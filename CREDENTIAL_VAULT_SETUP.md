# Private credential vault setup

The public repository contains credential metadata only. Never commit ticket,
insurance, booking, identity, QR-code, or passenger files.

## Cloudflare resources

Create a **private** R2 bucket (suggested name: `switzerland-italy-trip-credentials`).
Do not enable the public development URL and do not attach a custom domain.

In the existing Pages project, add an R2 binding:

- Variable name: `CREDENTIALS_BUCKET`
- R2 bucket: the private bucket created above
- Apply it to Production (and Preview only if private previews are required)

Add these encrypted secrets to the Pages project:

- `CREDENTIAL_VAULT_PASSWORD`: the vault password. Keep it in Cloudflare Secrets
  (and local `.dev.vars`) only. Never hardcode it in React or other frontend files.
- `CREDENTIAL_SESSION_SECRET`: a separate random secret used only to sign the
  8-hour session token. Generate at least 32 random bytes; do not reuse the
  vault password.
- `CREDENTIAL_OBJECT_MAP`: JSON mapping public document IDs to private R2 keys.

## Local development

Copy `.dev.vars.example` to `.dev.vars` and fill in the same secret names.
Wrangler / Cloudflare Pages Functions load `.dev.vars` locally; the unlock API
still compares the submitted password on the server. Changing the password later
only requires updating `.dev.vars` and the Cloudflare Secret.

Example shape (use your own opaque R2 keys; do not commit the real value):

```json
{
  "milan-duomo": "opaque/private/object-key-1.pdf",
  "vatican-museums": "opaque/private/object-key-2.pdf"
}
```

Upload files directly to the private bucket in the Cloudflare dashboard. Set
each object's HTTP metadata `Content-Type` to `application/pdf`, `image/jpeg`,
or `image/png`. The object keys need only match the encrypted map above; they
must not match or reveal booking references.

After bindings and secrets are saved, trigger one new production deployment so
the Pages Functions receive them. The credential API streams objects from R2;
it never returns an R2 URL and sends `Cache-Control: private, no-store`.
