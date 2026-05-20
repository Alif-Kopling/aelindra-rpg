import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  GameScreen,
  PlayerState,
  PlayerStats,
  InventoryState,
  Item,
  Quest,
  DialogueState,
  DialogueLine,
  BossData,
  Notification,
  GameSettings,
  SaveSlot,
  HitEffect,
} from '../utils/types';
import { PLAYER_DEFAULTS, ITEMS_DB } from '../utils/constants';

// ============================================================
// INITIAL STATES
// ============================================================

const initialPlayerStats: PlayerStats = {
  hp: PLAYER_DEFAULTS.maxHp,
  maxHp: PLAYER_DEFAULTS.maxHp,
  stamina: PLAYER_DEFAULTS.maxStamina,
  maxStamina: PLAYER_DEFAULTS.maxStamina,
  mana: PLAYER_DEFAULTS.maxMana,
  maxMana: PLAYER_DEFAULTS.maxMana,
  attack: PLAYER_DEFAULTS.attack,
  defense: PLAYER_DEFAULTS.defense,
  speed: PLAYER_DEFAULTS.speed,
  level: 1,
  exp: 0,
  expToNext: 100,
};

const initialPlayer: PlayerState = {
  name: 'Alden',
  stats: initialPlayerStats,
  position: { x: 200, y: 300 },
  facingRight: true,
  isAttacking: false,
  isDashing: false,
  isInteracting: false,
  comboCount: 0,
  lastComboTime: 0,
  ultimateCharge: 0,
  equippedWeapon: 'iron_sword',
  equippedArmor: 'knight_armor',
  equippedAccessory: '',
  weaponLevel: 1,
  armorLevel: 1,
};

const initialInventory: InventoryState = {
  items: [
    { ...ITEMS_DB.iron_sword, quantity: 1 },
    { ...ITEMS_DB.knight_armor, quantity: 1 },
    { ...ITEMS_DB.health_potion, quantity: 3 },
  ],
  gold: 0,
  maxSlots: 30,
};

const initialSettings: GameSettings = {
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 85,
  ambientVolume: 60,
  showDamageNumbers: true,
  screenShake: true,
  particleQuality: 'high',
  fullscreen: false,
  showFPS: false,
  language: 'en',
};

const initialDialogue: DialogueState = {
  isOpen: false,
  lines: [],
  currentIndex: 0,
  speakerName: '',
};

// ============================================================
// STORE INTERFACE
// ============================================================

interface GameStore {
  // Screen management
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  // Player
  player: PlayerState;
  setPlayerName: (name: string) => void;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  restoreStamina: (amount: number) => void;
  drainStamina: (amount: number) => void;
  gainExp: (amount: number) => void;
  levelUp: () => void;
  setPlayerAttacking: (val: boolean) => void;
  setPlayerDashing: (val: boolean) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  chargeUltimate: (amount: number) => void;

