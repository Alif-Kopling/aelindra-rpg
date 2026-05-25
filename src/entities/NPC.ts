import Phaser from 'phaser';
import { DialogueLine } from '../utils/types';

export interface NPCConfig {
  name: string;
  portrait?: string;
  dialogue: DialogueLine[];
  color: number;
  accentColor: number;
  routinePoints?: { x: number; y: number }[];
  isShop?: boolean;
  isCheckpoint?: boolean;
}

export class NPC extends Phaser.Physics.Arcade.Sprite {
  private config: NPCConfig;
  private nameLabel!: Phaser.GameObjects.Text;
  private interactPrompt!: Phaser.GameObjects.Text;
  private routineIndex = 0;
  private routineTimer = 0;
  private routineDelay = 3000;
  private frameTimer = 0;
  private currentFrame = 0;
  private isMoving = false;
  private inRange = false;
  private glowEffect!: Phaser.GameObjects.Graphics;

  private static PORTRAIT_TEXTURES: Record<string, string> = {
    evelyne: 'princess_sprite',
    blacksmith: 'npc_blacksmith',
    boy: 'npc_boy',
    nun: 'npc_nun',
  };

  constructor(scene: Phaser.Scene, x: number, y: number, config: NPCConfig) {
    let finalTexKey = `npc_${config.name.replace(/\s+/g, '_')}`;
    const texKey = config.portrait ? NPC.PORTRAIT_TEXTURES[config.portrait] : undefined;
    const usePreloaded = !!texKey && scene.textures.exists(texKey);

    if (usePreloaded) {
      finalTexKey = texKey;
    } else {
      NPC.generateTexture(scene, finalTexKey, config.color, config.accentColor);
    }

    super(scene, x, y, finalTexKey);
    this.config = config;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setImmovable(!config.routinePoints?.length);

    if (usePreloaded) {
      const baseScaleX = 64 / this.width;
      const baseScaleY = 92 / this.height;
      this.setScale(baseScaleX, baseScaleY);
      
      // Use texture-space coordinates:
      // We want the body to be centered horizontally and anchored near the bottom
      const bw = this.width * 0.4;
      const bh = this.height * 0.8;
      body.setSize(bw, bh);
      body.setOffset((this.width - bw) / 2, this.height - bh);
    } else {
      this.setScale(2);
      const th = 46; // Texture height from generateTexture
      const tw = 32; // Texture width
      const bh = 30;
      const bw = 20;
      body.setSize(bw, bh);
      body.setOffset((tw - bw) / 2, th - bh);
    }

    this.setDepth(8);

    this.createLabels();
    this.createGlow();

    if (config.isCheckpoint) {
      this.createCheckpointEffect();
    }
  }

  static generateTexture(scene: Phaser.Scene, key: string, bodyColor: number, accentColor: number) {
    if (scene.textures.exists(key)) return;

    const g = scene.make.graphics();

    g.fillStyle(bodyColor);
    g.fillRect(6, 12, 20, 20);
    g.fillStyle(accentColor);
    g.fillRect(8, 14, 16, 8);
    g.fillStyle(0xd4a574);
    g.fillRect(8, 2, 16, 14);
    g.fillStyle(((bodyColor & 0xff) > 0x88) ? 0x3d2b1f : 0xc8a862);
    g.fillRect(7, 2, 18, 5);
    g.fillStyle(0x2c1810);
    g.fillRect(11, 10, 3, 2);
    g.fillRect(18, 10, 3, 2);
    g.fillStyle(bodyColor);
    g.fillRect(8, 32, 8, 10);
    g.fillRect(16, 32, 8, 10);
    g.fillStyle(0x2c1810);
    g.fillRect(7, 40, 9, 4);
    g.fillRect(16, 40, 9, 4);

    const rt = scene.add.renderTexture(0, 0, 32, 46);
    rt.draw(g, 0, 0);
    rt.saveTexture(key);
    rt.destroy();
    g.destroy();
  }

