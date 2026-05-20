import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playBGM, stopBGM, setBGMVolume } from '../utils/bgm';

const ENDING_LINES = [
  { text: 'The darkness receded.', delay: 0, duration: 3000 },
  { text: 'The ancient evil, sealed once more beneath the earth.', delay: 3000, duration: 3500 },
  { text: 'Valther — the architect of all that suffering — was gone.', delay: 7000, duration: 3500 },
  { text: 'But so was the price.', delay: 11000, duration: 3000 },
  { text: '...', delay: 14500, duration: 2500 },
  { text: 'In the ruined throne room, Princess Evelyne knelt.', delay: 17500, duration: 3500 },
  { text: 'She held the forsaken knight in her arms.', delay: 21500, duration: 3500 },
  { text: 'The man the kingdom had called a murderer.', delay: 25500, duration: 3000 },
  { text: 'The man who had saved them all anyway.', delay: 29000, duration: 3500, emphasis: true },
  { text: '"Alden..."', delay: 33000, duration: 2500 },
  { text: '"...Tell Tam... the hero he believed in... was real."', delay: 36000, duration: 4000, alden: true },
  { text: 'The kingdom finally learned the truth.', delay: 41000, duration: 3500 },
  { text: 'And wept.', delay: 45000, duration: 3000 },
  { text: '— — —', delay: 49000, duration: 2000 },
  { text: 'Years later...', delay: 52000, duration: 3000 },
  { text: 'A statue stands in the capital.', delay: 55500, duration: 3000 },
  { text: 'Flowers, always placed beneath it.', delay: 59000, duration: 3000 },
  { text: 'Children gather to hear the old story.', delay: 62500, duration: 3500 },
  { text: '"The knight the world hated..."', delay: 67000, duration: 3000 },
  { text: '"...who saved everyone."', delay: 71000, duration: 4000, emphasis: true },
];

const EndingScreen: React.FC = () => {
  const { setScreen, player, settings } = useGameStore();
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [bgPhase, setBgPhase] = useState<'dark' | 'dawn' | 'bright'>('dark');

  useEffect(() => {
    ENDING_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => new Set([...prev, i]));
      }, line.delay);
    });

    setTimeout(() => setBgPhase('dawn'), 40000);
    setTimeout(() => setBgPhase('bright'), 55000);
    setTimeout(() => setFinished(true), 76000);
  }, []);

  useEffect(() => {
    setBGMVolume(settings.musicVolume, settings.masterVolume);
    playBGM('ending');
    return () => stopBGM();
  }, [settings.musicVolume, settings.masterVolume]);

  const bgColors = {
    dark: 'radial-gradient(ellipse at 50% 80%, #0a0510 0%, #050208 60%, #000005 100%)',
    dawn: 'radial-gradient(ellipse at 50% 100%, #3a1a05 0%, #1a0810 40%, #050208 80%, #000005 100%)',
    bright: 'radial-gradient(ellipse at 50% 100%, #8b5010 0%, #4a2408 30%, #1a0810 60%, #050208 90%)',
  };

  return (
    <div
      className="absolute inset-0 overflow-y-auto flex flex-col items-center"
      style={{
        background: bgColors[bgPhase],
        transition: 'background 8s ease',
        zIndex: 100,
      }}
    >
      {/* Background Image Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-[4000ms]"
        style={{
          backgroundImage: `url('/assets/images/ending-bg-dialog.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: bgPhase === 'dark' ? 0.2 : bgPhase === 'dawn' ? 0.3 : 0.4,
          zIndex: 0,
        }}
      />

      {/* Ember particles in bright phase */}
      {bgPhase === 'bright' && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#ffa040',
                left: `${Math.random() * 100}%`,
                bottom: -10,
                animation: `ember-float ${4 + Math.random() * 4}s linear ${Math.random() * 4}s infinite`,
                '--tx': `${Phaser_math_between(-30, 30)}px`,
              } as any}
            />
          ))}
        </div>
      )}

      {/* Cinematic bars */}
      <div className="fixed top-0 left-0 right-0 z-20" style={{ height: 70, background: '#000000' }} />
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{ height: 70, background: '#000000' }} />

      {/* Content */}
      <div
        className="relative z-10 text-center"
        style={{ maxWidth: 640, padding: '100px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}
      >
        {ENDING_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: line.alden ? 'Lora, serif' : line.emphasis ? 'Cinzel, serif' : 'Lora, serif',
              fontSize: line.emphasis ? 'clamp(16px, 2.5vw, 22px)' : line.alden ? 'clamp(14px, 2vw, 18px)' : 'clamp(12px, 1.8vw, 16px)',
              fontStyle: (!line.emphasis && !line.alden) ? 'italic' : line.alden ? 'italic' : 'normal',
              fontWeight: line.emphasis ? 700 : 400,
              letterSpacing: line.emphasis ? '3px' : '0.5px',
              color: line.alden ? '#8fa8b8' : line.emphasis ? '#f4e4c1' : '#8a7a6a',
              textShadow: line.emphasis ? '0 0 20px rgba(244,228,193,0.3)' : 'none',
              lineHeight: 1.8,
              opacity: visibleLines.has(i) ? 1 : 0,
              transform: visibleLines.has(i) ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 1.5s ease, transform 1.5s ease',
            }}
          >
            {line.text === '— — —' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ width: 80, height: 1, background: 'linear-gradient(to right, transparent, #4a3a2a)' }} />
                <span>✦</span>
                <div style={{ width: 80, height: 1, background: 'linear-gradient(to left, transparent, #4a3a2a)' }} />
              </div>
            ) : line.text}
          </div>
        ))}

        {/* Final statue scene */}
        {bgPhase === 'bright' && (
          <div
            style={{
              marginTop: 40,
              opacity: bgPhase === 'bright' ? 1 : 0,
              transition: 'opacity 3s ease',
            }}
          >
            <div style={{ fontSize: 60, marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(255,200,100,0.4))' }}>
              🗽
            </div>
            <div style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 'clamp(20px, 4vw, 36px)',
              fontWeight: 900,
              color: '#c8a862',
              letterSpacing: '4px',
              textShadow: '0 0 30px rgba(200,168,98,0.4)',
              animation: 'textGlow 3s ease-in-out infinite',
            }}>
              {player.name}
            </div>
            <div style={{
              fontFamily: 'Lora, serif',
              fontStyle: 'italic',
              fontSize: 14,
              color: '#8a7a6a',
              marginTop: 8,
              letterSpacing: '2px',
            }}>
              The Forsaken Knight · Hero of Aelindra
            </div>

            {/* Flowers */}
            <div style={{ fontSize: 24, marginTop: 16, letterSpacing: 8 }}>🌸 🌼 🌷 🌸 🌼</div>
          </div>
        )}
      </div>

      {/* Return button after everything */}
      {finished && (
        <div
          className="fixed bottom-20 left-1/2 z-30"
          style={{
            transform: 'translateX(-50%)',
            animation: 'fadeIn 2s ease-out',
          }}
        >
          <button
            onClick={() => setScreen('title')}
            className="btn-fantasy py-4 px-12 rounded-sm"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 14,
              letterSpacing: '3px',
              color: '#c8a862',
              borderColor: 'rgba(200,168,98,0.5)',
              boxShadow: '0 0 30px rgba(200,168,98,0.2)',
            }}
          >
            ✦ Return to Title ✦
          </button>
        </div>
      )}
    </div>
  );
};

// small helper to avoid importing phaser in UI
function Phaser_math_between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default EndingScreen;
