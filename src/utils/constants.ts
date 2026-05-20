export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 32;

export const PLAYER_DEFAULTS = {
  maxHp: 150,
  maxStamina: 100,
  maxMana: 80,
  attack: 18,
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

export const COMBO_TIMEOUT = 1200; // ms between combo hits
export const DASH_COOLDOWN = 600;
export const DASH_DURATION = 200;
export const DASH_SPEED = 600;
export const INVINCIBILITY_FRAMES = 400;

export const STORY_CHAPTERS = [
  { id: 'prologue', title: 'The Night the Kingdom Wept' },
  { id: 'ch1', title: 'The Forsaken Knight' },
  { id: 'ch2', title: 'Ashes of the Crown' },
  { id: 'ch3', title: 'The Wandering Nun\'s Secret' },
  { id: 'ch4', title: 'Beyond the Fogbound Forest' },
  { id: 'ch5', title: 'The Princess\'s Doubt' },
  { id: 'ch6', title: 'Shattered Seals' },
  { id: 'ch7', title: 'Valther\'s True Face' },
  { id: 'finale', title: 'The Last Knight' },
];

export const ZONES = {
  village: { name: 'Harrowmere Village', music: 'village_peaceful', ambience: 'rain_soft' },
  tavern: { name: 'The Iron Lantern Tavern', music: 'tavern_warm', ambience: 'fireplace' },
  forest: { name: 'Fogbound Forest', music: 'forest_dark', ambience: 'wind_leaves' },
  castle: { name: 'Aelindra Royal Castle', music: 'castle_haunted', ambience: 'wind_stone' },
  cathedral: { name: 'Cathedral of Ash', music: 'cathedral_choir', ambience: 'silence' },
  mountain: { name: 'Frostpeak Summit', music: 'mountain_lonely', ambience: 'blizzard' },
  catacombs: { name: 'Sunken Catacombs', music: 'catacombs_dread', ambience: 'drip_echo' },
  battlefield: { name: 'Ruined Battlefields', music: 'battlefield_tragic', ambience: 'wind_haunting' },
};

export const BOSS_DATA = [
  {
    id: 'blind_king',
    name: 'The Blind King',
    title: 'Former Ruler, Now Hollow',
    maxHp: 800,
    phases: 2,
    zone: 'castle',
  },
  {
    id: 'ashen_knight',
    name: 'Ashen Knight',
    title: 'Once a Guardian, Now Dust',
    maxHp: 600,
    phases: 2,
    zone: 'battlefield',
  },
  {
    id: 'saint_of_rot',
    name: 'Saint of Rot',
    title: 'Corrupted Servant of the Faith',
    maxHp: 700,
    phases: 3,
    zone: 'cathedral',
  },
  {
    id: 'hollow_beast',
    name: 'Hollow Beast',
    title: 'The Forest\'s Despair Given Form',
    maxHp: 900,
    phases: 2,
    zone: 'forest',
  },
  {
    id: 'fallen_guardian',
    name: 'Fallen Guardian',
    title: 'Who Swore to Protect All',
    maxHp: 1000,
    phases: 3,
    zone: 'mountain',
  },
  {
    id: 'valther',
    name: 'Valther',
    title: 'The Architect of Ruin',
    maxHp: 1500,
    phases: 4,
    zone: 'castle',
  },
];

export const ITEMS_DB: Record<string, any> = {
  health_potion: {
    id: 'health_potion',
    name: 'Healing Draught',
    type: 'consumable',
    rarity: 'common',
    description: 'A crimson tincture that mends wounds. Tastes of iron and desperate hope.',
    icon: '🧪',
    quantity: 1,
    stackable: true,
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Longsword',
    type: 'weapon',
    rarity: 'common',
    description: 'Standard-issue blade of Aelindra knights. Once it stood for honor.',
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
    description: 'Forged by the Old Blacksmith for Alden\'s journey. Carries the weight of innocence.',
    icon: '🗡️',
    stats: { attack: 14 },
    quantity: 1,
    stackable: false,
  },
  knight_armor: {
    id: 'knight_armor',
    name: 'Tattered Knight\'s Plate',
    type: 'armor',
    rarity: 'uncommon',
    description: 'Once polished and proud. Now scratched and stained with his own blood.',
    icon: '🛡️',
    stats: { defense: 8 },
    quantity: 1,
    stackable: false,
  },
  wanderers_ring: {
    id: 'wanderers_ring',
    name: 'Ring of the Wanderer',
    type: 'accessory',
    rarity: 'rare',
    description: 'Given by the Wandering Nun. Glows faintly when ancient seals are near.',
    icon: '💍',
    stats: { mana: 20, speed: 15 },
    quantity: 1,
    stackable: false,
  },
  blacksmiths_gift: {
    id: 'blacksmiths_gift',
    name: 'Blacksmith\'s Memento',
    type: 'questItem',
    rarity: 'legendary',
    description: '"Survive, boy. That\'s an order from an old fool who still believes in you." — Old Edric',
    icon: '🔨',
    quantity: 1,
    stackable: false,
  },
};
