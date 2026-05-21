# Aelindra: The Forsaken Knight

*Game Action RPG 2D dark fantasy bergaya pixel art yang dibangun menggunakan React & Phaser 3.*

---

## Gambaran Umum

**Aelindra: The Forsaken Knight** adalah game action RPG side-scrolling yang berfokus pada cerita emosional, pertarungan intens, dan atmosfer dunia fantasi kelam. Pemain akan mengikuti perjalanan **Alden**, seorang ksatria kerajaan yang difitnah sebagai pembunuh rajanya sendiri.

Dengan perpaduan combat cepat, sinematik bergaya visual novel, serta dunia penuh misteri dan kehancuran, game ini menghadirkan kisah tentang pengkhianatan, penebusan dosa, dan pengorbanan terakhir seorang pahlawan.

---

# Lore & Cerita Dunia

## Kerajaan Aelindra

Di kerajaan **Aelindra**, cahaya lilin hampir tidak pernah mampu mencapai sudut tergelap aula kastil. Di balik kemegahan kerajaan, tersembunyi kekuatan kuno yang perlahan bangkit dari kedalaman.

Di tengah tragedi tersebut berdiri seorang ksatria setia bernama **Alden**, prajurit kerajaan yang mengabdikan hidupnya untuk melindungi Raja **Aldric** dan rakyat Aelindra.

Namun, satu malam mengubah segalanya.

---

## Alur Cerita Utama

### 1. Pengkhianatan

Alden menemukan Raja Aldric tewas bersimbah darah di ruang kerajaan. Sebelum ia sempat menjelaskan apa yang terjadi, seorang petinggi kerajaan bernama **Valther** menuduhnya sebagai pelaku pembunuhan.

Putri kerajaan, **Evelyne**, yang dipenuhi kesedihan dan amarah, mempercayai fitnah tersebut dan memerintahkan Alden dihukum mati saat fajar tiba.

---

### 2. Pelarian dari Penjara

Pada malam sebelum eksekusi dilaksanakan, seorang pandai besi tua bernama **Old Edric** membebaskan Alden secara diam-diam dari penjara kerajaan.

Dipaksa melarikan diri dari tanah yang dulu ia lindungi, Alden memulai perjalanan untuk mencari kebenaran di balik kematian sang raja.

---

### 3. Ksatria yang Terbuang

Dalam persembunyiannya di **Harrowmere Village**, Alden melindungi warga desa dari serangan mayat hidup dan monster kegelapan.

Seorang anak kecil bernama **Tam** menjadi orang pertama yang percaya kepadanya:

> “Orang jahat tidak akan menyelamatkan ibuku dari monster.”

Di desa tersebut, Edric juga memberikan sebuah pedang legendaris bernama **The Forsaken Blade**.

---

### 4. Rahasia Kegelapan

Di dalam **Fogbound Forest**, Alden bertemu dengan seorang biarawati pengembara yang mengungkap kebenaran mengerikan.

Valther ternyata telah membuat perjanjian dengan kekuatan kuno yang tersegel di bawah Kastil Aelindra. Pembunuhan Raja Aldric merupakan bagian dari ritual untuk menghancurkan segel pertama.

---

### 5. Raja yang Terkutuk

Alden kembali ke reruntuhan kastil dan menghadapi **The Blind King**, arwah Raja Aldric yang telah dirasuki kegelapan.

Pada saat yang sama, Evelyne menemukan buku harian ayahnya yang membuktikan pengkhianatan Valther. Menyadari kesalahannya, ia mencari Alden dan memohon maaf.

---

### 6. Pertempuran Terakhir

Alden turun ke **Sunken Catacombs** lalu melintasi **Ruined Battlefields** demi menghentikan kehancuran kerajaan.

Setelah mengalahkan **Ashen Knight**, ia akhirnya berhadapan langsung dengan Valther dalam pertarungan terakhir yang menentukan nasib Aelindra.

---

## Ending

Valther berhasil dikalahkan dan kegelapan kuno kembali disegel.

Namun luka yang diterima Alden selama pertempuran terlalu parah untuk diselamatkan.

Di bawah langit merah yang perlahan mereda, Alden mengembuskan napas terakhirnya di pangkuan Evelyne sambil berkata:

> “Evelyne... kerajaan ini milikmu sekarang.  
> Kau akan menjadi ratu yang luar biasa.  
> Dan katakan pada Tam... bahwa pahlawan yang ia percayai... itu nyata.”

Bertahun-tahun kemudian, sebuah patung didirikan di pusat ibu kota dengan tulisan:

> **“Ksatria yang dibenci dunia... yang menyelamatkan semua orang.”**


![Ending Scene](./public/assets/images/ending.png)
=======
---

# Gameplay & Mekanik

## Sistem Combat

