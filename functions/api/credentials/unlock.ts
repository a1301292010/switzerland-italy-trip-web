import {
  createSessionCookie,
  json,
  passwordMatches,
  type PagesHandler,
} from "../../_credential-vault.ts";

export const onRequestPost: PagesHandler = async ({ request, env }) => {
  if (!env.CREDENTIAL_VAULT_PASSWORD || !env.CREDENTIAL_SESSION_SECRET)
    return json({ error: "凭证库尚未配置" }, 503);
  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return json({ error: "请求格式错误" }, 400);
  }
  if (!password || password.length > 256) return json({ error: "密码错误" }, 401);
  if (!(await passwordMatches(password, env.CREDENTIAL_VAULT_PASSWORD)))
    return json({ error: "密码错误" }, 401);
  return json(
    { unlocked: true },
    200,
    { "Set-Cookie": await createSessionCookie(env.CREDENTIAL_SESSION_SECRET) },
  );
};
