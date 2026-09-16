import assert from "node:assert/strict";
import test from "node:test";
import {
  createSessionCookie,
  hasValidSession,
  passwordMatches,
} from "../functions/_credential-vault.ts";
import { onRequestPost as unlock } from "../functions/api/credentials/unlock.ts";
import { onRequestGet as getCredential } from "../functions/api/credentials/[documentId].ts";

test("credential password comparison accepts only the configured secret", async () => {
  assert.equal(await passwordMatches("correct horse", "correct horse"), true);
  assert.equal(await passwordMatches("wrong horse", "correct horse"), false);
});

test("vault session cookie is HttpOnly, Secure, Strict and session-scoped", async () => {
  const cookie = await createSessionCookie("test-secret");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  assert.doesNotMatch(cookie, /Max-Age|Expires/i);
  const request = new Request("https://example.com/api/credentials/test", {
    headers: { Cookie: cookie.split(";")[0] },
  });
  assert.equal(await hasValidSession(request, "test-secret"), true);
  assert.equal(await hasValidSession(request, "different-secret"), false);
});

test("credential route rejects locked requests and streams an unlocked private object", async () => {
  const env = {
    CREDENTIAL_VAULT_PASSWORD: "vault-password",
    CREDENTIAL_SESSION_SECRET: "a-separate-high-entropy-session-secret-for-tests",
    CREDENTIAL_OBJECT_MAP: JSON.stringify({ "test-document": "private/test.pdf" }),
    CREDENTIALS_BUCKET: {
      async get(key: string) {
        assert.equal(key, "private/test.pdf");
        return {
          body: new Blob(["private-pdf"]).stream(),
          httpMetadata: { contentType: "application/pdf" },
        };
      },
    },
  };
  const locked = await getCredential({
    request: new Request("https://example.com/api/credentials/test-document"),
    env,
    params: { documentId: "test-document" },
  });
  assert.equal(locked.status, 401);

  const unlockResponse = await unlock({
    request: new Request("https://example.com/api/credentials/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "vault-password" }),
    }),
    env,
    params: {},
  });
  assert.equal(unlockResponse.status, 200);
  const cookie = unlockResponse.headers.get("Set-Cookie")?.split(";")[0];
  assert.ok(cookie);

  const unlocked = await getCredential({
    request: new Request("https://example.com/api/credentials/test-document", {
      headers: { Cookie: cookie },
    }),
    env,
    params: { documentId: "test-document" },
  });
  assert.equal(unlocked.status, 200);
  assert.equal(unlocked.headers.get("Content-Type"), "application/pdf");
  assert.equal(unlocked.headers.get("Cache-Control"), "private, no-store, max-age=0");
  assert.equal(await unlocked.text(), "private-pdf");
});
