import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import TitleScreen from './ui/TitleScreen';
import PrologueScreen from './ui/PrologueScreen';
import NameInputScreen from './ui/NameInputScreen';
import GameComponent from './components/GameComponent';
import GameOverScreen from './ui/GameOverScreen';
import EndingScreen from './ui/EndingScreen';

const App: React.FC = () => {
  const { screen } = useGameStore();

  // Prevent context menu on right click (for skill usage)
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  // Prevent default space/arrow scrolling
  useEffect(() => {
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

      {/* Game Over */}
      {screen === 'gameOver' && <GameOverScreen />}

      {/* Ending */}
      {screen === 'ending' && <EndingScreen />}

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
