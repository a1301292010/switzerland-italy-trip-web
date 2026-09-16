import type { CredentialDocument } from "../data/documents";

export type ResolvedDocument =
  | { kind: "mock" }
  | { kind: "inline"; url: string }
  | { kind: "blob"; url: string };

export class CredentialVaultLockedError extends Error {
  constructor() {
    super("credential-vault-locked");
    this.name = "CredentialVaultLockedError";
  }
}

async function fetchCredential(endpoint: string) {
  const response = await fetch(endpoint, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (response.status === 401) throw new CredentialVaultLockedError();
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "无法载入私有凭证");
  }
  return response;
}

export async function resolveDocumentSource(
  document: CredentialDocument,
): Promise<ResolvedDocument> {
  if (document.storage.kind === "mock") return { kind: "mock" };

  const response = await fetchCredential(document.storage.endpoint);
  const contentType = response.headers.get("Content-Type") || "";

  // Chrome/Edge often force-download blob: PDFs inside iframes. Same-origin
  // API URLs keep the session cookie and let the browser PDF viewer render inline.
  if (document.type === "pdf" || contentType.includes("pdf")) {
    await response.body?.cancel().catch(() => undefined);
    return { kind: "inline", url: document.storage.endpoint };
  }

  const buffer = await response.arrayBuffer();
  const blob = new Blob([buffer], {
    type: contentType || (document.type === "image" ? "image/jpeg" : "application/octet-stream"),
  });
  return { kind: "blob", url: URL.createObjectURL(blob) };
}

export async function downloadCredentialDocument(document: CredentialDocument) {
  if (document.storage.kind === "mock") throw new Error("凭证尚未连接私有存储");
  const response = await fetchCredential(document.storage.endpoint);
  const buffer = await response.arrayBuffer();
  const type = response.headers.get("Content-Type") || "application/pdf";
  const url = URL.createObjectURL(new Blob([buffer], { type }));
  try {
    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.displayFileName || `${document.id}.pdf`;
    link.rel = "noopener";
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
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
