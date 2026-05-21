import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { playBGM, stopBGM, setBGMVolume } from '../utils/bgm';

const ENDING_LINES = [
  { text: 'Kegelapan surut.', delay: 0, duration: 3000 },
  { text: 'Kejahatan kuno, tersegel lagi di bawah bumi.', delay: 3000, duration: 3500 },
  { text: 'Valther — arsitek dari semua penderitaan itu — udah pergi.', delay: 7000, duration: 3500 },
  { text: 'Tapi begitu juga harganya.', delay: 11000, duration: 3000 },
  { text: '...', delay: 14500, duration: 2500 },
  { text: 'Di ruang singgasana yang hancur, Putri Evelyne berlutut.', delay: 17500, duration: 3500 },
  { text: 'Dia gendong ksatria terbuang itu di pelukannya.', delay: 21500, duration: 3500 },
  { text: 'Pria yang kerajaan sebut pembunuh.', delay: 25500, duration: 3000 },
  { text: 'Pria yang tetap nyelamatin mereka semua.', delay: 29000, duration: 3500, emphasis: true },
  { text: '"Alden..."', delay: 33000, duration: 2500 },
  { text: '"...Bilang ke Tam... pahlawan yang dia percayain... itu nyata."', delay: 36000, duration: 4000, alden: true },
  { text: 'Kerajaan akhirnya tau kebenaran.', delay: 41000, duration: 3500 },
  { text: 'Dan menangis.', delay: 45000, duration: 3000 },
  { text: '— — —', delay: 49000, duration: 2000 },
  { text: 'Bertahun-tahun kemudian...', delay: 52000, duration: 3000 },
  { text: 'Sebuah patung berdiri di ibu kota.', delay: 55500, duration: 3000 },
  { text: 'Bunga, selalu ada di bawahnya.', delay: 59000, duration: 3000 },
  { text: 'Anak-anak berkumpul dengerin cerita lama.', delay: 62500, duration: 3500 },
  { text: '"Ksatria yang dibenci dunia..."', delay: 67000, duration: 3000 },
  { text: '"...yang menyelamatkan semua orang."', delay: 71000, duration: 4000, emphasis: true },
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
      className="absolute inset-0 overflow-y-auto flex flex-col items-center custom-scrollbar"
      style={{
        background: bgColors[bgPhase],
        transition: 'background 8s ease',
        zIndex: 100,
      }}
    >
      <style>
        {`
          @keyframes ember-float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-100vh) translateX(var(--tx)); opacity: 0; }
          }
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 20px rgba(200,168,98,0.2); }
            50% { text-shadow: 0 0 40px rgba(200,168,98,0.6); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(200, 168, 98, 0.2);
            border-radius: 2px;
          }
        `}
      </style>

      {/* Background Image Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-[4000ms]"
        style={{
          backgroundImage: `url('/assets/images/ending-bg-dialog.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: bgPhase === 'dark' ? 0.15 : bgPhase === 'dawn' ? 0.25 : 0.35,
          zIndex: 0,
        }}
      />

      {/* Ember particles in bright phase */}
      {bgPhase === 'bright' && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: Phaser_math_between(2, 5),
                height: Phaser_math_between(2, 5),
                borderRadius: '50%',
                background: '#ffa040',
                left: `${Math.random() * 100}%`,
                bottom: -20,
                filter: 'blur(1px)',
                animation: `ember-float ${6 + Math.random() * 6}s linear ${Math.random() * 5}s infinite`,
                '--tx': `${Phaser_math_between(-100, 100)}px`,
              } as any}
            />
          ))}
        </div>
      )}

      {/* Cinematic bars */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ height: '12vh', background: 'linear-gradient(to bottom, #000 70%, transparent)' }} />
      <div className="fixed bottom-0 left-0 right-0 z-50" style={{ height: '12vh', background: 'linear-gradient(to top, #000 70%, transparent)' }} />

      {/* Content */}
      <div
        className="relative z-10 text-center"
        style={{ 
          maxWidth: 700, 
          padding: '20vh 40px 30vh 40px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 24 
        }}
      >
        {ENDING_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: line.alden ? 'Lora, serif' : line.emphasis ? 'Cinzel, serif' : 'Lora, serif',
              fontSize: line.emphasis ? 'clamp(18px, 3vw, 24px)' : line.alden ? 'clamp(15px, 2.2vw, 19px)' : 'clamp(13px, 2vw, 17px)',
              fontStyle: (!line.emphasis && !line.alden) ? 'italic' : line.alden ? 'italic' : 'normal',
              fontWeight: line.emphasis ? 700 : 400,
              letterSpacing: line.emphasis ? '4px' : '0.8px',
              color: line.alden ? '#a0b0c0' : line.emphasis ? '#f4e4c1' : '#b0a090',
              textShadow: line.emphasis ? '0 0 25px rgba(244,228,193,0.4)' : '0 2px 4px rgba(0,0,0,0.5)',
              lineHeight: 1.8,
              opacity: visibleLines.has(i) ? 1 : 0,
              transform: visibleLines.has(i) ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1), transform 2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {line.text === '— — —' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '20px 0' }}>
                <div style={{ width: 100, height: 1, background: 'linear-gradient(to right, transparent, #8b6914, transparent)' }} />
                <span style={{ color: '#8b6914', fontSize: 18 }}>✦</span>
                <div style={{ width: 100, height: 1, background: 'linear-gradient(to right, transparent, #8b6914, transparent)' }} />
              </div>
            ) : line.text}
          </div>
        ))}

        {/* Final statue scene */}
        {bgPhase === 'bright' && (
          <div
            style={{
              marginTop: 60,
              paddingTop: 60,
              borderTop: '1px solid rgba(200,168,98,0.1)',
              opacity: bgPhase === 'bright' ? 1 : 0,
              transition: 'opacity 4s ease',
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 24, filter: 'drop-shadow(0 0 30px rgba(255,200,100,0.5))' }}>
              ⚔️
            </div>
            <div style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 'clamp(24px, 5vw, 42px)',
              fontWeight: 900,
              color: '#c8a862',
              letterSpacing: '6px',
              textShadow: '0 0 40px rgba(200,168,98,0.5)',
              animation: 'textGlow 3s ease-in-out infinite',
            }}>
              {player.name}
            </div>
            <div style={{
              fontFamily: 'Lora, serif',
              fontStyle: 'italic',
              fontSize: 16,
              color: '#a09080',
              marginTop: 12,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}>
              The Forsaken Knight · Savior of Aelindra
            </div>

            {/* Flowers */}
            <div style={{ fontSize: 32, marginTop: 32, letterSpacing: 12, opacity: 0.8 }}>🌸 🌼 🌷 🌼 🌸</div>
          </div>
        )}
      </div>

      {/* Return button after everything */}
      {finished && (
        <div
          className="fixed bottom-[15vh] left-1/2 z-[100]"
          style={{
            transform: 'translateX(-50%)',
            animation: 'fadeIn 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          <button
            onClick={() => setScreen('title')}
            className="btn-fantasy py-4 px-16 rounded-sm transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 15,
              letterSpacing: '4px',
              color: '#c8a862',
              background: 'rgba(10, 5, 0, 0.8)',
              border: '1px solid rgba(200,168,98,0.4)',
              boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(200,168,98,0.1)',
            }}
          >
            ✦ ASCEND TO TITLE ✦
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
