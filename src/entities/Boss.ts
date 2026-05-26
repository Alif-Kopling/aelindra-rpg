import Phaser from 'phaser';
import { useGameStore } from '../store/gameStore';
import { getTrustBossHint } from '../systems/dialogueEngine';

export interface BossConfig {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  phases: number;
  attack: number;
  speed: number;
  scale?: number;
}

type BossAIState = 'intro' | 'idle' | 'phase1' | 'phase2' | 'phase3' | 'enrage' | 'dead';

export class Boss extends Phaser.Physics.Arcade.Sprite {
  private config: BossConfig;
  private hp: number;
  private maxHp: number;
  private aiState: BossAIState = 'intro';
  private phase = 1;
  private attackTimer = 0;
  private specialTimer = 0;
  private moveTimer = 0;
  private target: Phaser.Physics.Arcade.Sprite | null = null;
  private projectiles: Phaser.Physics.Arcade.Group;
  private currentFrame = 0;
  private frameTimer = 0;
  private isDead = false;
  private isAttacking = false;
  private phaseTransitioning = false;
  private introComplete = false;
  private enrageMode = false;
  private timeAccumulator = 0;
  private phaseScaleMultiplier = 1;
  private arenaLeft = 0;
  private arenaRight = 1920;
  private activeTimers: Phaser.Time.TimerEvent[] = [];

  private static spriteKeyForBoss(id: string): string {
    const map: Record<string, string> = {
      blind_king: 'boss_blind_king_sprite',
      ashen_knight: 'boss_ashen_knight_sprite',
      saint_of_rot: 'boss_saint_of_rot_sprite',
      fallen_guardian: 'boss_fallen_guardian_sprite',
    };
    return map[id] || 'boss_blind_king_sprite';
  }

  private getSpriteKey(): string {
    if (this.isAttacking) {
      const attackKey = `boss_${this.config.id}_attack`;
      if (this.scene.textures.exists(attackKey)) {
        return attackKey;
      }
    }

    if (
      this.config.id === 'blind_king' &&
      this.phase >= 3 &&
      this.scene.textures.exists('boss_blind_king_phase3_sprite')
    ) {
      return 'boss_blind_king_phase3_sprite';
    }
    return Boss.spriteKeyForBoss(this.config.id);
  }

  constructor(scene: Phaser.Scene, x: number, y: number, config: BossConfig) {
    const spriteKey = Boss.spriteKeyForBoss(config.id);
    const textureToUse = scene.textures.exists(spriteKey) ? spriteKey : 'pixel';
    super(scene, x, y, textureToUse);
    this.config = config;
    this.hp = config.maxHp;
    this.maxHp = config.maxHp;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(200, 600);
    body.setImmovable(false);

    const scale = config.scale || 3.5;
    if (scene.textures.exists(spriteKey)) {
      this.setDisplaySize(64 * scale, 80 * scale);
    } else {
      this.setScale(scale);
    }

    // Anchor body to bottom of sprite using texture-space coordinates
    const tex = this.texture.get();
    const tw = tex.width;
    const th = tex.height;

    const bw = 48;
    const bh = 64;
    body.setSize(bw, bh);
    body.setOffset((tw - bw) / 2, th - bh);
    this.setDepth(10);

    this.projectiles = scene.physics.add.group();

    useGameStore.getState().setBoss({
      id: config.id,
      name: config.name,
      title: config.title,
      hp: this.hp,
      maxHp: config.maxHp,
      phase: this.phase,
      maxPhase: config.phases,
      isActive: true,
    });

    this.playIntro();
  }

  private playIntro() {
    const scene = this.scene;
    this.setAlpha(0);
    this.setScale(0.5);

    scene.cameras.main.shake(500, 0.01);
    scene.cameras.main.flash(200, 80, 0, 0);

    scene.tweens.add({
      targets: this,
      alpha: 1,
      scaleX: this.config.scale || 2.5,
      scaleY: this.config.scale || 2.5,
      duration: 1000,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.introComplete = true;
        this.aiState = 'phase1';
        scene.cameras.main.shake(300, 0.008);
      },
    });

    const nameText = scene.add.text(
      scene.cameras.main.width / 2,
      scene.cameras.main.height * 0.3,
      `${this.config.name}\n${this.config.title}`,
      {
        fontSize: '16px',
        fontFamily: 'Cinzel, serif',
        color: '#cc0000',
        align: 'center',
        stroke: '#000',
        strokeThickness: 4,
      }
    );
    nameText.setScrollFactor(0);
    nameText.setDepth(100);
    nameText.setOrigin(0.5);
    nameText.setAlpha(0);

    scene.tweens.add({
      targets: nameText,
      alpha: 1,
      duration: 600,
      yoyo: true,
      hold: 2000,
      onComplete: () => nameText.destroy(),
    });

