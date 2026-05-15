# Release Checklist

## Current Release Identity

- App display name: `Emoji Royale`
- Expo/EAS slug: `MasterEmojiProjectRebuild`
- iOS bundle id: `com.stockett119.emojiroyale`
- Android package: `com.stockett119.emojiroyale`
- EAS project id: `54f98a72-d3d1-426b-bd56-252a8c4ed87b`
- Version: `1.0.0`

## Verification Commands

Run before a build:

```bash
npm run verify
npx expo config --type public
npx expo-doctor
npm audit --omit=dev
```

`npm run verify` runs:

- `tsc --noEmit`
- `jscpd src/hooks src/lib src/fresh src/components --min-lines 20 --min-tokens 120`

## Build Config Notes

- Android microphone permissions were removed because the app uses audio playback, not recording.
- `expo-audio` is configured with `microphonePermission: false` and `recordAudioAndroid: false`.
- Android blocks `android.permission.RECORD_AUDIO` in the final manifest.
- `android.permission.MODIFY_AUDIO_SETTINGS` still appears from `expo-audio`; this is for audio playback/control, not microphone recording.
- `.easignore` excludes local/generated folders such as `dist/`, `reports/`, `memory/`, and `.DS_Store`.
- `expo-av` was removed because the app uses `expo-audio`.
- `postcss` is pinned through `overrides` to avoid the Expo/Metro audit warning without downgrading Expo.
- App icon / splash assets:
  - app icon: `assets/images/appicon.png` at 1024x1024
  - splash image: `assets/images/splash-icon.png` at 1024x1024
  - Android adaptive foreground: `assets/images/android-icon-foreground.png` at 512x512
  - Android adaptive monochrome: `assets/images/android-icon-monochrome.png` at 432x432

Latest audit result:

- `npm run verify` passes.
- `npx expo-doctor` passes 17/17 checks.
- `npm audit --omit=dev` reports 0 vulnerabilities.
- `npx expo config --type public` shows app name `Emoji Royale`, slug `emoji-royale`, and `RECORD_AUDIO` in `blockedPermissions`.

## Before Sending To Testers

- Run `npm run verify`.
- Run the app on a real phone.
- Smoke test:
  - Solo practice, Epic Lite, Epic.
  - Pass & Play no wager, Epic, Legendary.
  - Battle with a new profile and an old profile.
  - Multiplayer host/guest if available.
  - Profile button sounds and How-To back sound.
- Confirm the app display name shows as `Emoji Royale`.

## EAS Build Commands

Internal Android APK:

```bash
npx eas build --platform android --profile preview
```

Production build:

```bash
npx eas build --platform all --profile production
```

## Watch Items

- Keep the local Expo slug as `MasterEmojiProjectRebuild` because the existing EAS project id is linked to that slug. The phone display name is still `Emoji Royale`.
- If EAS complains about changing the Expo slug, do not create a new project accidentally.
- If an Android build asks for unexpected permissions, inspect the generated manifest before release.
