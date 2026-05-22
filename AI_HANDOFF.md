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
- Last tested gameplay flow: zone transitions, combat, dialogue, hotbar, recall portal
