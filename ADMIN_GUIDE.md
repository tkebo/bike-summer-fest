# Admin Guide

## Login

1. Open `/admin`.
2. Click `Admin Login`.
3. Sign in with the Google account that has an `admins/{uid}` document.

Your role document must contain:

```json
{
  "email": "admin@example.com",
  "role": "owner",
  "active": true
}
```

## Content and Design

- `Content`: KA/EN copy, labels, FAQ, footer, newsletter, cards
- `Design`: theme controls, colors, spacing, backgrounds
- `Sections`: visibility, order, layout settings
- `Visual Builder`: direct visual editing and legacy editor controls

Changes are written to draft automatically.

## Media

1. Open `Media`.
2. Upload an image or select an existing asset.
3. Edit title, alt text, tags, and type.
4. Assign the asset to hero, gallery, sponsor, intro, or background targets.

Cloudinary upload is client-side unsigned upload for the current MVP. Keep the preset restricted and review Cloudinary rules before production launch.

## Publish

1. Open `Publish`.
2. Review draft state and preview draft.
3. Add a publish note.
4. Confirm publish.

Publishing creates a version snapshot and promotes the current draft to `site/published`.

## Users and Roles

- Only `owner` can manage users.
- Add a user by email to create a pending invite.
- After first Google login, the user receives the invited role.
- Do not demote or remove the final active owner.

## Security and Audit Logs

- `owner` sees the full Security module.
- `admin` can read audit logs.
- `editor/viewer` do not see the Security module.

Use the log filters and CSV/JSON export for operational review.
