# Aelindra: The Forsaken Knight

> Dark fantasy 2D action RPG berbasis **Phaser 3 + React + Zustand + TypeScript**.  
> Kisah pengkhianatan, kebenaran, dan pengorbanan terakhir seorang ksatria terbuang.

---

## Overview

**Aelindra: The Forsaken Knight** adalah side-scrolling action RPG dengan fokus pada:

- combat cepat dan berat (hit-stop, parry, dash i-frame)
- cinematic story flow (prologue, boss cinematic, final ending, epilogue)
- progression RPG (level, skill tree, equipment, quest, shop)
- atmosfer dark fantasy pixel-art dengan nuansa naratif kuat

---

## Core Features

- **Responsive Combat System**
  - light combo, charged attack, parry/counter, ultimate
- **Boss Multi-Phase Fights**
  - termasuk final boss: **Ashen Knight**
- **Zone Round Progression**
  - tiap zone punya urutan combat + story beats sendiri
- **Dialogue & Narrative Layer**
  - typewriter dialogue, portrait, emotion tone, narration scenes
- **RPG Progression**
  - EXP/leveling, stat growth, skill unlock, gold economy
- **Inventory + Shop**
  - equipment, consumables, upgrade weapon/armor
- **Save/Load (3 Slots)**
  - via `localStorage`
- **Player Animation Texture Swapping**
  - idle ↔ walk bergantian saat jalan, jump sprite saat lompat, dash sprite saat dash
- **Final 6-Frame Cinematic Ending**
  - letterbox, scanline, grain, jitter, flash transition, fade-to-black
- **Seamless Ending Audio Flow**
  - music menyambung dari boss clear -> cinematic -> ending -> epilogue tanpa reset

---

## Cutscene Highlights

- **Prologue Cinematic**
  - pembuka cerita bergaya visual novel, membangun tragedi awal Alden
- **Ashen Knight Pre-Boss Cinematic**
  - transisi dramatis sebelum pertarungan final dimulai
- **Final 6-Frame Stop-Motion Ending**
  - urutan frame sinematik setelah boss kalah:
  - The Final Strike
  - Ashen Dissolution
  - The Wounded Knight
  - The Princess Runs
  - The Final Embrace
  - The Monument
- **Ending Dialogue Sequence**
  - narasi penutup emosional dengan transisi langit/atmosfer bertahap
- **Epilogue Screen**
  - closure dunia pasca perang dengan tone reflektif

---

## Visual Preview

<table>
  <tr>
    <td align="center"><strong>Prologue</strong></td>
    <td align="center"><strong>Tragedy</strong></td>
  </tr>
  <tr>
    <td><img src="./public/assets/images/animation/scene1-before-tragedy.jpeg" alt="Prologue Scene" width="100%"></td>
    <td><img src="./public/assets/images/animation/scene3-The-Tragedy.jpeg" alt="The Tragedy" width="100%"></td>
  </tr>
  <tr>
    <td align="center"><strong>Final Clash</strong></td>
    <td align="center"><strong>Battlefield Mood</strong></td>
  </tr>
  <tr>
    <td><img src="./public/assets/images/animation/pict-animasi-boss-vs-mc.png" alt="Boss vs Alden" width="100%"></td>
    <td><img src="./public/assets/images/boss-fight-bg.jpeg" alt="Battlefield" width="100%"></td>
  </tr>
  <tr>
    <td align="center"><strong>Ending Dialogue</strong></td>
    <td align="center"><strong>Memorial</strong></td>
  </tr>
  <tr>
    <td><img src="./public/assets/images/ending-bg-dialog.jpeg" alt="Ending Dialogue Background" width="100%"></td>
    <td><img src="./public/assets/images/ending.png" alt="Memorial Ending" width="100%"></td>
  </tr>
</table>

---

## Story Arc (Short)

1. **Alden** difitnah membunuh Raja Aldric oleh **Valther**  
2. Melarikan diri dari eksekusi dengan bantuan **Old Edric**
3. Menelusuri tujuh wilayah untuk mengungkap segel kegelapan kuno
4. Menghadapi para guardian terkutuk
5. Bertarung melawan wujud final Valther: **Ashen Knight**
6. Menyelamatkan Aelindra dengan harga yang sangat mahal

---

## World & Stages

| Stage | Zone | Atmosfer |
|---|---|---|
| 1 | Harrowmere Village | desa muram, awal pelarian |
| 2 | Fogbound Forest | hutan berkabut, makhluk korup |
| 3 | Aelindra Castle Ruins | reruntuhan kerajaan dan kutukan |
| 4 | Sunken Catacombs | lorong tulang dan kegelapan |
| 5 | Cathedral of Ash | altar sunyi penuh abu |
| 6 | Frostpeak Summit | puncak beku dan sumpah kuno |
| 7 | Ruined Battlefields | panggung pertarungan terakhir |

