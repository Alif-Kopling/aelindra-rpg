import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 8,
  size: 2 + Math.random() * 4,
  color: Math.random() > 0.6 ? '#b8860b' : Math.random() > 0.5 ? '#8b0000' : '#4169e1',
}));

const TitleScreen: React.FC = () => {
  const { setScreen } = useGameStore();
  const [phase, setPhase] = useState<'initial' | 'subtitle' | 'menu'>('initial');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('subtitle'), 1200);
    const t2 = setTimeout(() => {
      setPhase('menu');
      setMenuVisible(true);
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, #0d0510 0%, #050208 50%, #000005 100%)',
      }}
    >
      {/* Ambient particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `particleFall ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}

      {/* Background castle silhouette */}
      <CastleSilhouette />

      {/* Title block */}
      <div className="relative z-10 flex flex-col items-center" style={{ marginBottom: 60 }}>
        {/* Kingdom name */}
        <div
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 11,
            letterSpacing: '8px',
            color: '#8fa8b8',
            opacity: phase !== 'initial' ? 1 : 0,
            transition: 'opacity 1s ease',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          ✦ Kingdom of Aelindra ✦
        </div>

        {/* Main title */}
        <div
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '4px',
            background: 'linear-gradient(180deg, #ffd700 0%, #b8860b 40%, #8b6914 70%, #5c4a1e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 20px rgba(184,134,11,0.5))',
            animation: phase !== 'initial' ? 'nameReveal 1.2s ease-out forwards' : 'none',
            opacity: phase !== 'initial' ? 1 : 0,
            transition: 'opacity 0.5s',
            textAlign: 'center',
          }}
        >
          AELINDRA
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(12px, 2vw, 18px)',
            letterSpacing: '6px',
            color: '#8fa8b8',
            marginTop: 10,
            opacity: phase === 'subtitle' || phase === 'menu' ? 1 : 0,
            transform: phase === 'subtitle' || phase === 'menu' ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          The Forsaken Knight
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: phase === 'menu' ? 400 : 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #b8860b, transparent)',
            marginTop: 16,
            transition: 'width 1s ease',
          }}
        />

        {/* Tagline */}
        {phase === 'menu' && (
          <div
            style={{
              fontFamily: 'Lora, serif',
              fontStyle: 'italic',
              fontSize: 12,
              color: '#6a5a4a',
              marginTop: 10,
              letterSpacing: '1px',
              animation: 'fadeIn 1s ease-out forwards',
            }}
          >
            "The world hated him. He saved it anyway."
          </div>
        )}
      </div>

      {/* Menu buttons */}
      <div
        className="relative z-10 flex flex-col items-center gap-3"
        style={{
          opacity: menuVisible ? 1 : 0,
          transform: menuVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <TitleButton label="▶  Begin the Journey" primary onClick={() => setScreen('prologue')} />
        <TitleButton label="⚔  Continue" onClick={() => {
          const save = localStorage.getItem('aelindra_save_0');
          if (save) {
            useGameStore.getState().loadGame(0);
          } else {
            useGameStore.getState().addNotification({
              type: 'warning', title: 'No Save Found', message: 'Start a new journey first.', icon: '💾',
            });
          }
        }} />
        <TitleButton label="⚙  Settings" onClick={() => {}} />
      </div>

      {/* Version + credits */}
      <div
        className="absolute bottom-4"
        style={{ fontFamily: 'Cinzel, serif', fontSize: 9, color: '#3a3040', letterSpacing: '1px' }}
      >
        v1.0.0 · A Dark Fantasy Pixel RPG · Built with Phaser + React
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />
    </div>
  );
};

const TitleButton: React.FC<{ label: string; primary?: boolean; onClick: () => void }> = ({ label, primary, onClick }) => (
  <button
    onClick={onClick}
    className="btn-fantasy relative overflow-hidden"
    style={{
      padding: '12px 48px',
      fontSize: 12,
      letterSpacing: '2px',
      borderRadius: 3,
      minWidth: 260,
      fontFamily: 'Cinzel, serif',
      fontWeight: primary ? 700 : 400,
      color: primary ? '#ffd700' : '#c8a882',
      borderColor: primary ? '#b8860b' : 'rgba(184,134,11,0.4)',
      boxShadow: primary ? '0 0 20px rgba(184,134,11,0.3)' : 'none',
    }}
  >
    {label}
  </button>
);

const CastleSilhouette: React.FC = () => (
  <div
    className="absolute bottom-0 left-0 right-0 pointer-events-none"
    style={{ height: '40%', overflow: 'hidden' }}
  >
    <svg viewBox="0 0 1280 300" preserveAspectRatio="xMidYMax meet" style={{ width: '100%', height: '100%' }}>
      {/* Castle outline */}
      <g fill="#080510" opacity="0.9">
        {/* Center tower */}
        <rect x="580" y="80" width="120" height="220" />
        <rect x="560" y="40" width="40" height="60" />
        <rect x="580" y="20" width="120" height="30" />
        <rect x="680" y="40" width="40" height="60" />
        {/* Battlements center */}
        {[560, 580, 600, 620, 640, 660, 680, 700].map((x, i) => (
          <rect key={i} x={x} y={10} width={16} height={20} />
        ))}
        {/* Left wing */}
        <rect x="440" y="140" width="140" height="160" />
        <rect x="420" y="100" width="160" height="50" />
        <rect x="400" y="120" width="40" height="80" />
        <rect x="380" y="100" width="40" height="20" />
        {/* Right wing */}
        <rect x="700" y="140" width="140" height="160" />
        <rect x="700" y="100" width="160" height="50" />
        <rect x="840" y="120" width="40" height="80" />
        <rect x="860" y="100" width="40" height="20" />
        {/* Far towers */}
        <rect x="280" y="180" width="80" height="120" />
        <rect x="260" y="160" width="120" height="30" />
        <rect x="920" y="180" width="80" height="120" />
        <rect x="900" y="160" width="120" height="30" />
        {/* Ground */}
        <rect x="0" y="270" width="1280" height="30" />
        {/* Hills */}
        <ellipse cx="200" cy="290" rx="200" ry="40" />
        <ellipse cx="1080" cy="290" rx="200" ry="40" />
      </g>

      {/* Glow windows */}
      <g opacity="0.6">
        <rect x="625" y="140" width="30" height="40" fill="#ffa040" rx="2" />
        <rect x="625" y="200" width="30" height="30" fill="#ffa040" rx="2" />
        <rect x="480" y="170" width="24" height="30" fill="#ff8020" rx="2" />
        <rect x="730" y="170" width="24" height="30" fill="#ff8020" rx="2" />
      </g>

      {/* Moon */}
      <circle cx="200" cy="60" r="40" fill="#d0d8e4" opacity="0.15" />
      <circle cx="178" cy="52" r="35" fill="#080510" opacity="0.8" />
    </svg>
  </div>
);

export default TitleScreen;
