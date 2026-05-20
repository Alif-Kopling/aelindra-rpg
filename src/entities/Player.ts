import Phaser from 'phaser';
import { useGameStore } from '../store/gameStore';
import {
  DASH_COOLDOWN,
  DASH_DURATION,
  DASH_SPEED,
  COMBO_TIMEOUT,
  INVINCIBILITY_FRAMES,
  COLORS,
} from '../utils/constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private keys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    Space: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    L: Phaser.Input.Keyboard.Key;
  };

  private attackKey!: Phaser.Input.Pointer;
  private isDashing = false;
  private dashCooldown = 0;
  private dashTimer = 0;
  private dashDirX = 1;
  private isAttacking = false;
  private attackCooldown = 0;
  private comboCount = 0;
  private lastComboTime = 0;
  private invincibleTimer = 0;
  private staminaRegenTimer = 0;
  private currentFrame = 0;
  private frameTimer = 0;
  private currentAnim = 'idle';
  private facingRight = true;
  private attackHitbox!: Phaser.GameObjects.Sprite;
  private ultimateCharge = 0;
  private isUltimate = false;
  private ultimateCooldown = 0;
  private timeAccumulator = 0;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private isOnGround = false;
  private footstepTimer = 0;

  private moveSpeed = 180;
  private jumpForce = -420;
  private coyoteTime = 100;
  private jumpBufferTime = 120;

  private isCharging = false;
  private chargeTime = 0;
  private readonly CHARGE_THRESHOLD = 400;
  private isChargedAttack = false;
  private chargeGraphic!: Phaser.GameObjects.Graphics;
  private cachedBaseScaleX = 2;
  private cachedBaseScaleY = 2;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, scene.textures.exists('player_sprite') ? 'player_sprite' : 'player_idle_0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(20, 36);
    body.setOffset(6, 10);
    body.setMaxVelocity(200, 600);
    body.setCollideWorldBounds(true);

    this.setScale(2);
    this.setDepth(10);

    if (scene.textures.exists('player_sprite')) {
      const tex = scene.textures.get('player_sprite');
      const srcW = tex.getSourceImage().width;
      const srcH = tex.getSourceImage().height;
      this.cachedBaseScaleX = 64 / srcW;
      this.cachedBaseScaleY = 96 / srcH;
    }

    this.chargeGraphic = scene.add.graphics();
    this.chargeGraphic.setDepth(12);

    this.setupControls();
    this.createAnimations();
    this.createAttackHitbox();
  }

  private setupControls() {
    const kbd = this.scene.input.keyboard!;
    this.keys = {
      W: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      Space: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      E: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      L: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.L),
    };
  }

  private createAnimations() {}

  private createAttackHitbox() {
    this.attackHitbox = this.scene.add.sprite(this.x + 40, this.y, 'pixel');
    this.attackHitbox.setDisplaySize(60, 50);
    this.attackHitbox.setVisible(false);
    this.scene.physics.add.existing(this.attackHitbox);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
  }

  isAttackCharged(): boolean {
    return this.isChargedAttack;
  }

  update(delta: number) {
    const store = useGameStore.getState();
    if (store.dialogue.isOpen || store.isPaused) {
      this.setVelocityX(0);
      if ((this.body as Phaser.Physics.Arcade.Body).velocity.y < 0) {
        (this.body as Phaser.Physics.Arcade.Body).setVelocityY(0);
      }
      this.clearCharge();
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    const stats = store.player.stats;

    this.dashCooldown = Math.max(0, this.dashCooldown - delta);
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.invincibleTimer = Math.max(0, this.invincibleTimer - delta);
    this.staminaRegenTimer += delta;
    this.ultimateCooldown = Math.max(0, this.ultimateCooldown - delta);
    this.frameTimer += delta;

    this.isOnGround = body.blocked.down || body.touching.down;

    if (this.isOnGround) {
      this.coyoteTimer = this.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    if (Date.now() - this.lastComboTime > COMBO_TIMEOUT && this.comboCount > 0) {
      this.comboCount = 0;
      store.resetCombo();
    }

    if (this.staminaRegenTimer > 200 && stats.stamina < stats.maxStamina) {
      store.restoreStamina(2);
      this.staminaRegenTimer = 0;
    }

    if (this.isDashing) {
      this.dashTimer -= delta;
      body.setVelocityX(this.dashDirX * DASH_SPEED);
      body.setVelocityY(0);
      body.allowGravity = false;
      this.setAlpha(0.7);
      this.updateFrame('dash', delta);
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        body.allowGravity = true;
        store.setPlayerDashing(false);
        this.setAlpha(1);
      }
      this.updateAttackHitbox();
      this.clearCharge();
      return;
    }

    // ── CHARGE / ATTACK SYSTEM ──────────────────────────────────

    const pointer = this.scene.input.activePointer;
    const attackHeld = pointer.isDown || this.keys.L.isDown;

    if (attackHeld && !this.isAttacking && this.attackCooldown <= 0 && !this.isUltimate) {
      if (!this.isCharging && !this.isAttacking) {
        this.isCharging = true;
        this.chargeTime = 0;
      }
    }

    if (this.isCharging) {
      this.chargeTime += delta;
      this.updateChargeVisual();
      body.setVelocityX(body.velocity.x * 0.7);

      if (this.chargeTime >= this.CHARGE_THRESHOLD) {
        this.spawnChargeReadyEffect();
      }

      if (!attackHeld) {
        this.isCharging = false;
        this.clearChargeVisual();

        if (this.chargeTime >= this.CHARGE_THRESHOLD && stats.stamina >= 20) {
          this.performChargedAttack(store);
        } else if (stats.stamina >= 8) {
          this.performAttack(store);
        }
      }
    }

    // ── MOVEMENT ────────────────────────────────────────────────
    let vx = 0;

    if (!this.isCharging) {
      if (this.keys.A.isDown) { vx = -this.moveSpeed; this.facingRight = false; }
      else if (this.keys.D.isDown) { vx = this.moveSpeed; this.facingRight = true; }
    }

    body.setVelocityX(vx);
    const isCustomTexture = ['player_sprite', 'player_attack1', 'player_attack2'].includes(this.texture.key);
    if (isCustomTexture) {
      this.setFlipX(this.facingRight);
    } else {
      this.setFlipX(!this.facingRight);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.W) || Phaser.Input.Keyboard.JustDown(this.keys.Space)) {
      this.jumpBufferTimer = this.jumpBufferTime;
    }
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && !this.isDashing) {
      body.setVelocityY(this.jumpForce);
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }

    if (this.keys.W.isUp && !this.keys.Space.isDown && body.velocity.y < -100) {
      body.setVelocityY(body.velocity.y * 0.5);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.Space) &&
        this.dashCooldown <= 0 &&
        stats.stamina >= 20 && vx !== 0 && !this.isDashing) {
      this.startDash(vx, store);
    }

    if (this.scene.input.activePointer.rightButtonDown() &&
        this.ultimateCharge >= 100 &&
        this.ultimateCooldown <= 0) {
      this.performUltimate(store);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.E)) {
      this.checkInteraction(store);
    }

    // ── ANIMATION ───────────────────────────────────────────────
    if (this.isCharging && !this.isAttacking) {
      this.updateFrame('charge', delta);
    } else if (this.isAttacking) {
      this.updateFrame('attack', delta);
    } else if (vx !== 0 && this.isOnGround) {
      this.updateFrame('run', delta);
      this.footstepTimer += delta;
      if (this.footstepTimer > 280) {
        this.footstepTimer = 0;
        this.playFootstep();
        this.spawnRunDust();
      }
    } else if (!this.isOnGround) {
      this.updateFrame('jump', delta);
    } else {
      this.updateFrame('idle', delta);
    }

    this.updateAttackHitbox();

    if (vx !== 0 && this.isOnGround) {
      this.ultimateCharge = Math.min(100, this.ultimateCharge + 0.003 * delta);
      store.chargeUltimate(0.003 * delta);
    }
    this.ultimateCharge = store.player.ultimateCharge;

    // Lock physics body size and offset to prevent clipping through platforms at all times (including attacks)
    const targetBodyW = 40;
    const targetBodyH = 72;

    const texInfo: Record<string, { sourceW: number; centerX: number; centerY: number }> = {
      player_sprite: { sourceW: 500, centerX: 279, centerY: 260 },
      player_attack1: { sourceW: 677, centerX: 236, centerY: 207 },
      player_attack2: { sourceW: 677, centerX: 275, centerY: 183 }
    };

    if (isCustomTexture) {
      const info = texInfo[this.texture.key] || { sourceW: 500, centerX: 279, centerY: 260 };
      const isFlipped = this.flipX;
      const visualCenterX = isFlipped 
        ? (info.sourceW - info.centerX) * this.scaleX 
        : info.centerX * this.scaleX;
      
      const targetOffsetX = visualCenterX - (targetBodyW / 2);
      const targetOffsetY = (info.centerY * this.scaleY) - (targetBodyH / 2);

      body.setSize(targetBodyW / this.scaleX, targetBodyH / this.scaleY);
      body.setOffset(targetOffsetX / this.scaleX, targetOffsetY / this.scaleY);
    } else {
      // Fallback for procedural texture
      const baseW = this.width * this.cachedBaseScaleX;
      const defaultOffset = 12;
      const flippedOffset = baseW - targetBodyW - defaultOffset;
      const targetOffsetX = (!this.facingRight) ? defaultOffset : flippedOffset;
      const targetOffsetY = 20;

      body.setSize(targetBodyW / this.cachedBaseScaleX, targetBodyH / this.cachedBaseScaleY);
      body.setOffset(targetOffsetX / this.cachedBaseScaleX, targetOffsetY / this.cachedBaseScaleY);
    }
  }

  // ── CHARGE VISUALS ────────────────────────────────────────────

  private updateChargeVisual() {
    this.chargeGraphic.clear();

    const progress = Math.min(1, this.chargeTime / this.CHARGE_THRESHOLD);
    const radius = 10 + progress * 15;
    const alpha = 0.2 + progress * 0.4;
    const color = progress >= 1 ? 0xffd700 : 0xffffff;

    this.chargeGraphic.lineStyle(2 + progress * 2, color, alpha);
    this.chargeGraphic.strokeCircle(this.x, this.y, radius);

    this.chargeGraphic.fillStyle(color, alpha * 0.15);
    this.chargeGraphic.fillCircle(this.x, this.y, radius);
  }

  private clearChargeVisual() {
    this.chargeGraphic.clear();
  }

  private spawnChargeReadyEffect() {
    const ring = this.scene.add.graphics();
    ring.lineStyle(3, 0xffd700, 0.9);
    ring.strokeCircle(this.x, this.y, 20);
    ring.setDepth(12);

    this.scene.tweens.add({
      targets: ring,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });

    this.setTint(0xffffff);
    this.scene.time.delayedCall(50, () => this.clearTint());
  }

  private clearCharge() {
    if (this.isCharging) {
      this.isCharging = false;
      this.chargeTime = 0;
      this.clearChargeVisual();
    }
  }

  private playSlashSound() {
    const keys = ['sfx_slash_1', 'sfx_slash_2', 'sfx_slash_3', 'sfx_slash_4'];
    const pick = keys[Math.floor(Math.random() * keys.length)];
    if (this.scene.cache.audio.exists(pick)) {
      this.scene.sound.play(pick, { volume: 0.5 });
    }
  }

  private playFootstep() {
    if (this.scene.cache.audio.exists('sfx_footstep')) {
      this.scene.sound.play('sfx_footstep', { volume: 0.15, rate: 0.8 + Math.random() * 0.4 });
    }
  }

  private spawnRunDust() {
    const dir = this.facingRight ? -1 : 1;
    const g = this.scene.add.graphics();
    g.fillStyle(0x888888, 0.25 + Math.random() * 0.2);
    g.fillCircle(0, 0, 2 + Math.random() * 2);
    g.setPosition(this.x + dir * 10, this.y + 16);
    g.setDepth(5);
    this.scene.tweens.add({
      targets: g,
      x: g.x + dir * Phaser.Math.Between(8, 20),
      y: g.y + Phaser.Math.Between(-4, 4),
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300 + Math.random() * 200,
      onComplete: () => g.destroy(),
    });
  }

  private performChargedAttack(store: ReturnType<typeof useGameStore.getState>) {
    this.isChargedAttack = true;
    this.isAttacking = true;
    this.currentFrame = 0;
    this.currentAnim = 'attack';
    this.frameTimer = 0;
    this.attackCooldown = 600;

    store.drainStamina(20);
    store.setPlayerAttacking(true);

    this.comboCount = Math.min(this.comboCount + 1, 5);
    this.lastComboTime = Date.now();
    store.incrementCombo();

    if (this.scene.cache.audio.exists('sfx_critical')) {
      this.scene.sound.play('sfx_critical', { volume: 0.7 });
    }
    this.playSlashSound();

    const body = this.body as Phaser.Physics.Arcade.Body;
    const dir = this.facingRight ? 1 : -1;

    body.setVelocityX(dir * 300);
    body.setVelocityY(-100);

    const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hb.enable = true;

    this.scene.time.delayedCall(250, () => {
      hb.enable = false;
    });

    this.scene.cameras.main.shake(200, 0.012);

    this.spawnChargedSlashEffect();

    this.scene.time.delayedCall(800, () => {
      this.isChargedAttack = false;
    });

    this.spawnSelfRecoil();
  }

  private spawnSelfRecoil() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const dir = this.facingRight ? -1 : 1;
    body.setVelocityX(dir * -200);
    body.setVelocityY(-80);

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 0.7,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
    });

    this.setTint(0xff4444);
    this.scene.time.delayedCall(150, () => this.clearTint());
  }

  private spawnChargedSlashEffect() {
    const dir = this.facingRight ? 1 : -1;
    const cx = this.x + dir * 30;
    const cy = this.y;

    const arc = this.scene.add.graphics();
    arc.lineStyle(8, 0xffd700, 1);
    arc.beginPath();
    arc.arc(cx, cy, 50, dir > 0 ? -Math.PI / 2 : Math.PI / 2, dir > 0 ? Math.PI / 2 : -Math.PI / 2, false);
    arc.strokePath();
    arc.setDepth(25);

    this.scene.tweens.add({
      targets: arc,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      onComplete: () => arc.destroy(),
    });

    const burst = this.scene.add.graphics();
    burst.fillStyle(0xffffff, 0.9);
    burst.fillCircle(cx + dir * 40, cy, 12);
    burst.setDepth(26);

    this.scene.tweens.add({
      targets: burst,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 250,
      onComplete: () => burst.destroy(),
    });

    for (let i = 0; i < 8; i++) {
      const spark = this.scene.add.graphics();
      spark.fillStyle(0xffd700, 0.9);
      spark.fillCircle(0, 0, 3);
      spark.setPosition(cx + dir * 20, cy);
      spark.setDepth(25);

      this.scene.tweens.add({
        targets: spark,
        x: spark.x + dir * Phaser.Math.Between(40, 100),
        y: spark.y + Phaser.Math.Between(-40, 40),
        alpha: 0,
        duration: 350,
        delay: i * 30,
        onComplete: () => spark.destroy(),
      });
    }
  }

  // ── FRAME UPDATER ─────────────────────────────────────────────

  private updateFrame(anim: string, delta: number) {
    this.timeAccumulator += delta;

    if (anim !== this.currentAnim) {
      this.currentAnim = anim;
      this.currentFrame = 0;
      this.frameTimer = 0;
    }

    if (anim === 'charge') {
      if (this.scene.textures.exists('player_attack1')) {
        this.setTexture('player_attack1');
      }
      const shake = Math.sin(this.timeAccumulator / 40) * 2;
      this.angle = shake;
      this.scaleX = 1.1;
      this.scaleY = 0.95;
      return;
    }

    if (this.scene.textures.exists('player_sprite')) {
      let targetTexture = 'player_sprite';

      if (anim === 'attack') {
        if (this.currentFrame === 0 && this.scene.textures.exists('player_attack1')) {
          targetTexture = 'player_attack1';
        } else if (this.currentFrame === 1 && this.scene.textures.exists('player_attack2')) {
          targetTexture = 'player_attack2';
        } else if (this.currentFrame >= 2 && this.scene.textures.exists('player_attack1')) {
          targetTexture = 'player_attack1';
        }
      }

      if (this.texture.key !== targetTexture) {
        this.setTexture(targetTexture);
      }

      const isCustomTexture = ['player_sprite', 'player_attack1', 'player_attack2'].includes(targetTexture);

      if (isCustomTexture) {
        // Precise scales calculated to keep the character's bounding box height exactly 72px
        const texScales: Record<string, number> = {
          player_sprite: 0.167, // 72 / 432
          player_attack1: 0.263, // 72 / 274
          player_attack2: 0.216  // 72 / 334
        };
        const baseScale = texScales[targetTexture] || 0.167;

        this.scaleX = baseScale;
        this.scaleY = baseScale;
        this.angle = 0;

        switch (anim) {
          case 'idle':
            // Very subtle idle breathing (uniform to avoid pixel distortion)
            const breathe = Math.sin(this.timeAccumulator / 200) * 0.02;
            this.scaleY = baseScale * (1 + breathe);
            this.scaleX = baseScale * (1 - breathe);
            break;

          case 'run':
            const runPulse = Math.sin(this.timeAccumulator / 60);
            this.scaleY = baseScale * (1 + Math.abs(runPulse) * 0.04);
            this.scaleX = baseScale * (1 - Math.abs(runPulse) * 0.02);
            this.angle = this.facingRight ? 3 : -3;
            break;

          case 'jump':
            this.scaleY = baseScale * 0.95;
            this.scaleX = baseScale * 1.05;
            this.angle = this.facingRight ? -2 : 2;
            break;

          case 'attack':
            // No squash/stretch distortion during keyframed hand-drawn attacks
            this.frameTimer += delta;
            const frameDuration = this.isChargedAttack ? 150 : 120;
            if (this.frameTimer >= frameDuration) {
              this.frameTimer = 0;
              this.currentFrame++;
              if (this.currentFrame >= 3) {
                this.isAttacking = false;
                useGameStore.getState().setPlayerAttacking(false);
                (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
              }
            }
            break;

          case 'dash':
            this.scaleX = baseScale * 1.05;
            this.scaleY = baseScale * 0.95;
            break;
        }
      } else {
        const baseScaleX = this.cachedBaseScaleX;
        const baseScaleY = this.cachedBaseScaleY;

        switch (anim) {
          case 'idle':
            this.scaleY = baseScaleY * (1 + Math.sin(this.timeAccumulator / 200) * 0.08);
            this.scaleX = baseScaleX * (1 - Math.sin(this.timeAccumulator / 200) * 0.03);
            this.angle = 0;
            break;

          case 'run':
            const runPulse = Math.sin(this.timeAccumulator / 60);
            this.scaleY = baseScaleY * (1 + Math.abs(runPulse) * 0.15);
            this.scaleX = baseScaleX * (1 - Math.abs(runPulse) * 0.05);
            this.angle = this.facingRight ? 6 : -6;
            break;

          case 'jump':
            this.scaleY = baseScaleY * 0.9;
            this.scaleX = baseScaleX * 1.1;
            this.angle = this.facingRight ? -5 : 5;
            break;

          case 'attack':
            const comboStep = (this.comboCount - 1) % 3;
            if (this.isChargedAttack) {
              this.scaleX = baseScaleX * 1.6;
              this.scaleY = baseScaleY * 0.7;
              this.angle = this.facingRight ? 20 : -20;
              this.frameTimer += delta;
              if (this.frameTimer >= 150) {
                this.frameTimer = 0;
                this.currentFrame++;
                if (this.currentFrame >= 3) {
                  this.isAttacking = false;
                  useGameStore.getState().setPlayerAttacking(false);
                  (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
                }
              }
            } else {
              if (comboStep === 0) {
                this.scaleX = baseScaleX * 1.35;
                this.scaleY = baseScaleY * 0.8;
                this.angle = this.facingRight ? 15 : -15;
              } else if (comboStep === 1) {
                this.scaleX = baseScaleX * 0.85;
                this.scaleY = baseScaleY * 1.35;
                this.angle = this.facingRight ? -10 : 10;
              } else {
                this.scaleX = baseScaleX * 1.55;
                this.scaleY = baseScaleY * 0.65;
                this.angle = this.facingRight ? 5 : -5;
              }

              this.frameTimer += delta;
              if (this.frameTimer >= 120) {
                this.frameTimer = 0;
                this.currentFrame++;
                if (this.currentFrame >= 3) {
                  this.isAttacking = false;
                  useGameStore.getState().setPlayerAttacking(false);
                  (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
                }
              }
            }
            break;

          case 'dash':
            this.scaleX = baseScaleX * 1.3;
            this.scaleY = baseScaleY * 0.75;
            this.angle = 0;
            break;

          default:
            this.scaleX = baseScaleX;
            this.scaleY = baseScaleY;
            this.angle = 0;
            break;
        }
      }
    }
  }

  private performAttack(store: ReturnType<typeof useGameStore.getState>) {
    if (store.player.stats.stamina < 8) return;

    this.isAttacking = true;
    this.currentFrame = 0;
    this.currentAnim = 'attack';
    this.frameTimer = 0;
    this.attackCooldown = 320;

    store.drainStamina(8);
    store.setPlayerAttacking(true);

    this.comboCount = Math.min(this.comboCount + 1, 5);
    this.lastComboTime = Date.now();
    store.incrementCombo();

    this.playSlashSound();

    const comboStep = (this.comboCount - 1) % 3;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const dir = this.facingRight ? 1 : -1;

    if (comboStep === 0) {
      body.setVelocityX(dir * 180);
    } else if (comboStep === 1) {
      body.setVelocityX(dir * 120);
      body.setVelocityY(-140);
    } else {
      body.setVelocityX(dir * 480);
    }

    const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hb.enable = true;

    this.scene.time.delayedCall(180, () => {
      hb.enable = false;
    });

    if (comboStep === 2) {
      this.scene.cameras.main.shake(120, 0.007);
    } else if (this.comboCount >= 3) {
      this.scene.cameras.main.shake(80, 0.004);
    }

    this.spawnSlashEffect(comboStep);
  }

  private startDash(vx: number, store: ReturnType<typeof useGameStore.getState>) {
    this.isDashing = true;
    this.dashTimer = DASH_DURATION;
    this.dashCooldown = DASH_COOLDOWN;
    this.invincibleTimer = INVINCIBILITY_FRAMES;
    store.setPlayerDashing(true);
    store.drainStamina(20);

    this.dashDirX = vx > 0 ? 1 : -1;
    this.spawnDashTrail();
  }

  private performUltimate(store: ReturnType<typeof useGameStore.getState>) {
    this.isUltimate = true;
    this.ultimateCharge = 0;
    this.ultimateCooldown = 15000;
    store.chargeUltimate(-100);

    this.scene.cameras.main.shake(300, 0.01);
    this.scene.cameras.main.flash(200, 255, 215, 0);

    this.spawnUltimateEffect();

    store.addNotification({
      type: 'warning',
      title: 'FORSAKEN SLASH',
      message: 'The rage of a wronged knight unleashed!',
      icon: '⚡',
      duration: 2000,
    });

    this.scene.time.delayedCall(1500, () => {
      this.isUltimate = false;
    });
  }

  private checkInteraction(_store: ReturnType<typeof useGameStore.getState>) {
    this.scene.events.emit('player-interact', { x: this.x, y: this.y });
  }

  private updateAttackHitbox() {
    const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    if (!hb) return;

    // Define standard hitbox width and height based on active attack state
    let w = 120;
    let h = 80;

    if (this.isChargedAttack) {
      w = 185;
      h = 100;
    } else if (this.isUltimate) {
      w = 260;
      h = 130;
    }

    // Set the physics body size of the attack hitbox zone
    hb.setSize(w, h);

    // Place the hitbox in front of the player
    // If facingRight is true, the center is to the right. Else, to the left.
    const margin = 10;
    const dir = this.facingRight ? 1 : -1;
    const px = this.x + dir * (w / 2 + margin);
    const py = this.y;

    this.attackHitbox.setPosition(px, py);
  }

  private spawnSlashEffect(comboStep: number) {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(25);

    const isRight = this.facingRight;
    const startX = this.x + (isRight ? 24 : -24);
    const startY = this.y;

    if (comboStep === 0) {
      graphics.lineStyle(5, 0x00f0ff, 0.95);
      graphics.beginPath();
      isRight
        ? graphics.arc(startX, startY, 45, -Math.PI / 3, Math.PI / 3, false)
        : graphics.arc(startX, startY, 45, Math.PI - Math.PI / 3, Math.PI + Math.PI / 3, false);
      graphics.strokePath();

      this.spawnParticles(startX, startY, 0x00f0ff, 8, 1);

      this.scene.tweens.add({
        targets: graphics, alpha: 0, scaleX: 1.25, scaleY: 1.25, duration: 140,
        onComplete: () => graphics.destroy()
      });
    } else if (comboStep === 1) {
      graphics.lineStyle(5, 0xff6600, 0.95);
      graphics.beginPath();
      isRight
        ? graphics.arc(startX, startY - 15, 50, -Math.PI / 2, Math.PI / 4, false)
        : graphics.arc(startX, startY - 15, 50, -Math.PI / 2, Math.PI - Math.PI / 4, true);
      graphics.strokePath();

      this.spawnParticles(startX, startY - 10, 0xff6600, 10, 1.1);

      this.scene.tweens.add({
        targets: graphics, alpha: 0, scaleX: 1.15, scaleY: 1.3, duration: 140,
        onComplete: () => graphics.destroy()
      });
    } else {
      graphics.lineStyle(6, 0xffd700, 1);
      const targetX = startX + (isRight ? 70 : -70);
      graphics.lineBetween(startX, startY, targetX, startY);
      graphics.strokePath();

      this.spawnParticles(targetX, startY, 0xffd700, 20, 1.45);

      const burst = this.scene.add.graphics();
      burst.fillStyle(0xffffff, 0.95);
      burst.fillCircle(targetX, startY, 10);
      burst.setDepth(26);

      const colorBurst = this.scene.add.graphics();
      colorBurst.fillStyle(0xffd700, 0.7);
      colorBurst.fillCircle(targetX, startY, 20);
      colorBurst.setDepth(24);

      this.scene.tweens.add({
        targets: burst, scaleX: 2.8, scaleY: 2.8, alpha: 0, duration: 220,
        onComplete: () => burst.destroy()
      });
      this.scene.tweens.add({
        targets: colorBurst, scaleX: 2, scaleY: 2, alpha: 0, duration: 250,
        onComplete: () => colorBurst.destroy()
      });
      this.scene.tweens.add({
        targets: graphics, alpha: 0, duration: 180,
        onComplete: () => graphics.destroy()
      });

      for (let i = 0; i < 6; i++) {
        const spark = this.scene.add.graphics();
        spark.fillStyle(0xffd700, 0.9);
        spark.fillRect(0, 0, 4, 4);
        spark.setPosition(targetX, startY + Phaser.Math.Between(-10, 10));
        spark.setDepth(25);

        const sparkDir = isRight ? 1 : -1;
        this.scene.tweens.add({
          targets: spark,
          x: spark.x + sparkDir * Phaser.Math.Between(30, 80),
          y: spark.y + Phaser.Math.Between(-20, 20),
          alpha: 0, duration: 300,
          onComplete: () => spark.destroy()
        });
      }
    }
  }

  private spawnDashTrail() {
    for (let i = 0; i < 5; i++) {
      const ghost = this.scene.add.image(this.x - this.dashDirX * i * 12, this.y, this.texture.key);
      ghost.setFlipX(this.flipX);
      ghost.setScale(2);
      ghost.setAlpha(0.4 - i * 0.07);
      ghost.setTint(0x4169e1);
      ghost.setDepth(9);

      this.scene.tweens.add({
        targets: ghost, alpha: 0, duration: 300, ease: 'Linear',
        onComplete: () => ghost.destroy(),
      });
    }

    for (let i = 0; i < 4; i++) {
      if (this.scene.textures.exists('dust_0')) {
        const dust = this.scene.add.image(
          this.x + Phaser.Math.Between(-10, 10), this.y + 18, 'dust_0'
        );
        dust.setDepth(8);
        this.scene.tweens.add({
          targets: dust, y: dust.y - 20, alpha: 0, duration: 400, ease: 'Power2',
          delay: i * 50, onComplete: () => dust.destroy(),
        });
      }
    }
  }

  private spawnUltimateEffect() {
    const circle = this.scene.add.graphics();
    circle.lineStyle(4, COLORS.gold, 1);
    circle.strokeCircle(this.x, this.y, 10);
    circle.setDepth(25);

    this.scene.tweens.add({
      targets: circle, scaleX: 15, scaleY: 15, alpha: 0, duration: 600, ease: 'Power2',
      onComplete: () => circle.destroy(),
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = 120;
      const wave = this.scene.add.graphics();
      wave.fillStyle(0xffd700, 0.8);
      wave.fillRect(-30, -4, 60, 8);
      wave.setPosition(this.x, this.y);
      wave.setRotation(angle);
      wave.setDepth(22);

      this.scene.tweens.add({
        targets: wave,
        x: this.x + Math.cos(angle) * dist,
        y: this.y + Math.sin(angle) * dist,
        alpha: 0, scaleX: 1.5, duration: 500, delay: i * 30, ease: 'Power2',
        onComplete: () => wave.destroy(),
      });
    }

    // Gold & Amber particle storms radiating outwards
    this.spawnParticles(this.x, this.y, 0xffd700, 25, 2.2);
    this.spawnParticles(this.x, this.y, 0xff6600, 20, 1.6);
  }

  takeDamage(amount: number) {
    if (this.invincibleTimer > 0 || this.isDashing) return;

    const store = useGameStore.getState();
    store.damagePlayer(amount);
    this.invincibleTimer = INVINCIBILITY_FRAMES;

    this.scene.tweens.add({
      targets: this, alpha: 0.3, yoyo: true, repeat: 4, duration: 80,
      onComplete: () => this.setAlpha(1),
    });

    this.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => this.clearTint());

    this.scene.cameras.main.shake(150, 0.008);

    this.clearCharge();
  }

  getAttackHitbox(): Phaser.GameObjects.Sprite {
    return this.attackHitbox;
  }

  isCurrentlyAttacking(): boolean {
    return this.isAttacking;
  }

  getComboCount(): number {
    return this.comboCount;
  }

  getFacing(): boolean {
    return this.facingRight;
  }

  private spawnParticles(x: number, y: number, color: number, count: number = 8, speedMultiplier: number = 1) {
    const isRight = this.facingRight;
    const baseDir = isRight ? 1 : -1;
    for (let i = 0; i < count; i++) {
      const particle = this.scene.add.graphics();
      particle.fillStyle(color, 1);
      const size = Phaser.Math.Between(2, 5);
      particle.fillRect(-size/2, -size/2, size, size);
      particle.setPosition(x, y);
      particle.setDepth(26);

      const vx = (baseDir * Phaser.Math.Between(40, 160) + Phaser.Math.Between(-30, 30)) * speedMultiplier;
      const vy = Phaser.Math.Between(-100, 100) * speedMultiplier;

      this.scene.tweens.add({
        targets: particle,
        x: x + vx,
        y: y + vy,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: Phaser.Math.Between(250, 600),
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }
}
