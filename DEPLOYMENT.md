# Deployment

## Firebase Setup

1. Create a Firebase web app.
2. Enable Google Authentication.
3. Create Firestore.
4. Deploy [firestore.rules](./firestore.rules).
5. Create the first owner role document:
   - collection: `admins`
   - document id: Firebase Auth UID
   - fields:
     ```json
     {
       "email": "owner@example.com",
       "role": "owner",
       "active": true
     }
     ```

To find your UID, sign in once and read it from Firebase Authentication users list or the temporary admin debug card if enabled in development.

## Vercel

1. Import the repository.
2. Build command:
   ```bash
   npm run build
   ```
3. Output directory:
   ```bash
   dist
   ```
4. Add all `VITE_FIREBASE_*` variables from `.env.example`.
5. Deploy.

`vercel.json` already rewrites all routes to `index.html`, so refreshing `/admin` should not return 404.

## Production Checklist

- Firebase Authentication authorized domains configured
- Firestore rules deployed
- Vercel env vars configured
- `.env` not tracked in git
- Cloudinary upload preset reviewed
- owner account created
- draft save, publish, restore, media upload, and audit logs tested in production project
- custom security headers configured at hosting/CDN layer

## Local Verification

```bash
npm run lint
npm run build
```
