# Shared Brand Assets

Single source of truth for static brand assets (logos, icons, splash screens, etc.) used by both `web/` and `mobile/`.

**Do NOT put DB-served images here** (priest photos, vendor photos, campaign banners). Those live in Firebase Storage and are fetched at runtime.

## Files

| File | Size | Used for |
|---|---|---|
| `samskara-icon-512.png` | 512×512 PNG, square | Favicon, PWA icon, mobile app icon, Android adaptive icon, notification icon |
| `samskara-lockup-horizontal.png` | wide PNG, transparent | Web navbar logo, mobile login/register screen header |

## How it's wired

These files are referenced by symlinks (created with `ln -s`) so both apps share the same source:

```
web/public/icon.png             → ../../assets/samskara-icon-512.png
web/public/logo.png             → ../../assets/samskara-lockup-horizontal.png
mobile/assets/icon.png          → ../../assets/samskara-icon-512.png
mobile/assets/adaptive-icon.png → ../../assets/samskara-icon-512.png
mobile/assets/notification-icon.png → ../../assets/samskara-icon-512.png
mobile/assets/splash.png        → ../../assets/samskara-icon-512.png
mobile/assets/logo-wordmark.png → ../../assets/samskara-lockup-horizontal.png
```

Update a file here → both web and mobile pick up the change.

## Replacing a logo

1. Drop the new PNG into this folder using the exact filename in the table above.
2. Web: hard-refresh the browser (Cmd+Shift+R) to bust favicon cache.
3. Mobile: restart Expo (`r` in the Expo CLI) so Metro rebuilds the bundle. For native icon/splash changes, you must rebuild the binary (`eas build` / `expo prebuild`).
