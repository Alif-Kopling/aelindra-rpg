# Aelindra RPG — AI Handoff

## Project Overview
2D pixel dark fantasy Idle RPG built with Phaser 3 + React + Zustand + TypeScript + Vite. Bahasa Indonesia sastra klasik.

## Key Architecture
- **Phaser** handles game loop, physics, rendering (scenes: GameplayScene, PreloadScene)
- **React** handles UI overlay (HUD, DialogueSystem, Inventory, Shop, etc.)
- **Zustand** (with immer middleware) is the single source of truth for all game state
- **src/entities/** — Player, Enemy, Boss, NPC (all extend Phaser.Physics.Arcade.Sprite)
- **src/scenes/GameplayScene.ts** — main scene; zone building, round system, combat overlaps, portals
- **src/systems/storyData.ts** — all dialogue (389 lines, literary Indonesian)
- **src/systems/MapSystem.ts** — procedural tilemap generation

## Implemented Features
- **Hotbar** (8 slots, keys 1-8, clickable)
- **Recall Portal** (recallToTown / returnToBattlefield via store + zone detection)
- **Auto-Battle AI** (find nearest enemy, move, attack, charged attack)
- **Auto-Potion** (< 30% HP)
- **Auto-Dialogue** (advances 2.5s after typing finishes)
- **Auto-Dash** (dashes when enemy > 180px away in auto mode)
- **Idle Stats Dashboard** (EXP, GOLD, KILLS)
- **Zone-based round system** with pre/post dialogue per round
- **Boss fights** with phase transitions (phase 1/2/3/enrage)
- **Boss cinematic** (letterbox + pan + flash for Ashen Knight)
- **Save/Load** (3 slots, localStorage)
- **Shop** (weapon/armor upgrade, potion purchase)
- **Skill tree** with prerequisites
- **Cycle system** (NG+ loop)
- **Literary Indonesian** dialogue (all 389 lines)
- **Final 6-frame cinematic ending** (`public/assets/cinematic/cinematic_1..6.png`)
- **Cinematic FX stack** (letterbox, scanline, grain jitter ~8fps, frame flash/fade transitions)
- **Ending audio continuity** (boss clear -> cinematic -> ending -> epilogue without reset)
- **Dev Tools panel** (`;` launcher, `F10` toggle, zone jump, ending/epilogue jump, final boss defeat trigger)
- **Title Screen v2 clean premium** (minimal cinematic layout + Settings/Credits/Quit modal + hover polish)

## Latest Rollout Notes (May 2026)

### Final Boss Ending Flow
- Replaced old chained delayed dialogue flow with:
  - camera flash -> `playFinalCinematic()` -> `ENDING_SCENE` dialogue -> `setScreen('ending')`
- Removed `BATTLEFIELD_BOSS_POST` from battlefield boss round to avoid duplicate post-boss narrative.
- Added cinematic object/tween/timer lifecycle cleanup in `GameplayScene.shutdown()` safe path.

### Cinematic Assets & Rendering
- Added preload keys:
  - `final_cinematic_1` ... `final_cinematic_6`
- Frame 6 supports full-fit behavior (`contain`) to avoid top/bottom crop under cinematic bars.

### Audio Continuity Changes
- Ending BGM now starts directly on `ashen_knight` boss death event.
- Removed automatic BGM stop on unmount between `game -> ending -> epilogue` screens.
- BGM stops explicitly when returning to title from epilogue.

### Dev Tools / QA Controls
- Added `src/ui/DevToolsPanel.tsx` and mounted in `GameComponent`.
- Zone jump now uses dual path:
  - store-driven fallback (`setZone`, `setScreen('game')`, `intro_seen=true`)
  - scene event (`dev-jump-zone`) to force `transitionToZone()` rebuild.
- Added final boss event trigger (`scene.events.emit('boss-died', { bossId: 'ashen_knight' })`).

### Documentation
- `README.md` rewritten with cleaner structure, visual preview gallery, cutscene highlights, and updated dev tools/audio notes.

## Critical Bug Fixes Completed (May 22, 2026)

### Enemy.ts
- **AI timer leak**: `startAI()` looping timer never cleaned up. Added `destroy()` override + stop in `die()`
- **Stuck stagger**: Enemy became permanent statue after stagger ended. Now resets to `'idle'`
- **Bleed DoT stopped during stun/stagger**: `timeAccumulator` wasn't incremented due to early returns. Moved to top of `update()`, uses separate `bleedTickAccumulator`
- **applyStun/applyBleed delayed calls**: Not canceled on enemy death. Stored timer references + cleanup in `destroy()`

### Boss.ts
- **No `destroy()` override**: All timers/tweens/projectiles leaked on boss death. Added `destroy()` that clears `activeTimers[]`, projectiles group, and kills tweens of this
- **projectileBarrage loop timer**: Per-projectile `delay:16` timer never stopped. Added `activeTimers` tracking
- **swordRain/ashenStorm**: Stale `this.target!` non-null assertions. Added active guards + timer tracking
- **chargeAttack**: Second `delayedCall` missing `isDead` guard. Added guard + timer tracking
- **darkWave double-destroy**: `onUpdate` + `onComplete` both destroy wave. Added `hit` flag guard
- **Double destroy**: `Boss.die()` calls `this.destroy()` in tween callback, and GameplayScene handler also called `this.boss.destroy()`. Removed from GameplayScene handler

### GameplayScene.ts
- **Event listeners never cleaned up**: 5 scene event listeners + keyboard listeners accumulated on every scene create. Added `shutdown()` lifecycle with `this.events.off(...)`
- **Stuck round**: If `roundEnemyTotal === 0` after spawn loop, round was permanently stuck. Now skips to story-only path
- **Ambient particles bleed**: Old zone particles persist ~6s after zone transition (minor — self-resolves)
- **Portal overlap never removed**: Physics overlap for portal not explicitly removed (minor)

### gameStore.ts
- **closeDialogue didn't reset onComplete**: Old callback could fire. Added `s.dialogue.onComplete = undefined`
- **addNotification `||` instead of `??`**: `duration: 0` was treated as 3000ms. Changed to `??` + `if (dur > 0)` guard
- **player.skillPoints/unlockedSkills duplication**: Two fields in `PlayerState` that were never mutated but saved/loaded. Removed from type + initial state

### DialogueSystem.tsx
- **Stale closure in auto-advance effect**: `handleAdvance` not in dependency array + defined after the effect. Moved `handleAdvance` before the effect + added to deps

### Notifications.tsx
- **NOTIF_STYLES[notif.type] crash**: No fallback for unknown type. Added `?? NOTIF_STYLES.info`

## Known Minor Issues (not blocking gameplay)
- FPS label `setVisible()` called every frame (performance: low)
- `createPortal` ignores `y` parameter (dead param)
- Phaser chunk size warning (1.8MB, expected with Phaser)
- `roundActive` not reset for final boss path (game ends anyway)
- Stun tint overrides bleed tint (cosmetic)
- `window.close()` on title `Quit` is browser-limited and may be blocked unless opened by script

## Story Summary
**Prologue**: Alden, kesatria kerajaan Aelindra, difitnah membunuh Raja Aldric oleh Valther. Putri Evelyne menghukumnya. Pandai besi Old Edric memotong rantainya saat fajar.

**Chapter 1**: Alden mengungkap kebenaran — Valther membuka Segel Kegelapan kuno. Perjalanan melewati: Desa Harrowmere → Hutan Fogbound → Puri Aelindra (Blind King / Sir Galen) → Katakombe Sunken → Cathedral of Ash (Saint of Rot) → Frostpeak Summit (Fallen Guardian) → Medan Perang Ruined (Ashen Knight / Valther).

**Ending**: Alden mengalahkan Ashen Knight, wujud Valther yang menyatu dengan kegelapan kuno. Ia gugur akibat luka-lukanya. Evelyne menjadi ratu. Sebuah patung didirikan untuk Alden — "kesatria yang dibenci dunia... yang menyelamatkan semua orang."

## How to Run / Build
```bash
npm run dev    # dev server
npx tsc --noEmit  # type check
npx vite build     # production build
```

## Testing Notes
- `npx tsc --noEmit` passes with zero errors
- `npx vite build` succeeds (chunk size warning is pre-existing)
- No automated test suite found
- Last tested gameplay flow: zone transitions, combat, dialogue, hotbar, recall portal, final cinematic ending, ending->epilogue audio continuity, dev tools zone jump
