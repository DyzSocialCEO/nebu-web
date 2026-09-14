type AttemptState = {
  failures: number;
  windowStartedAt: number;
  blockedUntil: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 30 * 60 * 1000;
const MAX_FAILURES = 5;

type AdminRateLimitGlobal = typeof globalThis & {
  __nebuAdminAttempts?: Map<string, AttemptState>;
};

const adminGlobal = globalThis as AdminRateLimitGlobal;
const attempts = adminGlobal.__nebuAdminAttempts ?? new Map<string, AttemptState>();
adminGlobal.__nebuAdminAttempts = attempts;

function clientKey(request: Request) {
  const cloudflare = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflare) return cloudflare;

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;

  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || "unknown";
}

function freshState(now: number): AttemptState {
  return { failures: 0, windowStartedAt: now, blockedUntil: 0 };
}

export function inspectAdminRateLimit(request: Request) {
  const now = Date.now();
  const key = clientKey(request);
  let state = attempts.get(key) ?? freshState(now);

  if (state.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((state.blockedUntil - now) / 1000)),
    };
  }

  if (now - state.windowStartedAt > WINDOW_MS) {
    state = freshState(now);
    attempts.set(key, state);
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function registerAdminFailure(request: Request) {
  const now = Date.now();
  const key = clientKey(request);
  let state = attempts.get(key) ?? freshState(now);

  if (now - state.windowStartedAt > WINDOW_MS) {
    state = freshState(now);
  }

  state.failures += 1;
  if (state.failures >= MAX_FAILURES) {
    state.blockedUntil = now + BLOCK_MS;
  }

  attempts.set(key, state);
  return state.blockedUntil > now
    ? Math.max(1, Math.ceil((state.blockedUntil - now) / 1000))
    : 0;
}

export function registerAdminSuccess(request: Request) {
  attempts.delete(clientKey(request));
}
