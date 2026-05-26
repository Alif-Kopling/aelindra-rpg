# Aelindra RPG — Status Proyek & Lanjutan Dev

Dokumen ini untuk **melanjutkan development tanpa konteks chat lama**. Terakhir di-update: **26 Mei 2026** — setelah **16 bug fix** (critical/high) + asset audit.

---

## Stack singkat

| Layer | Tech |
|--------|------|
| Game | Phaser 3.60 |
| UI | React 18 + Tailwind |
| State | Zustand + Immer |
| Build | Vite 5 + TypeScript |

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc + vite → dist/
```

---

## Struktur folder penting

```
src/
  scenes/GameplayScene.ts   # Zona, round, portal, combat overlap, cinematics
  scenes/PreloadScene.ts      # Asset load
  entities/Player.ts          # Movement, combo, dash, parry
  entities/Enemy.ts, Boss.ts, NPC.ts
  systems/
    storyData.ts              # Semua dialog canon (jangan fork ending)
    storyChoices.ts           # Inject pilihan tone Alden per scene
    dialogueEngine.ts         # Reaksi NPC dari tone + trust
    combatFeel.ts             # Tuning hitstop, dash, combo (single source)
    MapSystem.ts              # Tile/platform per theme
  store/gameStore.ts          # Screen, player, save, zone, dialogue, trust
  ui/DialogueSystem.tsx       # Typewriter + choice buttons 1–5
  ui/DevToolsPanel.tsx        # F10, zone jump (dev only)
  components/GameComponent.tsx
