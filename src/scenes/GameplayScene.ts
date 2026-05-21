import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy, EnemyConfig } from '../entities/Enemy';
import { Boss, BossConfig } from '../entities/Boss';
import { NPC, NPCConfig } from '../entities/NPC';
import { MapSystem, ZoneTheme } from '../systems/MapSystem';
import { useGameStore } from '../store/gameStore';
import {
  VILLAGE_BOY_DIALOGUE,
  BLACKSMITH_DIALOGUE,
  NUN_DIALOGUE,
  QUEST_INTRO_VILLAGE,
  CASTLE_DIALOGUE_INTRO,
  BETRAYAL_SCENE,
  ESCAPE_NARRATION,
  EVELYNE_TURNING_POINT,
  CHAPTER_1,
  VILLAGE_ENTRY,
  VILLAGE_ROUND1_POST,
  VILLAGE_ROUND2_POST,
  FOREST_ENTRY,
  FOREST_ROUND1_POST,
  FOREST_ROUND2_POST,
  CASTLE_ENTRY,
  CASTLE_ROUND1_POST,
  CASTLE_ROUND2_POST,
  CASTLE_BOSS_PRE,
  CASTLE_BOSS_POST,
  CATACOMBS_ENTRY,
  CATACOMBS_ROUND1_POST,
  CATACOMBS_ROUND2_POST,
  BATTLEFIELD_ENTRY,
  BATTLEFIELD_ROUND1_POST,
  BATTLEFIELD_ROUND2_POST,
  BATTLEFIELD_BOSS_PRE,
  BATTLEFIELD_BOSS_POST,
  ENDING_SCENE,
} from '../systems/storyData';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

interface ZoneData {
  theme: ZoneTheme;
  name: string;
  enemies: EnemyConfig[];
  npcs: NPCConfig[];
  boss?: BossConfig;
  music?: string;
  nextZone?: { x: number; y: number; zone: string };
}

interface ZoneRound {
  enemies: { config: EnemyConfig; count: number }[];
  preDialogue?: { speaker: string; portrait?: string; text: string; emotion?: string; isNarration?: boolean }[];
  postDialogue?: { speaker: string; portrait?: string; text: string; emotion?: string; isNarration?: boolean }[];
  boss?: BossConfig;
}