---

## Controls

| Input | Action |
|---|---|---|
| `WASD` | Move |
| `W` / `Space` | Jump / Double Jump |
| `Shift` | Dash |
| `J` / `Mouse Left` | Light Attack |
| `Hold J/M1` | Charged Attack |
| `L` / `Mouse Right` | Ultimate (Forsaken Slash) |
| `F` | Parry / Counter |
| `E` | Interact / Advance Dialogue |
| `Tab` | Inventory |
| `Esc` | Pause Menu (tutup dialog dulu jika sedang open) |
| `;` | Dev Tools Launcher |
| `F10` | Toggle Dev Tools Panel |

---

## Dev Tools (Testing)

Panel dev tersedia di dalam game untuk QA flow cepat. Tekan **`;`** lalu **`F10`** untuk toggle.

Fitur:

- Jump ke zone mana pun (skip story atau full)
- Open ending/epilogue langsung
- Trigger `boss-died (ashen_knight)` untuk test final cinematic flow

---

## Tech Stack

- **Runtime/Game Engine**: Phaser 3
- **UI Layer**: React 18
- **State Management**: Zustand + Immer
- **Language**: TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + custom CSS

---

## Project Structure

```text
src/
  components/      # React wrappers (Phaser host, overlays)
  scenes/          # Phaser scenes (GameplayScene, PreloadScene)
  entities/        # Player, Enemy, Boss, NPC
  systems/         # MapSystem, storyData, world logic
  ui/              # HUD, Dialogue, Pause, Ending, Epilogue, DevTools
  store/           # Zustand game store (single source of truth)
  utils/           # constants, bgm, shared types
public/assets/
  images/
  audio/
  cinematic/       # final cinematic frame_1..6
```

---

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Run Dev Server

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build    # tsc + vite → dist/
```

### 4. Type Check Only

```bash
npx tsc --noEmit
```

---

## Audio Notes

- tiap zone punya BGM berbeda (7 zone tracks + ending/epilogue/prologue)
- `ending` dan `epilogue` memakai track yang sama untuk transisi emosional kontinu
- final boss path memainkan track ending dari momen boss clear
- semua asset audio terverifikasi — **0 missing files** (35 audio files, semuanya referenced)

---

## Changelog (26 Mei 2026)

### 🔴 Critical Fixes
- Keyboard listener leak (ESC/TAB) — `removeAllListeners()` di setiap setup + cleanup `shutdown()`
- `enemyGroup` tidak pernah clear saat ganti zone — ghost physics sprites menumpuk
- Boss `onRoundCleared()` double fire — guard `roundActive` di `onEnemyKilled()` + handler `boss-died`
- `Math.random()` di React key — Inventory item flashing tiap render
- `setTimeout` leak di 6 file (`BossHealthBar`, `GameOverScreen`, `EndingScreen`, `EpilogueScreen`, `PrologueScreen`, `BossHealthBar` damage flash)

### 🟠 High Fixes
- Physics resume saat hitstop tidak cek menu — `triggerHitStop()` pake fresh `getState()`, cek pause/inventory/shop
- Physics tidak pause saat inventory open — `isInventoryOpen` di kondisi + dependency
- `loadGame()` tanpa validasi — cek `typeof stats.hp === 'number'` sebelum assign (cegah NaN state)
- Dialogue audio blip glitch — `playBlip()` guard `ended || paused` sebelum play
- Boss HP NaN — guard `maxHp > 0` di kalkulasi `hpPct`
- Ashen Knight phase shift store delay 3 detik — `store.setBoss()` langsung, bukan di `delayedCall`
- ESC bentrok dialog vs pause — dialog handle ESC lewat Phaser, cek `dialogue.isOpen` → `closeDialogue()` else `togglePause()`

### 🟢 Low Fixes
- Stamina regen jalan terus saat attack — tambah `!this.isAttacking`
- Loot drop numpuk posisi sama — random offset `Phaser.Math.Between(-30, 30)`
- Hotbar/item missing image placeholder — render `div` placeholder kalo `ITEM_IMAGES[itemId]` falsy
- `spawnGhost()` unimplemented method — commented out + TODO

### Asset Audit
- **0 missing assets** dari 81 total file (46 gambar + 35 audio)
- 1 orphan file: `footstep00.ogg` (tidak dipakai)
- 1 filename dengan spasi: `village bg.jpeg` (aman di Windows, potensi issue di Linux hosting)
- 1 dead config: `hollow_beast` di `BOSS_DATA` (tanpa sprite/implementasi)

---

## Credits

Game universe: **Aelindra**  
Main character: **Alden**  
Built with Phaser + React for narrative-action hybrid gameplay.  
Dev: Alxyzz
