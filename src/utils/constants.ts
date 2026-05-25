export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 32;

export const DEBUG_HITBOXES = false;

/** Story progression order for zone unlock / recall */
export const ZONE_ORDER = [
  'village',
  'forest',
  'castle',
  'catacombs',
  'cathedral',
  'mountain',
  'battlefield',
] as const;

export function zoneProgressRank(zoneId: string): number {
  const index = ZONE_ORDER.indexOf(zoneId as (typeof ZONE_ORDER)[number]);
  return index >= 0 ? index : 0;
}

export const PLAYER_DEFAULTS = {
  maxHp: 120,
  maxStamina: 100,
  maxMana: 80,
  attack: 15,
  defense: 8,
  speed: 200,
};

export const COLORS = {
  hp: 0xdc143c,
  stamina: 0x32cd32,
  mana: 0x4169e1,
  gold: 0xffd700,
  exp: 0x9370db,
  white: 0xffffff,
  black: 0x000000,
  shadow: 0x1e1e2e,
  frost: 0xa8d8ea,
  ember: 0xc0392b,
  parchment: 0xf4e4c1,
};

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'combat' | 'survival' | 'passive';
  prerequisites: string[];
}

export const SKILL_TREE: SkillDefinition[] = [
  {
    id: 'blade_mastery',
    name: 'Kemahiran Pedang',
    description: 'Serangan dasar dan serangan berat menghasilkan kerusakan lebih tinggi, menghargai serangan yang disiplin.',
    cost: 1,
    category: 'combat',
    prerequisites: [],
  },
  {
    id: 'relentless_step',
    name: 'Langkah Tanpa Henti',
    description: 'Biaya menghindar lebih rendah dan durasi kekebalan bertahan sedikit lebih lama.',
    cost: 1,
    category: 'survival',
    prerequisites: [],
  },
  {
    id: 'iron_reflex',
    name: 'Refleks Besi',
    description: 'Jeda parry melebar dan parry yang berhasil memulihkan lebih banyak stamina.',
    cost: 1,
    category: 'combat',
    prerequisites: ['blade_mastery'],
  },
  {
    id: 'blood_pact',
    name: 'Pakta Darah',
    description: 'Serangan kritis lebih mematikan dan efek pendarahan bertahan lebih lama.',
    cost: 2,
    category: 'passive',
    prerequisites: ['iron_reflex'],
  },
];

/** @deprecated Prefer COMBAT_CONFIG from systems/combatFeel.ts */
export const COMBO_TIMEOUT = 1400;
export const DASH_COOLDOWN = 480;
export const DASH_DURATION = 180;
export const DASH_SPEED = 680;
export const INVINCIBILITY_FRAMES = 280;

export const STORY_CHAPTERS = [
  { id: 'prologue', title: 'Malam Saat Kerajaan Menangis' },
  { id: 'ch1', title: 'Ksatria Terbuang' },
  { id: 'ch2', title: 'Abu Sang Mahkota' },
  { id: 'ch3', title: 'Rahasia Biarawati Pengembara' },
  { id: 'ch4', title: 'Di Balik Hutan Fogbound' },
  { id: 'ch5', title: 'Keraguan Sang Putri' },
  { id: 'ch6', title: 'Segel yang Hancur' },
  { id: 'ch7', title: 'Wajah Asli Valther' },
  { id: 'finale', title: 'Ksatria Terakhir' },
];

export const ZONES = {
  village: { name: 'Desa Harrowmere', music: 'village_peaceful', ambience: 'rain_soft' },
  tavern: { name: 'Kedai Iron Lantern', music: 'tavern_warm', ambience: 'fireplace' },
  forest: { name: 'Hutan Fogbound', music: 'forest_dark', ambience: 'wind_leaves' },
  castle: { name: 'Kastil Kerajaan Aelindra', music: 'castle_haunted', ambience: 'wind_stone' },
  cathedral: { name: 'Katedral Abu', music: 'cathedral_choir', ambience: 'silence' },
  mountain: { name: 'Puncak Frostpeak', music: 'mountain_lonely', ambience: 'blizzard' },
  catacombs: { name: 'Katakombe Terkutuk', music: 'catacombs_dread', ambience: 'drip_echo' },
  battlefield: { name: 'Reruntuhan Medan Perang', music: 'battlefield_tragic', ambience: 'wind_haunting' },
};

