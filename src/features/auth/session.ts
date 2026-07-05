// Web Crypto (HMAC-SHA256) signing for the access gate. Edge-safe, so it runs in
// both middleware and server actions. A session token is `<expiryMs>.<hmacHex>`.

const encoder = new TextEncoder();

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time comparison of two equal-length hex strings.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Signs a session token that is valid until the given expiry (epoch ms).
export async function createSessionToken(
  secret: string,
  expiresAtMs: number,
): Promise<string> {
  const sig = await hmacHex(secret, String(expiresAtMs));
  return `${expiresAtMs}.${sig}`;
}

// True if the token's signature is valid and it has not expired.
export async function verifySessionToken(
  token: string,
  secret: string,
  nowMs: number,
): Promise<boolean> {
  const [expiryStr, sig] = token.split(".");
  if (!expiryStr || !sig) return false;
  const expiresAtMs = Number(expiryStr);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= nowMs) return false;
  const expected = await hmacHex(secret, expiryStr);
  return timingSafeEqual(sig, expected);
}

// True if the input matches the expected password (constant-time via HMAC).
export async function verifyPassword(
  input: string,
  expected: string,
  secret: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([
    hmacHex(secret, input),
    hmacHex(secret, expected),
  ]);
  return timingSafeEqual(a, b);
}
