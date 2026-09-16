export interface CredentialEnv {
  CREDENTIALS_BUCKET: {
    get(key: string): Promise<{
      body: ReadableStream;
      httpMetadata?: { contentType?: string };
      size?: number;
      etag?: string;
    } | null>;
  };
  CREDENTIAL_VAULT_PASSWORD: string;
  CREDENTIAL_SESSION_SECRET: string;
  CREDENTIAL_OBJECT_MAP: string;
}

export interface PagesContext<Params extends Record<string, string> = Record<string, string>> {
  request: Request;
  env: CredentialEnv;
  params: Params;
}

export type PagesHandler<Params extends Record<string, string> = Record<string, string>> = (
  context: PagesContext<Params>,
) => Response | Promise<Response>;

const COOKIE = "__Host-credential_vault";
const SESSION_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left[index] ^ right[index];
  return mismatch === 0;
}

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

export async function passwordMatches(candidate: string, expected: string) {
  return timingSafeEqual(await digest(candidate), await digest(expected));
}

export async function createSessionCookie(secret: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const nonce = crypto.randomUUID();
  const payload = `v1.${expires}.${nonce}`;
  const token = `${payload}.${await signature(payload, secret)}`;
  // No Max-Age/Expires: browser-session cookie. The signed token itself expires in 8h.
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function hasValidSession(request: Request, secret: string) {
  const raw = request.headers.get("Cookie") || "";
  const token = raw
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000)) return false;
  const payload = parts.slice(0, 3).join(".");
  const expected = await signature(payload, secret);
  return timingSafeEqual(encoder.encode(parts[3]), encoder.encode(expected));
}

export function privateHeaders(extra: Record<string, string> = {}) {
  return {
    "Cache-Control": "private, no-store, max-age=0",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    ...extra,
  };
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: privateHeaders({ "Content-Type": "application/json; charset=utf-8", ...headers }),
  });
}

export function objectMap(env: CredentialEnv): Record<string, string> {
  try {
    const parsed = JSON.parse(env.CREDENTIAL_OBJECT_MAP || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