  private createLabels() {
    this.nameLabel = this.scene.add.text(this.x, this.y - 40, this.config.name, {
      fontSize: '9px',
      fontFamily: 'Cinzel, serif',
      color: '#f4e4c1',
      stroke: '#000',
      strokeThickness: 3,
    });
    this.nameLabel.setOrigin(0.5, 1);
    this.nameLabel.setDepth(25);
    this.nameLabel.setVisible(false);

    this.interactPrompt = this.scene.add.text(this.x, this.y - 55, '[E] Talk', {
      fontSize: '8px',
      fontFamily: 'Cinzel, serif',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 3,
    });
    this.interactPrompt.setOrigin(0.5, 1);
    this.interactPrompt.setDepth(25);
    this.interactPrompt.setVisible(false);

    this.scene.tweens.add({
      targets: this.interactPrompt,
      alpha: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 800,
    });
  }

  private createGlow() {
    this.glowEffect = this.scene.add.graphics();
    this.glowEffect.setDepth(7);

    if (this.config.isCheckpoint) {
      this.glowEffect.fillStyle(0xffd700, 0.15);
      this.glowEffect.fillCircle(this.x, this.y, 40);
    }
  }

  private createCheckpointEffect() {
    for (let i = 0; i < 6; i++) {
      const particle = this.scene.add.graphics();
      particle.fillStyle(0xffd700, 0.8);
      particle.fillCircle(0, 0, 3);
      particle.setDepth(26);

      const radius = 35 + Math.random() * 10;
      const speed = 0.8 + Math.random() * 0.5;
      const startAngle = (i / 6) * Math.PI * 2;

      this.scene.tweens.add({
        targets: particle,
        duration: 3000 / speed,
        repeat: -1,
        onUpdate: (tween) => {
          const angle = startAngle + tween.progress * Math.PI * 2;
          particle.setPosition(
            this.x + Math.cos(angle) * radius,
            this.y + Math.sin(angle) * radius
          );
        },
      });
    }
  }

  update(_delta: number, playerX: number, playerY: number) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
    const wasInRange = this.inRange;
    this.inRange = dist < 80;

    if (this.inRange !== wasInRange) {
      this.nameLabel.setVisible(this.inRange);
      this.interactPrompt.setVisible(this.inRange);
    }

    const labelY = this.y - this.displayHeight / 2;
    this.nameLabel.setPosition(this.x, labelY - 8);
    this.interactPrompt.setPosition(this.x, labelY - 20);

    if (this.config.routinePoints && this.config.routinePoints.length > 0) {
      this.handleRoutine(_delta);
    }

    this.frameTimer += _delta;
    if (this.frameTimer > 600) {
      this.frameTimer = 0;
      this.scene.tweens.add({
        targets: this,
        y: this.y - 2,
        yoyo: true,
        duration: 300,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private handleRoutine(delta: number) {
    if (!this.config.routinePoints) return;

    this.routineTimer += delta;

    if (this.routineTimer >= this.routineDelay) {
      this.routineTimer = 0;
      this.routineIndex = (this.routineIndex + 1) % this.config.routinePoints.length;
    }

    const target = this.config.routinePoints[this.routineIndex];
    const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

    if (dist > 10) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const dx = target.x - this.x;
      body.setVelocityX(dx > 0 ? 40 : -40);
      this.setFlipX(dx < 0);
      this.isMoving = true;
    } else {
      (this.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
      this.isMoving = false;
    }
  }

  isPlayerInRange(): boolean {
    return this.inRange;
  }

  getDialogue(): DialogueLine[] {
    return this.config.dialogue;
  }

  getName(): string {
    return this.config.name;
  }

  isCheckpointNPC(): boolean {
    return this.config.isCheckpoint || false;
  }

  destroy(fromScene?: boolean) {
    if (this.nameLabel) this.nameLabel.destroy();
    if (this.interactPrompt) this.interactPrompt.destroy();
    if (this.glowEffect) this.glowEffect.destroy();
    super.destroy(fromScene);
  }
}
