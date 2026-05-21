import Phaser from 'phaser';

export type ZoneTheme = 'village' | 'forest' | 'castle' | 'cathedral' | 'mountain' | 'catacombs' | 'battlefield';

export interface MapConfig {
  theme: ZoneTheme;
  width: number;
  height: number;
  tileSize: number;
  name: string;
}

export class MapSystem {
  private scene: Phaser.Scene;
  private config: MapConfig;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private bgLayers: Phaser.GameObjects.Graphics[] = [];
  private decorations: Phaser.GameObjects.GameObject[] = [];
  private ambientTimers: Phaser.Time.TimerEvent[] = [];

  constructor(scene: Phaser.Scene, config: MapConfig) {
    this.scene = scene;
    this.config = config;
    this.platformGroup = scene.physics.add.staticGroup();
    this.ambientTimers = [];
    this.bgLayers = [];
    this.decorations = [];
  }

  generateMap(): { platformBodies: Phaser.Physics.Arcade.StaticGroup; bounds: Phaser.Geom.Rectangle } {
    const { width, height, tileSize, theme } = this.config;
    const W = width * tileSize;
    const H = height * tileSize;

    this.drawBackground(theme, W, H);
    this.generatePlatforms(theme, width, height, tileSize);
    this.addForegroundVignette(W, H);

    this.scene.physics.world.setBounds(0, 0, W, H);
    this.scene.cameras.main.setBounds(0, 0, W, H);

    return { platformBodies: this.platformGroup, bounds: new Phaser.Geom.Rectangle(0, 0, W, H) };
  }

  private drawBackground(theme: ZoneTheme, W: number, H: number) {
    const bgKeys: Record<string, string> = {
      village: 'bg_village',
      forest: 'bg_forest',
      castle: 'bg_castle',
      catacombs: 'bg_catacombs',
      battlefield: 'bg_battlefield',
      cathedral: 'bg_castle',
      mountain: 'bg_forest',
    };

    const key = bgKeys[theme];
    const cam = this.scene.cameras.main;
    const viewW = cam.width || 1280;
    const viewH = cam.height || 720;

    if (key && this.scene.textures.exists(key)) {
      const bgImg = this.scene.add.image(viewW / 2, viewH / 2, key);
      bgImg.setOrigin(0.5, 0.5);
      bgImg.setDepth(-10);
      bgImg.setScrollFactor(0.15, 0.05); // Light parallax scrolling
      const scale = Math.max(viewW / bgImg.width, viewH / bgImg.height);
      const parallaxScale = scale * 1.25;
      bgImg.setDisplaySize(bgImg.width * parallaxScale, bgImg.height * parallaxScale);
    } else {
      const sky = this.scene.add.graphics();
      sky.setDepth(-10);

      const bgColors: Record<ZoneTheme, { top: number; bottom: number }> = {
        village: { top: 0x1a1a2e, bottom: 0x2d1b2e },
        forest: { top: 0x0a0a14, bottom: 0x0d1f0d },
        castle: { top: 0x0d0d1a, bottom: 0x1a0a0a },
        cathedral: { top: 0x0d0d1a, bottom: 0x1a0d14 },
        mountain: { top: 0x0d141e, bottom: 0x141e28 },
        catacombs: { top: 0x050508, bottom: 0x0a0014 },
        battlefield: { top: 0x0f0a0a, bottom: 0x1a0d05 },
      };

      const c = bgColors[theme];
      sky.fillGradientStyle(c.top, c.top, c.bottom, c.bottom, 1, 1, 1, 1);
      sky.fillRect(0, 0, W, H);
    }
  }

  private generatePlatforms(theme: ZoneTheme, width: number, height: number, tileSize: number) {
    const T = tileSize;
    const W = width;
    const H = height;
    const groundY = H - 1;
    const platforms: { x: number; y: number; w: number }[] = [];

    switch (theme) {
      case 'village':
        platforms.push({ x: 0, y: groundY, w: W });
        break;
      case 'forest':
        platforms.push({ x: 0, y: groundY, w: W });
        break;
      case 'castle':
        platforms.push({ x: 0, y: groundY, w: W });
        break;
      case 'catacombs':
        platforms.push({ x: 0, y: groundY, w: W });
        break;
      case 'battlefield':
        platforms.push({ x: 0, y: groundY, w: W });
        break;
      default:
        platforms.push({ x: 0, y: groundY, w: W });
    }

    const floorColors: Record<ZoneTheme, number[]> = {
      village: [0x3a2a1a, 0x2d1f12],
      forest: [0x1a2a0d, 0x0d1f08],
      castle: [0x2a2a3a, 0x1a1a2a],
      cathedral: [0x2a2030, 0x1a1525],
      mountain: [0x1a2830, 0x0d1a22],
      catacombs: [0x0a0a18, 0x050510],
      battlefield: [0x1a0d05, 0x0f0803],
    };

    const bgKeys: Record<string, string> = {
      village: 'bg_village',
      forest: 'bg_forest',
      castle: 'bg_castle',
      catacombs: 'bg_catacombs',
      battlefield: 'bg_battlefield',
      cathedral: 'bg_castle',
      mountain: 'bg_forest',
    };
    const floorClr = floorColors[theme];

    for (const p of platforms) {
      // 1. Create Phaser Arcade Static physics body (always invisible)
      for (let tx = p.x; tx < p.x + p.w && tx < W; tx++) {
        const px = tx * T + T / 2;
        const py = p.y * T + T / 2;
        const tile = this.platformGroup.create(px, py, 'pixel') as Phaser.Physics.Arcade.Sprite;
        tile.setDisplaySize(T, T);
        tile.setVisible(false);
        tile.refreshBody();
      }

      // 2. Draw Visuals for the platforms
      const gfx = this.scene.add.graphics();
      gfx.setDepth(5); // Bring ground visuals in front of background

      const startX = p.x * T;
      const startY = p.y * T;
      const width = p.w * T;
      const height = T;

      // Solid ground rectangle (one smooth surface instead of per-tile blocks)
      gfx.fillStyle(floorClr[0], 1);
      gfx.fillRect(startX, startY, width, height);
      gfx.fillStyle(floorClr[1], 1);
      gfx.fillRect(startX, startY + 2, width, 4); // Thicker top line for better visibility
    }
  }

  private addForegroundVignette(W: number, H: number) {
    const v = this.scene.add.graphics();
    v.setDepth(100);
    v.setScrollFactor(0);
    
    const cam = this.scene.cameras.main;
    const viewW = cam.width || 1280;
    const viewH = cam.height || 720;

    // Fixed vignette for the entire screen
    v.fillStyle(0x000000, 0.25);
    v.fillRect(0, 0, viewW, 40); // Top bar
    v.fillRect(0, viewH - 40, viewW, 40); // Bottom bar
  }

  getPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    return this.platformGroup;
  }

  destroy() {
    this.ambientTimers.forEach(t => t.remove());
    this.bgLayers.forEach(g => g.destroy());
    this.decorations.forEach(d => d.destroy());
    this.platformGroup.destroy(true);
  }
}