    const store = useGameStore.getState();
    const hintLevel = getTrustBossHint(store.npcTrust, 'evelyne');
    if (hintLevel) {
      const hintTexts: Record<string, string> = {
        basic: '"Valther pernah bilang — musuh punya irama. Dengarkan."',
        pattern: '"Putri ingatkan: tiap pukulan punya celah. Cari di antara serangan."',
        dodge: '"Kata Evelyne — musuh ini punya momen rentan setelah serangan besarnya."',
      };
      const hintText = scene.add.text(
        scene.cameras.main.width / 2,
        scene.cameras.main.height * 0.4,
        hintTexts[hintLevel],
        {
          fontSize: '10px',
          fontFamily: 'Cinzel, serif',
          color: '#88bbff',
          align: 'center',
          stroke: '#000',
          strokeThickness: 3,
          fontStyle: 'italic',
        }
      );
      hintText.setScrollFactor(0);
      hintText.setDepth(100);
      hintText.setOrigin(0.5);
      hintText.setAlpha(0);

      scene.tweens.add({
        targets: hintText,
        alpha: 1,
        duration: 800,
        delay: 500,
        yoyo: true,
        hold: 2500,
        onComplete: () => hintText.destroy(),
      });
    }
  }

  setTarget(target: Phaser.Physics.Arcade.Sprite) {
    this.target = target;
  }

  getId(): string {
    return this.config.id;
  }

  getProjectiles(): Phaser.Physics.Arcade.Group {
    return this.projectiles;
  }

  update(delta: number) {
    if (this.isDead || !this.introComplete) return;

    this.attackTimer = Math.max(0, this.attackTimer - delta);
    this.specialTimer = Math.max(0, this.specialTimer - delta);
    this.moveTimer = Math.max(0, this.moveTimer - delta);
    this.frameTimer += delta;

    if (this.phaseTransitioning) return;

    this.timeAccumulator += delta;

    const spriteKey = this.getSpriteKey();
    if (this.scene.textures.exists(spriteKey)) {
      if (this.texture.key !== spriteKey) {
        this.setTexture(spriteKey);
      }

      const baseScale = (this.config.scale || 3.5) * this.phaseScaleMultiplier;
      const baseScaleX = (64 * baseScale) / this.width;
      const baseScaleY = (80 * baseScale) / this.height;

      if (this.phaseTransitioning) {
        this.scaleX = baseScaleX * 1.3;
        this.scaleY = baseScaleY * 1.3;
      } else if (this.aiState === 'enrage') {
        this.scaleY = baseScaleY * (1 + Math.sin(this.timeAccumulator / 50) * 0.06);
        this.scaleX = baseScaleX * (1 + Math.cos(this.timeAccumulator / 50) * 0.06);
        this.angle = Math.sin(this.timeAccumulator / 30) * 5;
      } else {
        const breathe = Math.sin(this.timeAccumulator / 300);
        this.scaleY = baseScaleY * (1 + breathe * 0.05);
        this.scaleX = baseScaleX * (1 - breathe * 0.02);
        this.angle = 0;
      }
    }

    switch (this.aiState) {
      case 'phase1': this.phase1AI(delta); break;
      case 'phase2': this.phase2AI(delta); break;
      case 'phase3': this.phase3AI(delta); break;
      case 'enrage': this.enrageAI(delta); break;
    }

    this.checkPhaseTransition();
  }

  private phase1AI(_delta: number) {
    if (!this.target) return;

    switch (this.config.id) {
      case 'blind_king':
        this.moveHorizontally(80);
        if (this.attackTimer <= 0) { this.attackTimer = 1800; this.basicAttack(); }
        if (this.specialTimer <= 0) { this.specialTimer = 5000; this.groundSlam(); }
        break;
      case 'saint_of_rot':
        this.moveHorizontally(60);
        if (this.attackTimer <= 0) { this.attackTimer = 2200; this.rotProjectile(); }
        if (this.specialTimer <= 0) { this.specialTimer = 5500; this.decayAura(); }
        break;
      case 'fallen_guardian':
        this.moveHorizontally(70);
        if (this.attackTimer <= 0) { this.attackTimer = 2000; this.shieldBash(); }
        if (this.specialTimer <= 0) { this.specialTimer = 6000; this.groundSlam(); }
        break;
      default:
        this.moveHorizontally(80);
        if (this.attackTimer <= 0) { this.attackTimer = 2000; this.basicAttack(); }
        if (this.specialTimer <= 0) { this.specialTimer = 6000; this.groundSlam(); }
    }
  }

  private phase2AI(_delta: number) {
    if (!this.target) return;

    switch (this.config.id) {
      case 'blind_king':
        this.moveHorizontally(100);
        if (this.attackTimer <= 0) {
          this.attackTimer = 1400;
          Math.random() < 0.5 ? this.sonarPulse() : this.basicAttack();
        }
        if (this.specialTimer <= 0) {
          this.specialTimer = 4500;
          this.blindTeleport();
        }
        break;
      case 'saint_of_rot':
        this.moveHorizontally(80);
        if (this.attackTimer <= 0) {
          this.attackTimer = 1600;
          Math.random() < 0.5 ? this.plagueBurst() : this.rotProjectile();
        }
        if (this.specialTimer <= 0) {
          this.specialTimer = 5000;
          this.sporePod();
        }
        break;
      case 'fallen_guardian':
        this.moveHorizontally(90);
        if (this.attackTimer <= 0) {
          this.attackTimer = 1500;
          Math.random() < 0.5 ? this.vengefulCounter() : this.shieldBash();
        }
        if (this.specialTimer <= 0) {
          this.specialTimer = 5000;
          this.chargeAttack();
        }
        break;
      default:
        const isAshen = this.config.id === 'ashen_knight';
        this.moveHorizontally(isAshen ? 130 : 100);
        if (this.attackTimer <= 0) {
          this.attackTimer = isAshen ? 1000 : 1500;
          Math.random() < 0.5 ? this.basicAttack() : this.projectileBarrage();
        }
        if (this.specialTimer <= 0) {
          this.specialTimer = isAshen ? 3000 : 5000;
          isAshen ? this.voidTeleport() : this.chargeAttack();
        }
    }
  }

  private summonMinions() {
    const scene = this.scene;
    // Roar audio
    if (scene.cache.audio.exists('boss_roar')) {
      scene.sound.play('boss_roar', { volume: 0.8 });
    }
    if (this.config.id === 'ashen_knight' && scene.cache.audio.exists('sfx_dragon_roar')) {
      scene.sound.play('sfx_dragon_roar', { volume: 0.6, rate: 0.8 });
    }

    // Summon 3 Ashen Soldiers at random positions
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(50, this.arenaRight - 50);
      scene.events.emit('boss-summon-minion', { x, y: this.y });
    }
  }

  private phase3AI(_delta: number) {
    if (!this.target) return;

    switch (this.config.id) {
      case 'blind_king':
        this.moveHorizontally(150);
        if (this.attackTimer <= 0) {
          this.attackTimer = 1000;
          const roll = Math.random();
          if (roll < 0.25) this.sonarPulse();
          else if (roll < 0.45) this.blindTeleport();
          else if (roll < 0.65) this.royalSummon();
          else if (roll < 0.85) this.swordRain();
          else this.darkWave();
        }
        if (this.specialTimer <= 0) { this.specialTimer = 3000; this.darkExplosion(); }
        break;
      case 'saint_of_rot':
        this.moveHorizontally(120);
        if (this.attackTimer <= 0) {
          this.attackTimer = 1100;
          const roll = Math.random();
          if (roll < 0.3) this.corruptingWave();
          else if (roll < 0.55) this.plagueBurst();
          else if (roll < 0.75) this.sporePod();
          else this.rotProjectile();
        }
        if (this.specialTimer <= 0) { this.specialTimer = 3200; this.rotExplosion(); }
        break;
      case 'fallen_guardian':
        this.moveHorizontally(140);
        if (this.attackTimer <= 0) {
          this.attackTimer = 1000;
          const roll = Math.random();
          if (roll < 0.35) this.judgmentStrike();
          else if (roll < 0.6) this.vengefulCounter();
          else if (roll < 0.8) this.chargeAttack();
          else this.guardianFury();
        }
        if (this.specialTimer <= 0) { this.specialTimer = 3000; this.shockwaveStomp(); }
        break;
      default:
        const isAshen = this.config.id === 'ashen_knight';
        this.moveHorizontally(isAshen ? 180 : 150);
        if (this.attackTimer <= 0) {
          this.attackTimer = isAshen ? 600 : 800;
          const roll = Math.random();
          if (isAshen) {
            if (roll < 0.15) this.voidTeleport();
            else if (roll < 0.3) this.ashenStorm();
            else if (roll < 0.45) this.swordRain();
            else if (roll < 0.6) this.summonMinions();
            else if (roll < 0.75) this.darkWave();
            else this.projectileBarrage();
          } else {
            if (roll < 0.25) this.basicAttack();
            else if (roll < 0.5) this.projectileBarrage();
            else if (roll < 0.75) this.darkWave();
            else this.voidTeleport();
          }
        }
        if (this.specialTimer <= 0) {
          this.specialTimer = isAshen ? 2200 : 3500;
          this.darkExplosion();
        }
    }
  }

  private swordRain() {
    this.setAttacking(2000);
    const scene = this.scene;
    // Roar audio
    if (scene.cache.audio.exists('boss_roar')) {
      scene.sound.play('boss_roar', { volume: 0.6 });
    }
    if (scene.cache.audio.exists('sfx_dragon_roar')) {
      scene.sound.play('sfx_dragon_roar', { volume: 0.5, rate: 0.85 });
    }

    const duration = 2000;
    const interval = 150;
    const count = duration / interval;

    for (let i = 0; i < count; i++) {
      const t = scene.time.delayedCall(i * interval, () => {
        if (this.isDead) return;
        const x = Phaser.Math.Between(50, this.arenaRight - 50);
        const sword = scene.physics.add.sprite(x, -50, 'sword_rain');
        sword.setDisplaySize(24, 48);
        sword.setDepth(15);
        sword.setRotation(Math.PI);
        (sword.body as Phaser.Physics.Arcade.Body).velocity.y = 600;
        
        if (this.target && this.target.active) {
          scene.physics.add.overlap(sword, this.target, () => {
            scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.6 });
            if (sword.active) sword.destroy();
          });
        }
        
        scene.time.delayedCall(1000, () => { if (sword.active) sword.destroy(); });
      });
      this.activeTimers.push(t);
    }
  }

  private ashenStorm() {
    const scene = this.scene;
    this.setTint(0xcccccc);
    
    for (let i = 0; i < 15; i++) {
      const t = scene.time.delayedCall(i * 80, () => {
        if (this.isDead) return;
        const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
        const proj = scene.physics.add.sprite(this.x, this.y, 'pixel');
        proj.setTint(0xffffff);
        proj.setDisplaySize(10, 10);
        proj.setDepth(15);
        
        const speed = 350;
        (proj.body as Phaser.Physics.Arcade.Body).velocity.x = Math.cos(angle) * speed;
        (proj.body as Phaser.Physics.Arcade.Body).velocity.y = Math.sin(angle) * speed;
        
        scene.time.delayedCall(1500, () => { if (proj.active) proj.destroy(); });
        if (this.target && this.target.active) {
          scene.physics.add.overlap(proj, this.target, () => {
            scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.45 });
            if (proj.active) proj.destroy();
          });
        }
      });
      this.activeTimers.push(t);
    }

    const clearTintTimer = scene.time.delayedCall(1200, () => { if (!this.isDead) this.clearTint(); });
    this.activeTimers.push(clearTintTimer);
  }

  private enrageAI(_delta: number) {
    if (!this.target) return;
    this.moveHorizontally(200);
    this.setTint(0xff0000);

    if (this.attackTimer <= 0) {
      this.attackTimer = 500;
      const roll = Math.random();
      switch (this.config.id) {
        case 'blind_king':
          const r = Math.random();
          if (r < 0.3) this.sonarPulse();
          else if (r < 0.6) this.blindTeleport();
          else if (r < 0.8) this.swordRain();
          else this.basicAttack();
          break;
        case 'saint_of_rot':
          roll < 0.4 ? this.corruptingWave() : roll < 0.7 ? this.plagueBurst() : this.rotProjectile();
          break;
        case 'fallen_guardian':
          roll < 0.4 ? this.judgmentStrike() : roll < 0.7 ? this.guardianFury() : this.shieldBash();
          break;
        default:
          roll < 0.4 ? this.basicAttack() : roll < 0.7 ? this.chargeAttack() : this.voidTeleport();
      }
    }
    
    if (this.specialTimer <= 0) {
      this.specialTimer = 2500;
      switch (this.config.id) {
        case 'blind_king': this.darkExplosion(); break;
        case 'saint_of_rot': this.rotExplosion(); break;
        case 'fallen_guardian': this.shockwaveStomp(); break;
        default: Math.random() < 0.5 ? this.groundSlam() : this.darkWave();
      }
    }
  }

  private darkWave() {
    this.setAttacking(1000);
    const dir = this.flipX ? -1 : 1;
    const scene = this.scene;
    const waveColor = this.config.id === 'blind_king' ? 0x9b59b6
      : this.config.id === 'saint_of_rot' ? 0x4a7c3f
      : this.config.id === 'fallen_guardian' ? 0x6eb5d4
      : 0x4b0082;
    const glowColor = this.config.id === 'blind_king' ? 0xbb77dd
      : this.config.id === 'saint_of_rot' ? 0x6a9c5f
      : this.config.id === 'fallen_guardian' ? 0x8ecfe0
      : 0x7b30c2;
    
    for (let i = 0; i < 3; i++) {
      const t = scene.time.delayedCall(i * 200, () => {
        // Glow behind wave
        const glow = scene.add.graphics();
        glow.lineStyle(8, glowColor, 0.3);
        glow.beginPath();
        glow.moveTo(this.x, this.y + 35);
        glow.lineTo(this.x, this.y - 35);
        glow.strokePath();
        glow.setDepth(19);
        scene.tweens.add({
          targets: glow,
          x: glow.x + dir * 500,
          alpha: 0,
          duration: 1000,
          onComplete: () => { if (glow.active) glow.destroy(); },
        });

        // Main wave
        const wave = scene.add.graphics();
        wave.lineStyle(4, waveColor, 1);
        wave.beginPath();
        wave.moveTo(this.x, this.y + 30);
        wave.lineTo(this.x, this.y - 30);
        wave.strokePath();
        wave.setDepth(20);

        let hit = false;
        scene.tweens.add({
          targets: wave,
          x: wave.x + dir * 500,
          alpha: 0,
          duration: 1000,
          onUpdate: () => {
            if (hit || !wave.active) return;
            if (this.target && this.target.active) {
              const dist = Phaser.Math.Distance.Between(wave.x, wave.y, this.target.x, this.target.y);
              if (dist < 40) {
                hit = true;
                scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.2, type: 'wave' });
                this.spawnHitSpark(wave.x, wave.y, waveColor, 5);
                wave.destroy();
                if (glow.active) glow.destroy();
              }
            }
          },
          onComplete: () => { if (wave.active) wave.destroy(); }
        });
      });
      this.activeTimers.push(t);
    }
  }

  private voidTeleport() {
    if (!this.target) return;
    const scene = this.scene;

    // Dissolve particles
    for (let i = 0; i < 8; i++) {
      const p = scene.add.graphics();
      const color = this.config.id === 'ashen_knight' ? 0xcccccc : 0x4b0082;
      p.fillStyle(color, 0.7);
      p.fillCircle(0, 0, Phaser.Math.Between(2, 5));
      p.setPosition(this.x + Phaser.Math.Between(-20, 20), this.y + Phaser.Math.Between(-30, 30));
      p.setDepth(22);
      const angle = Math.random() * Math.PI * 2;
      scene.tweens.add({
        targets: p,
        x: p.x + Math.cos(angle) * Phaser.Math.Between(30, 60),
        y: p.y + Math.sin(angle) * Phaser.Math.Between(30, 60),
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 300,
        onComplete: () => p.destroy(),
      });
    }

    scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      duration: 300,
      onComplete: () => {
        const side = Math.random() < 0.5 ? -120 : 120;
        this.x = Phaser.Math.Clamp(this.target!.x + side, this.arenaLeft + 50, this.arenaRight - 50);

        // Arrival burst
        const burst = scene.add.graphics();
        const color = this.config.id === 'ashen_knight' ? 0xcccccc : 0x9b59b6;
        burst.fillStyle(color, 0.5);
        burst.fillCircle(this.x, this.y, 15);
        burst.setDepth(22);
        scene.tweens.add({
          targets: burst,
          scaleX: 3,
          scaleY: 3,
          alpha: 0,
          duration: 400,
          onComplete: () => burst.destroy(),
        });

        scene.tweens.add({
          targets: this,
          alpha: 1,
          scaleX: this.config.scale || 2.5,
          duration: 300,
          onComplete: () => {
            this.basicAttack();
          },
        });
      },
    });
  }

  // ── BLIND KING SKILLS ─────────────────────────────────────

  private setAttacking(duration: number) {
    this.isAttacking = true;
    const t = this.scene.time.delayedCall(duration, () => {
      this.isAttacking = false;
    });
    this.activeTimers.push(t);
  }

  private sonarPulse() {
    this.setAttacking(1000);
    const scene = this.scene;
    scene.cameras.main.shake(200, 0.005);

    for (let i = 0; i < 3; i++) {
      const t = scene.time.delayedCall(i * 300, () => {
        if (this.isDead) return;
        const ring = scene.add.graphics();
        ring.lineStyle(3, 0x9b59b6, 0.7);
        ring.strokeCircle(this.x, this.y, 10);
        ring.setDepth(18);

        scene.tweens.add({
          targets: ring,
          scaleX: 8,
          scaleY: 8,
          alpha: 0,
          duration: 700,
          ease: 'Power2',
          onComplete: () => ring.destroy(),
        });

        if (this.target && this.target.active) {
          const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
          if (dist < 200) {
            scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 0.7, type: 'aoe', radius: 200 });
          }
        }
      });
      this.activeTimers.push(t);
    }
  }

  private blindTeleport() {
    if (!this.target) return;
    const scene = this.scene;

    scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        const side = Math.random() < 0.5 ? -100 : 100;
        this.x = Phaser.Math.Clamp(this.target!.x + side, this.arenaLeft + 50, this.arenaRight - 50);
        this.y = this.target!.y - 60;

        scene.cameras.main.flash(150, 100, 0, 100);

        scene.tweens.add({
          targets: this,
          alpha: 1,
          duration: 200,
          onComplete: () => {
            this.groundSlam();
          },
        });
      },
    });
  }

  private royalSummon() {
    const scene = this.scene;
    for (let i = 0; i < 2; i++) {
      const t = scene.time.delayedCall(i * 400, () => {
        if (this.isDead) return;
        const x = Phaser.Math.Between(this.arenaLeft + 50, this.arenaRight - 50);
        scene.events.emit('boss-summon-minion', { x, y: this.y });
      });
      this.activeTimers.push(t);
    }
  }

  // ── SAINT OF ROT SKILLS ────────────────────────────────────

  private rotProjectile() {
    this.setAttacking(800);
    if (!this.target) return;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
    const proj = this.scene.add.graphics();
    proj.fillStyle(0x4a7c3f);
    proj.fillCircle(0, 0, 7);
    proj.fillStyle(0x6a9c5f, 0.5);
    proj.fillCircle(0, 0, 4);
    proj.setPosition(this.x, this.y - 20);
    proj.setDepth(15);

    const speed = 200;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    let traveled = 0;

    const timer = this.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (!proj.active) { timer.remove(); return; }
        proj.x += vx * 0.016;
        proj.y += vy * 0.016;
        traveled += speed * 0.016;

        if (this.target && this.target.active) {
          const dist = Phaser.Math.Distance.Between(proj.x, proj.y, this.target.x, this.target.y);
          if (dist < 30) {
            this.scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.7 });
            proj.destroy();
            timer.remove();
            return;
          }
        }
        if (traveled > 500) { proj.destroy(); timer.remove(); }
      },
    });
    this.activeTimers.push(timer);
  }

  private decayAura() {
    this.setAttacking(1500);
    const scene = this.scene;
    const aura = scene.add.graphics();
    aura.fillStyle(0x2d5a1e, 0.25);
    aura.fillCircle(this.x, this.y, 120);
    aura.setDepth(14);

    let ticks = 0;
    const timer = scene.time.addEvent({
      delay: 500,
      repeat: 5,
      callback: () => {
        if (this.isDead) { timer.remove(); aura.destroy(); return; }
        aura.setPosition(this.x, this.y);
        ticks++;
        if (this.target && this.target.active) {
          const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
          if (dist < 120) {
            scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.3 });
          }
        }
      },
    });
    this.activeTimers.push(timer);

    scene.tweens.add({
      targets: aura,
      alpha: 0,
      duration: 3500,
      onComplete: () => aura.destroy(),
    });
  }

  private plagueBurst() {
    this.setAttacking(1200);
    const scene = this.scene;
    scene.cameras.main.shake(300, 0.008);

    for (let i = 0; i < 5; i++) {
      const t = scene.time.delayedCall(i * 120, () => {
        if (this.isDead) return;
        const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
        const cloud = scene.add.graphics();
        cloud.fillStyle(0x3a6b2f, 0.5);
        cloud.fillCircle(0, 0, 15);
        cloud.setPosition(this.x, this.y);
        cloud.setDepth(16);

        const speed = 150;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        let traveled = 0;
        const moveTimer = scene.time.addEvent({
          delay: 16,
          loop: true,
          callback: () => {
            if (!cloud.active) { moveTimer.remove(); return; }
            cloud.x += vx * 0.016;
            cloud.y += vy * 0.016;
            traveled += speed * 0.016;

            if (this.target && this.target.active) {
              const dist = Phaser.Math.Distance.Between(cloud.x, cloud.y, this.target.x, this.target.y);
              if (dist < 35) {
                scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.5 });
              }
            }
            if (traveled > 200) { cloud.destroy(); moveTimer.remove(); }
          },
        });
        this.activeTimers.push(moveTimer);
      });
      this.activeTimers.push(t);
    }
  }

  private sporePod() {
    this.setAttacking(1000);
    const scene = this.scene;
    const px = Phaser.Math.Between(this.arenaLeft + 80, this.arenaRight - 80);

    const pod = scene.add.graphics();
    pod.fillStyle(0x5a8c4a, 0.8);
    pod.fillCircle(0, 0, 12);
    pod.fillStyle(0x8abc6a, 0.5);
    pod.fillCircle(0, 0, 7);
    pod.setPosition(px, this.y);
    pod.setDepth(15);

    const warnTimer = scene.time.delayedCall(1200, () => {
      if (!pod.active || this.isDead) { pod.destroy(); return; }
      pod.fillStyle(0xff4444, 0.8);
      pod.fillCircle(0, 0, 12);

      const explodeTimer = scene.time.delayedCall(600, () => {
        if (!pod.active) return;
        if (this.target && this.target.active) {
          const dist = Phaser.Math.Distance.Between(pod.x, pod.y, this.target.x, this.target.y);
          if (dist < 60) {
            scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.0, type: 'aoe', radius: 60 });
          }
        }
        const burst = scene.add.graphics();
        burst.fillStyle(0x4a7c3f, 0.6);
        burst.fillCircle(pod.x, pod.y, 10);
        burst.setDepth(18);
        scene.tweens.add({
          targets: burst,
          scaleX: 5,
          scaleY: 5,
          alpha: 0,
          duration: 400,
          onComplete: () => burst.destroy(),
        });
        pod.destroy();
      });
      this.activeTimers.push(explodeTimer);
    });
    this.activeTimers.push(warnTimer);
  }

  private corruptingWave() {
    this.setAttacking(1000);
    const scene = this.scene;
    scene.cameras.main.shake(400, 0.01);

    for (let i = 0; i < 3; i++) {
      const t = scene.time.delayedCall(i * 250, () => {
        const dir = this.flipX ? -1 : 1;
        const wave = scene.add.graphics();
        wave.lineStyle(5, 0x3a6b2f, 0.8);
        wave.beginPath();
        wave.moveTo(this.x, this.y + 40);
        wave.lineTo(this.x, this.y - 40);
        wave.strokePath();
        wave.setDepth(20);

        let hit = false;
        scene.tweens.add({
          targets: wave,
          x: wave.x + dir * 450,
          alpha: 0,
          duration: 900,
          onUpdate: () => {
            if (hit || !wave.active) return;
            if (this.target && this.target.active) {
              const dist = Phaser.Math.Distance.Between(wave.x, wave.y, this.target.x, this.target.y);
              if (dist < 45) {
                hit = true;
                scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.3, type: 'wave' });
                wave.destroy();
              }
            }
          },
          onComplete: () => { if (wave.active) wave.destroy(); },
        });
      });
      this.activeTimers.push(t);
    }
  }

  private rotExplosion() {
    this.setAttacking(1500);
    const scene = this.scene;
    scene.cameras.main.shake(600, 0.015);
    scene.cameras.main.flash(200, 50, 100, 0);

    const burst = scene.add.graphics();
    burst.fillStyle(0x2d5a1e, 0.9);
    burst.fillCircle(this.x, this.y, 20);
    burst.setDepth(22);

    scene.tweens.add({
      targets: burst,
      scaleX: 12,
      scaleY: 12,
      alpha: 0,
      duration: 1000,
      ease: 'Power3',
      onComplete: () => burst.destroy(),
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const tendril = scene.add.graphics();
      tendril.lineStyle(5, 0x4a7c3f, 0.7);
      tendril.lineBetween(0, 0, Math.cos(angle) * 120, Math.sin(angle) * 120);
      tendril.setPosition(this.x, this.y);
      tendril.setDepth(20);

      scene.tweens.add({
        targets: tendril,
        scaleX: 1.5,
        alpha: 0,
        duration: 500,
        delay: i * 30,
        onComplete: () => tendril.destroy(),
      });
    }

    scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 2.5, type: 'aoe', radius: 200 });
  }

  // ── FALLEN GUARDIAN SKILLS ─────────────────────────────────

  private shieldBash() {
    this.setAttacking(600);
    if (!this.target) return;
    const dx = this.target.x - this.x;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(dx > 0 ? 500 : -500);

    const flash = this.scene.add.graphics();
    flash.fillStyle(0x6eb5d4, 0.5);
    flash.fillCircle(this.x + (dx > 0 ? 40 : -40), this.y, 30);
    flash.setDepth(18);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy(),
    });

    const t = this.scene.time.delayedCall(300, () => {
      if (this.isDead) return;
      body.setVelocityX(0);
      this.scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.2, type: 'charge' });
    });
    this.activeTimers.push(t);
  }

  private vengefulCounter() {
    if (!this.target) return;
    const scene = this.scene;

    this.setTint(0x6eb5d4);
    this.isInvulnerable = true;

    const shield = scene.add.graphics();
    shield.lineStyle(3, 0x6eb5d4, 0.6);
    shield.strokeCircle(this.x, this.y, 50);
    shield.setDepth(18);

    scene.tweens.add({
      targets: shield,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      onComplete: () => {
        shield.destroy();
        if (this.isDead) return;
        this.isInvulnerable = false;
        this.clearTint();

        if (this.target && this.target.active) {
          const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
          if (dist < 80) {
            this.basicAttack();
            scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.8, type: 'melee' });
          } else {
            this.chargeAttack();
          }
        }
      },
    });
  }

  private judgmentStrike() {
    this.setAttacking(1200);
    if (!this.target) return;
    const scene = this.scene;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);

    this.setTint(0xffffff);
    scene.cameras.main.shake(300, 0.01);

    const marker = scene.add.graphics();
    marker.lineStyle(2, 0xffffff, 0.4);
    marker.strokeRect(this.target.x - 40, this.target.y - 80, 80, 120);
    marker.setDepth(15);

    const t = scene.time.delayedCall(600, () => {
      if (this.isDead) { marker.destroy(); return; }
      this.clearTint();
      marker.destroy();

      this.x = this.target!.x;
      this.y = this.target!.y - 60;

      const slam = scene.add.graphics();
      slam.fillStyle(0xffffff, 0.8);
      slam.fillCircle(this.x, this.y + 40, 30);
      slam.setDepth(20);

      scene.tweens.add({
        targets: slam,
        scaleX: 6,
        scaleY: 3,
        alpha: 0,
        duration: 500,
        onComplete: () => slam.destroy(),
      });

      scene.cameras.main.flash(200, 150, 150, 200);
      scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 2.0, type: 'aoe', radius: 150 });
    });
    this.activeTimers.push(t);
  }

  private guardianFury() {
    this.setAttacking(1000);
    const scene = this.scene;
    for (let i = 0; i < 4; i++) {
      const t = scene.time.delayedCall(i * 150, () => {
        if (this.isDead) return;
        const slash = scene.add.graphics();
        slash.fillStyle(0x8bb8d4, 0.6);
        const dir = this.flipX ? -1 : 1;
        slash.fillRect(this.x + dir * 15, this.y - 25, 60 * dir, 50);
        slash.setDepth(20);

        scene.tweens.add({
          targets: slash,
          alpha: 0,
          duration: 200,
          onComplete: () => slash.destroy(),
        });

        scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 0.7, type: 'melee' });
      });
      this.activeTimers.push(t);
    }
  }

  private shockwaveStomp() {
    this.setAttacking(1200);
    const scene = this.scene;
    scene.cameras.main.shake(500, 0.015);

    for (let i = 0; i < 4; i++) {
      const t = scene.time.delayedCall(i * 200, () => {
        const ring = scene.add.graphics();
        ring.lineStyle(4, 0x6eb5d4, 0.7);
        ring.strokeCircle(this.x, this.y, 10);
        ring.setDepth(18);

        scene.tweens.add({
          targets: ring,
          scaleX: 7 + i * 2,
          scaleY: 2.5 + i,
          alpha: 0,
          duration: 500 + i * 150,
          delay: i * 100,
          ease: 'Power2',
          onComplete: () => ring.destroy(),
        });
      });
      this.activeTimers.push(t);
    }

    scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.5, type: 'aoe', radius: 140 });
  }

  private moveHorizontally(speed: number) {
    if (!this.target) return;
    const dx = this.target.x - this.x;
    const dist = Math.abs(dx);

    if (dist > 80) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocityX(dx > 0 ? speed : -speed);
      this.setFlipX(dx < 0);
    } else {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    }
  }

  private spawnHitSpark(x: number, y: number, color: number, count: number = 6) {
    for (let i = 0; i < count; i++) {
      const spark = this.scene.add.graphics();
      const hue = Phaser.Display.Color.IntegerToColor(color);
      spark.fillStyle(color, 0.9);
      spark.fillCircle(0, 0, Phaser.Math.Between(2, 5));
      spark.setPosition(x, y);
      spark.setDepth(25);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = Phaser.Math.Between(40, 80);
      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: Phaser.Math.Between(200, 400),
        onComplete: () => spark.destroy(),
      });
    }
  }

  private basicAttack() {
    this.setAttacking(500);
    if (!this.target) return;
    this.scene.events.emit('boss-attack', { boss: this, damage: this.config.attack, type: 'melee' });

    const dir = this.flipX ? -1 : 1;
    const sx = this.x + dir * 20;
    const sy = this.y;

    // Glow behind slash
    const glow = this.scene.add.graphics();
    glow.fillStyle(0xff4444, 0.2);
    glow.fillRect(sx, sy - 40, 90 * dir, 80);
    glow.setDepth(19);
    this.scene.tweens.add({
      targets: glow,
      alpha: 0,
      duration: 200,
      onComplete: () => glow.destroy(),
    });

    // Main slash arc
    const slash = this.scene.add.graphics();
    const slashColor = this.config.id === 'ashen_knight' ? 0xcccccc
      : this.config.id === 'blind_king' ? 0x9b59b6
      : this.config.id === 'saint_of_rot' ? 0x4a7c3f
      : 0x6eb5d4;
    slash.fillStyle(slashColor, 0.8);
    slash.fillRect(sx, sy - 30, 80 * dir, 60);
    slash.setDepth(20);

    // Slash trail
    const trail = this.scene.add.graphics();
    trail.fillStyle(slashColor, 0.3);
    trail.fillRect(sx - 10 * dir, sy - 25, 100 * dir, 50);
    trail.setDepth(18);
    this.scene.tweens.add({
      targets: trail,
      x: trail.x + 20 * dir,
      alpha: 0,
      duration: 250,
      onComplete: () => trail.destroy(),
    });

    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      duration: 300,
      onComplete: () => slash.destroy(),
    });

    this.spawnHitSpark(sx + 40 * dir, sy, slashColor);
  }

  private groundSlam() {
    this.setAttacking(800);
    const scene = this.scene;
    scene.cameras.main.shake(400, 0.012);

    // Dust burst
    const dust = scene.add.graphics();
    dust.fillStyle(0x888888, 0.3);
    dust.fillCircle(this.x, this.y + 30, 15);
    dust.setDepth(17);
    scene.tweens.add({
      targets: dust,
      scaleX: 5,
      scaleY: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => dust.destroy(),
    });

    // Impact ring
    const impact = scene.add.graphics();
    impact.lineStyle(3, 0xff6600, 0.9);
    impact.strokeCircle(this.x, this.y, 5);
    impact.setDepth(19);
    scene.tweens.add({
      targets: impact,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 400,
      onComplete: () => impact.destroy(),
    });

    // Shockwave rings
    for (let i = 0; i < 3; i++) {
      const ring = scene.add.graphics();
      const alpha = 0.6 - i * 0.15;
      ring.lineStyle(4 - i, 0xcc0000, alpha);
      ring.strokeCircle(this.x, this.y, 10);
      ring.setDepth(18);

      scene.tweens.add({
        targets: ring,
        scaleX: 6 + i * 2,
        scaleY: 2 + i,
        alpha: 0,
        duration: 600 + i * 200,
        delay: i * 150,
        ease: 'Power2',
        onComplete: () => ring.destroy(),
      });
    }

    // Debris particles
    for (let i = 0; i < 5; i++) {
      const debris = scene.add.graphics();
      debris.fillStyle(0x665544, 0.7);
      debris.fillRect(0, 0, Phaser.Math.Between(3, 6), Phaser.Math.Between(2, 4));
      debris.setPosition(this.x + Phaser.Math.Between(-30, 30), this.y);
      debris.setDepth(16);
      scene.tweens.add({
        targets: debris,
        x: debris.x + Phaser.Math.Between(-80, 80),
        y: debris.y - Phaser.Math.Between(30, 60),
        alpha: 0,
        rotation: Phaser.Math.Between(-3, 3),
        duration: Phaser.Math.Between(300, 600),
        onComplete: () => debris.destroy(),
      });
    }

    scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.5, type: 'aoe', radius: 120 });
  }

  private projectileBarrage() {
    this.setAttacking(1000);
    const count = this.phase >= 3 ? 8 : 5;
    const projColor = this.config.id === 'blind_king' ? 0x9b59b6
      : this.config.id === 'saint_of_rot' ? 0x4a7c3f
      : this.config.id === 'fallen_guardian' ? 0x6eb5d4
      : 0x8b0000;
    const glowColor = this.config.id === 'blind_king' ? 0xbb77dd
      : this.config.id === 'saint_of_rot' ? 0x6a9c5f
      : this.config.id === 'fallen_guardian' ? 0x8ecfe0
      : 0xff4444;

    for (let i = 0; i < count; i++) {
      const angle = this.flipX
        ? Math.PI + (i / count) * Math.PI - Math.PI / 2
        : (i / count) * Math.PI - Math.PI / 2;

      const proj = this.scene.add.graphics();
      // Outer glow
      proj.fillStyle(glowColor, 0.25);
      proj.fillCircle(0, 0, 14);
      // Main body
      proj.fillStyle(projColor, 0.9);
      proj.fillCircle(0, 0, 8);
      // Core
      proj.fillStyle(glowColor, 0.7);
      proj.fillCircle(0, 0, 4);
      proj.setPosition(this.x, this.y);
      proj.setDepth(15);

      const speed = 180 + this.phase * 30;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Trail
      const trail = this.scene.add.graphics();
      trail.fillStyle(projColor, 0.15);
      trail.fillCircle(0, 0, 6);
      trail.setPosition(this.x, this.y);
      trail.setDepth(14);

      let traveled = 0;
      let trailTick = 0;
      const timer = this.scene.time.addEvent({
        delay: 16,
        loop: true,
        callback: () => {
          if (!proj.active) { timer.remove(); return; }
          proj.x += vx * 0.016;
          proj.y += vy * 0.016;
          traveled += speed * 0.016;

          trailTick++;
          if (trailTick % 3 === 0) {
            trail.setPosition(proj.x, proj.y);
            trail.setAlpha(0.2);
            this.scene.tweens.add({
              targets: trail,
              alpha: 0,
              scaleX: 0.3,
              scaleY: 0.3,
              duration: 300,
            });
          }

          if (this.target && this.target.active) {
            const dist = Phaser.Math.Distance.Between(proj.x, proj.y, this.target.x, this.target.y);
            if (dist < 30) {
              this.scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.8 });
              this.spawnHitSpark(proj.x, proj.y, projColor, 4);
              proj.destroy();
              timer.remove();
              return;
            }
          }

          if (traveled > 400 || proj.y > this.scene.physics.world.bounds.height) {
            proj.destroy();
            timer.remove();
          }
        },
      });
      this.activeTimers.push(timer);
    }
  }

  private chargeAttack() {
    this.setAttacking(1000);
    if (!this.target) return;

    const dx = this.target.x - this.x;
    const dir = dx > 0 ? 1 : -1;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);
    this.setTint(0xff8800);

    // Charge wind-up particles
    const chargeFx = this.scene.add.graphics();
    const chargeColor = this.config.id === 'fallen_guardian' ? 0x6eb5d4 : 0xff8800;
    chargeFx.fillStyle(chargeColor, 0.3);
    chargeFx.fillCircle(this.x + dir * 30, this.y, 20);
    chargeFx.setDepth(18);

    this.scene.tweens.add({
      targets: chargeFx,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0.5,
      duration: 400,
      yoyo: true,
      onComplete: () => chargeFx.destroy(),
    });

    const t1 = this.scene.time.delayedCall(500, () => {
      if (this.isDead) return;
      this.clearTint();
      body.setVelocityX(dx > 0 ? 600 : -600);
      this.scene.cameras.main.shake(200, 0.01);

      // Speed lines
      const lines = this.scene.add.graphics();
      lines.lineStyle(2, chargeColor, 0.4);
      for (let i = 0; i < 3; i++) {
        const ly = this.y + Phaser.Math.Between(-30, 30);
        lines.lineBetween(this.x - dir * 20, ly, this.x - dir * 80, ly + Phaser.Math.Between(-10, 10));
      }
      lines.setDepth(17);
      this.scene.tweens.add({
        targets: lines,
        alpha: 0,
        duration: 300,
        onComplete: () => lines.destroy(),
      });

      const t2 = this.scene.time.delayedCall(400, () => {
        if (this.isDead) return;
        body.setVelocityX(0);
        this.scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 2, type: 'charge' });
        this.spawnHitSpark(this.x + dir * 40, this.y, chargeColor, 8);
      });
      this.activeTimers.push(t2);
    });
    this.activeTimers.push(t1);
  }

  private darkExplosion() {
    this.setAttacking(1500);
    const scene = this.scene;
    scene.cameras.main.shake(500, 0.015);
    scene.cameras.main.flash(150, 80, 0, 0);

    const color = this.config.id === 'blind_king' ? 0x4b0082 : 0x1a0030;
    const brightColor = this.config.id === 'blind_king' ? 0x9b59b6 : 0x4b0082;

    // Inner core flash
    const core = scene.add.graphics();
    core.fillStyle(0xffffff, 0.9);
    core.fillCircle(this.x, this.y, 10);
    core.setDepth(23);
    scene.tweens.add({
      targets: core,
      alpha: 0,
      scaleX: 3,
      scaleY: 3,
      duration: 200,
      onComplete: () => core.destroy(),
    });

    // Outer burst
    const burst = scene.add.graphics();
    burst.fillStyle(color, 0.9);
    burst.fillCircle(this.x, this.y, 20);
    burst.setDepth(22);

    scene.tweens.add({
      targets: burst,
      scaleX: 10,
      scaleY: 10,
      alpha: 0,
      duration: 800,
      ease: 'Power3',
      onComplete: () => burst.destroy(),
    });

    // Glow ring
    const ring = scene.add.graphics();
    ring.lineStyle(4, brightColor, 0.5);
    ring.strokeCircle(this.x, this.y, 15);
    ring.setDepth(21);
    scene.tweens.add({
      targets: ring,
      scaleX: 7,
      scaleY: 7,
      alpha: 0,
      duration: 600,
      onComplete: () => ring.destroy(),
    });

    // Tendrils
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const tendril = scene.add.graphics();
      tendril.lineStyle(6, brightColor, 0.8);
      tendril.lineBetween(0, 0, Math.cos(angle) * 150, Math.sin(angle) * 150);
      tendril.setPosition(this.x, this.y);
      tendril.setDepth(20);

      scene.tweens.add({
        targets: tendril,
        scaleX: 1.5,
        alpha: 0,
        duration: 600,
        delay: i * 40,
        onComplete: () => tendril.destroy(),
      });
    }

    // Sparks
    this.spawnHitSpark(this.x, this.y, brightColor, 10);

    scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 2.5, type: 'aoe', radius: 200 });
  }

  private checkPhaseTransition() {
    const pct = this.hp / this.config.maxHp;

    if (this.config.phases >= 2 && pct <= 0.5 && this.phase === 1) {
      this.triggerPhaseTransition(2);
    } else if (this.config.phases >= 3 && pct <= 0.25 && this.phase === 2) {
      this.triggerPhaseTransition(3);
    } else if (pct <= 0.1 && !this.enrageMode) {
      this.enrageMode = true;
      this.aiState = 'enrage';
    }
  }

  private triggerPhaseTransition(newPhase: number) {
    if (this.phaseTransitioning) return;
    this.phaseTransitioning = true;
    this.phase = newPhase;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);

    this.scene.cameras.main.shake(600, 0.015);
    this.scene.cameras.main.flash(300, 100, 0, 0);

    const baseScaleVal = this.config.scale || 3.5;
    const nextMultiplier = newPhase === 2 ? 1.2 : 1.4;
    const targetScale = baseScaleVal * nextMultiplier;

    this.scene.tweens.add({
      targets: this,
      scaleX: targetScale * 1.3,
      scaleY: targetScale * 1.3,
      duration: 400,
      yoyo: true,
      ease: 'Power2',
      onComplete: () => {
        this.phaseTransitioning = false;
        this.aiState = newPhase === 2 ? 'phase2' : 'phase3';
        this.phaseScaleMultiplier = nextMultiplier;
        
        // Update body size to match new visual scale
        const bw = 48 * nextMultiplier;
        const bh = 64 * nextMultiplier;
        body.setSize(bw, bh);
        const tex = this.texture.get();
        body.setOffset((tex.width - bw) / 2, tex.height - bh);
      },
    });

    const txt = this.scene.add.text(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height / 2,
      `— PHASE ${newPhase} —`,
      {
        fontSize: '20px',
        fontFamily: 'Cinzel, serif',
        color: '#ff0000',
        stroke: '#000',
        strokeThickness: 5,
      }
    );
    txt.setScrollFactor(0);
    txt.setDepth(100);
    txt.setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      alpha: 0,
      duration: 1500,
      delay: 800,
      onComplete: () => txt.destroy(),
    });

    useGameStore.getState().setBoss({
      ...useGameStore.getState().activeBoss!,
      phase: newPhase,
    });
  }

  private isInvulnerable = false;

  takeDamage(amount: number): boolean {
    if (this.isDead || this.phaseTransitioning || this.isInvulnerable) return false;

    const isAshen = this.config.id === 'ashen_knight';
    
    // ── FINAL BOSS CINEMATIC PHASE TRANSITIONS ────────────────
    if (isAshen) {
      if (this.phase === 1 && this.hp - amount <= this.maxHp * 0.2) {
        this.hp = Math.floor(this.maxHp * 0.2);
        this.triggerAshenPhaseShift(2);
        return false;
      }
      if (this.phase === 2 && this.hp - amount <= this.maxHp * 0.1) {
        this.hp = Math.floor(this.maxHp * 0.1);
        this.triggerAshenPhaseShift(3);
        return false;
      }
    }

    this.hp = Math.max(0, this.hp - amount);
    useGameStore.getState().damageBoss(amount);

    this.setTint(0xff4444);
    this.scene.time.delayedCall(100, () => {
      if (!this.isDead) this.clearTint();
    });

    if (this.scene.cache.audio.exists('sfx_ds_boss_pain')) {
      this.scene.sound.play('sfx_ds_boss_pain', { volume: 0.5, rate: 0.9 + Math.random() * 0.2 });
    }

    const txt = this.scene.add.text(
      this.x + Phaser.Math.Between(-20, 20),
      this.y - 40,
      `-${amount}`,
      {
        fontSize: '14px',
        fontFamily: 'Cinzel, serif',
        color: '#ffd700',
        stroke: '#000',
        strokeThickness: 3,
      }
    );
    txt.setDepth(30);
    txt.setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: txt.y - 50,
      alpha: 0,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => txt.destroy(),
    });

    useGameStore.getState().chargeUltimate(5);

    if (this.hp <= 0) {
      this.die();
      return true;
    }

    return false;
  }

  private die() {
    this.isDead = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setVelocityX(0);
      body.enable = false;
    }

    this.scene.cameras.main.shake(1000, 0.02);
    this.scene.cameras.main.flash(500, 255, 100, 0);

    for (let i = 0; i < 8; i++) {
      const t = this.scene.time.delayedCall(i * 150, () => {
        if (!this.scene) return;
        const ex = this.scene.add.graphics();
        ex.fillStyle(0x8b0000, 0.8);
        ex.fillCircle(0, 0, 30);
        ex.fillStyle(0xff6600, 0.6);
        ex.fillCircle(0, 0, 20);
        ex.setPosition(
          this.x + Phaser.Math.Between(-50, 50),
          this.y + Phaser.Math.Between(-50, 50)
        );
        ex.setDepth(25);

        this.scene.tweens.add({
          targets: ex,
          scaleX: 3,
          scaleY: 3,
          alpha: 0,
          duration: 500,
          onComplete: () => ex.destroy(),
        });
      });
      this.activeTimers.push(t);
    }

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 1500,
      delay: 800,
      ease: 'Power3',
      onComplete: () => {
        useGameStore.getState().setBoss(null);
        this.scene.events.emit('boss-died', { bossId: this.config.id });
        this.destroy();
      },
    });
  }

  private triggerAshenPhaseShift(newPhase: number) {
    if (this.phase >= newPhase) return;
    this.isInvulnerable = true;
    this.phaseTransitioning = true;
    this.phase = newPhase;
    const scene = this.scene;
    const store = useGameStore.getState();

    // Visual feedback
    this.setTint(0xffffff);
    scene.cameras.main.shake(800, 0.015);
    scene.cameras.main.flash(500, 255, 255, 255);

    const alertTitle = newPhase === 2 ? 'PHASE II: UNYIELDING WILL' : 'PHASE III: ASHEN ASCENSION';
    const alertMsg = newPhase === 2 
      ? 'The Knight refuses to fall! Power is surging...' 
      : 'THE END IS NEAR! The ground trembles...';

    store.addNotification({
      type: 'warning',
      title: alertTitle,
      message: alertMsg,
      icon: '🔥',
      duration: 4000,
    });

    scene.time.delayedCall(3000, () => {
      this.isInvulnerable = false;
      this.phaseTransitioning = false;
      this.clearTint();

      if (newPhase === 2) {
        this.maxHp = 2500;
        this.hp = 2500;
        this.config.attack += 20;
        this.config.speed += 30;
        this.phaseScaleMultiplier = 1.3;
      } else if (newPhase === 3) {
        this.maxHp = 2000;
        this.hp = 2000;
        this.config.attack += 25;
        this.config.speed += 40;
        this.phaseScaleMultiplier = 2.0; // 2x Lipat!
        
        // Final form dramatic scale
        scene.tweens.add({
          targets: this,
          scaleX: (this.config.scale || 3.5) * 2.5, // Visual flash peak
          scaleY: (this.config.scale || 3.5) * 2.5,
          duration: 1200,
          yoyo: true,
          ease: 'Cubic.easeInOut'
        });
      }

      // Update body size for the new massive scale
      const body = this.body as Phaser.Physics.Arcade.Body;
      const bw = 48 * this.phaseScaleMultiplier;
      const bh = 64 * this.phaseScaleMultiplier;
      body.setSize(bw, bh);
      const tex = this.texture.get();
      body.setOffset((tex.width - bw) / 2, tex.height - bh);

      store.setBoss({
        id: this.config.id,
        name: this.config.name,
        title: this.config.title,
        hp: this.hp,
        maxHp: this.maxHp,
        phase: this.phase,
        maxPhase: this.config.phases,
        isActive: true,
      });
    });
  }

  getHP(): number { return this.hp; }
  getMaxHP(): number { return this.maxHp; }
  isAlive(): boolean { return !this.isDead; }
  getPhase(): number { return this.phase; }

  destroy(fromScene?: boolean) {
    this.isDead = true;
    this.activeTimers.forEach(t => t.remove());
    this.activeTimers = [];
    if (this.projectiles) {
      this.projectiles.clear(true, true);
    }
    this.scene.tweens.killTweensOf(this);
    super.destroy(fromScene);
  }
}
