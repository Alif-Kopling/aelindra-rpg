import Phaser from 'phaser';
import { useGameStore } from '../store/gameStore';
import { EnemyStats } from '../utils/types';
import { COMBAT_CONFIG } from '../systems/combatFeel';
import { getTrustHpRegen } from '../systems/dialogueEngine';

export interface EnemyConfig {
  key: string;
  name: string;
  stats: EnemyStats;
  frameCount?: number;
  scale?: number;
  bodySize?: [number, number];
  patrolRange?: number;
}

type AIState = 'idle' | 'patrol' | 'chase' | 'attack' | 'stagger' | 'dead';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private config: EnemyConfig;
  private aiState: AIState = 'idle';
  private patrolDir = 1;
  private patrolDistance = 0;
  private patrolOrigin: Phaser.Math.Vector2;
  private patrolRange: number;
  private hp: number;
  private maxHp: number;
  private attackCooldown = 0;
  private staggerTimer = 0;
  private aggroRange = 250;
  private attackRange = 45;
  private attackDamage: number;
  private currentFrame = 0;
  private frameTimer = 0;
  private target: Phaser.Physics.Arcade.Sprite | null = null;
  private hpBar!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private isDead = false;
  private id: string;
  private lootDropped = false;
  private timeAccumulator = 0;
  private isStunned = false;
  private bleedTimer = 0;
  private bleedTickAccumulator = 0;
  private attackWindup = 0;
  private aiTimer: Phaser.Time.TimerEvent | null = null;
  private stunTimerId: Phaser.Time.TimerEvent | null = null;
  private bleedTimerId: Phaser.Time.TimerEvent | null = null;
  private telegraphGfx: Phaser.GameObjects.Graphics | null = null;
  private comboHitsInWindow = 0;
  private comboWindowTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, config: EnemyConfig) {

    const spriteKey = `${config.key}_sprite`;
    const textureToUse = scene.textures.exists(spriteKey) ? spriteKey : 'pixel';
    super(scene, x, y, textureToUse);
    this.config = config;
    this.id = `enemy_${Date.now()}_${Math.random()}`;
    this.hp = config.stats.hp;
    this.maxHp = config.stats.hp;
    this.attackDamage = config.stats.attack;
    this.patrolOrigin = new Phaser.Math.Vector2(x, y);
    this.patrolRange = config.patrolRange || 80;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    const [bw, bh] = config.bodySize || [20, 32];
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(150, 400);

    const scale = config.scale || 2;
    if (scene.textures.exists(spriteKey)) {
      this.setDisplaySize(32 * scale, 48 * scale);
    } else {
      this.setScale(scale);
    }

    // Anchor body to bottom of sprite using texture-space coordinates
    const tex = this.texture.get();
    const tw = tex.width;
    const th = tex.height;
    
    body.setSize(bw, bh);
    body.setOffset((tw - bw) / 2, th - bh);
    this.setDepth(9);

    this.createHpBar();
    this.startAI();
  }

  private createHpBar() {
    this.hpBar = this.scene.add.graphics();
    this.hpBar.setDepth(20);

    this.nameText = this.scene.add.text(0, 0, this.config.name, {
      fontSize: '10px',
      fontFamily: 'Cinzel, serif',
      color: '#ffcccc',
    });
    this.nameText.setDepth(21);
    this.nameText.setOrigin(0.5, 1);
    this.updateHpBar();
  }

  private updateHpBar() {
    const y = this.y - this.displayHeight / 2 - 12;
    const x = this.x;

    this.hpBar.clear();

    this.hpBar.fillStyle(0x1a0000);
    this.hpBar.fillRect(x - 20, y - 4, 40, 6);

    const pct = this.hp / this.maxHp;
    const color = pct > 0.5 ? 0xff4444 : pct > 0.25 ? 0xff8800 : 0xff0000;
    this.hpBar.fillStyle(color);
    this.hpBar.fillRect(x - 20, y - 4, 40 * pct, 6);

    this.hpBar.lineStyle(1, 0x880000);
    this.hpBar.strokeRect(x - 20, y - 4, 40, 6);

    this.nameText.setPosition(x, y - 6);

    this.hpBar.setVisible(this.hp < this.maxHp);
    this.nameText.setVisible(this.hp < this.maxHp);
  }

  private startAI() {
    this.aiTimer = this.scene.time.addEvent({
      delay: 500 + Math.random() * 200,
      loop: true,
      callback: this.updateAIState,
      callbackScope: this,
    });
  }

  private updateAIState() {
    if (this.isDead || !this.target) return;

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

    switch (this.aiState) {
      case 'idle':
      case 'patrol':
        if (dist < this.aggroRange) {
          this.aiState = 'chase';
        }
        break;
      case 'chase':
        if (dist > this.aggroRange * 1.5) {
          this.aiState = 'patrol';
        } else if (dist < this.attackRange && this.attackCooldown <= 0) {
          this.aiState = 'attack';
          this.attackWindup = COMBAT_CONFIG.enemyTelegraphMs;
          this.showAttackTelegraph();
        }
        break;
      case 'attack':
        if (dist > this.attackRange * 1.2) {
          this.aiState = 'chase';
        }
        break;
    }
  }

  setTarget(target: Phaser.Physics.Arcade.Sprite) {
    this.target = target;
  }

  update(delta: number) {
    if (this.isDead) return;

    this.timeAccumulator += delta;
    this.bleedTickAccumulator += delta;

    // Handle Status Effects
    if (this.bleedTimer > 0) {
      this.bleedTimer -= delta;
      if (this.bleedTickAccumulator >= 1000) {
        this.bleedTickAccumulator -= 1000;
        this.takeDamage(5);
      }
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.staggerTimer = Math.max(0, this.staggerTimer - delta);
    this.comboWindowTimer = Math.max(0, this.comboWindowTimer - delta);
    if (this.comboWindowTimer <= 0) {
      this.comboHitsInWindow = 0;
    }
    this.frameTimer += delta;

    if (this.isStunned) {
      this.staggerTimer = 0;
      this.setTint(0x8888ff);
      this.updateHpBar();
      return;
    }

    if (this.staggerTimer > 0) {
      this.updateHpBar();
      return;
    }

    if (this.aiState === 'stagger') {
      this.aiState = 'idle';
    }

    const body = this.body as Phaser.Physics.Arcade.Body;

    switch (this.aiState) {
      case 'idle':
        body.setVelocityX(0);
        this.animateFrames(delta, 4, 600);
        break;

      case 'patrol':
        this.handlePatrol(body, delta);
        break;

      case 'chase':
        this.handleChase(body, delta);
        break;

      case 'attack':
        this.handleAttack(body, delta);
        break;
    }

    this.updateHpBar();
  }

  private handlePatrol(body: Phaser.Physics.Arcade.Body, delta: number) {
    this.patrolDistance += Math.abs(body.velocity.x) * delta / 1000;

    if (this.patrolDistance >= this.patrolRange) {
      this.patrolDir *= -1;
      this.patrolDistance = 0;
    }

    body.setVelocityX(this.config.stats.speed * 0.4 * this.patrolDir);
    this.setFlipX(body.velocity.x < 0);
    this.animateFrames(delta, 4, 250);
  }

  private handleChase(body: Phaser.Physics.Arcade.Body, delta: number) {
    if (!this.target) return;

    const dx = this.target.x - this.x;
    body.setVelocityX(dx > 0 ? this.config.stats.speed * 0.8 : -this.config.stats.speed * 0.8);
    this.setFlipX(dx < 0);

    if (this.target.y < this.y - 40 && body.blocked.down) {
      body.setVelocityY(-350);
    }

    this.animateFrames(delta, 4, 150);
  }

  private showAttackTelegraph() {
    this.clearTelegraph();
    this.setTint(0xffaa00);
    this.telegraphGfx = this.scene.add.graphics();
    this.telegraphGfx.lineStyle(2, 0xff4444, 0.85);
    this.telegraphGfx.strokeCircle(this.x, this.y, this.attackRange + 8);
    this.telegraphGfx.setDepth(7);
    this.scene.tweens.add({
      targets: this.telegraphGfx,
      alpha: { from: 0.9, to: 0.25 },
      duration: COMBAT_CONFIG.enemyTelegraphMs,
      yoyo: true,
    });
  }

  private clearTelegraph() {
    if (this.telegraphGfx?.active) {
      this.telegraphGfx.destroy();
    }
    this.telegraphGfx = null;
  }

  private handleAttack(body: Phaser.Physics.Arcade.Body, delta: number) {
    body.setVelocityX(0);
    this.animateFrames(delta, 4, 200);

    if (this.attackWindup > 0) {
      this.attackWindup -= delta;
      if (this.attackWindup > 0) {
        return;
      }
      this.clearTelegraph();
    }

    if (this.attackCooldown <= 0 && this.target) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (dist < this.attackRange + 24) {
        this.attackCooldown = 1500;
        this.clearTint();
        this.dealDamage();
      }
      this.aiState = 'chase';
    }
  }

  private dealDamage() {
    const store = useGameStore.getState();
    this.scene.events.emit('enemy-attack', { enemy: this, damage: this.attackDamage });

    this.scene.cameras.main.shake(60, 0.003);

    const attackGfx = this.scene.add.graphics();
    attackGfx.fillStyle(0xff4444, 0.5);
    attackGfx.fillCircle(this.x + (this.flipX ? -30 : 30), this.y, 20);
    attackGfx.setDepth(15);

    this.scene.tweens.add({
      targets: attackGfx,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => attackGfx.destroy(),
    });
  }

  private animateFrames(delta: number, _frameCount: number, _delay: number) {
    this.timeAccumulator += delta;

    const spriteKey = `${this.config.key}_sprite`;
    if (this.scene.textures.exists(spriteKey)) {
      if (this.texture.key !== spriteKey) {
        this.setTexture(spriteKey);
      }

      const baseScale = this.config.scale || 2;
      const baseScaleX = (32 * baseScale) / this.width;
      const baseScaleY = (48 * baseScale) / this.height;

      switch (this.aiState) {
        case 'idle':
          this.scaleY = baseScaleY * (1 + Math.sin(this.timeAccumulator / 250) * 0.04);
          this.scaleX = baseScaleX * (1 - Math.sin(this.timeAccumulator / 250) * 0.02);
          this.angle = 0;
          break;
        case 'patrol':
        case 'chase':
          const walkPulse = Math.sin(this.timeAccumulator / 80);
          this.scaleY = baseScaleY * (1 + Math.abs(walkPulse) * 0.08);
          this.scaleX = baseScaleX * (1 - Math.abs(walkPulse) * 0.03);
          this.angle = walkPulse * 3;
          break;
        case 'attack':
          this.scaleX = baseScaleX * 1.1;
          this.scaleY = baseScaleY * 0.9;
          this.angle = this.flipX ? -8 : 8;
          break;
        case 'stagger':
          this.scaleX = baseScaleX * 0.9;
          this.scaleY = baseScaleY * 1.1;
          this.angle = this.flipX ? 15 : -15;
          break;
        default:
          this.scaleX = baseScaleX;
          this.scaleY = baseScaleY;
          this.angle = 0;
          break;
      }
    }
  }

  takeDamage(amount: number, comboCount = 1, isCritical = false, isFinisher = false): boolean {
    if (this.isDead) return false;

    const totalDmg = amount;
    this.hp = Math.max(0, this.hp - totalDmg);

    this.comboWindowTimer = COMBAT_CONFIG.enemyComboStaggerWindowMs;
    this.comboHitsInWindow += 1;
    const pressureStagger =
      this.comboHitsInWindow >= COMBAT_CONFIG.enemyComboStaggerThreshold || isFinisher;

    this.aiState = 'stagger' as AIState;
    this.staggerTimer = pressureStagger ? (isFinisher ? 520 : 400) : 220;

    this.setTint(0xff0000);
    this.scene.time.delayedCall(150, () => {
      if (!this.isDead) this.clearTint();
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.target) {
      const dx = Math.sign(this.x - this.target.x);
      
      const kbMult = isFinisher ? 1.35 : pressureStagger ? 1.15 : 1;
      if (isCritical || isFinisher) {
        body.setVelocityX(dx * 250 * kbMult);
        body.setVelocityY(isFinisher ? 280 : 350);
        this.spawnCriticalImpactEffect();
      } else {
        body.setVelocityX(dx * 180 * kbMult);
        body.setVelocityY(pressureStagger ? -80 : 0);
      }
    }

    this.spawnDamageNumber(totalDmg, isCritical);

    useGameStore.getState().chargeUltimate(3);

    if (this.hp <= 0) {
      this.die();
      return true;
    }

    this.updateHpBar();
    return false;
  }

  private spawnCriticalImpactEffect() {
    const cx = this.x;
    const cy = this.y;
    
    // Spawn a quick glowing flash circle
    const flash = this.scene.add.graphics();
    flash.fillStyle(0xffd700, 0.8);
    flash.fillCircle(cx, cy, 30);
    flash.setDepth(25);
    
    this.scene.tweens.add({
      targets: flash,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });

    // Spawn downward falling slash sparks
    for (let i = 0; i < 6; i++) {
      const spark = this.scene.add.graphics();
      spark.fillStyle(0xff8800, 0.9);
      spark.fillRect(-2, -8, 4, 16);
      spark.setPosition(cx + Phaser.Math.Between(-20, 20), cy - 20);
      spark.setDepth(26);
      spark.angle = Phaser.Math.Between(15, 45); // Tilted downward

      this.scene.tweens.add({
        targets: spark,
        x: spark.x + Phaser.Math.Between(-10, 10),
        y: spark.y + Phaser.Math.Between(50, 100), // Falling downwards!
        alpha: 0,
        scaleY: 0.2,
        duration: 400,
        delay: i * 20,
        onComplete: () => spark.destroy()
      });
    }
  }

  private spawnDamageNumber(damage: number, isCritical: boolean) {
    const color = isCritical ? '#ffd700' : '#ffffff';
    const size = isCritical ? '14px' : '11px';
    const text = this.scene.add.text(
      this.x + Phaser.Math.Between(-15, 15),
      this.y - 20,
      isCritical ? `✦ ${damage}` : `${damage}`,
      { fontSize: size, fontFamily: 'Cinzel, serif', color, stroke: '#000', strokeThickness: 3 }
    );
    text.setDepth(30);
    text.setOrigin(0.5);

    if (isCritical) {
      // Bouncing and falling parabola curve for critical hits!
      const startY = text.y;
      const targetY = startY - 50;
      const fallY = startY + 80;

      this.scene.tweens.chain({
        targets: text,
        tweens: [
          {
            y: targetY,
            scale: 1.4,
            duration: 250,
            ease: 'Back.easeOut',
          },
          {
            y: fallY,
            scale: 1.0,
            alpha: 0,
            duration: 800,
            ease: 'Quad.easeIn',
          }
        ],
        onComplete: () => text.destroy()
      });
    } else {
      // Normal attack: float straight up
      this.scene.tweens.add({
        targets: text,
        y: text.y - 35,
        alpha: 0,
        duration: 900,
        ease: 'Quad.easeOut',
        onComplete: () => text.destroy(),
      });
    }
  }

  getEnemyId(): string {
    return this.id;
  }

  private die() {
    this.isDead = true;
    this.aiState = 'dead' as AIState;

    if (this.aiTimer) { this.aiTimer.remove(); this.aiTimer = null; }

    const store = useGameStore.getState();
    store.gainExp(this.config.stats.exp);
    store.addGold(this.config.stats.gold);
    store.incrementKillCount();

    const tamRegen = getTrustHpRegen(store.npcTrust, 'tam');
    if (tamRegen > 0) {
      store.healPlayer(tamRegen);
    }

    if (this.scene.cache.audio.exists('sfx_undead')) {
      this.scene.sound.play('sfx_undead', { volume: 0.35, rate: 0.7 + Math.random() * 0.6 });
    }
    if (Math.random() < 0.3 && this.scene.cache.audio.exists('sfx_monster_scream')) {
      this.scene.sound.play('sfx_monster_scream', { volume: 0.4, rate: 0.8 + Math.random() * 0.4 });
    }

    this.setTint(0x666666);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y + 10,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        this.hpBar.destroy();
        this.nameText.destroy();
        this.scene.events.emit('enemy-died', { enemy: this, x: this.x, y: this.y });
        this.destroy();
      },
    });

    if (!this.lootDropped && Math.random() < 0.3) {
      this.lootDropped = true;
      this.dropLoot();
    }

    store.addNotification({
      type: 'info',
      title: this.config.name + ' Defeated',
      message: `+${this.config.stats.exp} EXP  +${this.config.stats.gold} gold`,
      icon: '⚔️',
      duration: 2500,
    });
  }

  private dropLoot() {
    const offsetX = Phaser.Math.Between(-30, 30);
    const offsetY = Phaser.Math.Between(-20, 0);
    const loot = this.scene.add.text(this.x + offsetX, this.y + offsetY, '💊', { fontSize: '20px' });
    loot.setDepth(8);
    loot.setInteractive();
    loot.on('pointerdown', () => {
      useGameStore.getState().healPlayer(30);
      useGameStore.getState().addNotification({
        type: 'success', title: 'Healing Draught', message: 'Restored 30 HP', icon: '🧪',
      });
      loot.destroy();
    });

    this.scene.tweens.add({
      targets: loot,
      y: loot.y - 20,
      duration: 400,
      ease: 'Power2',
    });
  }

  applyBleed(duration: number) {
    this.bleedTimer = duration;
    this.setTint(0xff00ff);
    if (this.bleedTimerId) this.bleedTimerId.remove();
    this.bleedTimerId = this.scene.time.delayedCall(duration, () => {
      this.bleedTimerId = null;
      if (!this.isDead) this.clearTint();
    });
  }

  applyStun(duration: number) {
    this.isStunned = true;
    this.staggerTimer = 0;
    if (this.stunTimerId) this.stunTimerId.remove();
    this.stunTimerId = this.scene.time.delayedCall(duration, () => {
      this.stunTimerId = null;
      this.isStunned = false;
      if (!this.isDead) this.clearTint();
    });
  }

  getAIState(): AIState {
    return this.aiState;
  }

  getHP(): number { return this.hp; }
  getMaxHP(): number { return this.maxHp; }
  isAlive(): boolean { return !this.isDead; }

  destroy(fromScene?: boolean) {
    if (this.aiTimer) { this.aiTimer.remove(); this.aiTimer = null; }
    if (this.stunTimerId) { this.stunTimerId.remove(); this.stunTimerId = null; }
    if (this.bleedTimerId) { this.bleedTimerId.remove(); this.bleedTimerId = null; }
    if (this.hpBar?.active) this.hpBar.destroy();
    if (this.nameText?.active) this.nameText.destroy();
    this.clearTelegraph();
    if (this.scene) this.scene.tweens.killTweensOf(this);
    super.destroy(fromScene);
  }
}
