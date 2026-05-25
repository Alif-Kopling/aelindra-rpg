# Portal Bug Fixes

## Masalah
1. **Portal ga muncul** — setelah clear zone, portal gak muncul
2. **Langsung hitam** — kalau kena portal, layar itemang
3. **Dev tools zone jump gak bisa** — pindah stage manual juga gagal

## Root Cause

### 1. `transitionToZone()` — Error bikin layar itemang selamanya
Di `GameplayScene.ts:970`, pas `buildZone()` dipanggil di dalem `time.delayedCall`, kalau ada error (misal map gagal generate, atau state kacau), `fadeIn()` gak pernah dieksekusi. Camera tetap di fadeOut hitam **selamanya**.

**Fix:** Wrap `buildZone()` pake `try/catch`. Kalau error, fallback ke `buildZone('village')` + `fadeIn()` tetap jalan.

### 2. `store.currentZone` gak pernah diupdate pas pindah zone
Pas `transitionToZone()` dipanggil, cuma `this.currentZone` (field scene) yg diupdate. Zustand store `currentZone` gak pernah diubah. Akibatnya:
- Store pikir masih di zone lama
- Recall portal system kacau (HUD tombol RECALL/RETURN salah)
- Save/load zone jadi salah

**Fix:** Nambah `store.setZone(zoneId)` di `transitionToZone()`.

### 3. `createPortal()` — parameter `y` diabaikan
`createPortal(x, y, ...)` panggilannya pake `y = 20` dari config zone, tapi implementasinya pake `(this.mapHeight - 3) * TILE` — nge-ignore `y` sama sekali.

**Fix:** `portalY = y * TILE + TILE / 2`.

### 4. Portal di ujung kanan
`portalX = (this.mapWidth - 3) * TILE` biar portal selalu spawn di ujung kanan map.

### 5. Null guard overlap
Nambah `!this.player` guard di callback overlap biar gak crash.

## Files Changed

| File | Changes |
|------|---------|
| `src/scenes/GameplayScene.ts:910` | `portalY` pake `y * TILE + TILE / 2` |
| `src/scenes/GameplayScene.ts:911` | `portalX = (this.mapWidth - 3) * TILE` |
| `src/scenes/GameplayScene.ts:962-964` | Null guard `!this.player` |
| `src/scenes/GameplayScene.ts:988-989` | Nambah `store.setZone(zoneId)` |
| `src/scenes/GameplayScene.ts:992-1004` | `try/catch` + fallback + `fadeIn` tetap jalan |
