import {
  hasValidSession,
  json,
  objectMap,
  privateHeaders,
  type PagesHandler,
} from "../../_credential-vault.ts";

export const onRequestGet: PagesHandler<{ documentId: string }> = async ({
  request,
  env,
  params,
}) => {
  if (!env.CREDENTIAL_SESSION_SECRET || !env.CREDENTIALS_BUCKET)
    return json({ error: "凭证库尚未配置" }, 503);
  if (!(await hasValidSession(request, env.CREDENTIAL_SESSION_SECRET)))
    return json({ error: "凭证库未解锁" }, 401);

  const key = objectMap(env)[params.documentId];
  if (!key) return json({ error: "凭证不存在" }, 404);
  const object = await env.CREDENTIALS_BUCKET.get(key);
  if (!object) return json({ error: "凭证文件尚未上传" }, 404);
  const type = object.httpMetadata?.contentType || "application/octet-stream";
  const wantDownload = new URL(request.url).searchParams.get("download") === "1";
  const safeName = `${params.documentId.replace(/[^a-zA-Z0-9._-]+/g, "-")}.${type.includes("png") ? "png" : type.includes("jpeg") || type.includes("jpg") ? "jpg" : "pdf"}`;
  return new Response(object.body, {
    headers: privateHeaders({
      "Content-Type": type,
      "Content-Disposition": `${wantDownload ? "attachment" : "inline"}; filename="${safeName}"`,
      ...(object.size ? { "Content-Length": String(object.size) } : {}),
      ...(object.etag ? { "ETag": object.etag } : {}),
    }),
  });
};
