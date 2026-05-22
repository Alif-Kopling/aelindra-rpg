import * as React from 'react';
import Phaser from 'phaser';
import { createPhaserGame } from '../game/phaserConfig';
import { useGameStore } from '../store/gameStore';
import HUD from '../ui/HUD';
import DialogueSystem from '../ui/DialogueSystem';
import BossHealthBar from '../ui/BossHealthBar';
import Inventory from '../ui/Inventory';
import PauseMenu from '../ui/PauseMenu';
import Notifications from '../ui/Notifications';
import Shop from '../ui/Shop';
import DevToolsPanel from '../ui/DevToolsPanel';
import { playBGM, setBGMVolume } from '../utils/bgm';

const GameComponent: React.FC = () => {
  const gameRef = React.useRef<Phaser.Game | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { isPaused, isInventoryOpen, dialogue, isShopOpen, currentZone, settings } = useGameStore();

  React.useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = createPhaserGame('game-canvas');

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!gameRef.current) return;
    const scene = gameRef.current.scene.getScene('GameplayScene');
    if (scene) {
      if (isPaused || dialogue.isOpen || isShopOpen) {
        scene.physics.world.pause();
      } else {
        scene.physics.world.resume();
      }
    }
  }, [isPaused, dialogue.isOpen, isShopOpen]);

  React.useEffect(() => {
    setBGMVolume(settings.musicVolume, settings.masterVolume);
  }, [settings.musicVolume, settings.masterVolume]);

  React.useEffect(() => {
    if (currentZone) {
      playBGM(currentZone);
    }
  }, [currentZone]);

  const triggerFinalBossDefeated = React.useCallback(() => {
    const scene = gameRef.current?.scene.getScene('GameplayScene') as Phaser.Scene | undefined;
    if (!scene) return;
    scene.events.emit('boss-died', { bossId: 'ashen_knight' });
    useGameStore.getState().addNotification({
      type: 'info',
      title: 'Dev Event',
      message: 'Triggered boss-died: ashen_knight',
      icon: '🧪',
      duration: 1800,
    });
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden" style={{ background: '#07070c' }}>
      <div
        className="relative shadow-2xl overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '177.78vh', // 16:9 aspect bounds
          maxHeight: '56.25vw',
          aspectRatio: '16/9',
          border: '1px solid rgba(184, 134, 11, 0.15)',
          background: '#0f0f1a',
        }}
      >
        <div
          id="game-canvas"
          ref={containerRef}
          className="w-full h-full"
        />

        {/* Dark fantasy radial vignette to focus gameplay view */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
            zIndex: 10,
          }}
        />

        {/* Ambient bottom shadow to blend ground and obscure background watermarks */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '110px',
            background: 'linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.85) 15%, rgba(10,10,15,0.3) 60%, transparent 100%)',
            zIndex: 9,
          }}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
          <HUD />
          <BossHealthBar />
          <div className="pointer-events-none">
            <Notifications />
          </div>
          <div className={dialogue.isOpen ? 'pointer-events-auto' : 'pointer-events-none'}>
            <DialogueSystem />
          </div>
          <div className={isInventoryOpen ? 'pointer-events-auto' : 'pointer-events-none'}>
            <Inventory />
          </div>
          <div className={isShopOpen ? 'pointer-events-auto' : 'pointer-events-none'}>
            <Shop />
          </div>
          <div className={isPaused ? 'pointer-events-auto' : 'pointer-events-none'}>
            <PauseMenu />
          </div>
          <DevToolsPanel onTriggerFinalBossDefeat={triggerFinalBossDefeated} />
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
