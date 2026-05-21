import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image('player_sprite', 'assets/images/knight_player.png');
    this.load.image('player_attack1', 'assets/images/knight_player_attack1.png');
    this.load.image('player_attack2', 'assets/images/knight_player_attack2.png');
    this.load.image('enemy_undead_sprite', 'assets/images/undead_enemy.png');
    this.load.image('enemy_beast_sprite', 'assets/images/beast_enemy.png');
    this.load.image('enemy_corrupted_sprite', 'assets/images/corrupted_enemy.png');
    this.load.image('boss_blind_king_sprite', 'assets/images/blind_king_boss.png');
    this.load.image('boss_ashen_knight_sprite', 'assets/images/boss_ashen_knight.png');
    this.load.image('anim_boss_vs_mc', 'assets/images/animation/pict-animasi-boss-vs-mc.png');

    this.load.image('scene_intro_1', 'assets/images/animation/scene1-before-tragedy.jpeg');
    this.load.image('scene_intro_3', 'assets/images/animation/scene3-The-Tragedy.jpeg');
    this.load.image('scene_intro_4', 'assets/images/animation/scene4-evelyn-marah-kepada-mc.png');
    this.load.image('scene_intro_5', 'assets/images/animation/scene5-mc-dipenjara-atas-fitnah.jpeg');
    this.load.image('scene_intro_6', 'assets/images/animation/scene6-mc-diselamatkan-oleh-seseorang.jpeg');
    this.load.image('scene_intro_escape', 'assets/images/animation/last-scene-mc-kabur-dari-penjara.jpeg');

    // Load background assets
    this.load.image('bg_village', 'assets/images/village bg.jpeg');
    this.load.image('bg_forest', 'assets/images/forest-bg.jpeg');
    this.load.image('bg_castle', 'assets/images/castle-bg.jpeg');
    this.load.image('bg_catacombs', 'assets/images/cave-bg.jpeg');
    this.load.image('bg_battlefield', 'assets/images/boss-fight-bg.jpeg');
    this.load.image('bg_ending', 'assets/images/ending-bg-dialog.jpeg');

    // Load NPC sprites
    this.load.image('princess_sprite', 'assets/images/evelyn-princess.png');
    this.load.image('npc_blacksmith', 'assets/images/npc-blacksmith.png');
    this.load.image('npc_nun', 'assets/images/npc-thenun.png');
    this.load.image('npc_boy', 'assets/images/npc-villages-boy.png');

    // Load audio
    this.load.audio('sfx_slash_1', 'assets/audio/sword-slash-1.mp3');
    this.load.audio('sfx_slash_2', 'assets/audio/sword-slash-2.mp3');
    this.load.audio('sfx_slash_3', 'assets/audio/sword-slash-3.mp3');
    this.load.audio('sfx_slash_4', 'assets/audio/sword-slash-4.mp3');
    this.load.audio('sfx_critical', 'assets/audio/Critical-sound.mp3');
    this.load.audio('sfx_undead', 'assets/audio/undead-monster-sound.mp3');
    this.load.audio('sfx_footstep', 'assets/audio/footstaps.mp3');
    this.load.audio('sfx_dialog', 'assets/audio/dialog-sound.mp3');
  }

  create() {
    this.generateTextures();
    this.scene.start('GameplayScene');
  }

  private generateTextures() {
    const g = this.make.graphics();
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 1, 1);
    const px = this.add.renderTexture(0, 0, 1, 1);
    px.draw(g, 0, 0);
    px.saveTexture('pixel');
    px.destroy();
    g.destroy();

    this.makePlayerTextures();
    this.makeEnvironmentTextures();
    this.makeEffectTextures();
    this.makeUITextures();
    this.makeItemTextures();
  }

  private makePlayerTextures() {
    const g = this.make.graphics();

    const frames: { key: string; draw: () => void }[] = [];

    frames.push({
      key: 'player_idle_0',
      draw: () => {
        g.clear();
        g.fillStyle(0x1a1a2e);
        g.fillRect(2, 8, 28, 26);
        g.fillStyle(0x222240);
        g.fillRect(4, 10, 24, 14);
        g.fillStyle(0xe8e0d0);
        g.fillCircle(16, 6, 9);
        g.fillStyle(0x1a1a2e);
        g.fillRect(8, 0, 16, 6);
        g.fillStyle(0xffffff);
        g.fillRect(12, 5, 3, 2);
        g.fillRect(17, 5, 3, 2);
        g.fillStyle(0x000000);
        g.fillRect(13, 5, 1, 1);
        g.fillRect(18, 5, 1, 1);
        g.fillStyle(0x1a1a2e);
        g.fillRect(4, 34, 10, 12);
        g.fillRect(18, 34, 10, 12);
        g.fillStyle(0x0f0f1a);
        g.fillRect(2, 44, 12, 4);
        g.fillRect(18, 44, 12, 4);
        g.fillStyle(0x2a0a0a);
        g.fillRect(0, 8, 3, 28);
        g.fillRect(29, 8, 3, 28);
        g.fillStyle(0x222240);
        g.fillRect(0, 8, 5, 10);
        g.fillRect(27, 8, 5, 10);
        g.fillStyle(0x808090);
        g.fillRect(30, 12, 4, 26);
        g.fillStyle(0xb8860b);
        g.fillRect(29, 20, 6, 3);
      },
    });

    frames.push({
      key: 'player_idle_1',
      draw: () => {
        g.clear();
        g.fillStyle(0x1a1a2e);
        g.fillRect(2, 9, 28, 26);
        g.fillStyle(0x222240);
        g.fillRect(4, 11, 24, 14);
        g.fillStyle(0xe8e0d0);
        g.fillCircle(16, 7, 9);
        g.fillStyle(0x1a1a2e);
        g.fillRect(8, 1, 16, 6);
        g.fillStyle(0xffffff);
        g.fillRect(12, 6, 3, 2);
        g.fillRect(17, 6, 3, 2);
        g.fillStyle(0x000000);
        g.fillRect(13, 6, 1, 1);
        g.fillRect(18, 6, 1, 1);
        g.fillStyle(0x1a1a2e);
        g.fillRect(4, 35, 10, 12);
        g.fillRect(18, 35, 10, 12);
        g.fillStyle(0x0f0f1a);
        g.fillRect(2, 45, 12, 3);
        g.fillRect(18, 45, 12, 3);
        g.fillStyle(0x2a0a0a);
        g.fillRect(0, 9, 3, 28);
        g.fillRect(29, 9, 3, 28);
        g.fillStyle(0x222240);
        g.fillRect(0, 9, 5, 10);
        g.fillRect(27, 9, 5, 10);
        g.fillStyle(0x808090);
        g.fillRect(30, 13, 4, 26);
        g.fillStyle(0xb8860b);
        g.fillRect(29, 21, 6, 3);
      },
    });

    for (let i = 0; i < 4; i++) {
      frames.push({
        key: `player_run_${i}`,
        draw: () => {
          g.clear();
          const legPhase = i % 2 === 0;
          const lean = i % 2 === 0 ? 2 : -2;
          g.fillStyle(0x1a1a2e);
          g.fillRect(2 + lean, 8, 28, 26);
          g.fillStyle(0x222240);
          g.fillRect(4 + lean, 10, 24, 14);
          g.fillStyle(0xe8e0d0);
          g.fillCircle(16 + lean, 6, 9);
          g.fillStyle(0x1a1a2e);
          g.fillRect(8 + lean, 0, 16, 6);
          g.fillStyle(0xffffff);
          g.fillRect(12 + lean, 5, 3, 2);
          g.fillRect(17 + lean, 5, 3, 2);
          g.fillStyle(0x000000);
          g.fillRect(13 + lean, 5, 1, 1);
          g.fillRect(18 + lean, 5, 1, 1);
          g.fillStyle(0x1a1a2e);
          if (legPhase) {
            g.fillRect(4, 34, 10, 6);
            g.fillRect(5, 40, 8, 6);
            g.fillRect(18, 34, 10, 12);
          } else {
            g.fillRect(4, 34, 10, 12);
            g.fillRect(18, 34, 10, 6);
            g.fillRect(19, 40, 8, 6);
          }
          g.fillStyle(0x0f0f1a);
          g.fillRect(2, 44, 12, 4);
          g.fillRect(18, 44, 12, 4);
          g.fillStyle(0x2a0a0a);
          g.fillRect(0 + lean, 8, 3, 28);
          g.fillRect(29 + lean, 8, 3, 28);
          g.fillStyle(0x222240);
          g.fillRect(0 + lean, 8, 5, 10);
          g.fillRect(27 + lean, 8, 5, 10);
          g.fillStyle(0x808090);
          g.fillRect(30 + lean, 12, 4, 26);
          g.fillStyle(0xb8860b);
          g.fillRect(29 + lean, 20, 6, 3);
        },
      });
    }

    for (let i = 0; i < 3; i++) {
      frames.push({
        key: `player_attack_${i}`,
        draw: () => {
          g.clear();
          const extend = i * 6;
          g.fillStyle(0x1a1a2e);
          g.fillRect(2, 8, 28, 26);
          g.fillStyle(0x222240);
          g.fillRect(4, 10, 24, 14);
          g.fillStyle(0xe8e0d0);
          g.fillCircle(16, 6, 9);
          g.fillStyle(0x1a1a2e);
          g.fillRect(8, 0, 16, 6);
          g.fillStyle(0xffffff);
          g.fillRect(12, 5, 3, 2);
          g.fillRect(17, 5, 3, 2);
          g.fillStyle(0x1a1a2e);
          g.fillRect(4, 34, 10, 12);
          g.fillRect(18, 34, 10, 12);
          g.fillStyle(0x0f0f1a);
          g.fillRect(2, 44, 12, 4);
          g.fillRect(18, 44, 12, 4);
          g.fillStyle(0x2a0a0a);
          g.fillRect(0, 8, 3, 28);
          g.fillRect(29, 8, 3, 28);
          g.fillStyle(0x808090);
          g.fillRect(30 + extend, 10, 6, 28);
          g.fillStyle(0xb8860b);
          g.fillRect(29 + extend, 20, 8, 3);
          if (i === 1) {
            g.fillStyle(0xffffff, 0.6);
            g.fillRect(32, 6, 4, 30);
          }
          if (i === 2) {
            g.fillStyle(0xffffff, 0.3);
            g.fillRect(34, 4, 6, 34);
          }
        },
      });
    }

    frames.push({
      key: 'player_dash_0',
      draw: () => {
        g.clear();
        g.fillStyle(0x1a1a2e, 0.3);
        g.fillRect(0, 8, 22, 26);
        g.fillStyle(0x1a1a2e);
        g.fillRect(6, 8, 28, 26);
        g.fillStyle(0xe8e0d0);
        g.fillCircle(20, 6, 9);
        g.fillStyle(0x1a1a2e);
        g.fillRect(12, 0, 16, 6);
        g.fillStyle(0x2a0a0a);
        g.fillRect(4, 8, 3, 28);
        g.fillRect(31, 8, 3, 28);
        g.fillStyle(0x808090);
        g.fillRect(32, 12, 4, 26);
        g.fillStyle(0xb8860b);
        g.fillRect(31, 20, 6, 3);
      },
    });

    for (const frame of frames) {
      const rt = this.add.renderTexture(0, 0, 48, 48);
      frame.draw();
      rt.draw(g, 0, 0);
      rt.saveTexture(frame.key);
      rt.destroy();
    }

    g.destroy();
  }

  private makeEnvironmentTextures() {
    const g = this.make.graphics();

    for (let i = 0; i < 2; i++) {
      const rt = this.add.renderTexture(0, 0, 48, 80);
      g.clear();
      g.fillStyle(0x2a1a0a);
      g.fillRect(20, 50, 8, 30);
      const green = i === 0 ? 0x0d2a0d : 0x0a1a0a;
      g.fillStyle(green, 0.8);
      g.fillEllipse(24, 40, 32, 28);
      g.fillStyle(Phaser.Display.Color.IntegerToColor(green).lighten(10).color, 0.7);
      g.fillEllipse(24, 30, 26, 22);
      g.fillStyle(Phaser.Display.Color.IntegerToColor(green).lighten(20).color, 0.6);
      g.fillEllipse(24, 22, 20, 16);
      rt.draw(g, 0, 0);
      rt.saveTexture(`tree_${i}`);
      rt.destroy();
    }

    const houseRt = this.add.renderTexture(0, 0, 96, 80);
    g.clear();
    g.fillStyle(0x3a2a1a);
    g.fillRect(0, 32, 96, 48);
    g.fillStyle(0x2a1a0a);
    g.fillRect(2, 34, 92, 44);
    g.fillStyle(0x5a2a0a);
    g.fillTriangle(0, 32, 48, 0, 96, 32);
    g.fillStyle(0x4a1a0a);
    g.fillTriangle(4, 32, 48, 6, 92, 32);
    g.fillStyle(0x2a1a0a);
    g.fillRect(38, 52, 20, 28);
    g.fillStyle(0xffc080, 0.5);
    g.fillRect(8, 44, 20, 14);
    g.fillRect(68, 44, 20, 14);
    g.fillStyle(0x2a1a0a);
    g.fillRect(8, 50, 20, 2);
    g.fillRect(68, 50, 20, 2);
    houseRt.draw(g, 0, 0);
    houseRt.saveTexture('house');
    houseRt.destroy();

    const candleRt = this.add.renderTexture(0, 0, 8, 16);
    g.clear();
    g.fillStyle(0x8a7a5a);
    g.fillRect(2, 6, 4, 10);
    g.fillStyle(0xffa030, 0.8);
    g.fillCircle(4, 4, 3);
    g.fillStyle(0xffd060, 0.6);
    g.fillCircle(4, 3, 2);
    candleRt.draw(g, 0, 0);
    candleRt.saveTexture('candle_0');
    candleRt.destroy();

    g.destroy();
  }

  private makeEffectTextures() {
    const g = this.make.graphics();

    for (let i = 0; i < 4; i++) {
      const rt = this.add.renderTexture(0, 0, 48, 16);
      g.clear();
      const alpha = 1 - i * 0.25;
      g.fillStyle(0xffffff, alpha);
      g.fillEllipse(24 - i * 5, 8, 48 - i * 10, 6);
      g.fillStyle(0xaaddff, alpha * 0.6);
      g.fillEllipse(24 - i * 5, 8, 40 - i * 10, 8);
      rt.draw(g, 0, 0);
      rt.saveTexture(`slash_${i}`);
      rt.destroy();
    }

    for (let i = 0; i < 4; i++) {
      const rt = this.add.renderTexture(0, 0, 32, 32);
      g.clear();
      const r = 8 + i * 3;
      g.fillStyle(0x4169e1, (1 - i * 0.2));
      g.fillCircle(16, 16, r);
      g.fillStyle(0xffffff, (0.8 - i * 0.2));
      g.fillCircle(16, 16, r / 2);
      rt.draw(g, 0, 0);
      rt.saveTexture(`magic_${i}`);
      rt.destroy();
    }

    // Soft fog/mist texture
    const fogRt = this.add.renderTexture(0, 0, 128, 128);
    g.clear();
    for (let r = 64; r > 0; r -= 4) {
      const alpha = (1 - r / 64) * 0.16;
      g.fillStyle(0xffffff, alpha);
      g.fillCircle(64, 64, r);
    }
    fogRt.draw(g, 0, 0);
    fogRt.saveTexture('fog_cloud');
    fogRt.destroy();

    g.destroy();
  }

  private makeUITextures() {
    const g = this.make.graphics();

    const arrowRt = this.add.renderTexture(0, 0, 16, 6);
    g.clear();
    g.fillStyle(0xc8a882);
    g.fillRect(0, 2, 12, 2);
    g.fillStyle(0xbdc3c7);
    g.fillRect(10, 0, 6, 6);
    arrowRt.draw(g, 0, 0);
    arrowRt.saveTexture('arrow');
    arrowRt.destroy();

    const dmgRt = this.add.renderTexture(0, 0, 40, 20);
    g.clear();
    g.fillStyle(0x000000, 0.5);
    g.fillRoundedRect(0, 0, 40, 20, 4);
    dmgRt.draw(g, 0, 0);
    dmgRt.saveTexture('dmg_bg');
    dmgRt.destroy();

    g.destroy();
  }

  private makeItemTextures() {
    const g = this.make.graphics();

    const potionRt = this.add.renderTexture(0, 0, 16, 20);
    g.clear();
    g.fillStyle(0x800000);
    g.fillRect(4, 6, 8, 12);
    g.fillStyle(0xdc143c);
    g.fillRect(5, 7, 6, 10);
    g.fillStyle(0x696969);
    g.fillRect(5, 3, 6, 4);
    g.fillStyle(0xc0c0c0);
    g.fillRect(4, 2, 8, 3);
    potionRt.draw(g, 0, 0);
    potionRt.saveTexture('item_potion');
    potionRt.destroy();

    const swordRt = this.add.renderTexture(0, 0, 24, 32);
    g.clear();
    g.fillStyle(0x808080);
    g.fillRect(10, 0, 4, 24);
    g.fillStyle(0xc0c0c0);
    g.fillRect(11, 1, 2, 22);
    g.fillStyle(0xb8860b);
    g.fillRect(5, 18, 14, 3);
    g.fillStyle(0x8b6914);
    g.fillRect(9, 21, 6, 10);
    swordRt.draw(g, 0, 0);
    swordRt.saveTexture('item_sword');
    swordRt.destroy();

    g.destroy();
  }
}