  // Inventory
  inventory: InventoryState;
  addItem: (item: Item) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (itemId: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  // Dialogue
  dialogue: DialogueState;
  openDialogue: (lines: DialogueLine[], onComplete?: () => void) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;

  // Boss
  activeBoss: BossData | null;
  setBoss: (boss: BossData | null) => void;
  damageBoss: (amount: number) => void;

  // Quests
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  updateQuestObjective: (questId: string, objectiveId: string, amount: number) => void;
  completeQuest: (questId: string) => void;

  // Story flags
  storyFlags: Record<string, boolean>;
  setStoryFlag: (flag: string, value: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Hit effects
  hitEffects: HitEffect[];
  addHitEffect: (effect: Omit<HitEffect, 'id'>) => void;
  clearOldHitEffects: () => void;

  // Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;

  // Zone
  currentZone: string;
  setZone: (zone: string) => void;
  discoveredZones: string[];
  discoverZone: (zoneId: string) => void;

  // UI state
  isInventoryOpen: boolean;
  toggleInventory: () => void;
  isSkillTreeOpen: boolean;
  toggleSkillTree: () => void;
  isQuestLogOpen: boolean;
  toggleQuestLog: () => void;
  isMapOpen: boolean;
  toggleMap: () => void;
  isPaused: boolean;
  togglePause: () => void;
  isShopOpen: boolean;
  setShopOpen: (val: boolean) => void;
  upgradeWeapon: (cost: number) => void;
  upgradeArmor: (cost: number) => void;
  buyPotion: (cost: number) => void;

  // Save system
  saveSlots: SaveSlot[];
  isSaving: boolean;
  saveGame: (slot: number) => void;
  loadGame: (slot: number) => void;

  // Play time
  playtime: number;
  incrementPlaytime: () => void;

  // Combat
  isInCombat: boolean;
  setInCombat: (val: boolean) => void;
  killCount: number;
  incrementKillCount: () => void;

  // Zone Rounds
  currentRound: number;
  setZoneRound: (round: number) => void;
}

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Screen
    screen: 'title',
    setScreen: (screen) => set((s) => { s.screen = screen; }),

    // Player
    player: initialPlayer,
    setPlayerName: (name) => set((s) => { s.player.name = name; }),
    updatePlayerStats: (stats) => set((s) => { Object.assign(s.player.stats, stats); }),
    damagePlayer: (amount) => set((s) => {
      const newHp = Math.max(0, s.player.stats.hp - Math.max(0, amount - s.player.stats.defense / 2));
      s.player.stats.hp = newHp;
      if (newHp <= 0) s.screen = 'gameOver';
    }),
    healPlayer: (amount) => set((s) => {
      s.player.stats.hp = Math.min(s.player.stats.maxHp, s.player.stats.hp + amount);
    }),
    restoreStamina: (amount) => set((s) => {
      s.player.stats.stamina = Math.min(s.player.stats.maxStamina, s.player.stats.stamina + amount);
    }),
    drainStamina: (amount) => set((s) => {
      s.player.stats.stamina = Math.max(0, s.player.stats.stamina - amount);
    }),
    gainExp: (amount) => {
      set((s) => { s.player.stats.exp += amount; });
      const { player } = get();
      if (player.stats.exp >= player.stats.expToNext) get().levelUp();
    },
    levelUp: () => set((s) => {
      const p = s.player.stats;
      p.level += 1;
      p.exp = p.exp - p.expToNext;
      p.expToNext = Math.floor(p.expToNext * 1.4);
      p.maxHp += 15;
      p.hp = p.maxHp;
      p.maxStamina += 5;
      p.stamina = p.maxStamina;
      p.maxMana += 8;
      p.mana = p.maxMana;
      p.attack += 3;
      p.defense += 2;
      get().addNotification({
        type: 'success',
        title: `Level ${p.level}!`,
        message: 'You grow stronger with every wound endured.',
        icon: '⬆️',
        duration: 4000,
      });
    }),
    setPlayerAttacking: (val) => set((s) => { s.player.isAttacking = val; }),
    setPlayerDashing: (val) => set((s) => { s.player.isDashing = val; }),
    incrementCombo: () => set((s) => {
      s.player.comboCount = Math.min(s.player.comboCount + 1, 5);
      s.player.lastComboTime = Date.now();
    }),
    resetCombo: () => set((s) => { s.player.comboCount = 0; }),
    chargeUltimate: (amount) => set((s) => {
      s.player.ultimateCharge = Math.min(100, s.player.ultimateCharge + amount);
    }),

    // Inventory
    inventory: initialInventory,
    addItem: (item) => set((s) => {
      const existing = s.inventory.items.find(i => i.id === item.id && i.stackable);
      if (existing) {
        existing.quantity += item.quantity;
      } else if (s.inventory.items.length < s.inventory.maxSlots) {
        s.inventory.items.push(item);
      }
    }),
    removeItem: (itemId, quantity = 1) => set((s) => {
      const idx = s.inventory.items.findIndex(i => i.id === itemId);
      if (idx >= 0) {
        s.inventory.items[idx].quantity -= quantity;
        if (s.inventory.items[idx].quantity <= 0) {
          s.inventory.items.splice(idx, 1);
        }
      }
    }),
    equipItem: (itemId) => set((s) => {
      const item = s.inventory.items.find(i => i.id === itemId);
      if (!item) return;
      if (item.type === 'weapon') s.player.equippedWeapon = itemId;
      else if (item.type === 'armor') s.player.equippedArmor = itemId;
      else if (item.type === 'accessory') s.player.equippedAccessory = itemId;
    }),
    addGold: (amount) => set((s) => { s.inventory.gold += amount; }),
    spendGold: (amount) => {
      if (get().inventory.gold < amount) return false;
      set((s) => { s.inventory.gold -= amount; });
      return true;
    },

    // Dialogue
    dialogue: initialDialogue,
    openDialogue: (lines, onComplete) => set((s) => {
      s.dialogue.isOpen = true;
      s.dialogue.lines = lines;
      s.dialogue.currentIndex = 0;
      s.dialogue.speakerName = lines[0]?.speaker || '';
      s.dialogue.onComplete = onComplete;
    }),
    advanceDialogue: () => {
      const { dialogue } = get();
      if (dialogue.currentIndex < dialogue.lines.length - 1) {
        set((s) => {
          s.dialogue.currentIndex += 1;
          s.dialogue.speakerName = s.dialogue.lines[s.dialogue.currentIndex]?.speaker || '';
        });
      } else {
        const cb = dialogue.onComplete;
        get().closeDialogue();
        cb?.();
      }
    },
    closeDialogue: () => set((s) => {
      s.dialogue.isOpen = false;
      s.dialogue.lines = [];
      s.dialogue.currentIndex = 0;
    }),

    // Boss
    activeBoss: null,
    setBoss: (boss) => set((s) => { s.activeBoss = boss; }),
    damageBoss: (amount) => set((s) => {
      if (s.activeBoss) {
        s.activeBoss.hp = Math.max(0, s.activeBoss.hp - amount);
        if (s.activeBoss.hp <= 0) s.activeBoss.isActive = false;
        // Phase transitions
        const pct = s.activeBoss.hp / s.activeBoss.maxHp;
        if (s.activeBoss.maxPhase >= 2 && pct <= 0.5 && s.activeBoss.phase === 1) {
          s.activeBoss.phase = 2;
        }
        if (s.activeBoss.maxPhase >= 3 && pct <= 0.25 && s.activeBoss.phase === 2) {
          s.activeBoss.phase = 3;
        }
      }
    }),

    // Quests
    quests: [],
    addQuest: (quest) => set((s) => { s.quests.push(quest); }),
    updateQuestObjective: (questId, objectiveId, amount) => set((s) => {
      const quest = s.quests.find(q => q.id === questId);
      if (quest) {
        const obj = quest.objectives.find(o => o.id === objectiveId);
        if (obj) {
          obj.current = Math.min(obj.required, obj.current + amount);
          obj.completed = obj.current >= obj.required;
        }
      }
    }),
    completeQuest: (questId) => set((s) => {
      const quest = s.quests.find(q => q.id === questId);
      if (quest) quest.status = 'completed';
    }),

    // Story flags
    storyFlags: {},
    setStoryFlag: (flag, value) => set((s) => { s.storyFlags[flag] = value; }),

    // Notifications
    notifications: [],
    addNotification: (notif) => set((s) => {
      const id = `notif_${Date.now()}_${Math.random()}`;
      s.notifications.push({ ...notif, id });
      // Auto-remove
      setTimeout(() => get().removeNotification(id), notif.duration || 3000);
    }),
    removeNotification: (id) => set((s) => {
      s.notifications = s.notifications.filter(n => n.id !== id);
    }),

    // Hit effects
    hitEffects: [],
    addHitEffect: (effect) => set((s) => {
      const id = `hit_${Date.now()}`;
      s.hitEffects.push({ ...effect, id });
    }),
    clearOldHitEffects: () => set((s) => {
      const now = Date.now();
      s.hitEffects = s.hitEffects.filter(e => now - e.timestamp < 500);
    }),

    // Settings
    settings: initialSettings,
    updateSettings: (settings) => set((s) => { Object.assign(s.settings, settings); }),

    // Zone
    currentZone: 'village',
    setZone: (zone) => set((s) => { s.currentZone = zone; }),
    discoveredZones: ['village'],
    discoverZone: (zoneId) => set((s) => {
      if (!s.discoveredZones.includes(zoneId)) s.discoveredZones.push(zoneId);
    }),

    // UI state
    isInventoryOpen: false,
    toggleInventory: () => set((s) => { s.isInventoryOpen = !s.isInventoryOpen; }),
    isSkillTreeOpen: false,
    toggleSkillTree: () => set((s) => { s.isSkillTreeOpen = !s.isSkillTreeOpen; }),
    isQuestLogOpen: false,
    toggleQuestLog: () => set((s) => { s.isQuestLogOpen = !s.isQuestLogOpen; }),
    isMapOpen: false,
    toggleMap: () => set((s) => { s.isMapOpen = !s.isMapOpen; }),
    isPaused: false,
    togglePause: () => set((s) => { s.isPaused = !s.isPaused; }),
    isShopOpen: false,
    setShopOpen: (val) => set((s) => { s.isShopOpen = val; }),
    upgradeWeapon: (cost) => {
      const state = get();
      if (state.inventory.gold >= cost) {
        set((s) => {
          s.inventory.gold -= cost;
          s.player.weaponLevel = (s.player.weaponLevel || 1) + 1;
          s.player.stats.attack += 3;
        });
        get().addNotification({
          type: 'success',
          title: 'Weapon Tempa!',
          message: `Pedang Alden naik ke Lv. ${get().player.weaponLevel}! (+3 Attack)`,
          icon: '🔨',
          duration: 3000,
        });
      }
    },
    upgradeArmor: (cost) => {
      const state = get();
      if (state.inventory.gold >= cost) {
        set((s) => {
          s.inventory.gold -= cost;
          s.player.armorLevel = (s.player.armorLevel || 1) + 1;
          s.player.stats.defense += 2;
        });
        get().addNotification({
          type: 'success',
          title: 'Pelindung Tempa!',
          message: `Zirah Alden naik ke Lv. ${get().player.armorLevel}! (+2 Defense)`,
          icon: '🛡️',
          duration: 3000,
        });
      }
    },
    buyPotion: (cost) => {
      const state = get();
      if (state.inventory.gold >= cost) {
        set((s) => {
          s.inventory.gold -= cost;
          const potion = s.inventory.items.find(i => i.id === 'health_potion');
          if (potion) {
            potion.quantity += 1;
          } else {
            s.inventory.items.push({
              id: 'health_potion',
              name: 'Healing Draught',
              type: 'consumable',
              rarity: 'common',
              description: 'A crimson tincture that mends wounds.',
              icon: '🧪',
              quantity: 1,
              stackable: true,
            });
          }
        });
        get().addNotification({
          type: 'success',
          title: 'Ramuan Dibeli',
          message: 'Berhasil membeli 1x Healing Draught.',
          icon: '🧪',
          duration: 3000,
        });
      }
    },

    // Save system
    saveSlots: [
      { id: 0, playerName: '', level: 0, zone: '', playtime: 0, timestamp: 0, isEmpty: true },
      { id: 1, playerName: '', level: 0, zone: '', playtime: 0, timestamp: 0, isEmpty: true },
      { id: 2, playerName: '', level: 0, zone: '', playtime: 0, timestamp: 0, isEmpty: true },
    ],
    isSaving: false,
    saveGame: (slot) => {
      const state = get();
      set((s) => { s.isSaving = true; });
      const saveData = {
        player: state.player,
        inventory: state.inventory,
        quests: state.quests,
        discoveredZones: state.discoveredZones,
        storyFlags: state.storyFlags,
        playtime: state.playtime,
        timestamp: Date.now(),
        slot,
      };
      localStorage.setItem(`aelindra_save_${slot}`, JSON.stringify(saveData));
      set((s) => {
        s.saveSlots[slot] = {
          id: slot,
          playerName: state.player.name,
          level: state.player.stats.level,
          zone: state.currentZone,
          playtime: state.playtime,
          timestamp: Date.now(),
          isEmpty: false,
        };
        s.isSaving = false;
      });
      state.addNotification({ type: 'success', title: 'Game Saved', message: `Checkpoint saved to slot ${slot + 1}.`, icon: '💾' });
    },
    loadGame: (slot) => {
      const raw = localStorage.getItem(`aelindra_save_${slot}`);
      if (!raw) return;
      const data = JSON.parse(raw);
      set((s) => {
        s.player = data.player;
        s.inventory = data.inventory;
        s.quests = data.quests;
        s.discoveredZones = data.discoveredZones;
        s.storyFlags = data.storyFlags;
        s.playtime = data.playtime;
        s.screen = 'game';
      });
    },

    // Playtime
    playtime: 0,
    incrementPlaytime: () => set((s) => { s.playtime += 1; }),

    // Combat
    isInCombat: false,
    setInCombat: (val) => set((s) => { s.isInCombat = val; }),
    killCount: 0,
    incrementKillCount: () => set((s) => { s.killCount += 1; }),

    // Zone Rounds
    currentRound: 0,
    setZoneRound: (round) => set((s) => { s.currentRound = round; }),
  }))
);
