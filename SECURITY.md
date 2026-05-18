# Security

## Access Model

- `/admin` requires Firebase Authentication.
- Runtime roles are resolved from `admins/{uid}`.
- Supported roles: `owner`, `admin`, `editor`, `viewer`.
- `owner/admin` can publish.
- `editor` can edit draft content only.
- `viewer` can access readonly admin surfaces.
- The client allowlist is only a development fallback. Firestore role documents are the production source of truth.

## Firestore Collections

- `site/published`: public read, owner/admin write
- `site/draft`: active admin read/write
- `site_versions`: active admin read/write
- `media`: public read, active admin write
- `admins`: owner-managed role documents
- `pending_invites`: owner-managed invite queue
- `audit_logs`: owner/admin read, active admin create, update/delete denied

Deploy [firestore.rules](./firestore.rules) before using production admin flows.

## Input and Import Safety

- User-editable text is sanitized before persistence.
- React renders plain text only; no `dangerouslySetInnerHTML` is used.
- JSON imports pass schema validation and reject blocked keys such as script handlers and prototype pollution fields.
- URL fields are validated before storage.
- Image uploads validate MIME type and size before Cloudinary transfer.

## Secrets

- Browser env vars may contain public Firebase config only.
- Do not commit `.env`.
- Do not ship service account credentials, service role keys, or private tokens to the browser.

## Deployment Headers

Recommended Vercel/CDN headers:

- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- HTTPS only

## Audit Trail

Audit logs are written for authentication, draft save, publish, restore, import/export, media changes, user changes, sponsor changes, ticket changes, and schedule structure changes. Logs are append-only from the client perspective.