export class GameplayScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private npcs: NPC[] = [];
  private boss: Boss | null = null;
  private map!: MapSystem;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private currentZone = 'village';
  private zonePortals: { zone: Phaser.GameObjects.Zone; targetZone: string; label: Phaser.GameObjects.Text }[] = [];
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private spawnTimer = 0;
  private maxEnemies = 5;
  private playtimeTimer = 0;
  private fpsText!: Phaser.GameObjects.Text;
  private zoneRounds: ZoneRound[] = [];
  private currentRoundIndex = 0;
  private roundEnemyTotal = 0;
  private roundEnemyKilled = 0;
  private roundActive = false;
  private portalVisible = false;
  private mapWidth = 60;
  private mapHeight = 23;

  constructor() {
    super({ key: 'GameplayScene' });
  }

  create() {
    try {
      const store = useGameStore.getState();
      const zone = store.currentZone || 'village';
      this.currentZone = zone;

      this.enemyGroup = this.physics.add.group();

      const zoneData = this.getZoneData(zone);
      if (!zoneData) {
        console.error(`Failed to get zone data for: ${zone}`);
        this.buildZone(this.getZoneData('village'));
      } else {
        this.buildZone(zoneData);
      }
    } catch (e) {
      console.error('CRITICAL: GameplayScene create failed', e);
    }

    this.fpsText = this.add.text(16, 16, '', {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#ffffff',
    });
    this.fpsText.setScrollFactor(0);
    this.fpsText.setDepth(200);

    this.setupEventListeners();

    this.time.delayedCall(500, () => {
      const s = useGameStore.getState();
      if (!s.storyFlags['intro_seen']) {
        this.playIntroSequence();
      } else {
        this.advanceToNextRound();
      }
    });
  }

  private buildZone(zoneData: ZoneData) {
    const TILE = 32;
    const W = 60;
    const H = 23;

    this.enemies.forEach(e => e.destroy());
    this.npcs.forEach(n => n.destroy());
    this.enemies = [];
    this.npcs = [];
    this.zonePortals.forEach(p => { p.zone.destroy(); p.label.destroy(); });
    this.zonePortals = [];

    this.map = new MapSystem(this, {
      theme: zoneData.theme,
      width: W,
      height: H,
      tileSize: TILE,
      name: zoneData.name,
    });

    const { platformBodies } = this.map.generateMap();
    this.platformGroup = platformBodies;

    const spawnX = 3 * TILE;
    const spawnY = (H - 3) * TILE;

    if (!this.player) {
      this.player = new Player(this, spawnX, spawnY);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      this.cameras.main.setZoom(1);
      this.cameras.main.setDeadzone(GAME_WIDTH * 0.15, 0);
    } else {
      this.player.setPosition(spawnX, spawnY);
      this.player.setVelocity(0, 0);
    }

    this.physics.add.collider(this.player, this.platformGroup);

    let npcIndex = 0;
    for (const npcConfig of zoneData.npcs) {
      const nx = (12 + npcIndex * 12) * TILE;
      const ny = (H - 3) * TILE;
      const npc = new NPC(this, nx, ny, npcConfig);
      this.npcs.push(npc);
      this.physics.add.collider(npc, this.platformGroup);
      npcIndex++;
    }

    this.setupCombatOverlaps();

    this.zoneRounds = this.getZoneRounds(this.currentZone);
    this.currentRoundIndex = -1;
    this.portalVisible = false;

    const store = useGameStore.getState();
    store.setZone(this.currentZone);
    store.discoverZone(this.currentZone);
    store.addNotification({
      type: 'lore',
      title: zoneData.name,
      message: this.getZoneDescription(this.currentZone),
      icon: this.getZoneIcon(this.currentZone),
      duration: 4000,
    });
  }

  private playIntroSequence() {
    const s = useGameStore.getState();
    s.setStoryFlag('intro_seen', true);
    s.openDialogue(CASTLE_DIALOGUE_INTRO as any, () => {
      this.time.delayedCall(500, () => {
        useGameStore.getState().openDialogue(BETRAYAL_SCENE as any, () => {
          this.time.delayedCall(500, () => {
            useGameStore.getState().openDialogue(ESCAPE_NARRATION as any, () => {
              this.time.delayedCall(500, () => {
                useGameStore.getState().openDialogue(CHAPTER_1 as any, () => {
                  useGameStore.getState().addNotification({
                    type: 'lore',
                    title: 'Chapter I',
                    message: 'The Forsaken Knight — Your journey begins.',
                    icon: '📖',
                    duration: 5000,
                  });
                  this.time.delayedCall(1000, () => this.advanceToNextRound());
                });
              });
            });
          });
        });
      });
    });
  }

  private setupCombatOverlaps() {
    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      (_player, _enemy) => {
        const enemy = _enemy as Enemy;
        if (enemy.getAIState() === 'attack') {
          this.player.takeDamage(enemy['config']?.stats?.attack || 10);
        }
      }
    );

    this.physics.add.overlap(
      this.player.getAttackHitbox(),
      this.enemyGroup,
      (_hitbox, _enemy) => {
        if (!this.player.isCurrentlyAttacking()) return;
        const enemy = _enemy as Enemy;
        const enemyId = (enemy as any).uuid || `${enemy.x},${enemy.y}`;

        // Ensure each enemy is only hit ONCE per sword swing
        if (this.player.hasHit(enemyId)) return;

        const store = useGameStore.getState();
        const isCharged = this.player.isAttackCharged();
        const comboCount = this.player.getComboCount();
        const isCritChance = Math.random() < 0.25;
        const isCritical = isCharged || (comboCount >= 4) || isCritChance;

        const dmg = isCritical 
          ? Phaser.Math.Between(50, 100) 
          : (25 + Math.min(5, comboCount));
        
        const killed = enemy.takeDamage(dmg, comboCount, isCritical);
        this.player.registerHit(enemyId);
        this.triggerHitStop(isCritical ? 120 : 80);

        // Apply Status Effects
        if (isCritical) {
          if (store.player.stats.stamina >= 15) {
            store.drainStamina(15);
            enemy.applyStun(1000);
          } else {
            // If no stamina, treat as normal hit or reduce crit dmg? 
            // For now, let's just not stun and keep normal damage
          }
        }
        if (this.player.getComboCount() % 3 === 0) {
          enemy.applyBleed(5000); // 5s bleed
        }

        if (killed) {
          this.enemies = this.enemies.filter(e => e !== enemy);
          this.enemyGroup.remove(enemy);
          store.updateQuestObjective('defend_village', 'kill_undead', 1);
          store.incrementKillCount();
          this.onEnemyKilled();
        }
      }
    );
  }

  private advanceToNextRound() {
    this.currentRoundIndex++;
    if (this.currentRoundIndex >= this.zoneRounds.length) {
      this.onZoneComplete();
      return;
    }

    const round = this.zoneRounds[this.currentRoundIndex];
    const store = useGameStore.getState();
    store.setZoneRound(this.currentRoundIndex);

    const startCombat = () => {
      if (round.boss) {
        this.spawnBoss(round.boss, this.mapWidth * 32, this.mapHeight * 32, 32);
      }
      if (round.enemies.length > 0) {
        this.spawnRoundEnemies(round);
        this.roundActive = true;
      } else {
        this.roundActive = false;
        this.time.delayedCall(300, () => this.onRoundCleared());
      }
    };

    if (round.preDialogue) {
      store.openDialogue(round.preDialogue as any, () => {
        if (round.boss && round.boss.id === 'ashen_knight') {
          this.playBossCinematic(() => {
            this.time.delayedCall(300, startCombat);
          });
        } else {
          this.time.delayedCall(300, startCombat);
        }
      });
    } else {
      startCombat();
    }
  }

  private playBossCinematic(onComplete: () => void) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create cinematic layer
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(900)
      .setAlpha(0);

    const img = this.add.image(width / 2, height / 2, 'anim_boss_vs_mc')
      .setScrollFactor(0)
      .setDepth(901)
      .setAlpha(0);

    // Initial scale to fit the screen width, then slightly larger for pan effect
    const scaleX = width / img.width;
    const scaleY = height / img.height;
    const baseScale = Math.max(scaleX, scaleY) * 1.1; // crop effect
    img.setScale(baseScale);

    // Letterbox bars
    const barHeight = height * 0.15;
    const topBar = this.add.rectangle(0, -barHeight, width, barHeight, 0x000000)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(902);
    
    const bottomBar = this.add.rectangle(0, height, width, barHeight, 0x000000)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(902);

    // Fade in overlay and image
    this.tweens.add({
      targets: [overlay, img],
      alpha: 1,
      duration: 800,
      onComplete: () => {
        // Animate letterbox in
        this.tweens.add({
          targets: topBar,
          y: 0,
          duration: 500,
          ease: 'Power2'
        });
        this.tweens.add({
          targets: bottomBar,
          y: height - barHeight,
          duration: 500,
          ease: 'Power2'
        });

        // Dramatic slow pan and slight zoom
        this.tweens.add({
          targets: img,
          scale: baseScale * 1.3,
          y: img.y - 40,
          duration: 3500,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            // Flash and end
            const flash = this.add.rectangle(0, 0, width, height, 0xffffff)
              .setOrigin(0)
              .setScrollFactor(0)
              .setDepth(903)
              .setAlpha(0);

            this.tweens.add({
              targets: flash,
              alpha: 1,
              duration: 150,
              yoyo: true,
              onComplete: () => {
                overlay.destroy();
                img.destroy();
                topBar.destroy();
                bottomBar.destroy();
                flash.destroy();
                onComplete();
              }
            });
          }
        });
      }
    });
  }

  private spawnRoundEnemies(round: ZoneRound) {
    const TILE = 32;
    this.roundEnemyTotal = 0;
    this.roundEnemyKilled = 0;

    for (const entry of round.enemies) {
      for (let i = 0; i < entry.count; i++) {
        const ex = (6 + Math.floor(Math.random() * (this.mapWidth - 12))) * TILE;
        const ey = (this.mapHeight - 3) * TILE;
        const enemy = new Enemy(this, ex, ey, entry.config);
        enemy.setTarget(this.player);
        this.enemies.push(enemy);
        this.enemyGroup.add(enemy);
        this.physics.add.collider(enemy, this.platformGroup);
        this.roundEnemyTotal++;
      }
    }

    if (this.roundEnemyTotal === 0) this.roundEnemyTotal = 1;
  }

  private onEnemyKilled() {
    this.roundEnemyKilled++;
    if (this.roundEnemyKilled >= this.roundEnemyTotal && this.roundActive) {
      this.roundActive = false;
      this.onRoundCleared();
    }
  }

  private onRoundCleared() {
    const round = this.zoneRounds[this.currentRoundIndex];
    if (!round) return;

    const store = useGameStore.getState();

    if (round.postDialogue) {
      store.openDialogue(round.postDialogue as any, () => {
        this.time.delayedCall(500, () => this.advanceToNextRound());
      });
    } else {
      this.time.delayedCall(500, () => this.advanceToNextRound());
    }
  }

  private onZoneComplete() {
    const zoneData = this.getZoneData(this.currentZone);
    if (zoneData.nextZone && !this.portalVisible) {
      this.createPortal(
        zoneData.nextZone.x,
        zoneData.nextZone.y,
        zoneData.nextZone.zone,
        32
      );
      this.portalVisible = true;
      useGameStore.getState().addNotification({
        type: 'success', title: 'Path Clear!',
        message: `The way to ${this.getZoneName(zoneData.nextZone.zone)} is open.`,
        icon: '🗺️', duration: 4000,
      });
    }
  }

  private spawnBoss(config: BossConfig, W: number, H: number, TILE: number) {
    const bx = Math.floor(this.mapWidth / 2) * TILE;
    const by = (this.mapHeight - 3) * TILE;

    this.boss = new Boss(this, bx, by, config);
    this.boss.setTarget(this.player);
    this.physics.add.collider(this.boss, this.platformGroup);

    this.physics.add.overlap(this.player, this.boss, () => {});

    this.physics.add.overlap(
      this.player.getAttackHitbox(),
      this.boss,
      () => {
        if (!this.player.isCurrentlyAttacking() || !this.boss) return;
        const bossId = this.boss.config.id;

        // Ensure boss is only hit ONCE per sword swing
        if (this.player.hasHit(bossId)) return;

        const store = useGameStore.getState();
        const baseDmg = store.player.stats.attack + Math.floor(Math.random() * 12);
        const dmg = this.player.isAttackCharged() ? Math.floor(baseDmg * 2.5) : baseDmg;
        
        this.boss.takeDamage(dmg);
        this.player.registerHit(bossId);
      }
    );
  }

  private createPortal(x: number, y: number, targetZone: string, TILE: number) {
    const portal = this.add.zone(x * TILE, y * TILE, 3 * TILE, 4 * TILE);
    this.physics.add.existing(portal, true); // Make it a static body so gravity does not drag it down

    const label = this.add.text(x * TILE, y * TILE - 30, `→ ${this.getZoneName(targetZone)}`, {
      fontSize: '10px',
      fontFamily: 'Cinzel, serif',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 3,
    });
    label.setDepth(30);
    label.setOrigin(0.5);

    const portalGfx = this.add.graphics();
    portalGfx.lineStyle(3, 0xffd700, 1.0); // No transparency
    portalGfx.strokeCircle(x * TILE, y * TILE, TILE);
    portalGfx.setDepth(8);
    this.tweens.add({
      targets: portalGfx,
      alpha: 1.0, // No transparency
      yoyo: false,
      repeat: -1,
      duration: 1200,
    });

    this.physics.add.overlap(this.player, portal as any, () => {
      this.transitionToZone(targetZone);
    });

    this.zonePortals.push({ zone: portal, targetZone, label });
  }

  private transitionToZone(zoneId: string) {
    if (this.currentZone === zoneId) return;
    
    const store = useGameStore.getState();
    if (this.currentZone === 'battlefield' && zoneId === 'village') {
      store.completeCycle();
    }

    this.currentZone = zoneId;

    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(700, () => {
      this.buildZone(this.getZoneData(zoneId));
      this.time.delayedCall(300, () => this.advanceToNextRound());
      this.cameras.main.fadeIn(600, 0, 0, 0);
    });
  }

  private setupEventListeners() {
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
      useGameStore.getState().togglePause();
    });

    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TAB).on('down', () => {
      useGameStore.getState().toggleInventory();
    });

    this.events.on('player-interact', (data: { x: number; y: number }) => {
      for (const npc of this.npcs) {
        if (npc.isPlayerInRange()) {
          const store = useGameStore.getState();
          const onComplete = npc.getName() === 'Old Edric' ? () => {
            store.setShopOpen(true);
          } : undefined;
          store.openDialogue(npc.getDialogue(), onComplete);
          if (npc.isCheckpointNPC()) {
            store.saveGame(0);
          }
          break;
        }
      }
    });

    this.events.on('boss-summon-minion', (data: { x: number; y: number }) => {
      const minionConfig: EnemyConfig = {
        key: 'enemy_corrupted',
        name: 'Ashen Soldier',
        stats: { hp: 80, attack: 20, defense: 0, speed: 100, exp: 0, gold: 0 },
        frameCount: 4,
        scale: 1.5,
      };
      const enemy = new Enemy(this, data.x, data.y, minionConfig);
      enemy.setTarget(this.player);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy);
      this.physics.add.collider(enemy, this.platformGroup);
    });

    this.events.on('boss-attack', (data: { boss: Boss; damage: number; type: string; radius?: number }) => {
      if (!this.boss?.isAlive()) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        data.boss.x, data.boss.y
      );
      const hitRange = data.radius || 80;
      if (dist < hitRange) {
        this.player.takeDamage(data.damage);
      }
    });

    this.events.on('boss-projectile-hit', (data: { damage: number }) => {
      this.player.takeDamage(data.damage);
    });

    this.events.on('boss-died', (data: { bossId: string }) => {
      this.boss = null;
      const store = useGameStore.getState();
      store.gainExp(500);
      store.addGold(200);
      store.addNotification({
        type: 'success',
        title: 'Boss Defeated!',
        message: 'The darkness retreats... for now.',
        icon: '⚔️',
        duration: 5000,
      });

      if (data.bossId === 'ashen_knight') {
        this.time.delayedCall(2000, () => {
          useGameStore.getState().openDialogue(BATTLEFIELD_BOSS_POST as any, () => {
            this.time.delayedCall(1500, () => {
              useGameStore.getState().openDialogue(ENDING_SCENE as any, () => {
                this.time.delayedCall(1000, () => {
                  useGameStore.getState().setScreen('ending');
                });
              });
            });
          });
        });
        return;
      }

      this.roundActive = false;
      this.onRoundCleared();
    });
  }

  private isHitStopping = false;

  triggerHitStop(duration: number = 80) {
    if (this.isHitStopping) return;
    this.isHitStopping = true;
    this.physics.world.pause();
    
    this.time.delayedCall(duration, () => {
      this.physics.world.resume();
      this.isHitStopping = false;
    });
  }

  update(time: number, delta: number) {
    const store = useGameStore.getState();

    if (store.dialogue.isOpen || store.isPaused || this.isHitStopping) return;

    this.player.update(delta);

    for (const enemy of this.enemies) {
      if (enemy.active) enemy.update(delta);
    }

    for (const npc of this.npcs) {
      npc.update(delta, this.player.x, this.player.y);
    }

    if (this.boss?.active) {
      this.boss.update(delta);
    }

    this.playtimeTimer += delta;
    if (this.playtimeTimer >= 1000) {
      this.playtimeTimer = 0;
      store.incrementPlaytime();
    }

    if (store.settings.showFPS) {
      this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
      this.fpsText.setVisible(true);
    } else {
      this.fpsText.setVisible(false);
    }
  }

  // ── ZONE DATA ────────────────────────────────────────────────

  private getZoneData(zoneId: string): ZoneData {
    const zones: Record<string, ZoneData> = {
      village: {
        theme: 'village',
        name: 'Harrowmere Village',
        enemies: [
          {
            key: 'enemy_undead',
            name: 'Restless Corpse',
            stats: { hp: 100, attack: 12, defense: 3, speed: 80, exp: 25, gold: 8 },
            frameCount: 4,
          },
          {
            key: 'enemy_corrupted',
            name: 'Tainted Peasant',
            stats: { hp: 150, attack: 10, defense: 2, speed: 90, exp: 20, gold: 5 },
            frameCount: 4,
          },
        ],
        npcs: [
          {
            name: 'Old Edric',
            portrait: 'blacksmith',
            dialogue: BLACKSMITH_DIALOGUE,
            color: 0x5c3d1e,
            accentColor: 0x8b6914,
            isCheckpoint: true,
          },
          {
            name: 'Tam',
            portrait: 'boy',
            dialogue: VILLAGE_BOY_DIALOGUE,
            color: 0x8b6914,
            accentColor: 0xc8a862,
            routinePoints: [{ x: 260, y: 480 }, { x: 350, y: 480 }],
          },
        ],
        nextZone: { x: 55, y: 20, zone: 'forest' },
      },
      forest: {
        theme: 'forest',
        name: 'Fogbound Forest',
        enemies: [
          {
            key: 'enemy_beast',
            name: 'Hollow Wolf',
            stats: { hp: 250, attack: 16, defense: 4, speed: 120, exp: 40, gold: 12 },
            frameCount: 4,
          },
          {
            key: 'enemy_corrupted',
            name: 'Corrupted Druid',
            stats: { hp: 150, attack: 14, defense: 6, speed: 70, exp: 35, gold: 10 },
            frameCount: 4,
          },
        ],
        npcs: [
          {
            name: 'Wandering Nun',
            portrait: 'nun',
            dialogue: NUN_DIALOGUE,
            color: 0x2c3e50,
            accentColor: 0xecf0f1,
          },
        ],
        nextZone: { x: 55, y: 20, zone: 'castle' },
      },
      castle: {
        theme: 'castle',
        name: 'Aelindra Castle Ruins',
        enemies: [
          {
            key: 'enemy_undead',
            name: 'Fallen Knight',
            stats: { hp: 100, attack: 20, defense: 10, speed: 85, exp: 60, gold: 20 },
            frameCount: 4,
            scale: 2.2,
          },
          {
            key: 'enemy_corrupted',
            name: 'Cursed Guard',
            stats: { hp: 150, attack: 18, defense: 8, speed: 75, exp: 50, gold: 15 },
            frameCount: 4,
          },
        ],
        npcs: [
          {
            name: 'Princess Evelyne',
            portrait: 'evelyne',
            dialogue: EVELYNE_TURNING_POINT,
            color: 0x9b59b6,
            accentColor: 0xda70d6,
          }
        ],
        boss: {
          id: 'blind_king',
          name: 'The Blind King',
          title: 'Former Ruler, Now Hollow',
          maxHp: 500,
          phases: 2,
          attack: 35,
          speed: 120,
          scale: 2.5,
        },
        nextZone: { x: 55, y: 20, zone: 'catacombs' },
      },
      catacombs: {
        theme: 'catacombs',
        name: 'Sunken Catacombs',
        enemies: [
          {
            key: 'enemy_undead',
            name: 'Bone Revenant',
            stats: { hp: 100, attack: 22, defense: 5, speed: 95, exp: 55, gold: 18 },
            frameCount: 4,
          },
        ],
        npcs: [],
        nextZone: { x: 55, y: 20, zone: 'battlefield' },
      },
      battlefield: {
        theme: 'battlefield',
        name: 'Ruined Battlefields',
        enemies: [
          {
            key: 'enemy_corrupted',
            name: 'Ashen Soldier',
            stats: { hp: 150, attack: 28, defense: 12, speed: 80, exp: 75, gold: 25 },
            frameCount: 4,
            scale: 2.2,
          },
        ],
        npcs: [],
        boss: {
          id: 'ashen_knight',
          name: 'Ashen Knight',
          title: 'Once a Guardian, Now Dust',
          maxHp: 500,
          phases: 2,
          attack: 40,
          speed: 150,
        },
        nextZone: { x: 55, y: 20, zone: 'village' },
      },
    };

    return zones[zoneId] || zones.village;
  }

  private getZoneRounds(zoneId: string): ZoneRound[] {
    const T1: EnemyConfig = { key: 'enemy_undead', name: 'Restless Corpse', stats: { hp: 100, attack: 12, defense: 3, speed: 80, exp: 25, gold: 8 }, frameCount: 4 };
    const T2: EnemyConfig = { key: 'enemy_corrupted', name: 'Tainted Peasant', stats: { hp: 150, attack: 10, defense: 2, speed: 90, exp: 20, gold: 5 }, frameCount: 4 };

    const W1: EnemyConfig = { key: 'enemy_beast', name: 'Hollow Wolf', stats: { hp: 250, attack: 16, defense: 4, speed: 120, exp: 40, gold: 12 }, frameCount: 4 };
    const W2: EnemyConfig = { key: 'enemy_corrupted', name: 'Corrupted Druid', stats: { hp: 150, attack: 14, defense: 6, speed: 70, exp: 35, gold: 10 }, frameCount: 4 };

    const K1: EnemyConfig = { key: 'enemy_undead', name: 'Fallen Knight', stats: { hp: 100, attack: 20, defense: 10, speed: 85, exp: 60, gold: 20 }, frameCount: 4, scale: 2.2 };
    const K2: EnemyConfig = { key: 'enemy_corrupted', name: 'Cursed Guard', stats: { hp: 150, attack: 18, defense: 8, speed: 75, exp: 50, gold: 15 }, frameCount: 4 };

    const C1: EnemyConfig = { key: 'enemy_undead', name: 'Bone Revenant', stats: { hp: 100, attack: 22, defense: 5, speed: 95, exp: 55, gold: 18 }, frameCount: 4 };
    const C2: EnemyConfig = { key: 'enemy_corrupted', name: 'Dark Acolyte', stats: { hp: 150, attack: 24, defense: 4, speed: 100, exp: 60, gold: 20 }, frameCount: 4 };

    const B1: EnemyConfig = { key: 'enemy_corrupted', name: 'Ashen Soldier', stats: { hp: 150, attack: 28, defense: 12, speed: 80, exp: 75, gold: 25 }, frameCount: 4, scale: 2.2 };
    const B2: EnemyConfig = { key: 'enemy_beast', name: 'War Hound', stats: { hp: 250, attack: 32, defense: 8, speed: 140, exp: 65, gold: 20 }, frameCount: 4 };

    const rounds: Record<string, ZoneRound[]> = {
      village: [
        {
          preDialogue: VILLAGE_ENTRY,
          enemies: [{ config: T1, count: 3 }, { config: T2, count: 1 }],
        },
        {
          postDialogue: VILLAGE_ROUND1_POST,
          enemies: [{ config: T1, count: 2 }, { config: T2, count: 2 }],
        },
        {
          postDialogue: VILLAGE_ROUND2_POST,
          enemies: [],
        },
      ],
      forest: [
        {
          preDialogue: FOREST_ENTRY,
          enemies: [{ config: W1, count: 3 }],
        },
        {
          postDialogue: FOREST_ROUND1_POST,
          enemies: [{ config: W1, count: 2 }, { config: W2, count: 2 }],
        },
        {
          postDialogue: FOREST_ROUND2_POST,
          enemies: [],
        },
      ],
      castle: [
        {
          preDialogue: CASTLE_ENTRY,
          enemies: [{ config: K1, count: 3 }],
        },
        {
          postDialogue: CASTLE_ROUND1_POST,
          enemies: [{ config: K1, count: 2 }, { config: K2, count: 2 }],
        },
        {
          postDialogue: CASTLE_ROUND2_POST,
          enemies: [{ config: K2, count: 2 }],
        },
        {
          preDialogue: CASTLE_BOSS_PRE,
          boss: { id: 'blind_king', name: 'The Blind King', title: 'Former Ruler, Now Hollow', maxHp: 1200, phases: 3, attack: 45, speed: 125, scale: 2.5 },
          postDialogue: CASTLE_BOSS_POST,
          enemies: [],
        },
      ],
      catacombs: [
        {
          preDialogue: CATACOMBS_ENTRY,
          enemies: [{ config: C1, count: 3 }, { config: C2, count: 2 }],
        },
        {
          postDialogue: CATACOMBS_ROUND1_POST,
          enemies: [{ config: C1, count: 2 }, { config: C2, count: 3 }],
        },
        {
          postDialogue: CATACOMBS_ROUND2_POST,
          enemies: [],
        },
      ],
      battlefield: [
        {
          preDialogue: BATTLEFIELD_ENTRY,
          enemies: [{ config: B1, count: 3 }, { config: B2, count: 2 }],
        },
        {
          postDialogue: BATTLEFIELD_ROUND1_POST,
          enemies: [{ config: B1, count: 2 }, { config: B2, count: 3 }],
        },
        {
          postDialogue: BATTLEFIELD_ROUND2_POST,
          enemies: [],
        },
        {
          preDialogue: BATTLEFIELD_BOSS_PRE,
          boss: { id: 'ashen_knight', name: 'Ashen Knight', title: 'Once a Guardian, Now Dust', maxHp: 3000, phases: 3, attack: 55, speed: 160 },
          postDialogue: BATTLEFIELD_BOSS_POST,
          enemies: [],
        },
      ],
    };

    return rounds[zoneId] || [];
  }

  private getZoneName(zoneId: string): string {
    const names: Record<string, string> = {
      village: 'Harrowmere Village',
      forest: 'Fogbound Forest',
      castle: 'Aelindra Castle',
      catacombs: 'Sunken Catacombs',
      battlefield: 'Ruined Battlefields',
      cathedral: 'Cathedral of Ash',
      mountain: 'Frostpeak Summit',
    };
    return names[zoneId] || zoneId;
  }

  private getZoneDescription(zoneId: string): string {
    const descs: Record<string, string> = {
      village: 'Rain-soaked cobblestones. Candle-lit windows. A warmth that feels like borrowed time.',
      forest: 'The fog swallows light here. Even the trees seem to watch.',
      castle: 'These halls once rang with your oath. Now they ring with your betrayal.',
      catacombs: 'The dead sleep restlessly. Something ancient stirs in the deep.',
      battlefield: 'So many lives. So many names no one will remember.',
      cathedral: 'The saints have gone silent. Only rot speaks now.',
      mountain: 'The cold does not care who you are. It never did.',
    };
    return descs[zoneId] || '';
  }

  private getZoneIcon(zoneId: string): string {
    const icons: Record<string, string> = {
      village: '🏘️',
      forest: '🌲',
      castle: '🏰',
      catacombs: '💀',
      battlefield: '⚔️',
      cathedral: '⛪',
      mountain: '🏔️',
    };
    return icons[zoneId] || '🗺️';
  }
}