```

---

## Alur cerita (CANON — jangan di-branch)

**Satu timeline tetap:**

`village → forest → castle → catacombs → cathedral → mountain → battlefield → ending`

- Setiap zona: beberapa **round** (musuh / dialog / boss).
- Selesai semua round → **portal kanan** → zona berikutnya.
- `battlefield` clear → cycle bisa reset ke `village` (NG+ ringan).
- Boss utama / ending: **tidak** diubah oleh pilihan dialog.

### Pilihan dialog (illusion of agency)

- Hanya **respons Alden (MC)** — 5 tone: calm, sarcastic, determined, emotional, silent.
- NPC **reaksi 1 baris** (trust + template), lalu script **lanjut baris canon** yang sama.
- Scene dengan choice (inject di `storyChoices.ts`):
  - `village_entry`, `village_round2`, `forest_entry`, `castle_entry`, `battlefield_entry`
- State: `npcTrust`, `npcMood`, `playerTone`, `storyFlags` flavor — **tersimpan di save**.

---

## Sistem combat (sudah ada)

File tuning: `src/systems/combatFeel.ts`

| Fitur | Catatan |
|--------|---------|
| Combo 5 hit | Hit ke-5 = finisher + zoom |
| Dash | i-frames, air dash, arah A/D |
| Input buffer | attack ~200ms, dash ~160ms |
| Attack cancel | Dash setelah ~140ms swing |
| Hitstop | Skala crit/finisher/boss |
| Enemy telegraph | Ring merah sebelum serang |
| Combo pressure | 3 hit cepat → stagger lebih panjang |
| Anti stun-lock player | Grace ~520ms antar damage |

Kontrol lengkap: **Pause → tab Controls**.

---

## Bug fixes (batch stabilisasi 26 Mei 2026)

### 🔴 Critical
| # | Fix | File |
|---|-----|------|
| 1 | **Keyboard listener leak** — ESC/TAB listeners `removeAllListeners()` tiap setup + cleanup di `shutdown()` | `GameplayScene.ts` |
| 2 | **enemyGroup tdk pernah clear** pas ganti zone — tambah `enemyGroup.clear(true,true)` di `buildZone()` + `shutdown()` | `GameplayScene.ts` |
| 3 | **Boss `onRoundCleared()` double fire** — guard `if (!this.roundActive) return` di `onEnemyKilled()` + guard di handler `boss-died` | `GameplayScene.ts` |
| 4 | **`Math.random()` di React key** — Inventory item key `item.id + '_' + idx` | `Inventory.tsx` |
| 5 | **setTimeout leak** (6 file) — semua timer pake `clearTimeout` di cleanup effect | `BossHealthBar.tsx`, `GameOverScreen.tsx`, `EndingScreen.tsx`, `EpilogueScreen.tsx`, `PrologueScreen.tsx` |

### 🟠 High
| # | Fix | File |
|---|-----|------|
| 6 | **Physics resume pas hitstop gak cek menu** — `triggerHitStop()` pake fresh `getState()`, cek `isPaused`/`isInventoryOpen`/`isShopOpen` | `GameplayScene.ts` |
| 7 | **Physics jalan pas inventory buka** — `isInventoryOpen` ditambah ke kondisi + dependency array | `GameComponent.tsx` |
| 8 | **loadGame tanpa validasi** — cek `typeof data.player?.stats?.hp === 'number'` sebelum `set()` | `gameStore.ts` |
| 9 | **DialogueSystem audio glitch** — `playBlip()` guard `ended || paused` sebelum `.play()` | `DialogueSystem.tsx` |
| 10 | **Boss HP bisa NaN** — guard `maxHp > 0` di kalkulasi `hpPct` | `BossHealthBar.tsx` |
| 11 | **Ashen Knight phase shift store delay 3s** — `store.setBoss()` dipindah ke luar `delayedCall(3000)`, UI update langsung | `Boss.ts` |
| 12 | **ESC bentrok dialog vs pause** — `DialogueSystem.tsx` ESC handler `return` (abaikan), `GameplayScene.ts` ESC cek `dialogue.isOpen` → `closeDialogue()` else `togglePause()` | `DialogueSystem.tsx`, `GameplayScene.ts` |

### 🟢 Low
| # | Fix | File |
|---|-----|------|
| 13 | **Stamina regen jalan pas attack** — tambah `!this.isAttacking` di kondisi regen | `Player.ts` |
| 14 | **Loot drop numpuk posisi sama** — tambah `Phaser.Math.Between(-30,30)` offset random | `Enemy.ts` |
| 15 | **Hotbar/item missing image placeholder** — render `div` placeholder kalo `ITEM_IMAGES[itemId]` falsy | `HUD.tsx`, `Inventory.tsx` |

---

## Asset audit (26 Mei 2026)

**Semua asset references bersih — 0 missing files.** Detail:
- 81 file assets total (46 gambar, 35 audio)
- Hanya 1 orphan file: `public/assets/audio/footstep00.ogg` (ga direference, udah diganti `footstaps.mp3`)
- 1 potensi issue: `public/assets/images/village bg.jpeg` ada **spasi** → aman di Windows, potensi broken di Linux hosting
- `constants.ts` `BOSS_DATA` berisi `hollow_beast` yang gak punya sprite/implementasi (dead config)

---

## Save / load

`localStorage` key: `aelindra_save_{0,1,2}`

Field penting: `player`, `inventory`, `storyFlags`, `currentZone`, `furthestClearedZone`, `npcTrust`, `npcMood`, `hotbar`, `unlockedSkills`, dll.

Load reset: boss null, pause/dialogue tutup, HP min 1 jika 0.

**⚠ Validasi:** `loadGame()` sekarang validasi `typeof data.player?.stats?.hp === 'number'` sebelum assign — cegah NaN state.

---

## Yang masih kurang (prioritas lanjut)

### P0 — Main play validation

- [ ] Playtest full loop **tanpa** dev tools (village → battlefield).
- [ ] Portal tiap zona muncul & tidak black screen.
- [ ] Recall / Return di HUD (`recallToTown`, `returnToBattlefield`) sync dengan scene.
- [ ] Save/load di tengah zona & setelah pindah map.

### P1 — Dialog & immersion

- [ ] Choice beats di **catacombs, cathedral, mountain** (copy pattern `storyChoices.ts`).
- [ ] Trust tampil di HUD (icon kecil Edric/Evelyne/Nun).
- [ ] Portrait **swap per emotion** (butuh asset atau sprite sheet).
- [ ] `sceneIdFromLines()` masih heuristic — lebih aman pass `sceneId` eksplisit di setiap `openStoryDialogue` call.
- [ ] Auto-dialogue (`isAutoDialogue`) **skip** choice UI — by design; dokumentasikan di settings.

### P1 — Combat polish

- [ ] Balance finisher damage / stamina (mudah terlalu OP di trash mobs).
- [ ] Boss phase + hitstop tidak bentrok dengan zone transition.
- [ ] Enemy pattern variety (ranged, leap) — sekarang mostly melee + telegraph ring.
- [ ] Animation state machine Phaser (sekarang frame/tween manual di `Player.updateFrame`).

### P2 — Tech debt

- [ ] Bundle ~1.9MB — code-split Phaser atau dynamic import scene.
- [ ] Rename `village bg.jpeg` → `village-bg.jpeg` (spasi) + update `PreloadScene.ts`.
- [ ] Hapus file orphan `footstep00.ogg`.
- [ ] Hapus dead config `hollow_beast` dari `constants.ts:BOSS_DATA`.
- [ ] Unit test minimal: `zoneProgressRank`, `resolveChoiceReactions`, save round-trip.
- [ ] CI: `npm run build` di GitHub Actions.

### P2 — Content

- [ ] NPC patrol coords hardcoded (`y: 480`) — selaraskan dengan `mapHeight * TILE`.
- [ ] BGM beberapa zona share file yang sama (`bgm.ts`).
- [ ] Quest system ada di store tapi kurang di-wire di gameplay.

### P3 — Nice to have

- [ ] Motion blur / lebih banyak slash VFX (setting `particleQuality` dipakai terbatas).
- [ ] Ending branch flavor text only (bukan route baru).
- [ ] i18n EN/ID konsisten (campur ID/EN di `storyData`).

---

## Prompt singkat untuk agent berikutnya

```
Baca HANDOFF.md.
Jangan branch ending/quest utama.
Dialogue: extend storyChoices + dialogueEngine, canon tetap.
Combat: tune combatFeel.ts, jangan duplikasi logic di Player.
Map: transitionToZone + buildZone + onZoneComplete portal.
Tes portal via main play, bukan hanya dev jump.

