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
  CATHEDRAL_ENTRY,
  CATHEDRAL_ROUND1_POST,
  CATHEDRAL_ROUND2_POST,
  CATHEDRAL_BOSS_PRE,
  CATHEDRAL_BOSS_POST,
  MOUNTAIN_ENTRY,
  MOUNTAIN_ROUND1_POST,
  MOUNTAIN_ROUND2_POST,
  MOUNTAIN_BOSS_PRE,
  MOUNTAIN_BOSS_POST,
  BATTLEFIELD_ENTRY,
  BATTLEFIELD_ROUND1_POST,
  BATTLEFIELD_ROUND2_POST,
  BATTLEFIELD_BOSS_PRE,
  ENDING_SCENE,
} from '../systems/storyData';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';
import { playBGM, setBGMVolume } from '../utils/bgm';

interface ZoneData {
  theme: ZoneTheme;
  name: string;
  enemies: EnemyConfig[];
  npcs: NPCConfig[];
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
  private zonePortals: {
    zone: Phaser.GameObjects.Zone;
    targetZone: string;
    label: Phaser.GameObjects.Text;
    gfx: Phaser.GameObjects.Graphics;
    orbs: Phaser.GameObjects.Graphics[];
  }[] = [];
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private bossGroup!: Phaser.Physics.Arcade.Group;
  private ambientTimer: Phaser.Time.TimerEvent | null = null;
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
  private transitioningZone = false;
  private combatOverlapsInitialized = false;
  private mapWidth = 60;
  private mapHeight = 23;
  private cinematicObjects: Phaser.GameObjects.GameObject[] = [];
  private cinematicTweens: Phaser.Tweens.Tween[] = [];
  private cinematicTimers: Phaser.Time.TimerEvent[] = [];
  private isFinalCinematicPlaying = false;

  constructor() {
    super({ key: 'GameplayScene' });
  }

