import { pickPulseLine, type PulseCategory, type PulseLine } from "@/lib/pulse-bank";

export type TradeSide = "buy" | "sell";

export type TradeSignal = {
  side: TradeSide;
  amount: number;
  wallet?: string;
  hasSoldBefore?: boolean;
};

export type PriceSignal = {
  direction: "up" | "down";
};

export type PulseSignal =
  | { type: "trade"; trade: TradeSignal }
  | { type: "price"; price: PriceSignal }
  | { type: "silence" };

export type PulseReaction = {
  category: PulseCategory;
  line: PulseLine;
};

export const PULSE_THRESHOLDS = {
  dustMaxExclusive: 0.1,
  bigMinInclusive: 1,
} as const;

export function classifyTrade(trade: TradeSignal): PulseCategory {
  if (trade.side === "buy" && trade.hasSoldBefore) return "buyback";

  if (trade.side === "buy") {
    if (trade.amount < PULSE_THRESHOLDS.dustMaxExclusive) return "dust_buy";
    if (trade.amount >= PULSE_THRESHOLDS.bigMinInclusive) return "big_buy";
    return "normal_buy";
  }

  if (trade.amount < PULSE_THRESHOLDS.dustMaxExclusive) return "dust_sell";
  if (trade.amount >= PULSE_THRESHOLDS.bigMinInclusive) return "big_sell";
  return "normal_sell";
}

export function classifyPulseSignal(signal: PulseSignal): PulseCategory {
  if (signal.type === "trade") return classifyTrade(signal.trade);
  if (signal.type === "price") return signal.price.direction === "up" ? "price_up" : "price_down";
  return "silence";
}

export function reactToPulseSignal(
  signal: PulseSignal,
  previous?: Pick<PulseLine, "id" | "shape"> | null,
  random: () => number = Math.random,
): PulseReaction {
  const category = classifyPulseSignal(signal);
  return {
    category,
    line: pickPulseLine(category, previous, random),
  };
}

export function isSilenceDue(lastTradeAt: number | null, now: number, silenceAfterMs: number): boolean {
  if (!Number.isFinite(silenceAfterMs) || silenceAfterMs <= 0) return false;
  if (lastTradeAt === null) return false;
  return now - lastTradeAt >= silenceAfterMs;
}