Sudah di-fix (batch 26 Mei 2026):
- Keyboard leak, enemyGroup leak, boss double-fire onRoundCleared
- React key Math.random, setTimeout leaks (6 file)
- Physics resume tanpa cek menu, inventory physics pause
- loadGame validation, boss HP NaN, audio blip glitch
- Ashen Knight phase shift store delay, ESC bentrok dialog/pause
- Missing image placeholder, stamina regen pas attack, loot overlap
- Asset audit: 0 missing files (1 orphan + 1 space-in-filename)
```

---

## Kontrol & dev

| Input | Aksi |
|--------|------|
| `;` | Dev Tools launcher |
| F10 | Toggle Dev Tools panel (zone jump, boss trigger, skip ending) |
| 1–5 | Pilih tone dialog (saat choice muncul) |
| WASD | Move |
| Space / Shift | Dash |
| L / LMB | Light Attack (hold = charged) |
| RMB | Ultimate (Forsaken Slash) |
| F | Parry / Counter |
| E | Interact NPC / Advance Dialogue |
| Tab | Toggle Inventory |
| Esc | **Pause** (tutup dialog dulu jika sedang open) |
| Recall/Return | HUD kanan bawah (setelah pernah leave village) |

---

## Catatan untuk user (Alxyzz)

- **Dialog pilihan = cuma Alden**, NPC cuma reaksi, **alur tetap nyambung**.
- **ESC sekarang bedain:** kalo dialog open → tutup dialog, gak toggle pause.
- **Physics gak bakal resume** pas hitstop kalo inventory/pause/shop/dialog open.
- **Boss phase HP bar** update langsung, gak nunggu 3 detik lagi.
- **Save corrupt** (NaN stats) bakal ditangkep validasi, gak nge-crash game.
- Lanjut paling enak: **P0 playtest** dulu, baru tambah choice di zona yang belum ada.
- Asset minor: `village bg.jpeg` (spasi) + `footstep00.ogg` (orphan) + `hollow_beast` (dead config) — belum dibersihkan.

---

*Dokumen ini sengaja self-contained agar sesi chat baru tidak perlu baca ulang seluruh history.*
