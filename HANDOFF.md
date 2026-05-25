# Aelindra RPG — Status Proyek & Lanjutan Dev

Dokumen ini untuk **melanjutkan development tanpa konteks chat lama**. Terakhir di-update setelah pass stabilisasi + dialogue choices + combat feel.

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

## Bug map / portal — status

### Sudah diperbaiki (`Bug1-portal.md` + lanjutan)

1. Layar hitam stuck → `try/catch` + `fadeIn` tetap jalan di `transitionToZone`.
2. `store.currentZone` sync → `setZone()` saat pindah zona.
3. Portal posisi → kanan map (`mapWidth - 3`), Y dari config `nextZone.y`.
4. Dev jump race → hapus `__dev_jump__`, satu jalur `transitionToZone`.
5. Boss HUD ghost → `setBoss(null)` saat `buildZone`.
6. Memory kecil → sfx listener cleanup, enemy destroy HP bar, portal tween kill.

### Dev Tools (F10)

- **Bukan** tes portal — langsung rebuild zona.
- Sekarang: `skipStory: true` → fade cepat, **tanpa** dialog entry zona, langsung combat round 1.
- Portal tetap hanya muncul setelah **clear semua round** di zona itu.

### Cara tes portal (main play)

1. Village → bunuh semua wave tiap round.
2. Notifikasi **"Path Clear!"**
3. Portal di **ujung kanan** → overlap → fade → zona baru.

---

## Save / load

`localStorage` key: `aelindra_save_{0,1,2}`

Field penting: `player`, `inventory`, `storyFlags`, `currentZone`, `furthestClearedZone`, `npcTrust`, `npcMood`, `hotbar`, `unlockedSkills`, dll.

Load reset: boss null, pause/dialogue tutup, HP min 1 jika 0.

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
- [ ] `GameComponent.tsx` di editor kadang beda dengan disk (pastikan DevTools + `jumpToZoneForDev` tersimpan).
- [ ] ESC bentrok: pause vs tutup dialog.
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

## File referensi bug lama

- `Bug1-portal.md` — root cause portal (historical, mostly fixed).

---

## Prompt singkat untuk agent berikutnya

```
Baca HANDOFF.md dan Bug1-portal.md.
Jangan branch ending/quest utama.
Dialogue: extend storyChoices + dialogueEngine, canon tetap.
Combat: tune combatFeel.ts, jangan duplikasi logic di Player.
Map: transitionToZone + buildZone + onZoneComplete portal.
Tes portal via main play, bukan hanya dev jump.
```

---

## Kontrol & dev

| Input | Aksi |
|--------|------|
| F10 | Dev Tools (zone jump, boss trigger, skip ke ending UI) |
| 1–5 | Pilih tone dialog (saat choice muncul) |
| Space/Shift | Dash |
| L / LMB | Combo |
| Hold L | Charged attack |
| F | Parry |
| RMB | Ultimate |
| E | Interact NPC |
| Recall/Return | HUD kanan bawah (setelah pernah leave village) |

---

## Catatan untuk user (Alxyzz)

- **Dialog pilihan = cuma Alden**, NPC cuma reaksi, **alur tetap nyambung**.
- **Map bug utama sudah di-address**; kalau masih aneh, catat: hitam permanen vs kedip, zona mana, dev tools atau portal.
- Lanjut paling enak: **P0 playtest** dulu, baru tambah choice di zona yang belum ada.

---

*Dokumen ini sengaja self-contained agar sesi chat baru tidak perlu baca ulang seluruh history.*
