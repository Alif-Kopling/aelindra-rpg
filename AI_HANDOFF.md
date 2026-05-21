# Aelindra Handoff

Use this as the short context pack for the next AI. Keep responses concise unless a code change is required.

## Current Goal

Dark fantasy RPG with longer story flow, stronger combat progression, and a full ending plus epilogue.

## What Was Done

### Story / Flow

- Extended the main route from `village -> forest -> castle -> catacombs -> cathedral -> mountain -> battlefield -> ending`.
- Added new story chapters in `src/systems/storyData.ts`:
  - `CATHEDRAL_*`
  - `MOUNTAIN_*`
- Added a post-ending epilogue screen in `src/ui/EpilogueScreen.tsx`.
- Ending screen now transitions to epilogue instead of returning directly to title.

### Gameplay / Progression

- Combat was upgraded earlier with:
  - parry/counter
  - dodge/stamina tuning
  - enemy telegraphing
  - skill scaling
- Added a real skill tree, skill points, unlock logic, and save persistence.

### Technical / Runtime

- The project is frontend-only. No backend is required to run the game.
- The old `vite.config.ts` was removed.
- Build/dev/preview use custom Node scripts in `scripts/`.
- A runtime issue with React default export and dev module loading was resolved by:
  - removing Zustand dependency from the live store
  - replacing it with a local React `useSyncExternalStore` + `immer` store

## Important Files

- `src/scenes/GameplayScene.ts`
  - zone routing
  - round sequences
  - boss flow
- `src/systems/storyData.ts`
  - full story dialogue
- `src/store/gameStore.ts`
  - custom store implementation
  - save/load
  - skill tree state
- `src/ui/EndingScreen.tsx`
  - ending presentation
- `src/ui/EpilogueScreen.tsx`
  - post-ending closure
- `src/main.tsx`
  - app bootstrap
- `scripts/dev.mjs`
  - dev server
- `scripts/build.mjs`
  - production build
- `scripts/preview.mjs`
  - preview server

## Run Instructions

```bash
npm run dev
```

Open the local URL printed by the terminal.

For production verification:

```bash
npm run build
npm run preview
```

## Current Status

- Build is passing.
- Dev server starts.
- Game runs frontend-only.

## Known Notes

- Build still prints a large-chunk warning from Vite. It does not block the game.
- If the browser shows an old error, hard refresh and restart the dev server.
- The repo contains a lot of story text and UI polish changes already; keep future edits scoped and verify with build.

## If You Continue

1. Inspect `src/scenes/GameplayScene.ts` first for any new flow changes.
2. Inspect `src/store/gameStore.ts` before touching state or save/load.
3. Use `npm run build` after any logic change.

