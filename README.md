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

## Demo (Expo Link)

Open in Expo Go:

<img width="250" height="250" alt="Screenshot 2025-09-09 at 22 58 25" src="https://github.com/user-attachments/assets/ab7b6207-57da-40ed-89ca-b9a4fb211f60" />

Using [link](https://expo.dev/preview/update?message=first+preview&updateRuntimeVersion=exposdk%3A53.0.0&createdAt=2025-09-09T16%3A46%3A49.596Z&slug=exp&projectId=18d01be1-92a7-4b46-88d4-8a8795c60cf6&group=9e6c68f4-5027-4a32-ae67-c3e0cb822460)

## Screenshots

Daily

<img width="250" alt="IMG_3214-portrait" src="https://github.com/user-attachments/assets/e84e22e7-a66d-4718-acd9-f4b8678ade40" />

Journey

<img width="250" alt="IMG_3215-portrait" src="https://github.com/user-attachments/assets/f8c2a980-59a9-446c-b644-ff1a18563a26" />

Stats 

<img width="250" alt="IMG_3216-portrait" src="https://github.com/user-attachments/assets/ee4da669-22a5-46e9-85e9-752d2d48d734" />

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