Game ini menghadirkan combat side-scrolling yang responsif, cepat, dan sinematik dengan fokus pada combo attack, impact yang terasa berat, serta efek visual yang memuaskan.

### 3-Hit Branching Combo System

Pemain dapat melancarkan kombinasi serangan unik:

1. **Light Slash 1 & 2**
   Tebasan cepat dengan sistem *Hit-Stop* yang membuat setiap pukulan terasa sangat berdampak.

2. **Cyclone Slash (Finisher)**
   Pada hit ke-3, pemain melepaskan serangan berputar (AoE) 360 derajat yang luas. Finisher ini memberikan efek **Bleed (DoT)** selama 5 detik pada musuh yang terkena.

### Status Effects

* **Stun (1s)**: Terjadi jika pemain mendaratkan serangan **Critical Hit**. Musuh akan terdiam total, memberikan celah untuk menghabisi mereka.
* **Bleed (5s)**: Efek kerusakan berkala dari *Cyclone Slash* yang menguras HP musuh secara perlahan.

---

## Tactical Movement & Combat Feel

### Shift Dash
Pemain dapat melakukan dash dengan tombol **Shift** atau **Space**. Dash ini adalah maneuver taktis tingkat tinggi yang mengonsumsi **35 Stamina** (tinggi), memberikan *invincibility frames* saat digunakan untuk menghindari serangan mematikan.

### Hit-Stop System
Dunia game akan berhenti sejenak (freeze) selama 80-120ms saat serangan pemain mengenai musuh atau boss, menciptakan pengalaman pertarungan yang visceral, berat, dan presisi.

### Surgical Hitboxes
Serangan pemain menggunakan *attack hitbox* yang presisi (75x60px) untuk memastikan combat terasa adil. Pemain harus berada di posisi yang tepat; tidak ada lagi damage yang masuk ke musuh hanya dengan "memukul angin".

---

## Final Boss: The Ashen Knight (Stage 5)

Pertarungan klimaks yang epik melawan Ashen Knight dengan sistem 3-Fase yang menantang:

1. **Fase I (100% - 20% HP)**: Pertarungan awal dengan pola serangan dasar yang agresif.
2. **Transisi Fase II**: Boss menjadi kebal, muncul peringatan **"PHASE II: UNYIELDING WILL"**, heal ke 2500 HP, dan buff statistik.
3. **Fase III (Climax)**: Boss menjadi lebih besar, heal ke 2000 HP, dan melepaskan **Ashen Storm** (hujan proyektil) serta *Void Teleport* secara terus-menerus.

---

# Stage & Dunia

Petualangan Alden terbagi menjadi lima wilayah utama dengan suasana visual dan tantangan yang berbeda.

| Stage | Lokasi | Deskripsi |
|---|---|---|
| 1 | **Harrowmere Village** | Desa hujan tempat Alden memulai pelariannya. |
| 2 | **Fogbound Forest** | Hutan berkabut yang dipenuhi monster bayangan. |
| 3 | **Aelindra Castle Ruins** | Reruntuhan kastil penuh badai petir dan kutukan. |
| 4 | **Sunken Catacombs** | Lorong bawah tanah kuno yang lembap dan gelap. |
| 5 | **Ruined Battlefields** | Medan perang tandus tempat pertarungan terakhir terjadi. |

---

# Sistem Cutscene & Narasi

## Prologue Cinematic

- Opening visual novel-style
- 17 slide narasi sinematik
- Typewriter text animation
- Rain ambience effect
- Background music khusus prologue

## Dialogue System

Sistem dialog interaktif untuk:

- Percakapan NPC
- Narasi cerita
- Intro boss battle
- Adegan emosional

---

# Audio & Sound Design

## Background Music

- Setiap stage memiliki backsound unik
- Transisi musik otomatis antar area
- Ending theme sinematik pada penutupan cerita

## Sound Effects

- Efek tebasan pedang
- Critical hit impact
- Footstep system
- Monster ambience
- Dialogue blip sound

## Audio Settings

Pause menu menyediakan pengaturan:

- Master Volume
- Music Volume
- SFX Volume
- Ambient Volume

Semua pengaturan tersimpan otomatis.

---

# Teknologi yang Digunakan

Game ini dibangun menggunakan teknologi web modern untuk menghasilkan performa stabil dan pengalaman bermain yang responsif.

## Core Technology

- React 18
- Phaser 3
- TypeScript
- Vite

## State Management

- Zustand
- Immer

## Styling & UI

- TailwindCSS
- Vanilla CSS

## Audio System

- HTML Audio API
- Phaser Sound System

---


# Cara Main Game nya
```bash
npm install
npm run build
npm run dev
>>>>>>> 18986534c77a890e0a5cef2f50d2764c5af797bd
