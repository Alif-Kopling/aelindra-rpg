// ============================================================
// CORE GAME TYPES
// ============================================================

export type GameScreen = 'title' | 'prologue' | 'nameInput' | 'game' | 'paused' | 'gameOver' | 'ending' | 'epilogue';

export interface Vector2 {
  x: number;
  y: number;
}

// ============================================================
// PLAYER TYPES
// ============================================================

export interface PlayerStats {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  exp: number;
  expToNext: number;
}

export interface PlayerState {
  name: string;
  stats: PlayerStats;
  position: Vector2;
  facingRight: boolean;
  isAttacking: boolean;
  isDashing: boolean;
  isInteracting: boolean;
  comboCount: number;
  lastComboTime: number;
  ultimateCharge: number;
  equippedWeapon: string;
  equippedArmor: string;
  equippedAccessory: string;
  weaponLevel?: number;
  armorLevel?: number;
  cycle: number;
}

// ============================================================
// INVENTORY / ITEMS
// ============================================================

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'questItem' | 'material';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  icon: string;
  stats?: Partial<PlayerStats>;
  quantity: number;
  stackable: boolean;
}

export interface InventoryState {
  items: Item[];
  gold: number;
  maxSlots: number;
}

// ============================================================
// COMBAT TYPES
// ============================================================

export interface AttackData {
  damage: number;
  knockback: number;
  stunDuration: number;
  comboIndex: number;
  isSkill: boolean;
  isMagic: boolean;
}

export interface HitEffect {
  id: string;
  position: Vector2;
  type: 'slash' | 'magic' | 'fire' | 'ice' | 'critical';
  timestamp: number;
}

// ============================================================
// ENEMY TYPES
// ============================================================

export type EnemyType = 'undead' | 'beast' | 'demon' | 'corrupted' | 'boss';
export type EnemyState = 'idle' | 'patrol' | 'chase' | 'attack' | 'stagger' | 'dead';

export interface EnemyStats {
  hp: number;
  maxHp?: number;
  attack: number;
  defense: number;
  speed: number;
  exp: number;
  gold: number;
}

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  stats: EnemyStats;
  position: Vector2;
  state: EnemyState;
  phase?: number;
}

// ============================================================
// BOSS TYPES
// ============================================================

export interface BossData {
  id: string;
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  phase: number;
  maxPhase: number;
  isActive: boolean;
}

// ============================================================
// DIALOGUE / STORY
// ============================================================

export type DialogueTone = 'calm' | 'sarcastic' | 'determined' | 'emotional' | 'silent';

export interface DialogueLine {
  speaker: string;
  portrait?: string;
  text: string;
  emotion?: 'neutral' | 'angry' | 'sad' | 'happy' | 'shocked' | 'determined' | 'loving';
  choices?: DialogueChoice[];
  isNarration?: boolean;
  /** Optional full-screen scene art (under public/assets/images/animation/) */
  sceneImage?: string;
  /** Brief hold after line completes (ms) */
  pauseAfterMs?: number;
  cinematic?: 'none' | 'zoom' | 'dramatic';
}

export interface DialogueChoice {
  text: string;
  tone: DialogueTone;
  /** Short label shown on choice button */
  label?: string;
  npcId?: string;
  trustDelta?: number;
  flavorFlag?: string;
  /** Alden's voiced response after picking */
  aldenLine?: string;
  /** Inline NPC reactions (overrides templates) */
  reactionLines?: DialogueLine[];
  reactions?: Record<string, DialogueLine>;
  pauseMs?: number;
  cinematic?: 'none' | 'zoom' | 'dramatic';
  /** Legacy fields — ignored; canon path preserved */
  consequence?: string;
  nextDialogue?: string;
}

export interface DialogueState {
  isOpen: boolean;
  lines: DialogueLine[];
  currentIndex: number;
  speakerName: string;
  onComplete?: () => void;
  awaitingChoice: boolean;
  lastTone?: DialogueTone;
}

// ============================================================
// QUEST TYPES
// ============================================================

export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  required: number;
  current: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: {
    exp: number;
    gold: number;
    items?: string[];
  };
  isMain: boolean;
}

// ============================================================
// MAP / WORLD
// ============================================================

export type ZoneType = 'village' | 'forest' | 'dungeon' | 'castle' | 'cathedral' | 'mountain' | 'battlefield';

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  ambience: string;
  music: string;
  discovered: boolean;
}

// ============================================================
// SKILL TREE
// ============================================================

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  unlocked: boolean;
  prerequisites: string[];
  category: 'combat' | 'magic' | 'survival' | 'passive';
  effect: Partial<PlayerStats> | { special: string };
}

// ============================================================
// SAVE SYSTEM
// ============================================================

export interface SaveSlot {
  id: number;
  playerName: string;
  level: number;
  zone: string;
  playtime: number;
  timestamp: number;
  isEmpty: boolean;
}

export interface GameSave {
  slot: number;
  player: PlayerState;
  inventory: InventoryState;
  quests: Quest[];
  discoveredZones: string[];
  storyFlags: Record<string, boolean>;
  skillPoints: number;
  unlockedSkills: string[];
  playtime: number;
  timestamp: number;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'lore' | 'error';
  title: string;
  message: string;
  icon?: string;
  duration?: number;
  timestamp?: number;
}

// ============================================================
// SETTINGS
// ============================================================

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  showDamageNumbers: boolean;
  screenShake: boolean;
  particleQuality: 'low' | 'medium' | 'high';
  fullscreen: boolean;
  showFPS: boolean;
  language: string;
}
