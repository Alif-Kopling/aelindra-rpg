import Phaser from 'phaser';
import { useGameStore } from '../store/gameStore';

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
  private phaseTransitioning = false;
  private introComplete = false;
  private enrageMode = false;
  private timeAccumulator = 0;
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
    body.setSize(48, 64);
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(200, 600);
    body.setImmovable(false);

    const scale = config.scale || 2.5;
    if (scene.textures.exists(spriteKey)) {
      this.setDisplaySize(64 * scale, 80 * scale);
    } else {
      this.setScale(scale);
    }
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

      const baseScale = this.config.scale || 2.5;
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
    this.moveHorizontally(80);

    if (this.attackTimer <= 0) {
      this.attackTimer = 2000;
      this.basicAttack();
    }

    if (this.specialTimer <= 0) {
      this.specialTimer = 6000;
      this.groundSlam();
    }
  }

  private phase2AI(_delta: number) {
    if (!this.target) return;
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

  private summonMinions() {
    const scene = this.scene;
    // Roar audio
    if (scene.cache.audio.exists('boss_roar')) {
      scene.sound.play('boss_roar', { volume: 0.8 });
    }

    // Summon 3 Ashen Soldiers at random positions
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(50, this.arenaRight - 50);
      scene.events.emit('boss-summon-minion', { x, y: this.y });
    }
  }

  private phase3AI(_delta: number) {
    if (!this.target) return;
    const isAshen = this.config.id === 'ashen_knight';
    this.moveHorizontally(isAshen ? 180 : 150);

    if (this.attackTimer <= 0) {
      const roll = Math.random();
      if (isAshen) {
        this.attackTimer = 600;
        if (roll < 0.15) this.voidTeleport();
        else if (roll < 0.3) this.ashenStorm();
        else if (roll < 0.45) this.swordRain();
        else if (roll < 0.6) this.summonMinions();
        else if (roll < 0.75) this.darkWave();
        else this.projectileBarrage();
      } else {
        if (roll < 0.25) {
          this.attackTimer = 800;
          this.basicAttack();
        } else if (roll < 0.5) {
          this.attackTimer = 1200;
          this.projectileBarrage();
        } else if (roll < 0.75) {
          this.attackTimer = 1500;
          this.darkWave();
        } else {
          this.attackTimer = 2000;
          this.voidTeleport();
        }
      }
    }

    if (this.specialTimer <= 0) {
      this.specialTimer = isAshen ? 2200 : 3500;
      this.darkExplosion();
    }
  }

  private swordRain() {
    const scene = this.scene;
    // Roar audio
    if (scene.cache.audio.exists('boss_roar')) {
      scene.sound.play('boss_roar', { volume: 0.6 });
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
      if (roll < 0.4) this.basicAttack();
      else if (roll < 0.7) this.chargeAttack();
      else this.voidTeleport();
    }
    
    if (this.specialTimer <= 0) {
      this.specialTimer = 2500;
      Math.random() < 0.5 ? this.groundSlam() : this.darkWave();
    }
  }

  private darkWave() {
    const dir = this.flipX ? -1 : 1;
    const scene = this.scene;
    
    for (let i = 0; i < 3; i++) {
      const t = scene.time.delayedCall(i * 200, () => {
        const wave = scene.add.graphics();
        wave.lineStyle(4, 0x4b0082, 1);
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
                wave.destroy();
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
    
    // Dissolve effect
    scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      duration: 300,
      onComplete: () => {
        // Teleport to player side
        const side = Math.random() < 0.5 ? -120 : 120;
        this.x = Phaser.Math.Clamp(this.target!.x + side, this.arenaLeft + 50, this.arenaRight - 50);
        
        scene.tweens.add({
          targets: this,
          alpha: 1,
          scaleX: this.config.scale || 2.5,
          duration: 300,
          onComplete: () => {
            this.basicAttack();
          }
        });
      }
    });
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

  private basicAttack() {
    if (!this.target) return;
    this.scene.events.emit('boss-attack', { boss: this, damage: this.config.attack, type: 'melee' });

    const slash = this.scene.add.graphics();
    slash.fillStyle(0x8b0000, 0.7);
    const direction = this.flipX ? -1 : 1;
    slash.fillRect(this.x + direction * 20, this.y - 30, 80 * direction, 60);
    slash.setDepth(20);

    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      duration: 300,
      onComplete: () => slash.destroy(),
    });
  }

  private groundSlam() {
    const scene = this.scene;
    scene.cameras.main.shake(400, 0.012);

    for (let i = 0; i < 3; i++) {
      const ring = scene.add.graphics();
      ring.lineStyle(4, 0xcc0000, 0.8);
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

    scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 1.5, type: 'aoe', radius: 120 });
  }

  private projectileBarrage() {
    const count = this.phase >= 3 ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const angle = this.flipX
        ? Math.PI + (i / count) * Math.PI - Math.PI / 2
        : (i / count) * Math.PI - Math.PI / 2;
      const proj = this.scene.add.graphics();
      proj.fillStyle(0x8b0000);
      proj.fillCircle(0, 0, 8);
      proj.fillStyle(0xff4444, 0.6);
      proj.fillCircle(0, 0, 5);
      proj.setPosition(this.x, this.y);
      proj.setDepth(15);

      const speed = 180 + this.phase * 30;
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
              this.scene.events.emit('boss-projectile-hit', { damage: this.config.attack * 0.8 });
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
    if (!this.target) return;

    const dx = this.target.x - this.x;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);
    this.setTint(0xff8800);

    const t1 = this.scene.time.delayedCall(500, () => {
      if (this.isDead) return;
      this.clearTint();
      body.setVelocityX(dx > 0 ? 600 : -600);
      this.scene.cameras.main.shake(200, 0.01);

      const t2 = this.scene.time.delayedCall(400, () => {
        if (this.isDead) return;
        body.setVelocityX(0);
        this.scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 2, type: 'charge' });
      });
      this.activeTimers.push(t2);
    });
    this.activeTimers.push(t1);
  }

  private darkExplosion() {
    this.scene.cameras.main.shake(500, 0.015);
    this.scene.cameras.main.flash(150, 80, 0, 0);

    const burst = this.scene.add.graphics();
    burst.fillStyle(0x1a0030, 0.9);
    burst.fillCircle(this.x, this.y, 20);
    burst.setDepth(22);

    this.scene.tweens.add({
      targets: burst,
      scaleX: 10,
      scaleY: 10,
      alpha: 0,
      duration: 800,
      ease: 'Power3',
      onComplete: () => burst.destroy(),
    });

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const tendril = this.scene.add.graphics();
      tendril.lineStyle(6, 0x4b0082, 0.8);
      tendril.lineBetween(0, 0, Math.cos(angle) * 150, Math.sin(angle) * 150);
      tendril.setPosition(this.x, this.y);
      tendril.setDepth(20);

      this.scene.tweens.add({
        targets: tendril,
        scaleX: 1.5,
        alpha: 0,
        duration: 600,
        delay: i * 40,
        onComplete: () => tendril.destroy(),
      });
    }

    this.scene.events.emit('boss-attack', { boss: this, damage: this.config.attack * 2.5, type: 'aoe', radius: 200 });
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

    this.scene.tweens.add({
      targets: this,
      scaleX: 3.5,
      scaleY: 3.5,
      duration: 300,
      yoyo: true,
      ease: 'Power2',
      onComplete: () => {
        this.phaseTransitioning = false;
        this.aiState = newPhase === 2 ? 'phase2' : 'phase3';
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
      } else if (newPhase === 3) {
        this.maxHp = 2000;
        this.hp = 2000;
        this.config.attack += 25;
        this.config.speed += 40;
        
        // Increase scale for final form
        scene.tweens.add({
          targets: this,
          scaleX: (this.config.scale || 2.5) * 1.35,
          scaleY: (this.config.scale || 2.5) * 1.35,
          duration: 1200,
          ease: 'Cubic.easeInOut'
        });
      }

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
