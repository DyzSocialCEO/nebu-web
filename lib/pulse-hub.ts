import { demoTrades, fetchTrades, rpcUrl, type AdapterTrade } from "@/lib/chain-adapter";
import { isSilenceDue, reactToPulseSignal, type PulseSignal } from "@/lib/pulse-engine";
import type { PulseLine } from "@/lib/pulse-bank";
import { getSiteData } from "@/lib/site-data";

export type PulseEvent =
  | { kind: "standby"; reason: string }
  | { kind: "live"; demo: boolean }
  | { kind: "line"; category: string; text: string; id: number; demo: boolean };

type Subscriber = (event: PulseEvent) => void;

const POLL_MS = 7000;
const DEMO_POLL_MS = 2600;
const SILENCE_AFTER_MS = 95_000;
const PRICE_MOVE_PERCENT = 6;
const PRICE_COOLDOWN_MS = 240_000;
const PRICE_WINDOW = 12;
const PRICE_MIN_SAMPLES = 5;
const SEEN_LIMIT = 400;
const SOLD_LIMIT = 2000;

type Hub = {
  subscribers: Set<Subscriber>;
  timer: ReturnType<typeof setInterval> | null;
  seen: Set<string>;
  soldBefore: Set<string>;
  priceWindow: number[];
  previousLine: Pick<PulseLine, "id" | "shape"> | null;
  lastTradeAt: number | null;
  lastPriceEventAt: number;
  primed: boolean;
  lastStatus: string;
};

function createHub(): Hub {
  return {
    subscribers: new Set(),
    timer: null,
    seen: new Set(),
    soldBefore: new Set(),
    priceWindow: [],
    previousLine: null,
    lastTradeAt: null,
    lastPriceEventAt: 0,
    primed: false,
    lastStatus: "",
  };
}

const hubs = new Map<string, Hub>();

function getHub(demo: boolean): Hub {
  const key = demo ? "demo" : "live";
  let hub = hubs.get(key);
  if (!hub) {
    hub = createHub();
    hubs.set(key, hub);
  }
  return hub;
}

function remember(set: Set<string>, value: string, limit: number) {
  set.add(value);
  if (set.size > limit) {
    const oldest = set.values().next().value;
    if (oldest !== undefined) set.delete(oldest);
  }
}

function broadcast(hub: Hub, event: PulseEvent) {
  hub.subscribers.forEach(send => {
    try {
      send(event);
    } catch {
      hub.subscribers.delete(send);
    }
  });
}

function emitSignal(hub: Hub, signal: PulseSignal, demo: boolean) {
  const reaction = reactToPulseSignal(signal, hub.previousLine);
  hub.previousLine = { id: reaction.line.id, shape: reaction.line.shape };
  broadcast(hub, {
    kind: "line",
    category: reaction.category,
    text: reaction.line.text,
    id: reaction.line.id,
    demo,
  });
}

function setStatus(hub: Hub, status: string, event: PulseEvent) {
  if (hub.lastStatus === status) return;
  hub.lastStatus = status;
  broadcast(hub, event);
}

function applyTrades(hub: Hub, trades: AdapterTrade[], demo: boolean) {
  for (const trade of trades) {
    if (hub.seen.has(trade.signature)) continue;
    remember(hub.seen, trade.signature, SEEN_LIMIT);

    // The first poll only establishes a baseline. Without this the page would
    // replay recent historical swaps as if they had just happened.
    if (!hub.primed) continue;

    const hasSoldBefore = Boolean(trade.wallet && hub.soldBefore.has(trade.wallet));
    if (trade.side === "sell" && trade.wallet) remember(hub.soldBefore, trade.wallet, SOLD_LIMIT);

    hub.lastTradeAt = Date.now();
    emitSignal(hub, {
      type: "trade",
      trade: { side: trade.side, amount: trade.amount, wallet: trade.wallet, hasSoldBefore },
    }, demo);
  }
}

/**
 * Price comes from the trades themselves, not a third party. Each trade
 * carries SOL in and tokens out, so the ratio is the price that trade paid.
 */
function trackPrice(hub: Hub, trades: AdapterTrade[], now: number, demo: boolean) {
  const priced = trades.filter(trade => Number.isFinite(trade.price) && trade.price > 0);
  if (priced.length === 0) return;

  const latest = priced[priced.length - 1].price;
  const samples = hub.priceWindow;

  if (samples.length >= PRICE_MIN_SAMPLES && now - hub.lastPriceEventAt >= PRICE_COOLDOWN_MS) {
    const average = samples.reduce((total, value) => total + value, 0) / samples.length;
    if (average > 0) {
      const movePercent = ((latest - average) / average) * 100;
      if (Math.abs(movePercent) >= PRICE_MOVE_PERCENT) {
        hub.lastPriceEventAt = now;
        emitSignal(hub, { type: "price", price: { direction: movePercent > 0 ? "up" : "down" } }, demo);
      }
    }
  }

  for (const trade of priced) {
    samples.push(trade.price);
    if (samples.length > PRICE_WINDOW) samples.shift();
  }
}

async function poll(demo: boolean) {
  const hub = getHub(demo);
  if (hub.subscribers.size === 0) return;

  const now = Date.now();
  let trades: AdapterTrade[] = [];

  if (demo) {
    hub.primed = true;
    trades = demoTrades(now);
    applyTrades(hub, trades, true);
    trackPrice(hub, trades, now, true);
  } else {
    const site = await getSiteData();
    const mint = site.contractAddress.trim();

    if (!mint) {
      setStatus(hub, "no-ca", { kind: "standby", reason: "no contract address set" });
      return;
    }

    if (!rpcUrl()) {
      setStatus(hub, "no-rpc", { kind: "standby", reason: "rpc endpoint not configured" });
      return;
    }

    setStatus(hub, "live", { kind: "live", demo: false });

    trades = await fetchTrades(mint, hub.seen);
    applyTrades(hub, trades, false);
    trackPrice(hub, trades, now, false);
    hub.primed = true;
  }

  if (isSilenceDue(hub.lastTradeAt, now, SILENCE_AFTER_MS)) {
    hub.lastTradeAt = now;
    emitSignal(hub, { type: "silence" }, demo);
  }
}

export function subscribe(send: Subscriber, demo: boolean): () => void {
  const hub = getHub(demo);
  hub.subscribers.add(send);

  if (hub.lastTradeAt === null) hub.lastTradeAt = Date.now();

  if (!hub.timer) {
    hub.timer = setInterval(() => {
      void poll(demo).catch(() => undefined);
    }, demo ? DEMO_POLL_MS : POLL_MS);
    void poll(demo).catch(() => undefined);
  }

  return () => {
    hub.subscribers.delete(send);
    if (hub.subscribers.size === 0 && hub.timer) {
      clearInterval(hub.timer);
      hub.timer = null;
      hub.lastStatus = "";
    }
  };
}
