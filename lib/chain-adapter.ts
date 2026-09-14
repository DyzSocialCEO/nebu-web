import type { TradeSignal } from "@/lib/pulse-engine";

export type AdapterTrade = TradeSignal & {
  signature: string;
  at: number;
  tokens: number;
  price: number;
};

const LAMPORTS_PER_SOL = 1_000_000_000;
const WSOL_MINT = "So11111111111111111111111111111111111111112";

export function rpcUrl(): string {
  return (process.env.SOLANA_RPC_URL || "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function num(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function rpc(method: string, params: unknown[], timeoutMs = 9000): Promise<unknown> {
  const url = rpcUrl();
  if (!url) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = await response.json();
    return asRecord(body).result ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

type TokenBalance = { owner: string; mint: string; amount: number };

function readTokenBalances(entries: unknown[]): TokenBalance[] {
  return entries.map(entry => {
    const row = asRecord(entry);
    return {
      owner: typeof row.owner === "string" ? row.owner : "",
      mint: typeof row.mint === "string" ? row.mint : "",
      amount: num(asRecord(row.uiTokenAmount).uiAmount),
    };
  });
}

function deltaFor(pre: TokenBalance[], post: TokenBalance[], owner: string, mint: string): number {
  const sum = (rows: TokenBalance[]) =>
    rows.filter(row => row.owner === owner && row.mint === mint).reduce((total, row) => total + row.amount, 0);
  return sum(post) - sum(pre);
}

/**
 * Derives a trade from a confirmed transaction using only balance deltas.
 *
 * Deliberately AMM-agnostic. It never decodes Raydium, Meteora or Pump
 * instructions, it reads what the transaction actually moved, so it keeps
 * working on any venue including ones that do not exist yet.
 *
 * Buy  = the fee payer's balance of our mint went up.
 * Sell = it went down.
 * Size = the fee payer's SOL movement, from native lamports or wrapped SOL,
 *        whichever actually moved.
 */
export function deriveTrade(raw: unknown, mint: string): AdapterTrade | null {
  const tx = asRecord(raw);
  const meta = asRecord(tx.meta);
  if (meta.err) return null;

  const signatures = asArray(asRecord(tx.transaction).signatures);
  const signature = typeof signatures[0] === "string" ? signatures[0] : "";
  if (!signature) return null;

  const accountKeys = asArray(asRecord(asRecord(tx.transaction).message).accountKeys);
  const firstKey = accountKeys[0];
  const feePayer = typeof firstKey === "string" ? firstKey : (typeof asRecord(firstKey).pubkey === "string" ? String(asRecord(firstKey).pubkey) : "");
  if (!feePayer) return null;

  const pre = readTokenBalances(asArray(meta.preTokenBalances));
  const post = readTokenBalances(asArray(meta.postTokenBalances));

  const tokenDelta = deltaFor(pre, post, feePayer, mint);
  if (tokenDelta === 0) return null;

  const side: TradeSignal["side"] = tokenDelta > 0 ? "buy" : "sell";
  const tokens = Math.abs(tokenDelta);

  const preLamports = num(asArray(meta.preBalances)[0]);
  const postLamports = num(asArray(meta.postBalances)[0]);
  const fee = num(meta.fee);
  const nativeMoved = Math.abs(preLamports - postLamports - fee) / LAMPORTS_PER_SOL;
  const wrappedMoved = Math.abs(deltaFor(pre, post, feePayer, WSOL_MINT));

  const amount = Math.max(nativeMoved, wrappedMoved);
  if (amount <= 0 || tokens <= 0) return null;

  const blockTime = num(tx.blockTime);

  return {
    side,
    amount: Number(amount.toFixed(6)),
    wallet: feePayer,
    signature,
    at: blockTime > 0 ? blockTime * 1000 : Date.now(),
    tokens,
    price: amount / tokens,
  };
}

async function recentSignatures(mint: string, limit: number): Promise<string[]> {
  const result = await rpc("getSignaturesForAddress", [mint, { limit }]);
  return asArray(result)
    .map(entry => {
      const row = asRecord(entry);
      if (row.err) return "";
      return typeof row.signature === "string" ? row.signature : "";
    })
    .filter(Boolean);
}

async function getTransaction(signature: string): Promise<unknown> {
  return rpc("getTransaction", [
    signature,
    { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "confirmed" },
  ]);
}

/**
 * Fetches recent trades. `skip` holds signatures already handled, so only
 * genuinely new transactions cost an RPC call.
 */
export async function fetchTrades(mint: string, skip: Set<string>, limit = 15): Promise<AdapterTrade[]> {
  if (!mint || !rpcUrl()) return [];

  const signatures = (await recentSignatures(mint, limit)).filter(signature => !skip.has(signature));
  if (signatures.length === 0) return [];

  const batch = signatures.slice(0, 8);
  const transactions = await Promise.all(batch.map(getTransaction));

  return transactions
    .map(tx => deriveTrade(tx, mint))
    .filter((trade): trade is AdapterTrade => trade !== null)
    .sort((a, b) => a.at - b.at);
}

/**
 * Demo trades. Only reached when a caller explicitly asks for demo mode, and
 * the UI labels it. Never used on the live public page.
 */
export function demoTrades(now: number): AdapterTrade[] {
  const side: TradeSignal["side"] = Math.random() > 0.42 ? "buy" : "sell";
  const size = Math.random();
  const amount = size > 0.82 ? 1 + Math.random() * 7 : size > 0.35 ? 0.1 + Math.random() * 0.8 : Math.random() * 0.09;
  const drift = 0.85 + Math.random() * 0.35;
  const tokens = (amount / 0.0000004) / drift;
  return [{
    side,
    amount: Number(amount.toFixed(4)),
    wallet: `demo${Math.floor(Math.random() * 6)}`,
    signature: `demo-${now}-${Math.floor(Math.random() * 1e6)}`,
    at: now,
    tokens,
    price: amount / tokens,
  }];
}
