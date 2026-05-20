import Phaser from 'phaser';
import { GameplayScene } from '../scenes/GameplayScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export function createPhaserGame(parent: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: '#0f0f1a',
    pixelArt: false,
    antialias: true,
    roundPixels: false,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 800 },
        debug: false,
      },
    },
    scene: [PreloadScene, GameplayScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  return new Phaser.Game(config);
}
