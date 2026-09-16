import { clearSessionCookie, json, type PagesHandler } from "../../_credential-vault.ts";

export const onRequestPost: PagesHandler = async () =>
  json({ unlocked: false }, 200, { "Set-Cookie": clearSessionCookie() });
