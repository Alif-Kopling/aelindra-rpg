import Phaser from 'phaser';
import { useGameStore } from '../store/gameStore';
import {
  COLORS,
  DEBUG_HITBOXES,
} from '../utils/constants';
import {
  COMBAT_CONFIG,
  comboStepIndex,
  getComboLungeSpeed,
  canCancelAttackIntoDash,
  isFinisherCombo,
} from '../systems/combatFeel';
import { getTrustDefenseBuff } from '../systems/dialogueEngine';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private keys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    Space: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    J: Phaser.Input.Keyboard.Key;
    L: Phaser.Input.Keyboard.Key;
    F: Phaser.Input.Keyboard.Key;
    Shift: Phaser.Input.Keyboard.Key;
  };

  private attackKey!: Phaser.Input.Pointer;
  private isDashing = false;
  private autoCombatTimer = 0;
  private autoPotionCooldown = 0;
  private autoTarget: Phaser.Physics.Arcade.Sprite | null = null;
  private hotbarKeys: Phaser.Input.Keyboard.Key[] = [];
  private dashCooldown = 0;
  private dashTimer = 0;
  private dashDirX = 1;
  private isAttacking = false;
  private attackCooldown = 0;
  private comboCount = 0;
  private lastComboTime = 0;
  private invincibleTimer = 0;
  private staminaRegenTimer = 0;
  private canDoubleJump = false;
  private isPlunging = false;
  private currentFrame = 0;
  private frameTimer = 0;
  private currentAnim = 'idle';
  private facingRight = true;
  private attackHitbox!: Phaser.GameObjects.Sprite;
  private ultimateCharge = 0;
  private isUltimate = false;
  private ultimateCooldown = 0;
  private isParrying = false;
  private parryTimer = 0;
  private parryCooldown = 0;
  private parryConsumed = false;
  private timeAccumulator = 0;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private isOnGround = false;
  private footstepTimer = 0;
  private hitEntities = new Set<string>();
  private ghostTimer = 0;
  private unlimitedStaminaTimer = 0;
  private prevGamepadButtons: boolean[] = [];
  private prevTouchAttack = false;

  private moveSpeed = 180;
  private jumpForce = -380;
  private coyoteTime = 120;
  private jumpBufferTime = 150;

  private isCharging = false;
  private chargeTime = 0;
  private readonly CHARGE_THRESHOLD = 400;
  private isChargedAttack = false;
  private chargeGraphic!: Phaser.GameObjects.Graphics;
  private cachedBaseScaleX = 2;
  private cachedBaseScaleY = 2;
  private hitboxDebugGfx!: Phaser.GameObjects.Graphics;
  private attackBufferTimer = 0;
  private dashBufferTimer = 0;
  private attackElapsedMs = 0;
  private lastDamageAt = 0;

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

    this.hitboxDebugGfx = scene.add.graphics();
    this.hitboxDebugGfx.setDepth(100);

    this.setupControls();
    this.createAnimations();
    this.createAttackHitbox();

    window.addEventListener('player:unlimited-stamina', ((e: CustomEvent) => {
      this.applyUnlimitedStamina(e.detail.duration);
    }) as any);
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
      J: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      L: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.L),
      F: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      Shift: kbd.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
    };
    for (let i = 0; i < 8; i++) {
      this.hotbarKeys.push(kbd.addKey(Phaser.Input.Keyboard.KeyCodes.ONE + i));
    }
  }

  private createAnimations() {}

  private createAttackHitbox() {
    this.attackHitbox = this.scene.add.sprite(this.x + 40, this.y, 'pixel');
    this.attackHitbox.setDisplaySize(40, 42);
    this.attackHitbox.setVisible(false);
    this.scene.physics.add.existing(this.attackHitbox);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
  }

  isAttackCharged(): boolean {
    return this.isChargedAttack;
  }

  isParryActive(): boolean {
    return this.isParrying && !this.parryConsumed && this.parryTimer > 0;
  }

  consumeParry(): boolean {
    if (!this.isParryActive()) return false;
    this.parryConsumed = true;
    this.parryTimer = 0;
    this.isParrying = false;
    return true;
  }

  private hasSkill(skillId: string): boolean {
    return useGameStore.getState().unlockedSkills.includes(skillId);
  }

  private getAttackMultiplier(): number {
    return this.hasSkill('blade_mastery') ? 1.2 : 1;
  }

  private getParryWindow(): number {
    return this.hasSkill('iron_reflex') ? 300 : 220;
  }

  private getDashCost(): number {
    return this.hasSkill('relentless_step') ? 28 : 35;
  }

  getBleedDuration(): number {
    return this.hasSkill('blood_pact') ? 7000 : 5000;
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

    // Gamepad detection
    const gamepad = (this.scene.input.gamepad && this.scene.input.gamepad.total > 0)
      ? this.scene.input.gamepad.getPad(0)
      : null;

    const isConsole = store.deviceType === 'console';
    const isMobile = store.deviceType === 'mobile';

    const gamepadJustPressed = (btnIndex: number) => {
      if (!gamepad) return false;
      const isPressed = gamepad.buttons[btnIndex]?.pressed || false;
      const wasPressed = this.prevGamepadButtons[btnIndex] || false;
      return isPressed && !wasPressed;
    };

    // Unified inputs
    const goLeft = this.keys.A.isDown ||
      (isMobile && store.touchInput.left) ||
      (isConsole && gamepad && (gamepad.left || gamepad.leftStick.x < -0.3));

    const goRight = this.keys.D.isDown ||
      (isMobile && store.touchInput.right) ||
      (isConsole && gamepad && (gamepad.right || gamepad.leftStick.x > 0.3));

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.W) ||
      Phaser.Input.Keyboard.JustDown(this.keys.Space) ||
      (isMobile && store.touchInput.jump) ||
      (isConsole && gamepad && gamepadJustPressed(0)); // Button A

    const jumpHeld = this.keys.W.isDown || this.keys.Space.isDown ||
      (isMobile && store.touchInput.jump) ||
      (isConsole && gamepad && gamepad.buttons[0].pressed);

    const attackPressed = this.keys.J.isDown ||
      (isMobile && store.touchInput.attack) ||
      (!isMobile && this.scene.input.activePointer.isDown) ||
      (isConsole && gamepad && gamepad.buttons[2].pressed); // Button X

    const attackJustDownFromTouch = isMobile && store.touchInput.attack && !this.prevTouchAttack;
    this.prevTouchAttack = isMobile ? !!store.touchInput.attack : false;
    const attackJustDown = Phaser.Input.Keyboard.JustDown(this.keys.J) ||
      attackJustDownFromTouch ||
      (isConsole && gamepad && gamepadJustPressed(2)); // Button X

    const dashPressed = Phaser.Input.Keyboard.JustDown(this.keys.Shift) ||
      (isMobile && store.touchInput.dash) ||
      (isConsole && gamepad && gamepadJustPressed(1)); // Button B

    const parryPressed = Phaser.Input.Keyboard.JustDown(this.keys.F) ||
      (isMobile && store.touchInput.parry) ||
      (isConsole && gamepad && gamepadJustPressed(3)); // Button Y

    const ultimatePressed = Phaser.Input.Keyboard.JustDown(this.keys.L) ||
      (!isMobile && this.scene.input.activePointer.rightButtonDown()) ||
      (isMobile && store.touchInput.ultimate) ||
      (isConsole && gamepad && gamepadJustPressed(5)); // R1 / RB

    const interactPressed = Phaser.Input.Keyboard.JustDown(this.keys.E) ||
      (isMobile && store.touchInput.interact) ||
      (isConsole && gamepad && gamepadJustPressed(4)); // L1 / LB

    // Toggling Menus for Gamepad
    if (isConsole && gamepad) {
      if (gamepadJustPressed(9)) { // Start button
        store.togglePause();
      }
      if (gamepadJustPressed(8)) { // Select/Back button
        store.toggleInventory();
      }
    }

    this.dashCooldown = Math.max(0, this.dashCooldown - delta);
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.invincibleTimer = Math.max(0, this.invincibleTimer - delta);
    this.parryCooldown = Math.max(0, this.parryCooldown - delta);
    this.staminaRegenTimer += delta;
    this.ultimateCooldown = Math.max(0, this.ultimateCooldown - delta);
    this.frameTimer += delta;
    this.unlimitedStaminaTimer = Math.max(0, this.unlimitedStaminaTimer - delta);

    this.isOnGround = body.blocked.down || body.touching.down;

    if (this.isOnGround) {
      this.coyoteTimer = this.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    if (Date.now() - this.lastComboTime > COMBAT_CONFIG.comboTimeoutMs && this.comboCount > 0) {
      this.comboCount = 0;
      store.resetCombo();
    }

    this.attackBufferTimer = Math.max(0, this.attackBufferTimer - delta);
    this.dashBufferTimer = Math.max(0, this.dashBufferTimer - delta);
    if (this.isAttacking) {
      this.attackElapsedMs += delta;
    } else {
      this.attackElapsedMs = 0;
    }

    if (this.unlimitedStaminaTimer > 0) {
      if (stats.stamina < stats.maxStamina) {
        store.restoreStamina(100); // Instantly refill during buff
      }
      // Visual feedback for unlimited stamina
      if (this.timeAccumulator % 200 < 20) {
        this.setTint(0x00ffff);
      } else {
        this.clearTint();
      }
    } else if (!this.isAttacking && this.staminaRegenTimer > 200 && stats.stamina < stats.maxStamina) {
      store.restoreStamina(2);
      this.staminaRegenTimer = 0;
    }

    // Auto-potion: drink when HP < 30%
    this.autoPotionCooldown = Math.max(0, this.autoPotionCooldown - delta);
    if (store.isAutoPlay && stats.hp / stats.maxHp < 0.3 && this.autoPotionCooldown <= 0) {
      const potionSlot = store.hotbar.indexOf('health_potion');
      if (potionSlot >= 0) {
        const pot = store.inventory.items.find(i => i.id === 'health_potion');
        if (pot && pot.quantity > 0) {
          store.useHotbarItem(potionSlot);
          this.autoPotionCooldown = 2000;
        }
      }
    }

    if (this.isParrying) {
      this.parryTimer -= delta;
      body.setVelocityX(0);
      body.setVelocityY(Math.max(body.velocity.y, 0));
      this.setTint(0xcfe8ff);
      if (this.parryTimer <= 0 || this.parryConsumed) {
        this.isParrying = false;
        this.clearTint();
      }
    }

    if (this.isDashing) {
      this.dashTimer -= delta;
      this.ghostTimer -= delta;
      
      if (this.ghostTimer <= 0) {
        // TODO: implement spawnGhost (dash trail effect)
        this.ghostTimer = 35;
      }

      const dashVx = this.dashDirX * COMBAT_CONFIG.dashSpeed;
      const dashVy = (this.keys.W.isDown || (isMobile && store.touchInput.up) || (isConsole && gamepad && gamepad.up) ? -180 : (this.keys.S.isDown || (isMobile && store.touchInput.down) || (isConsole && gamepad && gamepad.down) ? 150 : 0));
      body.setVelocityX(dashVx);
      body.setVelocityY(dashVy);
      body.allowGravity = false;
      this.invincibleTimer = Math.max(this.invincibleTimer, COMBAT_CONFIG.dashIFramesMs);
      this.updateFrame('dash', delta);
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        body.allowGravity = true;
        store.setPlayerDashing(false);
        this.spawnBlinkArrival();
      }
      this.updateAttackHitbox();
      this.clearCharge();

      // Save gamepad button states
      if (gamepad) {
        this.prevGamepadButtons = gamepad.buttons.map(b => b.pressed);
      }
      return;
    }

    if (
      canCancelAttackIntoDash(this.attackElapsedMs, this.isAttacking) &&
      this.dashCooldown <= 0 &&
      stats.stamina >= this.getDashCost() &&
      dashPressed
    ) {
      const cancelDir = goLeft ? -1 : goRight ? 1 : this.facingRight ? 1 : -1;
      this.isAttacking = false;
      store.setPlayerAttacking(false);
      (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
      this.startDash(cancelDir * 200, store);

      // Save gamepad button states
      if (gamepad) {
        this.prevGamepadButtons = gamepad.buttons.map(b => b.pressed);
      }
      return;
    }

    // ── CHARGE / ATTACK SYSTEM ──────────────────────────────────

    if (parryPressed && !this.isDashing && !this.isAttacking && !this.isCharging && this.parryCooldown <= 0 && stats.stamina >= 6) {
      this.beginParry(store);
    }

    if (attackPressed && !this.isAttacking && this.attackCooldown <= 0 && !this.isUltimate && !this.isParrying) {
      if (!this.isCharging && !this.isAttacking) {
        this.isCharging = true;
        this.chargeTime = 0;
      }
    }

    if (this.isCharging && !this.isParrying) {
      this.chargeTime += delta;
      this.updateChargeVisual();
      body.setVelocityX(body.velocity.x * 0.7);

      if (this.chargeTime >= this.CHARGE_THRESHOLD) {
        this.spawnChargeReadyEffect();
      }

      if (!attackPressed) {
        this.isCharging = false;
        this.clearChargeVisual();

        if (this.chargeTime >= this.CHARGE_THRESHOLD && stats.stamina >= 20) {
          this.performChargedAttack(store);
        } else if (stats.stamina >= 8) {
          if (isFinisherCombo(this.comboCount + 1)) {
            this.performFinisherAttack(store);
          } else {
            this.performAttack(store);
          }
        }
      }
    }

    if (attackJustDown && !this.isCharging) {
      this.attackBufferTimer = COMBAT_CONFIG.attackBufferMs;
    }

    // ── MOVEMENT ────────────────────────────────────────────────
    let vx = 0;

    if (store.isAutoPlay && !this.isCharging && !this.isParrying && !this.isAttacking && this.attackCooldown <= 0) {
      this.autoCombatTimer -= delta;
      this.autoTarget = this.findNearestEnemy();
      if (this.autoTarget) {
        const dx = this.autoTarget.x - this.x;
        const dist = Math.abs(dx);
        this.facingRight = dx > 0;
        if (dist > 60) {
          vx = this.facingRight ? this.moveSpeed : -this.moveSpeed;
          if (dist > 180 && this.dashCooldown <= 0 && !this.isDashing && stats.stamina >= this.getDashCost()) {
            this.startDash(vx, store);
          }
        } else {
          vx = 0;
          this.performAutoAttack(store);
        }
      }
    } else if (!store.isAutoPlay) {
      if (!this.isCharging && !this.isParrying) {
        if (goLeft) { vx = -this.moveSpeed; this.facingRight = false; }
        else if (goRight) { vx = this.moveSpeed; this.facingRight = true; }
      }
    }

    body.setVelocityX(vx);

    if (jumpPressed) {
      this.jumpBufferTimer = this.jumpBufferTime;
    }
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && !this.isDashing) {
      body.setVelocityY(this.jumpForce);
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }

    if (!jumpHeld && body.velocity.y < -100) {
      body.setVelocityY(body.velocity.y * 0.5);
    }

    if (
      !this.isParrying &&
      dashPressed
    ) {
      this.dashBufferTimer = COMBAT_CONFIG.dashBufferMs;
    }
    const dashIntent = this.dashBufferTimer > 0;
    const dashDir = goLeft ? -1 : goRight ? 1 : vx !== 0 ? (vx > 0 ? 1 : -1) : this.facingRight ? 1 : -1;
    const canAirDash = COMBAT_CONFIG.airDashAllowed || this.isOnGround;
    if (
      dashIntent &&
      !this.isDashing &&
      this.dashCooldown <= 0 &&
      stats.stamina >= this.getDashCost() &&
      canAirDash &&
      !this.isAttacking
    ) {
      this.startDash(dashDir * 200, store);
      this.dashBufferTimer = 0;
    }

    if (
      this.attackBufferTimer > 0 &&
      !this.isAttacking &&
      this.attackCooldown <= 0 &&
      !this.isCharging &&
      !this.isParrying &&
      stats.stamina >= 8
    ) {
      if (isFinisherCombo(this.comboCount + 1)) {
        this.performFinisherAttack(store);
      } else {
        this.performAttack(store);
      }
      this.attackBufferTimer = 0;
    }

    if (!this.isParrying && this.ultimateCharge >= 100 && this.ultimateCooldown <= 0 && ultimatePressed) {
      this.performUltimate(store);
    }

    // Hotbar keyboard shortcuts (1-8)
    for (let i = 0; i < this.hotbarKeys.length; i++) {
      if (Phaser.Input.Keyboard.JustDown(this.hotbarKeys[i])) {
        store.useHotbarItem(i);
      }
    }

    if (interactPressed) {
      this.checkInteraction(store);
    }

    // Save gamepad button states for the next frame
    if (gamepad) {
      this.prevGamepadButtons = gamepad.buttons.map(b => b.pressed);
    } else {
      this.prevGamepadButtons = [];
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

    const isCustomTexture = ['player_sprite', 'player_walk', 'player_jump', 'player_dash', 'player_attack1', 'player_attack2'].includes(this.texture.key);

    if (vx !== 0 && this.isOnGround) {
      store.chargeUltimate(0.003 * delta);
    }
    this.ultimateCharge = store.player.ultimateCharge;

    // Standardized body size to prevent jitter and clipping
    const targetBodyW = 32;
    const targetBodyH = 68;

    if (isCustomTexture) {
      const texInfo: Record<string, { sourceW: number; centerX: number; centerY: number }> = {
        player_sprite: { sourceW: 500, centerX: 279, centerY: 260 },
        player_walk: { sourceW: 500, centerX: 279, centerY: 260 },
        player_jump: { sourceW: 500, centerX: 279, centerY: 260 },
        player_dash: { sourceW: 100, centerX: 50, centerY: 80 },
        player_attack1: { sourceW: 677, centerX: 236, centerY: 207 },
        player_attack2: { sourceW: 677, centerX: 275, centerY: 183 }
      };

      const info = texInfo[this.texture.key] || texInfo.player_sprite;
      const isFlipped = this.flipX;
      
      // Calculate offset based on texture's internal center point
      const visualCenterX = isFlipped 
        ? (info.sourceW - info.centerX) * this.scaleX 
        : info.centerX * this.scaleX;
      
      const targetOffsetX = visualCenterX - (targetBodyW / 2);
      const targetOffsetY = (info.centerY * this.scaleY) - (targetBodyH / 2);

      body.setSize(targetBodyW / this.scaleX, targetBodyH / this.scaleY);
      body.setOffset(targetOffsetX / this.scaleX, targetOffsetY / this.scaleY);
    } else {
      // Fallback for procedural texture
      body.setSize(20, 36);
      body.setOffset(6, 10);
    }

    if (DEBUG_HITBOXES) {
      this.hitboxDebugGfx.clear();
      const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
      if (hb && hb.enable) {
        this.hitboxDebugGfx.lineStyle(1, 0x00ff00, 1);
        this.hitboxDebugGfx.strokeRect(hb.x, hb.y, hb.width, hb.height);
        this.hitboxDebugGfx.fillStyle(0x00ff00, 0.2);
        this.hitboxDebugGfx.fillRect(hb.x, hb.y, hb.width, hb.height);
      }
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

  private playSfx(key: string, volume = 0.5, rate = 1) {
    if (this.scene.cache.audio.exists(key)) {
      this.scene.sound.play(key, { volume, rate });
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

    this.playSfx('sfx_slash_crit', 0.6, 0.7 + Math.random() * 0.3);
    this.playSlashSound();

    const body = this.body as Phaser.Physics.Arcade.Body;
    const dir = this.facingRight ? 1 : -1;

    this.resetHitTracking();

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
    body.setVelocityX(dir * -120);
    body.setVelocityY(-60);

    const baseScaleX = this.scaleX;
    const baseScaleY = this.scaleY;

    this.scene.tweens.add({
      targets: this,
      scaleX: baseScaleX * 1.2,
      scaleY: baseScaleY * 0.8,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
    });

    this.setTint(0xff4444);
    this.scene.time.delayedCall(150, () => this.clearTint());
  }

  private beginParry(store: ReturnType<typeof useGameStore.getState>) {
    this.isParrying = true;
    this.parryConsumed = false;
    this.parryTimer = this.getParryWindow();
    this.parryCooldown = 600;
    this.scene.time.delayedCall(this.parryTimer, () => {
      this.isParrying = false;
      this.clearTint();
    });

    store.drainStamina(this.hasSkill('iron_reflex') ? 6 : 8);

    this.playSfx('sfx_parry', 0.5, 0.8 + Math.random() * 0.4);
    this.scene.cameras.main.flash(80, 210, 240, 255);
  }

  private spawnChargedSlashEffect() {
    const dir = this.facingRight ? 1 : -1;
    const cx = this.x + dir * 30;
    const cy = this.y;

    this.scene.cameras.main.shake(200, 0.015);
    this.scene.cameras.main.flash(80, 255, 215, 0);

    const glowArc = this.scene.add.graphics();
    glowArc.lineStyle(16, 0xffd700, 0.3);
    glowArc.beginPath();
    glowArc.arc(cx, cy, 50, Math.PI / 2, -Math.PI / 2, dir > 0);
    glowArc.strokePath();
    glowArc.setDepth(24);
    this.scene.tweens.add({
      targets: glowArc, alpha: 0, scaleX: 2, scaleY: 2, duration: 300,
      onComplete: () => glowArc.destroy(),
    });

    const arc = this.scene.add.graphics();
    arc.lineStyle(8, 0xffd700, 1);
    arc.beginPath();
    arc.arc(cx, cy, 50, Math.PI / 2, -Math.PI / 2, dir > 0);
    arc.strokePath();
    arc.setDepth(25);
    this.scene.tweens.add({
      targets: arc, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 300,
      onComplete: () => arc.destroy(),
    });

    const whiteArc = this.scene.add.graphics();
    whiteArc.lineStyle(4, 0xffffff, 0.9);
    whiteArc.beginPath();
    whiteArc.arc(cx, cy, 42, Math.PI / 2, -Math.PI / 2, dir > 0);
    whiteArc.strokePath();
    whiteArc.setDepth(26);
    this.scene.tweens.add({
      targets: whiteArc, alpha: 0, scaleX: 1.4, scaleY: 1.4, duration: 200,
      onComplete: () => whiteArc.destroy(),
    });

    const burst = this.scene.add.graphics();
    burst.fillStyle(0xffffff, 0.9);
    burst.fillCircle(cx + dir * 40, cy, 12);
    burst.setDepth(26);
    this.scene.tweens.add({
      targets: burst, scaleX: 3, scaleY: 3, alpha: 0, duration: 250,
      onComplete: () => burst.destroy(),
    });

    const colorBurst = this.scene.add.graphics();
    colorBurst.fillStyle(0xffd700, 0.5);
    colorBurst.fillCircle(cx + dir * 40, cy, 24);
    colorBurst.setDepth(23);
    this.scene.tweens.add({
      targets: colorBurst, scaleX: 3, scaleY: 3, alpha: 0, duration: 350,
      onComplete: () => colorBurst.destroy(),
    });

    for (let i = 0; i < 12; i++) {
      const spark = this.scene.add.graphics();
      const isWhite = Math.random() > 0.5;
      spark.fillStyle(isWhite ? 0xffffff : 0xffd700, 0.9);
      const size = isWhite ? 2 : 3;
      spark.fillRect(-size/2, -size/2, size, size);
      spark.setPosition(cx + dir * 20, cy);
      spark.setDepth(25);

      this.scene.tweens.add({
        targets: spark,
        x: spark.x + dir * Phaser.Math.Between(40, 120),
        y: spark.y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        rotation: Math.random() * Math.PI * 2,
        duration: Phaser.Math.Between(200, 400),
        delay: i * 20,
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
      
      const texScales: Record<string, number> = {
        player_sprite: 0.167,
        player_attack1: 0.263,
        player_attack2: 0.216
      };
      const baseScale = texScales['player_attack1'] || 0.263;
      
      this.scaleX = baseScale * 1.1;
      this.scaleY = baseScale * 0.95;
      return;
    }

    if (this.scene.textures.exists('player_sprite')) {
      let targetTexture = 'player_sprite';

      if (anim === 'run') {
        if (this.scene.textures.exists('player_walk')) {
          const runPhase = Math.sin(this.timeAccumulator / 60);
          targetTexture = runPhase >= 0 ? 'player_sprite' : 'player_walk';
        }
      } else if (anim === 'jump') {
        if (this.scene.textures.exists('player_jump')) {
          targetTexture = 'player_jump';
        }
      } else if (anim === 'dash') {
        if (this.scene.textures.exists('player_dash')) {
          targetTexture = 'player_dash';
        }
      } else if (anim === 'attack') {
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

      const isCustomTexture = ['player_sprite', 'player_walk', 'player_jump', 'player_dash', 'player_attack1', 'player_attack2'].includes(targetTexture);

      if (isCustomTexture) {
        // Precise scales calculated to keep the character's bounding box height exactly 72px
        const texScales: Record<string, number> = {
          player_sprite: 0.167,
          player_walk: 0.167,
          player_jump: 0.167,
          player_dash: 0.27,
          player_attack1: 0.263,
          player_attack2: 0.216
        };
        const baseScale = texScales[targetTexture] || 0.167;

        this.scaleX = baseScale;
        this.scaleY = baseScale;
        this.angle = 0;
        
        // Correct flip logic based on texture orientation
        if (targetTexture === 'player_sprite' || targetTexture === 'player_walk' || targetTexture === 'player_jump' || targetTexture === 'player_dash') {
          this.setFlipX(this.facingRight);
        } else {
          this.setFlipX(!this.facingRight);
        }

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

            const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
            
            if (this.frameTimer >= frameDuration) {
              this.frameTimer = 0;
              this.currentFrame++;
              
              // Enable hitbox on frame 1 (the swing)
              if (this.currentFrame === 1) {
                hb.enable = true;
              } else {
                hb.enable = false;
              }

              if (this.currentFrame >= 3) {
                this.isAttacking = false;
                useGameStore.getState().setPlayerAttacking(false);
                hb.enable = false;
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
    this.attackElapsedMs = 0;
    this.currentFrame = 0;
    this.currentAnim = 'attack';
    this.frameTimer = 0;
    this.attackCooldown = COMBAT_CONFIG.attackCooldownMs;

    store.drainStamina(8);
    store.setPlayerAttacking(true);

    this.comboCount = Math.min(this.comboCount + 1, COMBAT_CONFIG.maxCombo);
    this.lastComboTime = Date.now();
    store.incrementCombo();

    this.playSlashSound();
    this.spawnSlashTrail();

    const comboStep = comboStepIndex(this.comboCount);
    const body = this.body as Phaser.Physics.Arcade.Body;
    const lunge = getComboLungeSpeed(comboStep, this.facingRight);

    this.resetHitTracking();

    body.setVelocityX(lunge.vx);
    if (lunge.vy !== 0) body.setVelocityY(lunge.vy);

    if (comboStep === 2) {
      this.spawnCycloneEffect();
    } else {
      this.spawnSlashEffect(comboStep);
    }

    const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hb.enable = true;
    this.scene.time.delayedCall(16, () => {
      this.setTint(0xf0f8ff);
      this.scene.time.delayedCall(70, () => this.clearTint());
    });

    this.scene.time.delayedCall(200, () => {
      hb.enable = false;
    });
  }

  private performFinisherAttack(store: ReturnType<typeof useGameStore.getState>) {
    if (store.player.stats.stamina < 12) return;

    this.isAttacking = true;
    this.attackElapsedMs = 0;
    this.currentFrame = 0;
    this.currentAnim = 'attack';
    this.frameTimer = 0;
    this.attackCooldown = COMBAT_CONFIG.finisherCooldownMs;
    this.isChargedAttack = true;

    store.drainStamina(12);
    store.setPlayerAttacking(true);

    this.comboCount = COMBAT_CONFIG.finisherAtCombo;
    this.lastComboTime = Date.now();
    store.incrementCombo();

    this.playSfx('sfx_slash_crit', 0.65, 0.85);
    this.playSfx('sfx_ds_stab', 0.7, 0.9);
    this.spawnSlashTrail();
    this.spawnChargedSlashEffect();

    const body = this.body as Phaser.Physics.Arcade.Body;
    const dir = this.facingRight ? 1 : -1;
    this.resetHitTracking();
    body.setVelocityX(dir * 320);
    body.setVelocityY(-60);

    const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hb.enable = true;
    this.scene.events.emit('combat-finisher-zoom');
    this.scene.time.delayedCall(280, () => {
      hb.enable = false;
      this.isChargedAttack = false;
    });
  }

  private spawnSlashTrail() {
    const dir = this.facingRight ? 1 : -1;
    const trail = this.scene.add.graphics();
    trail.lineStyle(3, 0x88ccff, 0.75);
    trail.beginPath();
    trail.moveTo(this.x - dir * 8, this.y - 8);
    trail.lineTo(this.x + dir * 48, this.y + 4);
    trail.strokePath();
    trail.setDepth(24);
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      x: trail.x + dir * 24,
      duration: 120,
      ease: 'Cubic.easeOut',
      onComplete: () => trail.destroy(),
    });
  }

  private spawnCycloneEffect() {
    const dir = this.facingRight ? 1 : -1;
    const cx = this.x;
    const cy = this.y;

    const outerRing = this.scene.add.graphics();
    outerRing.setDepth(24);
    outerRing.lineStyle(3, 0x00ffff, 0.4);
    outerRing.strokeCircle(cx, cy, 100);
    this.scene.tweens.add({
      targets: outerRing,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      rotation: Math.PI * 2 * dir,
      duration: 400,
      ease: 'Cubic.easeOut',
      onComplete: () => outerRing.destroy(),
    });

    const g = this.scene.add.graphics();
    g.setDepth(25);
    g.lineStyle(6, 0x00ffff, 0.9);
    g.strokeCircle(cx, cy, 80);
    this.scene.tweens.add({
      targets: g,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      rotation: Math.PI * 2 * dir,
      duration: 250,
      ease: 'Cubic.easeOut',
      onComplete: () => g.destroy(),
    });

    const innerGlow = this.scene.add.graphics();
    innerGlow.fillStyle(0x00ffff, 0.2);
    innerGlow.fillCircle(cx, cy, 40);
    innerGlow.setDepth(23);
    this.scene.tweens.add({
      targets: innerGlow,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 300,
      onComplete: () => innerGlow.destroy(),
    });

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const streak = this.scene.add.graphics();
      streak.fillStyle(0x00ffff, 0.6);
      streak.fillRect(-12, -2, 24, 4);
      streak.setPosition(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60);
      streak.setRotation(a);
      streak.setDepth(24);
      this.scene.tweens.add({
        targets: streak,
        x: streak.x + Math.cos(a) * 80,
        y: streak.y + Math.sin(a) * 80,
        alpha: 0,
        scaleX: 1.5,
        duration: 300,
        ease: 'Power2',
        onComplete: () => streak.destroy(),
      });
    }

    this.spawnParticles(cx, cy, 0x00ffff, 18, 1.8);
  }

  private startDash(vx: number, store: ReturnType<typeof useGameStore.getState>) {
    this.isDashing = true;
    this.dashTimer = COMBAT_CONFIG.dashDurationMs;
    this.dashCooldown = COMBAT_CONFIG.dashCooldownMs;
    this.invincibleTimer =
      COMBAT_CONFIG.dashIFramesMs + (this.hasSkill('relentless_step') ? 90 : 0);
    store.setPlayerDashing(true);
    store.drainStamina(this.getDashCost());

    this.dashDirX = vx >= 0 ? 1 : -1;
    if (vx !== 0) this.facingRight = vx > 0;
    this.spawnDashTrail();
    this.spawnBlinkDeparture();
    this.playSfx('sfx_dash', 0.35, 0.9 + Math.random() * 0.2);
  }

  private performUltimate(store: ReturnType<typeof useGameStore.getState>) {
    this.isUltimate = true;
    this.ultimateCharge = 0;
    this.ultimateCooldown = 15000;
    store.chargeUltimate(-100);

    this.scene.cameras.main.shake(300, 0.01);
    this.scene.cameras.main.flash(200, 255, 215, 0);

    this.playSfx('sfx_whoosh', 0.7, 0.8);
    this.playSfx('sfx_slash_crit', 0.5, 0.6);

    this.spawnUltimateEffect();

    this.resetHitTracking();
    this.isAttacking = true;
    store.setPlayerAttacking(true);
    const hb = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hb.enable = true;
    this.scene.time.delayedCall(350, () => {
      hb.enable = false;
      this.isAttacking = false;
      store.setPlayerAttacking(false);
    });

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

    // Melee hitbox — kept narrow so one swing does not hit the whole screen
    const finisherSwing = this.isAttacking && (this.comboCount - 1) % 3 === 2;
    let w = finisherSwing ? 40 : 30;
    let h = finisherSwing ? 38 : 36;

    if (this.isChargedAttack) {
      w = 44;
      h = 42;
    } else if (this.isUltimate) {
      w = 56;
      h = 48;
    }

    hb.setSize(w, h);
    this.attackHitbox.setDisplaySize(w, h);
    const margin = 5;
    const dir = this.facingRight ? 1 : -1;
    const px = this.x + dir * (w / 2 + margin);
    const py = this.y;
    this.attackHitbox.setPosition(px, py);
  }

  hasHit(entityId: string): boolean {
    return this.hitEntities.has(entityId);
  }

  registerHit(entityId: string) {
    this.hitEntities.add(entityId);
  }

  private resetHitTracking() {
    this.hitEntities.clear();
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

      for (let i = 0; i < 8; i++) {
        const spark = this.scene.add.graphics();
        const c = i % 2 === 0 ? 0xffd700 : 0xffffff;
        spark.fillStyle(c, 0.9);
        spark.fillRect(0, 0, 4, 4);
        spark.setPosition(targetX, startY + Phaser.Math.Between(-10, 10));
        spark.setDepth(25);

        const sparkDir = isRight ? 1 : -1;
        this.scene.tweens.add({
          targets: spark,
          x: spark.x + sparkDir * Phaser.Math.Between(30, 80),
          y: spark.y + Phaser.Math.Between(-20, 20),
          alpha: 0, rotation: Math.random() * 6, duration: 300,
          onComplete: () => spark.destroy()
        });
      }
    }
  }

  private spawnDashTrail() {
    const dir = this.dashDirX;
    const cx = this.x;
    const cy = this.y;

    const speedLines = this.scene.add.graphics();
    speedLines.lineStyle(2, 0x88ccff, 0.5);
    for (let i = 0; i < 5; i++) {
      const ly = cy + Phaser.Math.Between(-20, 20);
      speedLines.lineBetween(
        cx - dir * 10, ly,
        cx - dir * 50, ly + Phaser.Math.Between(-8, 8)
      );
    }
    speedLines.setDepth(24);
    this.scene.tweens.add({
      targets: speedLines,
      alpha: 0,
      x: speedLines.x - dir * 30,
      duration: 200,
      onComplete: () => speedLines.destroy(),
    });

    const trailGlow = this.scene.add.graphics();
    trailGlow.fillStyle(0x4169e1, 0.4);
    trailGlow.fillCircle(cx, cy, 14);
    trailGlow.setDepth(8);
    this.scene.tweens.add({
      targets: trailGlow,
      x: cx + dir * -80,
      alpha: 0,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: 250,
      onComplete: () => trailGlow.destroy(),
    });

    for (let i = 0; i < 8; i++) {
      const spark = this.scene.add.graphics();
      spark.fillStyle(0x88ccff, 0.7);
      spark.fillCircle(0, 0, 1.5 + Math.random() * 2);
      spark.setPosition(cx + Phaser.Math.Between(-6, 6), cy + Phaser.Math.Between(-14, 14));
      spark.setDepth(24);
      this.scene.tweens.add({
        targets: spark,
        alpha: 0,
        x: spark.x - dir * Phaser.Math.Between(20, 60),
        y: spark.y + Phaser.Math.Between(-10, 10),
        duration: 200,
        delay: i * 15,
        onComplete: () => spark.destroy(),
      });
    }
  }

  private spawnUltimateEffect() {
    const cx = this.x;
    const cy = this.y;

    this.scene.cameras.main.shake(400, 0.02);
    this.scene.cameras.main.flash(150, 255, 215, 0);

    const expandingRing = this.scene.add.graphics();
    expandingRing.lineStyle(6, COLORS.gold, 1);
    expandingRing.strokeCircle(cx, cy, 10);
    expandingRing.setDepth(26);
    this.scene.tweens.add({
      targets: expandingRing, scaleX: 18, scaleY: 18, alpha: 0, duration: 600, ease: 'Power2',
      onComplete: () => expandingRing.destroy(),
    });

    const glowRing = this.scene.add.graphics();
    glowRing.fillStyle(COLORS.gold, 0.3);
    glowRing.fillCircle(cx, cy, 30);
    glowRing.setDepth(24);
    this.scene.tweens.add({
      targets: glowRing, scaleX: 6, scaleY: 6, alpha: 0, duration: 500, ease: 'Power2',
      onComplete: () => glowRing.destroy(),
    });

    const whiteFlash = this.scene.add.graphics();
    whiteFlash.fillStyle(0xffffff, 0.6);
    whiteFlash.fillCircle(cx, cy, 8);
    whiteFlash.setDepth(27);
    this.scene.tweens.add({
      targets: whiteFlash, scaleX: 20, scaleY: 20, alpha: 0, duration: 400, ease: 'Power2',
      onComplete: () => whiteFlash.destroy(),
    });

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 140;
      const wave = this.scene.add.graphics();
      wave.fillStyle(i % 2 === 0 ? 0xffd700 : 0xff6600, 0.8);
      wave.fillRect(-24, -3, 48, 6);
      wave.setPosition(cx, cy);
      wave.setRotation(angle);
      wave.setDepth(22);
      this.scene.tweens.add({
        targets: wave,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        alpha: 0, scaleX: 1.5, duration: 500, delay: i * 20, ease: 'Power2',
        onComplete: () => wave.destroy(),
      });
    }

    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2;
      const spark = this.scene.add.graphics();
      spark.fillStyle(Math.random() > 0.5 ? 0xffd700 : 0xffffff, 0.9);
      spark.fillRect(-2, -2, 4, 4);
      spark.setPosition(cx, cy);
      spark.setDepth(25);
      this.scene.tweens.add({
        targets: spark,
        x: cx + Math.cos(a) * Phaser.Math.Between(60, 180),
        y: cy + Math.sin(a) * Phaser.Math.Between(60, 180),
        scaleX: 0, scaleY: 0, alpha: 0, rotation: a * 3,
        duration: Phaser.Math.Between(300, 600),
        delay: i * 15,
        ease: 'Cubic.easeOut',
        onComplete: () => spark.destroy(),
      });
    }

    this.spawnParticles(cx, cy, 0xffd700, 30, 2.5);
    this.spawnParticles(cx, cy, 0xff6600, 25, 1.8);
    this.spawnParticles(cx, cy, 0xffffff, 15, 2);
  }

  private findNearestEnemy(): Phaser.Physics.Arcade.Sprite | null {
    const scene = this.scene as any;
    let nearest: Phaser.Physics.Arcade.Sprite | null = null;
    let nearestDist = Infinity;
    if (scene.enemyGroup) {
      scene.enemyGroup.getChildren().forEach((e: Phaser.Physics.Arcade.Sprite) => {
        if (!e.active) return;
        const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = e;
        }
      });
    }
    if (scene.bossGroup) {
      scene.bossGroup.getChildren().forEach((b: Phaser.Physics.Arcade.Sprite) => {
        if (!b.active) return;
        const d = Phaser.Math.Distance.Between(this.x, this.y, b.x, b.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = b;
        }
      });
    }
    return nearest;
  }

  private performAutoAttack(store: ReturnType<typeof useGameStore.getState>) {
    if (this.attackCooldown > 0 || this.isAttacking || this.isCharging || this.isParrying) return;
    if (store.player.stats.stamina < 8) return;

    const isCharged = this.autoCombatTimer <= -300;
    if (isCharged && store.player.stats.stamina >= 20) {
      this.performChargedAttack(store);
      this.autoCombatTimer = 0;
    } else {
      this.performAttack(store);
      this.autoCombatTimer = 0;
    }
  }

  takeDamage(amount: number) {
    if (this.invincibleTimer > 0 || this.isDashing) return;
    const now = Date.now();
    if (now - this.lastDamageAt < COMBAT_CONFIG.playerHitGraceMs) return;
    this.lastDamageAt = now;

    const store = useGameStore.getState();
    const nunDefense = getTrustDefenseBuff(store.npcTrust, 'nun');
    const reducedAmount = Math.max(1, amount - nunDefense);
    store.damagePlayer(reducedAmount);
    this.invincibleTimer = COMBAT_CONFIG.dashIFramesMs + 180;

    this.playSfx('sfx_sword_hit_blood', 0.4, 0.8 + Math.random() * 0.4);

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

  private spawnBlinkDeparture() {
    const cx = this.x;
    const cy = this.y;
    const dir = this.dashDirX;

    const flash = this.scene.add.graphics();
    flash.fillStyle(0xffffff, 0.7);
    flash.fillCircle(cx, cy, 18);
    flash.setDepth(26);
    this.scene.tweens.add({
      targets: flash,
      scaleX: 0.1,
      scaleY: 0.1,
      alpha: 0,
      duration: 120,
      onComplete: () => flash.destroy(),
    });

    for (let i = 0; i < 8; i++) {
      const streak = this.scene.add.graphics();
      streak.fillStyle(0x88ccff, 0.6);
      streak.fillRect(-2, -6, 4, 12);
      streak.setPosition(cx, cy + Phaser.Math.Between(-16, 16));
      streak.setDepth(25);
      streak.setAlpha(1);
      this.scene.tweens.add({
        targets: streak,
        x: cx + dir * Phaser.Math.Between(40, 100),
        alpha: 0,
        scaleX: 0.1,
        duration: 150,
        delay: i * 10,
        onComplete: () => streak.destroy(),
      });
    }
  }

  private spawnBlinkArrival() {
    const cx = this.x;
    const cy = this.y;
    const dir = this.dashDirX;

    const burst = this.scene.add.graphics();
    burst.fillStyle(0xffffff, 0.5);
    burst.fillCircle(cx, cy, 12);
    burst.setDepth(26);
    this.scene.tweens.add({
      targets: burst,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => burst.destroy(),
    });

    const ring = this.scene.add.graphics();
    ring.lineStyle(2, 0x88ccff, 0.7);
    ring.strokeCircle(cx, cy, 8);
    ring.setDepth(25);
    this.scene.tweens.add({
      targets: ring,
      scaleX: 4,
      scaleY: 4,
      alpha: 0,
      duration: 250,
      ease: 'Power2',
      onComplete: () => ring.destroy(),
    });

    for (let i = 0; i < 6; i++) {
      const spark = this.scene.add.graphics();
      spark.fillStyle(0x4169e1, 0.8);
      spark.fillCircle(0, 0, 2 + Math.random() * 2);
      spark.setPosition(cx, cy);
      spark.setDepth(25);
      const angle = Math.random() * Math.PI * 2;
      this.scene.tweens.add({
        targets: spark,
        x: cx + Math.cos(angle) * Phaser.Math.Between(20, 50),
        y: cy + Math.sin(angle) * Phaser.Math.Between(20, 50),
        alpha: 0,
        duration: 200 + Math.random() * 100,
        onComplete: () => spark.destroy(),
      });
    }

    this.scene.cameras.main.flash(60, 100, 150, 255);
  }

  applyUnlimitedStamina(duration: number) {
    this.unlimitedStaminaTimer = duration;
    this.setTint(0x00ffff);
    this.scene.time.delayedCall(500, () => this.clearTint());
  }

  private spawnParticles(x: number, y: number, color: number, count: number = 8, speedMultiplier: number = 1) {
    const isRight = this.facingRight;
    const baseDir = isRight ? 1 : -1;
    const colors = [color, Phaser.Display.Color.ValueToColor(color).lighten(30).color, 0xffffff];
    for (let i = 0; i < count; i++) {
      const isStar = Math.random() > 0.7;
      const particle = this.scene.add.graphics();
      const c = colors[Math.floor(Math.random() * colors.length)];
      particle.fillStyle(c, 0.7 + Math.random() * 0.3);
      if (isStar) {
        particle.fillRect(-3, -1, 6, 2);
        particle.fillRect(-1, -3, 2, 6);
      } else {
        const size = Phaser.Math.Between(2, 5);
        particle.fillRect(-size/2, -size/2, size, size);
      }
      particle.setPosition(x, y);
      particle.setDepth(26);

      const angle = Math.random() * Math.PI * 2;
      const speed = Phaser.Math.Between(60, 200) * speedMultiplier;
      const vx = (baseDir * Math.cos(angle) * speed + Math.cos(angle + 0.5) * 30);
      const vy = Math.sin(angle) * speed;

      this.scene.tweens.add({
        targets: particle,
        x: x + vx,
        y: y + vy,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        rotation: Math.random() * Math.PI * 2,
        duration: Phaser.Math.Between(200, 500),
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      });
    }

    if (count >= 10) {
      const glow = this.scene.add.graphics();
      glow.fillStyle(color, 0.25);
      glow.fillCircle(x, y, 20);
      glow.setDepth(24);
      this.scene.tweens.add({
        targets: glow,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 350,
        ease: 'Power2',
        onComplete: () => glow.destroy(),
      });
    }
  }
}
