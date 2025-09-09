# AdventureLog

Playful daily adventure logger built with Expo + expo-router. Log quick moments with an emoji, optional location, and see a whimsical timeline and basic insights.

## Quick Start

Prerequisites
- Node.js 18+ (LTS recommended)
- iOS Simulator (Xcode) or Android Emulator (Android Studio) optional

Install and run
```bash
npm install
npx expo start
```
Then press:
- `i` for iOS Simulator, `a` for Android Emulator, or `w` for Web
- Or scan the QR code in Expo Go on your device

## Features
- Daily logs with title + emoji
- Optional location snapshot (permission asked on first add)
- Day-wise Journey timeline (Map tab)
- Stats: weekly total and most-used emoji
- Themed, safe-area-aware UI with playful fonts

## Configuration

Fonts
- Custom fonts are loaded in `app/_layout.tsx` (Baloo2, Nunito, SpaceMono).

Storage
- Uses `@react-native-async-storage/async-storage` to persist logs locally.

Location (optional)
- Uses `expo-location` to capture a lightweight snapshot and reverse geocode to a city name.
- If permission is denied or the module is unavailable, logs save without location.

## Scripts
```bash
npm run ios      # open iOS simulator
npm run android  # open Android emulator
npm run web      # run on web
```

## Deploy a Demo (Web)

This app is web-ready. You can deploy to Vercel or Netlify.

Build static web output
```bash
npx expo export --platform web
# Output: dist/
```

Vercel
- Connect your GitHub repo in Vercel dashboard
- Set Build Command: `npx expo export --platform web`
- Set Output Directory: `dist`
- Deploy

Netlify
- New site from Git
- Build Command: `npx expo export --platform web`
- Publish directory: `dist`
- Deploy

Tip: After adding packages or assets, if local dev behaves oddly, clear the Metro cache:
```bash
npx expo start -c
```

## Share on Device (Expo Go)
For quick demos, start the dev server and share the QR code. You can also enable the tunnel in the CLI to share over the internet temporarily.

## Notes
- The Stats screen does not require native maps. The Journey tab is a custom timeline (no native map dependency).
- If you add native modules later (e.g., react-native-maps), follow their installation docs and rebuild as needed.
