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
  }

  generateMap(): { platformBodies: Phaser.Physics.Arcade.StaticGroup; bounds: Phaser.Geom.Rectangle } {
    const { width, height, tileSize, theme } = this.config;
    const W = width * tileSize;
    const H = height * tileSize;

    this.drawBackground(theme, W, H);
    this.generatePlatforms(theme, width, height, tileSize);
    this.addDecorativeElements(theme, width, height, tileSize);
    this.addAmbientEffects(theme, W, H);

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

    this.drawParallaxLayer(theme, W, H);
  }

  private drawParallaxLayer(theme: ZoneTheme, W: number, H: number) {
    const bgKeys: Record<string, string> = {
      village: 'bg_village',
      forest: 'bg_forest',
      castle: 'bg_castle',
      catacombs: 'bg_catacombs',
      battlefield: 'bg_battlefield',
      cathedral: 'bg_castle',
      mountain: 'bg_forest',
    };
    
    // Skip vector parallax silhouettes if custom image backgrounds exist
    const key = bgKeys[theme];
    if (key && this.scene.textures.exists(key)) {
      return;
    }

    const farBg = this.scene.add.graphics();
    farBg.setDepth(-8);

    const midBg = this.scene.add.graphics();
    midBg.setDepth(-6);

    const nearBg = this.scene.add.graphics();
    nearBg.setDepth(-4);

    switch (theme) {
      case 'village':
        this.drawDistantMountains(farBg, W, H, 0x1a1a30, 0.3);
        this.drawDistantMountains(midBg, W, H, 0x221a2e, 0.5);
        this.drawVillageSilhouettes(nearBg, W, H);
        break;
      case 'forest':
        this.drawDistantMountains(farBg, W, H, 0x0a121a, 0.2);
        this.drawTreeSilhouettes(midBg, W, H, 0x0d1a0d, 0.6);
        this.drawTreeSilhouettes(nearBg, W, H, 0x0a140a, 0.8);
        break;
      case 'castle':
        this.drawDistantMountains(farBg, W, H, 0x0d0d1e, 0.2);
        this.drawCastleSilhouettes(midBg, W, H, 0x1a0d0d, 0.5);
        this.drawCastleSilhouettes(nearBg, W, H, 0x120808, 0.7);
        break;
      case 'catacombs':
        this.drawDistantMountains(farBg, W, H, 0x050510, 0.2);
        this.drawCatacombSilhouettes(midBg, W, H, 0x0a0018, 0.5);
        break;
      case 'battlefield':
        this.drawDistantMountains(farBg, W, H, 0x0f0a08, 0.3);
        this.drawBattlefieldSilhouettes(midBg, W, H, 0x1a0d05, 0.5);
        break;
      case 'mountain':
        this.drawDistantMountains(farBg, W, H, 0x0f1a2a, 0.2);
        this.drawDistantMountains(midBg, W, H, 0x141e30, 0.5);
        this.drawDistantMountains(nearBg, W, H, 0x1a2838, 0.7);
        break;
      case 'cathedral':
        this.drawDistantMountains(farBg, W, H, 0x0d0d1a, 0.2);
        this.drawCastleSilhouettes(midBg, W, H, 0x140d1a, 0.5);
        this.drawCathedralSilhouettes(nearBg, W, H);
        break;
    }

    this.bgLayers = [farBg, midBg, nearBg];
  }

  private drawDistantMountains(g: Phaser.GameObjects.Graphics, W: number, H: number, color: number, alpha: number) {
    g.fillStyle(color, alpha);
    let x = 0;
    while (x < W + 100) {
      const peak = H * (0.5 + Math.random() * 0.2);
      const w = 80 + Math.random() * 150;
      g.fillTriangle(x, H, x + w / 2, H - peak, x + w, H);
      x += w * (0.4 + Math.random() * 0.3);
    }
  }

  private drawTreeSilhouettes(g: Phaser.GameObjects.Graphics, W: number, H: number, color: number, alpha: number) {
    g.fillStyle(color, alpha);
    let x = 0;
    while (x < W + 50) {
      const treeH = 60 + Math.random() * 80;
      const w = 20 + Math.random() * 25;
      g.fillRect(x, H - treeH, w, treeH);
      g.fillTriangle(x - 10, H - treeH, x + w / 2, H - treeH - 40, x + w + 10, H - treeH);
      g.fillTriangle(x + 5, H - treeH - 20, x + w / 2, H - treeH - 60, x + w - 5, H - treeH - 20);
      x += 30 + Math.random() * 40;
    }
  }

  private drawVillageSilhouettes(g: Phaser.GameObjects.Graphics, W: number, H: number) {
    g.fillStyle(0x1a1220, 0.6);
    let x = 0;
    while (x < W + 80) {
      const houseH = 30 + Math.random() * 40;
      const houseW = 30 + Math.random() * 40;
      g.fillRect(x, H - houseH, houseW, houseH);
      g.fillTriangle(x - 5, H - houseH, x + houseW / 2, H - houseH - 25, x + houseW + 5, H - houseH);
      const winColor = Math.random() > 0.5 ? 0xffa050 : 0x404060;
      g.fillStyle(winColor, 0.4);
      g.fillRect(x + 5, H - houseH + 8, 6, 6);
      g.fillRect(x + houseW - 11, H - houseH + 8, 6, 6);
      g.fillStyle(0x1a1220, 0.6);
      x += 40 + Math.random() * 50;
    }
  }

  private drawCastleSilhouettes(g: Phaser.GameObjects.Graphics, W: number, H: number, color: number, alpha: number) {
    g.fillStyle(color, alpha);
    let x = 0;
    while (x < W + 80) {
      const towerH = 100 + Math.random() * 60;
      const towerW = 30 + Math.random() * 20;
      g.fillRect(x, H - towerH, towerW, towerH);
      for (let c = 0; c < 3; c++) {
        if (Math.random() > 0.5) {
          g.fillRect(x + c * 10, H - towerH - 8, 6, 8);
        }
      }
      g.fillRect(x - 2, H - towerH - 4, towerW + 4, 4);
      x += 50 + Math.random() * 60;
    }
  }

  private drawCathedralSilhouettes(g: Phaser.GameObjects.Graphics, W: number, H: number) {
    g.fillStyle(0x12081a, 0.6);
    const cx = W / 2 - 40;
    g.fillRect(cx, H - 180, 80, 180);
    g.fillTriangle(cx - 10, H - 180, cx + 40, H - 260, cx + 90, H - 180);
    g.fillRect(cx + 30, H - 200, 20, 20);
    g.fillStyle(0x2a0a30, 0.3);
    g.fillCircle(cx + 40, H - 100, 15);
  }

  private drawCatacombSilhouettes(g: Phaser.GameObjects.Graphics, W: number, H: number, color: number, alpha: number) {
    g.fillStyle(color, alpha);
    let x = 0;
    while (x < W + 50) {
      const colH = 50 + Math.random() * 40;
      const colW = 15 + Math.random() * 10;
      g.fillRect(x, H - colH, colW, colH);
      g.fillRect(x - 2, H - colH, colW + 4, 4);
      x += 25 + Math.random() * 30;
    }
  }

  private drawBattlefieldSilhouettes(g: Phaser.GameObjects.Graphics, W: number, H: number, color: number, alpha: number) {
    g.fillStyle(color, alpha);
    let x = 0;
    while (x < W + 80) {
      const ruinH = 20 + Math.random() * 50;
      const ruinW = 15 + Math.random() * 30;
      g.fillRect(x, H - ruinH, ruinW, ruinH);
      if (Math.random() > 0.5) {
        g.fillTriangle(x - 4, H - ruinH, x + ruinW / 2, H - ruinH - 20, x + ruinW + 4, H - ruinH);
      }
      x += 30 + Math.random() * 40;
    }
  }

  private generatePlatforms(theme: ZoneTheme, width: number, height: number, tileSize: number) {
    const T = tileSize;
    const W = width;
    const H = height;
    const groundY = H - 3;
    const platforms: { x: number; y: number; w: number }[] = [];

    const groundGaps: number[] = [];

    switch (theme) {
      case 'village':
        platforms.push({ x: 0, y: groundY, w: W });
        platforms.push({ x: 5, y: groundY - 5, w: 3 });
        platforms.push({ x: 10, y: groundY - 4, w: 2 });
        platforms.push({ x: 17, y: groundY - 6, w: 4 });
        platforms.push({ x: 24, y: groundY - 5, w: 3 });
        platforms.push({ x: 30, y: groundY - 4, w: 2 });
        groundGaps.push(13, 20, 28);
        break;
      case 'forest':
        platforms.push({ x: 0, y: groundY, w: W });
        platforms.push({ x: 3, y: groundY - 6, w: 4 });
        platforms.push({ x: 8, y: groundY - 4, w: 2 });
        platforms.push({ x: 12, y: groundY - 8, w: 3 });
        platforms.push({ x: 16, y: groundY - 5, w: 2 });
        platforms.push({ x: 20, y: groundY - 7, w: 4 });
        platforms.push({ x: 26, y: groundY - 4, w: 3 });
        platforms.push({ x: 30, y: groundY - 6, w: 2 });
        groundGaps.push(10, 18, 25, 33);
        break;
      case 'castle':
        platforms.push({ x: 0, y: groundY, w: W });
        platforms.push({ x: 4, y: groundY - 5, w: 2 });
        platforms.push({ x: 9, y: groundY - 3, w: 3 });
        platforms.push({ x: 14, y: groundY - 7, w: 4 });
        platforms.push({ x: 20, y: groundY - 4, w: 2 });
        platforms.push({ x: 25, y: groundY - 6, w: 3 });
        platforms.push({ x: 30, y: groundY - 5, w: 2 });
        groundGaps.push(7, 17, 23, 29, 34);
        break;
      case 'catacombs':
        platforms.push({ x: 0, y: groundY, w: 6 });
        platforms.push({ x: 10, y: groundY - 4, w: 4 });
        platforms.push({ x: 16, y: groundY - 8, w: 3 });
        platforms.push({ x: 20, y: groundY - 3, w: 2 });
        platforms.push({ x: 24, y: groundY - 6, w: 5 });
        platforms.push({ x: 30, y: groundY, w: 5 });
        groundGaps.push(6, 14, 22, 29);
        break;
      case 'battlefield':
        platforms.push({ x: 0, y: groundY, w: W });
        platforms.push({ x: 3, y: groundY - 4, w: 2 });
        platforms.push({ x: 8, y: groundY - 6, w: 3 });
        platforms.push({ x: 14, y: groundY - 5, w: 2 });
        platforms.push({ x: 19, y: groundY - 7, w: 4 });
        platforms.push({ x: 26, y: groundY - 4, w: 3 });
        platforms.push({ x: 31, y: groundY - 5, w: 2 });
        groundGaps.push(6, 12, 18, 24, 30);
        break;
      default:
        platforms.push({ x: 0, y: groundY, w: W });
        platforms.push({ x: 5, y: groundY - 5, w: 3 });
        platforms.push({ x: 12, y: groundY - 4, w: 2 });
        platforms.push({ x: 20, y: groundY - 6, w: 3 });
        platforms.push({ x: 28, y: groundY - 5, w: 2 });
        groundGaps.push(15, 25);
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

    const wallColors: Record<ZoneTheme, number[]> = {
      village: [0x4a3a2a, 0x3a2a1a],
      forest: [0x2a3a1a, 0x1a2a0d],
      castle: [0x3a3a4a, 0x2a2a3a],
      cathedral: [0x3a2a40, 0x2a1a32],
      mountain: [0x2a3840, 0x1a2832],
      catacombs: [0x1a1a28, 0x0f0f1a],
      battlefield: [0x2a1a0d, 0x1a0f08],
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
    const hasCustomBg = !!bgKeys[theme] && this.scene.textures.exists(bgKeys[theme]);

    const wallClr = wallColors[theme];
    const floorClr = floorColors[theme];

    for (const p of platforms) {
      const isGround = p.y === groundY;

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
      gfx.setDepth(0);

      const startX = p.x * T;
      const startY = p.y * T;
      const width = p.w * T;
      const height = T;

      if (!isGround) {
        // Sleek, high-end floating platform style with glowing borders instead of boxy tiles
        let accentColor = 0xb8860b; // Gold/Amber
        let baseColor = 0x1a1a2e; // Dark twilight blue
        
        if (theme === 'forest') {
          accentColor = 0x2e8b57; // SeaGreen
          baseColor = 0x0a1f0a;
        } else if (theme === 'castle') {
          accentColor = 0xda70d6; // Orchid
          baseColor = 0x1a0a22;
        } else if (theme === 'catacombs') {
          accentColor = 0x00ced1; // DarkTurquoise
          baseColor = 0x05101a;
        } else if (theme === 'battlefield') {
          accentColor = 0xd2691e; // Chocolate/Orange
          baseColor = 0x220a05;
        }

        // Semi-transparent center slab
        gfx.fillStyle(baseColor, 0.75);
        gfx.fillRoundedRect(startX, startY + 4, width, height - 8, 4);

        // Thin glowing top border
        gfx.fillStyle(accentColor, 1);
        gfx.fillRect(startX, startY + 2, width, 3);
        
        // Inner shadow/depth
        gfx.fillStyle(0x000000, 0.5);
        gfx.fillRect(startX, startY + height - 4, width, 2);

        // Subtle glowing magical core dots on the platforms
        gfx.fillStyle(accentColor, 0.4);
        for (let rx = startX + 16; rx < startX + width; rx += 32) {
          gfx.fillCircle(rx, startY + height / 2, 2);
        }
      } else {
        // Solid ground rectangle (one smooth surface instead of per-tile blocks)
        if (!hasCustomBg) {
          gfx.fillStyle(floorClr[0], 1);
          gfx.fillRect(startX, startY, width, height);
          gfx.fillStyle(floorClr[1], 1);
          gfx.fillRect(startX, startY + 2, width, 2);
        }
      }
    }
  }

  private addDecorativeElements(theme: ZoneTheme, width: number, height: number, tileSize: number) {
    const bgKeys: Record<string, string> = {
      village: 'bg_village',
      forest: 'bg_forest',
      castle: 'bg_castle',
      catacombs: 'bg_catacombs',
      battlefield: 'bg_battlefield',
      cathedral: 'bg_castle',
      mountain: 'bg_forest',
    };
    
    // Skip vector decorations if custom image background exists
    const key = bgKeys[theme];
    if (key && this.scene.textures.exists(key)) {
      return;
    }

    const T = tileSize;
    const W = width * T;
    const H = height * T;
    const g = this.scene.add.graphics();
    g.setDepth(1);

    switch (theme) {
      case 'village':
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * W;
          g.fillStyle(0x8b6914, 0.3);
          g.fillRect(x, H - 3 * T - 4, 2, 4);
          if (Math.random() > 0.5) {
            g.fillStyle(0xffa500, 0.4);
            g.fillCircle(x, H - 3 * T - 6, 3);
          }
        }
        break;
      case 'forest':
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * W;
          g.fillStyle(0x0d1f0d, 0.5);
          g.fillRect(x, H - 3 * T - 12, 3, 12);
          g.fillStyle(0x0a140a, 0.4);
          g.fillCircle(x + 1, H - 3 * T - 14, 4 + Math.random() * 3);
        }
        break;
      case 'castle':
        for (let i = 0; i < 12; i++) {
          const x = Math.random() * W;
          g.fillStyle(0x1a0a0a, 0.4);
          g.fillRect(x - 2, H - 3 * T - 10, 4, 10);
          g.fillStyle(0xff6600, 0.5);
          g.fillCircle(x, H - 3 * T - 12, 2);
        }
        break;
      case 'catacombs':
        for (let i = 0; i < 8; i++) {
          const x = Math.random() * W;
          g.fillStyle(0x4b0082, 0.3);
          g.fillCircle(x, H - 3 * T - 4, 4);
        }
        break;
      case 'battlefield':
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * W;
          g.fillStyle(0x222222, 0.5);
          g.fillEllipse(x, H - 3 * T, 8 + Math.random() * 12, 4 + Math.random() * 4);
        }
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * W;
          g.fillStyle(0xff4500, 0.4);
          g.fillCircle(x, H - 3 * T - 2, 3);
        }
        break;
    }
  }

  private addAmbientEffects(theme: ZoneTheme, W: number, H: number) {
    switch (theme) {
      case 'village':
        this.startRainEffect(W, H);
        break;
      case 'forest':
        this.startFogEffect(W, H);
        break;
      case 'catacombs':
      case 'battlefield':
        this.startAshEffect(W, H);
        break;
      case 'mountain':
        this.startSnowEffect(W, H);
        break;
    }
  }

  private startRainEffect(W: number, H: number) {
    const timer = this.scene.time.addEvent({
      delay: 25,
      loop: true,
      callback: () => {
        for (let i = 0; i < 2; i++) {
          const g = this.scene.add.graphics();
          g.lineStyle(1, 0x8fa8c8, 0.3);
          g.lineBetween(0, 0, 3, 10);
          g.setPosition(Math.random() * W, -10);
          g.setDepth(3);
          this.scene.tweens.add({
            targets: g, y: H + 10, x: g.x + 20,
            duration: 1000 + Math.random() * 400, ease: 'Linear',
            onComplete: () => g.destroy(),
          });
        }
      },
    });
    this.ambientTimers.push(timer);
  }

  private startFogEffect(W: number, H: number) {
    const spawnCloud = (initialX: number) => {
      // Return if the scene is no longer active (prevents timer loop memory leaks)
      if (!this.scene || !this.scene.sys.isActive()) return;

      const fog = this.scene.add.image(initialX, H * (0.2 + Math.random() * 0.55), 'fog_cloud');
      fog.setDepth(20); // Drift in front of platforms and trees
      fog.setAlpha(0.12 + Math.random() * 0.1);
      const sc = 1.5 + Math.random() * 2.0;
      fog.setScale(sc);
      fog.setScrollFactor(0.85); // Light parallax scroll relative to camera
      this.decorations.push(fog);

      const duration = 25000 + Math.random() * 20000;
      this.scene.tweens.add({
        targets: fog,
        x: W + 200,
        duration: duration * (1 - Math.max(0, initialX / W)),
        ease: 'Linear',
        onComplete: () => {
          // Remove from decorations tracker to keep list small
          const idx = this.decorations.indexOf(fog);
          if (idx !== -1) this.decorations.splice(idx, 1);
          fog.destroy();

          // Respawn at the far left
          spawnCloud(-200);
        }
      });
    };

    // Pre-populate with 8 drifting clouds spread across map width
    for (let i = 0; i < 8; i++) {
      spawnCloud(Math.random() * W);
    }
  }

  private startAshEffect(W: number, H: number) {
    const timer = this.scene.time.addEvent({
      delay: 150, loop: true,
      callback: () => {
        const g = this.scene.add.graphics();
        g.fillStyle(0x444444, 0.4);
        g.fillCircle(0, 0, 2);
        g.setPosition(Math.random() * W, -10);
        g.setDepth(3);
        this.scene.tweens.add({
          targets: g, y: H + 10, x: g.x + Phaser.Math.Between(-40, 40),
          duration: 4000 + Math.random() * 3000, alpha: 0, ease: 'Sine.easeInOut',
          onComplete: () => g.destroy(),
        });
      },
    });
    this.ambientTimers.push(timer);
  }

  private startSnowEffect(W: number, H: number) {
    const timer = this.scene.time.addEvent({
      delay: 100, loop: true,
      callback: () => {
        for (let i = 0; i < 2; i++) {
          const g = this.scene.add.graphics();
          g.fillStyle(0xe8f4fc, 0.6);
          g.fillCircle(0, 0, 1 + Math.random() * 2);
          g.setPosition(Math.random() * W, -10);
          g.setDepth(3);
          this.scene.tweens.add({
            targets: g, y: H + 10, x: g.x + Phaser.Math.Between(-30, 30),
            duration: 2500 + Math.random() * 2000, ease: 'Sine.easeInOut',
            onComplete: () => g.destroy(),
          });
        }
      },
    });
    this.ambientTimers.push(timer);
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
