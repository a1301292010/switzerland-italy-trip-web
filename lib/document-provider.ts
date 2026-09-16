import type { CredentialDocument } from "../data/documents";

export type ResolvedDocument =
  | { kind: "mock" }
  | { kind: "blob"; url: string };

export class CredentialVaultLockedError extends Error {
  constructor() {
    super("credential-vault-locked");
    this.name = "CredentialVaultLockedError";
  }
}

export async function resolveDocumentSource(
  document: CredentialDocument,
): Promise<ResolvedDocument> {
  if (document.storage.kind === "mock") return { kind: "mock" };
  const response = await fetch(document.storage.endpoint, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (response.status === 401) throw new CredentialVaultLockedError();
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "无法载入私有凭证");
  }
  return { kind: "blob", url: URL.createObjectURL(await response.blob()) };
}

export async function unlockCredentialVault(password: string) {
  const response = await fetch("/api/credentials/unlock", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "无法解锁凭证库");
  }
}

export async function lockCredentialVault() {
  await fetch("/api/credentials/lock", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
  });
}
