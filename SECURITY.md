# Security Roadmap

This project currently supports MVP local editing with `localStorage`. Production admin usage must move admin state and CMS writes behind authentication, authorization, and server-side validation.

## Admin Access
- MVP: editor state is local-only.
- Production: add `/admin` route behind auth.
- Roles: `viewer`, `editor`, `admin`.
- Admin mutations must require a token and server-side role checks.

## Input Safety
- Editable input is sanitized before persistence.
- React renders plain text; no `dangerouslySetInnerHTML` is used.
- URLs must pass an allowlist before being stored as config image URLs.

## Import Safety
- JSON imports are validated against known schema shape.
- Blocked fields include script-like and prototype pollution keys.
- Backups are versioned with `{ meta, data }`.

## Storage Safety
- `localStorage` is only for development/MVP.
- Future Supabase/Firebase storage must separate public content from private admin data.
- Database rules/RLS must enforce per-role access.

## Upload Safety
- Only image MIME types should be accepted.
- Enforce file size limits.
- Sanitize filenames.
- Prefer signed Cloudinary upload or Supabase Storage policies.

## API Security
- All future mutating calls require authenticated headers.
- Server-side validation is mandatory.
- Rate limiting is required for admin, upload, and import endpoints.

## Secrets
- Browser env vars may contain public keys only.
- Service role keys must never be included in frontend code or Vite env.

## Deployment Headers
Configure these at hosting/CDN level:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- HTTPS only
