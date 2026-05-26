import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { PLAYER_DEFAULTS } from '../utils/constants';

const GameOverScreen: React.FC = () => {
  const { setScreen, player, updatePlayerStats, loadGame, saveSlots } = useGameStore();
  const [visible, setVisible] = React.useState(false);
  const [quote, setQuote] = React.useState('');

  const DEATH_QUOTES = [
    '"Even a forsaken knight rises again."',
    '"The world hasn\'t forgiven you yet. That means your story isn\'t done."',
    '"Darkness cannot win if you refuse to stay fallen."',
    '"Edric would say: Get up, fool. So get up."',
    '"Evelyne still doesn\'t know the truth. Will you let it die with you?"',
    '"A nameless grave is not your ending."',
  ];

  React.useEffect(() => {
    setQuote(DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)]);
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleRetry = () => {
    updatePlayerStats({ hp: Math.floor(player.stats.maxHp * 0.4) });
    useGameStore.setState((s) => {
      s.isPaused = false;
      s.isInventoryOpen = false;
      s.isShopOpen = false;
      s.activeBoss = null;
      s.dialogue.isOpen = false;
    });
    setScreen('game');
  };

  const handleLoadSave = () => {
    const latestSave = saveSlots.find(s => !s.isEmpty);
    if (latestSave) loadGame(latestSave.id);
    else setScreen('title');
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: '#000000',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease',
        zIndex: 100,
      }}
    >
      {/* Blood effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 100%, rgba(100,0,0,0.4) 0%, transparent 60%)',
        animation: 'crimson-pulse 3s ease-in-out infinite',
      }} />

      {/* Dripping blood lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${10 + i * 12}%`,
            width: 2 + Math.random() * 2,
            height: `${20 + Math.random() * 40}%`,
            background: 'linear-gradient(to bottom, rgba(139,0,0,0.8), transparent)',
            borderRadius: '0 0 4px 4px',
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-8" style={{ maxWidth: 560 }}>
        {/* YOU DIED */}
        <div
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900,
            color: '#8b0000',
            letterSpacing: '6px',
            textShadow: '0 0 30px rgba(139,0,0,0.8), 0 0 60px rgba(139,0,0,0.4)',
            animation: 'fadeIn 1s ease-out',
            marginBottom: 16,
          }}
        >
          YOU DIED
        </div>

        {/* Decorative line */}
        <div className="mx-auto" style={{
          width: 'min(60vw, 300px)',
          height: 1,
          background: 'linear-gradient(90deg, transparent, #8b0000, transparent)',
          marginBottom: 'clamp(12px, 3vw, 24px)',
        }} />

        {/* Quote */}
        <div
          style={{
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
            fontSize: 14,
            color: '#6a5050',
            lineHeight: 1.8,
            marginBottom: 12,
            animation: 'fadeIn 1.5s ease-out',
          }}
        >
          {quote}
        </div>

        {/* Player name */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 11,
          color: '#3a2a2a',
          letterSpacing: '3px',
          marginBottom: 48,
        }}>
          {player.name} · Level {player.stats.level}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 sm:gap-3 items-center w-full px-4">
          <button
            onClick={handleRetry}
            className="btn-fantasy py-3 sm:py-4 px-8 sm:px-12 rounded-sm w-full sm:w-auto"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              letterSpacing: '2px',
              color: '#f4e4c1',
              borderColor: 'rgba(139,0,0,0.6)',
              boxShadow: '0 0 20px rgba(139,0,0,0.2)',
              maxWidth: 300,
            }}
          >
            ↺  Rise Again
          </button>
          <button
            onClick={handleLoadSave}
            className="btn-fantasy py-2 sm:py-3 px-6 sm:px-10 rounded-sm w-full sm:w-auto"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(10px, 2vw, 11px)',
              letterSpacing: '2px',
              color: '#8fa8b8',
              borderColor: 'rgba(65,105,225,0.3)',
              maxWidth: 300,
            }}
          >
            💾  Load Last Save
          </button>
          <button
            onClick={() => setScreen('title')}
            className="btn-fantasy py-2 sm:py-3 px-6 sm:px-10 rounded-sm w-full sm:w-auto"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(10px, 2vw, 11px)',
              letterSpacing: '2px',
              color: '#4a3a3a',
              borderColor: 'rgba(100,60,60,0.2)',
              maxWidth: 300,
            }}
          >
            Return to Title
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
