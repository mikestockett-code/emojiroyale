// routes.ts
// New route names for the rewrite.
//
// This file is the top-level traffic map for the new app.
// Keep it small and route-only.

export const APP_ROUTES = {
  menu: 'menu',
  howTo: 'howTo',
  profile: 'profile',
  soloSubmenu: 'soloSubmenu',
  soloGame: 'soloGame',
  passPlaySubmenu: 'passPlaySubmenu',
  passPlayGame: 'passPlayGame',
  battleModeSelect: 'battleModeSelect',
  battleSubmenu: 'battleSubmenu',
  battleGame: 'battleGame',
  album: 'album',
} as const;