  shutdown() {
    this.cleanupFinalCinematicState(false);
    this.events.off('player-interact');
    this.events.off('dev-jump-zone');
    this.events.off('boss-summon-minion');
    this.events.off('boss-attack');
    this.events.off('boss-projectile-hit');
    this.events.off('boss-died');
    this.enemies.forEach(e => e.destroy());
    this.enemies = [];
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];
    if (this.boss) { this.boss.destroy(); this.boss = null; }
    if (this.ambientTimer) { this.ambientTimer.remove(); this.ambientTimer = null; }
  }

  create() {
    try {
      const store = useGameStore.getState();
      const zone = store.currentZone || 'village';
      this.currentZone = zone;

      this.enemyGroup = this.physics.add.group();
      this.bossGroup = this.physics.add.group();

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
    this.zonePortals.forEach(p => {
      p.zone.destroy();
      p.label.destroy();
      p.gfx.destroy();
      p.orbs.forEach(o => o.destroy());
    });
    this.zonePortals = [];

    if (this.boss) {
      this.boss.destroy();
      this.boss = null;
    }
    if (this.bossGroup) {
      this.bossGroup.clear(true, true);
    }
    this.createAmbientFX(zoneData.theme);

    if (this.map) {
      this.map.destroy();
    }

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

    this.zoneRounds = this.getZoneRounds(this.currentZone);
    this.currentRoundIndex = -1;
    this.portalVisible = false;

    if (!this.combatOverlapsInitialized) {
      this.setupCombatOverlaps();
      this.combatOverlapsInitialized = true;
    }

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

  private setupCombatOverlaps() {
    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      (_player, _enemy) => {
        const enemy = _enemy as Enemy;
        const store = useGameStore.getState();
        if (enemy.getAIState() === 'attack') {
          if (this.player.isParryActive()) {
            const parried = this.player.consumeParry();
            if (parried) {
              enemy.applyStun(900);
              store.restoreStamina(store.unlockedSkills.includes('iron_reflex') ? 16 : 12);
              store.chargeUltimate(8);
              store.addNotification({
                type: 'success',
                title: 'Parry!',
                message: 'The strike breaks against your timing.',
                icon: '⚔️',
                duration: 1800,
              });
              this.triggerHitStop(110);
            }
            return;
          }

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
        const enemyId = enemy.getEnemyId();

        // Ensure each enemy is only hit ONCE per sword swing
        if (this.player.hasHit(enemyId)) return;

        const store = useGameStore.getState();
        const isCharged = this.player.isAttackCharged();
        const comboCount = this.player.getComboCount();
        const critChance = store.unlockedSkills.includes('blood_pact') ? 0.35 : 0.25;
        const isCritChance = Math.random() < critChance;
        const isCritical = isCharged || (comboCount >= 4) || isCritChance;

        const stats = store.player.stats;
        const atkBonus = Math.floor(stats.attack * 0.6);
        const critBonus = Math.floor(stats.attack * 0.5);
        const dmg = isCritical 
          ? Math.round(Phaser.Math.Between(50 + critBonus, 90 + critBonus) * (store.unlockedSkills.includes('blood_pact') ? 1.25 : 1))
          : Math.round((25 + atkBonus + Math.min(5, comboCount)) * (store.unlockedSkills.includes('blade_mastery') ? 1.2 : 1));
        
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
          enemy.applyBleed(this.player.getBleedDuration());
        }

        if (killed) {
          this.enemies = this.enemies.filter(e => e !== enemy);
          this.enemyGroup.remove(enemy);
          store.updateQuestObjective('defend_village', 'kill_undead', 1);
          this.onEnemyKilled();
        }
      }
    );

    // Overlap fisik antara hitbox serangan pemain dengan grup Boss
    this.physics.add.overlap(
      this.player.getAttackHitbox(),
      this.bossGroup,
      (_hitbox, _boss) => {
        if (!this.player.isCurrentlyAttacking()) return;
        const boss = _boss as Boss;
        const bossId = boss.getId();

        // Pastikan boss hanya terkena hit SATU kali per ayunan pedang
        if (this.player.hasHit(bossId)) return;

        const store = useGameStore.getState();
        const isCharged = this.player.isAttackCharged();
        const comboCount = this.player.getComboCount();
        const critChance = store.unlockedSkills.includes('blood_pact') ? 0.35 : 0.25;
        const isCritChance = Math.random() < critChance;
        const isCritical = isCharged || (comboCount >= 4) || isCritChance;

        const stats = store.player.stats;
        const bossAtkBonus = Math.floor(stats.attack * 0.7);
        const bossCritBonus = Math.floor(stats.attack * 0.5);
        const dmg = isCritical 
          ? Math.round(Phaser.Math.Between(100 + bossCritBonus, 180 + bossCritBonus) * (store.unlockedSkills.includes('blood_pact') ? 1.25 : 1))
          : Math.round((45 + bossAtkBonus + Math.min(10, comboCount)) * (store.unlockedSkills.includes('blade_mastery') ? 1.2 : 1));
        
        // Spawn partikel cipratan darah jika serangan kritikal
        if (isCritical) {
          this.spawnBloodSpray(boss.x, boss.y);
        }

        const killed = boss.takeDamage(dmg);
        this.player.registerHit(bossId);
        this.triggerHitStop(isCritical ? 120 : 80);

        if (killed) {
          this.bossGroup.remove(boss);
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
        this.roundActive = true;
        this.roundEnemyTotal = 1;
        this.roundEnemyKilled = 0;
      } else if (round.enemies.length > 0) {
        this.spawnRoundEnemies(round);
        this.roundActive = true;
      } else {
        // Story-only round (dialogue beat, no combat)
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

  private registerCinematicObject<T extends Phaser.GameObjects.GameObject>(obj: T): T {
    this.cinematicObjects.push(obj);
    return obj;
  }

  private registerCinematicTween(config: Phaser.Types.Tweens.TweenBuilderConfig): Phaser.Tweens.Tween {
    const tween = this.tweens.add(config);
    this.cinematicTweens.push(tween);
    return tween;
  }

  private registerCinematicTimer(delay: number, callback: () => void): Phaser.Time.TimerEvent {
    const timer = this.time.delayedCall(delay, callback);
    this.cinematicTimers.push(timer);
    return timer;
  }

  private cleanupFinalCinematicState(restoreControl: boolean = true) {
    this.cinematicTimers.forEach((timer) => timer.remove(false));
    this.cinematicTimers = [];

    this.cinematicTweens.forEach((tween) => tween.remove());
    this.cinematicTweens = [];

    this.cinematicObjects.forEach((obj) => {
      const gameObject = obj as Phaser.GameObjects.GameObject & { scene?: Phaser.Scene };
      if (gameObject.scene) {
        gameObject.destroy();
      }
    });
    this.cinematicObjects = [];

    this.isFinalCinematicPlaying = false;
    useGameStore.getState().setCinematicGrainActive(false);

    if (restoreControl) {
      this.transitioningZone = false;
    }
  }

  private playFinalCinematic(onComplete: () => void) {
    this.cleanupFinalCinematicState(false);
    this.isFinalCinematicPlaying = true;
    this.transitioningZone = true;
    useGameStore.getState().setCinematicGrainActive(true);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const darkOverlay = this.registerCinematicObject(
      this.add.rectangle(0, 0, width, height, 0x000000)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(910)
        .setAlpha(0.65)
    );

    const blackTransition = this.registerCinematicObject(
      this.add.rectangle(0, 0, width, height, 0x000000)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(915)
        .setAlpha(0)
    );

    const scanlines = this.registerCinematicObject(
      this.add.graphics()
        .setScrollFactor(0)
        .setDepth(913)
    );
    scanlines.lineStyle(1, 0xffffff, 0.08);
    for (let y = 0; y <= height; y += 4) {
      scanlines.lineBetween(0, y, width, y);
    }

    const grain = this.registerCinematicObject(
      this.add.graphics()
        .setScrollFactor(0)
        .setDepth(914)
    );
    for (let i = 0; i < Math.floor((width * height) / 1100); i++) {
      const alpha = Phaser.Math.FloatBetween(0.03, 0.08);
      grain.fillStyle(0xffffff, alpha);
      grain.fillRect(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        1,
        1
      );
    }

    const barHeight = Math.round(height * 0.15);
    const topBar = this.registerCinematicObject(
      this.add.rectangle(0, -barHeight, width, barHeight, 0x000000)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(916)
    );
    const bottomBar = this.registerCinematicObject(
      this.add.rectangle(0, height, width, barHeight, 0x000000)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(916)
    );

    const frameFiveNarration = this.registerCinematicObject(
      this.add.text(centerX, height - barHeight - 28, 'He gave everything so dawn could return.', {
        fontSize: '18px',
        fontFamily: 'Cinzel, serif',
        color: '#f4e4c1',
        stroke: '#000000',
        strokeThickness: 4,
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(917)
        .setAlpha(0)
    );

    const jitterTimer = this.time.addEvent({
      delay: 125,
      loop: true,
      callback: () => {
        const jitterX = Phaser.Math.Between(-1, 1);
        const jitterY = Phaser.Math.Between(-1, 1);
        scanlines.setPosition(jitterX, jitterY);
        grain.setPosition(-jitterX, -jitterY);
      },
    });
    this.cinematicTimers.push(jitterTimer);

    this.registerCinematicTween({
      targets: topBar,
      y: 0,
      duration: 450,
      ease: 'Power2.easeOut',
    });
    this.registerCinematicTween({
      targets: bottomBar,
      y: height - barHeight,
      duration: 450,
      ease: 'Power2.easeOut',
    });

    type FrameSpec = {
      key: string;
      hold: number;
      fromScale: number;
      fitMode?: 'cover' | 'contain';
      toScale?: number;
      startOffsetX?: number;
      startOffsetY?: number;
      endOffsetX?: number;
      endOffsetY?: number;
    };

    const frames: FrameSpec[] = [
      { key: 'final_cinematic_1', hold: 4000, fromScale: 1.0, toScale: 1.15 },
      { key: 'final_cinematic_2', hold: 3000, fromScale: 1.08, endOffsetX: -30 },
      { key: 'final_cinematic_3', hold: 5000, fromScale: 1.1, toScale: 0.95 },
      { key: 'final_cinematic_4', hold: 4000, fromScale: 1.05 },
      { key: 'final_cinematic_5', hold: 6000, fromScale: 1.08, endOffsetX: 40 },
      { key: 'final_cinematic_6', hold: 3000, fromScale: 1.0, fitMode: 'contain' },
    ];

    const finishCinematic = () => {
      if (!this.isFinalCinematicPlaying) return;
      this.cleanupFinalCinematicState(true);
      onComplete();
    };

    const playFrame = (index: number) => {
      if (!this.isFinalCinematicPlaying) return;
      if (index >= frames.length) {
        finishCinematic();
        return;
      }

      const frame = frames[index];
      const image = this.registerCinematicObject(
        this.add.image(centerX, centerY, frame.key)
          .setScrollFactor(0)
          .setDepth(912)
          .setAlpha(0)
      );

      const scaleCover = Math.max(width / image.width, height / image.height);
      const scaleContain = Math.min(width / image.width, height / image.height);
      const baseScale = frame.fitMode === 'contain' ? scaleContain : scaleCover;
      image.setScale(baseScale * frame.fromScale);
      image.x = centerX + (frame.startOffsetX ?? 0);
      image.y = centerY + (frame.startOffsetY ?? 0);

      const startFrameHold = () => {
        const targetScale = frame.toScale !== undefined ? baseScale * frame.toScale : image.scale;
        const targetX = centerX + (frame.endOffsetX ?? frame.startOffsetX ?? 0);
        const targetY = centerY + (frame.endOffsetY ?? frame.startOffsetY ?? 0);

        if (
          targetScale !== image.scale ||
          targetX !== image.x ||
          targetY !== image.y
        ) {
          this.registerCinematicTween({
            targets: image,
            scale: targetScale,
            x: targetX,
            y: targetY,
            duration: frame.hold,
            ease: 'Sine.easeInOut',
          });
        }

        if (index === 4) {
          this.registerCinematicTimer(3000, () => {
            if (!this.isFinalCinematicPlaying) return;
            this.registerCinematicTween({
              targets: frameFiveNarration,
              alpha: 1,
              duration: 700,
              ease: 'Sine.easeOut',
            });
          });
        }

        this.registerCinematicTimer(frame.hold, () => {
          if (!this.isFinalCinematicPlaying) return;

          if (index === 5) {
            this.registerCinematicTween({
              targets: image,
              alpha: 0,
              duration: 600,
              ease: 'Sine.easeInOut',
            });
            this.registerCinematicTween({
              targets: blackTransition,
              alpha: 1,
              duration: 1000,
              ease: 'Sine.easeInOut',
              onComplete: finishCinematic,
            });
            return;
          }

          if (index === 4) {
            this.registerCinematicTween({
              targets: [image, frameFiveNarration],
              alpha: 0,
              duration: 600,
              ease: 'Sine.easeInOut',
            });
            this.registerCinematicTween({
              targets: blackTransition,
              alpha: 1,
              duration: 1000,
              ease: 'Sine.easeInOut',
              onComplete: () => playFrame(index + 1),
            });
            return;
          }

          this.registerCinematicTween({
            targets: image,
            alpha: 0,
            duration: 600,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              if (!this.isFinalCinematicPlaying) return;
              if (index === 1) {
                const flash = this.registerCinematicObject(
                  this.add.rectangle(0, 0, width, height, 0xffffff)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(918)
                    .setAlpha(0)
                );
                this.registerCinematicTween({
                  targets: flash,
                  alpha: 1,
                  duration: 50,
                  yoyo: true,
                  ease: 'Linear',
                  onComplete: () => playFrame(index + 1),
                });
              } else {
                playFrame(index + 1);
              }
            },
          });
        });
      };

      if (index === 5) {
        this.registerCinematicTween({
          targets: image,
          alpha: 1,
          duration: 800,
          ease: 'Sine.easeOut',
          onComplete: startFrameHold,
        });
        this.registerCinematicTween({
          targets: blackTransition,
          alpha: 0.65,
          duration: 800,
          ease: 'Sine.easeOut',
        });
      } else {
        this.registerCinematicTween({
          targets: image,
          alpha: 1,
          duration: 800,
          ease: 'Sine.easeOut',
          onComplete: startFrameHold,
        });
      }
    };

    this.registerCinematicTimer(200, () => playFrame(0));
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

    if (this.roundEnemyTotal === 0) {
      this.roundActive = false;
      this.time.delayedCall(300, () => this.onRoundCleared());
    }
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
    if (this.boss) {
      this.boss.destroy();
      this.boss = null;
    }

    const bx = Math.floor(this.mapWidth / 2) * TILE;
    const by = (this.mapHeight - 3) * TILE;

    this.boss = new Boss(this, bx, by, config);
    this.boss.setTarget(this.player);
    this.bossGroup.add(this.boss);
    this.physics.add.collider(this.boss, this.platformGroup);
  }

  private createPortal(x: number, y: number, targetZone: string, TILE: number) {
    const portalX = x * TILE + TILE / 2;
    const portalY = (this.mapHeight - 3) * TILE;
    const portal = this.add.zone(portalX, portalY, 4 * TILE, 3 * TILE);
    this.physics.add.existing(portal, true);

    const label = this.add.text(portalX, portalY - 50, `→ ${this.getZoneName(targetZone)}`, {
      fontSize: '12px',
      fontFamily: 'Cinzel, serif',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 3,
    });
    label.setDepth(30);
    label.setOrigin(0.5);

    // Portal visual layers
    const portalGfx = this.add.graphics();
    portalGfx.lineStyle(3, 0xffd700, 1.0);
    portalGfx.strokeCircle(portalX, portalY, TILE * 1.2);
    portalGfx.setDepth(8);
    this.tweens.add({
      targets: portalGfx,
      alpha: { from: 0.4, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 900,
    });

    // Orbiting particles around portal
    const orbs: Phaser.GameObjects.Graphics[] = [];
    for (let i = 0; i < 4; i++) {
      const orb = this.add.graphics();
      orb.fillStyle(0xffd700, 0.6);
      orb.fillCircle(0, 0, 3);
      orb.setPosition(portalX, portalY);
      orb.setDepth(9);
      const angle = (i / 4) * Math.PI * 2;
      const radius = TILE * 1.6;
      this.tweens.add({
        targets: orb,
        x: portalX + Math.cos(angle) * radius,
        y: portalY + Math.sin(angle) * radius,
        duration: 800,
        yoyo: true,
        repeat: -1,
        delay: i * 200,
        ease: 'Sine.easeInOut',
      });
      orbs.push(orb);
    }

    this.physics.add.overlap(this.player, portal as any, () => {
      if (this.transitioningZone || useGameStore.getState().dialogue.isOpen) return;
      this.transitionToZone(targetZone);
    });

    this.zonePortals.push({ zone: portal, targetZone, label, gfx: portalGfx, orbs });
  }

  private transitionToZone(zoneId: string) {
    if (this.transitioningZone || this.currentZone === zoneId) return;

    this.transitioningZone = true;
    this.portalVisible = false;
    this.zonePortals.forEach(p => {
      p.zone.destroy();
      p.label.destroy();
      p.gfx.destroy();
      p.orbs.forEach(o => o.destroy());
    });
    this.zonePortals = [];

    const store = useGameStore.getState();
    if (this.currentZone === 'battlefield' && zoneId === 'village') {
      store.completeCycle();
    }

    this.currentZone = zoneId;

    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(700, () => {
      this.buildZone(this.getZoneData(zoneId));
      this.time.delayedCall(300, () => {
        this.advanceToNextRound();
        this.transitioningZone = false;
      });
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

    this.events.on('dev-jump-zone', (data: { zoneId: string }) => {
      const target = data?.zoneId;
      if (!target) return;
      const zoneData = this.getZoneData(target);
      if (!zoneData) return;
      this.cleanupFinalCinematicState(true);
      this.transitioningZone = false;
      this.currentZone = '__dev_jump__';
      this.transitionToZone(target);
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
      this.roundEnemyKilled = 1;
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
        this.roundActive = false;
        this.transitioningZone = true;
        const musicSettings = useGameStore.getState().settings;
        setBGMVolume(musicSettings.musicVolume, musicSettings.masterVolume);
        playBGM('ending');
        this.cameras.main.flash(500, 255, 255, 255);
        this.playFinalCinematic(() => {
          const finalStore = useGameStore.getState();
          finalStore.openDialogue(ENDING_SCENE as any, () => {
            finalStore.setScreen('ending');
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

    // Detect zone changes from store (triggered by recall/return)
    if (store.currentZone !== this.currentZone && !this.transitioningZone) {
      this.transitionToZone(store.currentZone);
      return;
    }

    if (store.dialogue.isOpen || store.isPaused || this.isHitStopping || this.transitioningZone || this.isFinalCinematicPlaying) return;

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
        nextZone: { x: 50, y: 20, zone: 'forest' },
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
        nextZone: { x: 50, y: 20, zone: 'castle' },
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
        nextZone: { x: 50, y: 20, zone: 'catacombs' },
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
        nextZone: { x: 50, y: 20, zone: 'cathedral' },
      },
      cathedral: {
        theme: 'cathedral',
        name: 'Cathedral of Ash',
        enemies: [
          {
            key: 'enemy_corrupted',
            name: 'Ashen Acolyte',
            stats: { hp: 160, attack: 26, defense: 6, speed: 95, exp: 65, gold: 22 },
            frameCount: 4,
          },
          {
            key: 'enemy_undead',
            name: 'Choir Wraith',
            stats: { hp: 120, attack: 22, defense: 4, speed: 110, exp: 58, gold: 18 },
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
        nextZone: { x: 50, y: 20, zone: 'mountain' },
      },
      mountain: {
        theme: 'mountain',
        name: 'Frostpeak Summit',
        enemies: [
          {
            key: 'enemy_beast',
            name: 'Frostborne Beast',
            stats: { hp: 220, attack: 30, defense: 8, speed: 115, exp: 72, gold: 24 },
            frameCount: 4,
          },
          {
            key: 'enemy_corrupted',
            name: 'Summit Warden',
            stats: { hp: 180, attack: 28, defense: 10, speed: 90, exp: 68, gold: 20 },
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
        nextZone: { x: 50, y: 20, zone: 'battlefield' },
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
        nextZone: { x: 50, y: 20, zone: 'village' },
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
      cathedral: [
        {
          preDialogue: CATHEDRAL_ENTRY,
          enemies: [{ config: C2, count: 2 }, { config: C1, count: 2 }],
        },
        {
          postDialogue: CATHEDRAL_ROUND1_POST,
          enemies: [{ config: C2, count: 3 }, { config: C1, count: 1 }],
        },
        {
          postDialogue: CATHEDRAL_ROUND2_POST,
          enemies: [{ config: C2, count: 2 }],
        },
        {
          preDialogue: CATHEDRAL_BOSS_PRE,
          boss: { id: 'saint_of_rot', name: 'Saint of Rot', title: 'The Hollow Vessel of Prayer', maxHp: 1400, phases: 3, attack: 48, speed: 120 },
          postDialogue: CATHEDRAL_BOSS_POST,
          enemies: [],
        },
      ],
      mountain: [
        {
          preDialogue: MOUNTAIN_ENTRY,
          enemies: [{ config: B2, count: 2 }, { config: B1, count: 1 }],
        },
        {
          postDialogue: MOUNTAIN_ROUND1_POST,
          enemies: [{ config: B2, count: 2 }, { config: B1, count: 2 }],
        },
        {
          postDialogue: MOUNTAIN_ROUND2_POST,
          enemies: [],
        },
        {
          preDialogue: MOUNTAIN_BOSS_PRE,
          boss: { id: 'fallen_guardian', name: 'Fallen Guardian', title: 'Last Keeper of the Oath', maxHp: 1600, phases: 3, attack: 52, speed: 130 },
          postDialogue: MOUNTAIN_BOSS_POST,
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

  private playIntroSequence() {
    const store = useGameStore.getState();
    store.setStoryFlag('intro_seen', true);
    this.advanceToNextRound();
  }

  spawnBloodSpray(x: number, y: number) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const px = x + Phaser.Math.Between(-10, 10);
      const py = y + Phaser.Math.Between(-30, 10);
      const rect = this.add.rectangle(px, py, 4, 4, 0x8b0000);
      this.physics.add.existing(rect);
      const body = rect.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-250, -50));
      body.setGravityY(400);
      body.setDrag(50);
      
      this.time.delayedCall(Phaser.Math.Between(500, 800), () => {
        rect.destroy();
      });
    }
  }

  private createAmbientFX(theme: ZoneTheme) {
    if (this.ambientTimer) {
      this.ambientTimer.destroy();
      this.ambientTimer = null;
    }

    this.ambientTimer = this.time.addEvent({
      delay: 350,
      callback: () => {
        const cam = this.cameras.main;
        if (!cam) return;
        
        const spawnCount = theme === 'mountain' || theme === 'cathedral' ? 3 : 1;
        
        for (let i = 0; i < spawnCount; i++) {
          const rx = cam.scrollX + Phaser.Math.Between(0, cam.width);
          
          if (theme === 'mountain') {
            const ry = cam.scrollY - 10;
            const snow = this.add.rectangle(rx, ry, 3, 3, 0xffffff, 0.8);
            this.physics.add.existing(snow);
            const b = snow.body as Phaser.Physics.Arcade.Body;
            b.allowGravity = false;
            b.setVelocity(Phaser.Math.Between(-80, -30), Phaser.Math.Between(50, 100));
            this.time.delayedCall(4000, () => snow.destroy());
          } else if (theme === 'cathedral') {
            const ry = cam.scrollY + cam.height + 10;
            const isOrange = Math.random() < 0.35;
            const ash = this.add.rectangle(rx, ry, 3, 3, isOrange ? 0xff4500 : 0x555555, 0.6);
            this.physics.add.existing(ash);
            const b = ash.body as Phaser.Physics.Arcade.Body;
            b.allowGravity = false;
            b.setVelocity(Phaser.Math.Between(10, 40), Phaser.Math.Between(-30, -70));
            this.time.delayedCall(6000, () => ash.destroy());
          }
        }
      },
      loop: true
    });
  }
}
