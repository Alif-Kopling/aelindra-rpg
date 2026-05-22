import * as React from 'react';
import { useGameStore } from './store/gameStore';
import TitleScreen from './ui/TitleScreen';
import PrologueScreen from './ui/PrologueScreen';
import NameInputScreen from './ui/NameInputScreen';
import GameComponent from './components/GameComponent';
import GameOverScreen from './ui/GameOverScreen';
import EndingScreen from './ui/EndingScreen';
import EpilogueScreen from './ui/EpilogueScreen';

const LowHealthVignette: React.FC = () => {
  const { player, screen } = useGameStore();
  if (screen !== 'game') return null;
  const hpPct = player.stats.hp / player.stats.maxHp;
  if (hpPct > 0.35) return null;

  const intensity = 1 - (hpPct / 0.35);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(circle, transparent 40%, rgba(139,0,0,${0.25 * intensity}) 80%, rgba(139,0,0,${0.5 * intensity}) 100%)`,
        zIndex: 100,
        boxShadow: `inset 0 0 ${100 * intensity}px rgba(139,0,0,0.4)`,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  );
};

const App: React.FC = () => {
  const { screen } = useGameStore();

  // Prevent context menu on right click (for skill usage)
  React.useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  // Prevent default space/arrow scrolling
  React.useEffect(() => {
    const prevent = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (screen === 'game') e.preventDefault();
      }
    };
    window.addEventListener('keydown', prevent);
    return () => window.removeEventListener('keydown', prevent);
  }, [screen]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#0a0a0f', fontFamily: 'Cinzel, serif' }}
    >
      {/* Title Screen */}
      {screen === 'title' && <TitleScreen />}

      {/* Prologue */}
      {screen === 'prologue' && <PrologueScreen />}

      {/* Name Input */}
      {screen === 'nameInput' && <NameInputScreen />}

      {/* Main Game */}
      {screen === 'game' && <GameComponent />}

      {/* Low Health Effect */}
      <LowHealthVignette />

      {/* Game Over */}
      {screen === 'gameOver' && <GameOverScreen />}

      {/* Ending */}
      {screen === 'ending' && <EndingScreen />}

      {/* Epilogue */}
      {screen === 'epilogue' && <EpilogueScreen />}

      {/* Global vignette for non-game screens */}
      {screen !== 'game' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default App;
