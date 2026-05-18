# BIKE SUMMER FEST 2026

Premium festival website platform built with React, Vite, Firebase CMS, Cloudinary media storage, and a modular admin panel.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example`.
3. Fill the public Firebase browser config values.
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open the public site at `/` and the admin shell at `/admin`.

## Environment Variables

Required Vite variables:

```bash
VITE_APP_ENV=development
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Only public browser-safe Firebase values belong here. Never place service account keys, service role keys, or private API secrets in frontend env files.

## Main Workflows

- Public content loads from `site/published`.
- Authenticated admins load `site/draft` when available.
- Draft changes autosave to Firestore and localStorage fallback.
- Publish copies draft state to `site/published` and creates a version snapshot.
- Media assets are uploaded to Cloudinary and indexed in Firestore `media/{assetId}`.

## Verification

```bash
npm run lint
npm run build
```

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md), [SECURITY.md](./SECURITY.md), and [DEPLOYMENT.md](./DEPLOYMENT.md) for operational details.
