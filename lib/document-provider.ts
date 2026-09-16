import type { CredentialDocument } from "../data/documents";

export type ResolvedDocument =
  | { kind: "mock" }
  | { kind: "signed"; url: string; expiresAt?: string };

export async function resolveDocumentSource(
  document: CredentialDocument,
): Promise<ResolvedDocument> {
  if (document.storage.kind === "mock") return { kind: "mock" };
  const response = await fetch(document.storage.endpoint, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("无法获取临时凭证地址");
  return (await response.json()) as ResolvedDocument;
}