export const BOSS_DATA = [
  {
    id: 'blind_king',
    name: 'Blind King',
    title: 'Mantan Penguasa, Kini Hampa',
    maxHp: 800,
    phases: 2,
    zone: 'castle',
  },
  {
    id: 'ashen_knight',
    name: 'Ashen Knight',
    title: 'Pernah Menjadi Pelindung, Kini Hanya Debu',
    maxHp: 600,
    phases: 2,
    zone: 'battlefield',
  },
  {
    id: 'saint_of_rot',
    name: 'Saint Pembusukan',
    title: 'Pelayan Iman yang Terkorupsi',
    maxHp: 700,
    phases: 3,
    zone: 'cathedral',
  },
  {
    id: 'hollow_beast',
    name: 'Hollow Beast',
    title: 'Keputusasaan Hutan yang Menjelma',
    maxHp: 900,
    phases: 2,
    zone: 'forest',
  },
  {
    id: 'fallen_guardian',
    name: 'Penjaga yang Gugur',
    title: 'Yang Bersumpah Melindungi Segalanya',
    maxHp: 1000,
    phases: 3,
    zone: 'mountain',
  },
  {
    id: 'valther',
    name: 'Valther',
    title: 'Arsitek Kehancuran',
    maxHp: 1500,
    phases: 4,
    zone: 'castle',
  },
];

export const ITEMS_DB: Record<string, any> = {
  health_potion: {
    id: 'health_potion',
    name: 'Ramuan Pemulih',
    type: 'consumable',
    rarity: 'common',
    description: 'Cairan merah yang menyembuhkan luka. Rasanya seperti besi dan harapan yang tipis.',
    icon: '🧪',
    quantity: 1,
    stackable: true,
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Pedang Panjang Besi',
    type: 'weapon',
    rarity: 'common',
    description: 'Pedang standar ksatria Aelindra. Dahulu merupakan simbol kehormatan.',
    icon: '⚔️',
    stats: { attack: 5 },
    quantity: 1,
    stackable: false,
  },
  forsaken_blade: {
    id: 'forsaken_blade',
    name: 'Forsaken Blade',
    type: 'weapon',
    rarity: 'rare',
    description: 'Ditempa oleh Pandai Besi Tua untuk perjalanan Alden. Memikul beban kemurnian.',
    icon: '🗡️',
    stats: { attack: 14 },
    quantity: 1,
    stackable: false,
  },
  knight_armor: {
    id: 'knight_armor',
    name: 'Zirah Ksatria Sobek',
    type: 'armor',
    rarity: 'uncommon',
    description: 'Dulu mengkilap dan membanggakan. Kini tergores dan ternoda oleh darahnya sendiri.',
    icon: '🛡️',
    stats: { defense: 8 },
    quantity: 1,
    stackable: false,
  },
  wanderers_ring: {
    id: 'wanderers_ring',
    name: 'Cincin Pengembara',
    type: 'accessory',
    rarity: 'rare',
    description: 'Diberikan oleh Biarawati Pengembara. Bersinar redup saat segel kuno berada di dekatnya.',
    icon: '💍',
    stats: { mana: 20, speed: 15 },
    quantity: 1,
    stackable: false,
  },
  blacksmiths_gift: {
    id: 'blacksmiths_gift',
    name: 'Kenang-kenangan Pandai Besi',
    type: 'questItem',
    rarity: 'legendary',
    description: '"Bertahanlah, nak. Itu perintah dari orang tua bodoh yang masih percaya padamu." — Edric Tua',
    icon: '🔨',
    quantity: 1,
    stackable: false,
  },
};
