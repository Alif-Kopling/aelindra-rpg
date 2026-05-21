import * as React from 'react';
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
  const [phase, setPhase] = React.useState<'initial' | 'subtitle' | 'menu'>('initial');
  const [menuVisible, setMenuVisible] = React.useState(false);

  React.useEffect(() => {
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
        background: 'radial-gradient(ellipse at 50% 50%, #1a0520 0%, #08030a 50%, #000000 100%)',
      }}
    >
      <style>
        {`
          @keyframes particleFall {
            0% { transform: translateY(0); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.2; }
            100% { transform: translateY(-100vh); opacity: 0; }
          }
          @keyframes nameReveal {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .vignette {
            background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
          }
        `}
      </style>

      {/* Atmospheric Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -50,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.3,
            animation: `particleFall ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}

      {/* Background Castle Silhouette */}
      <CastleSilhouette />

      {/* Title block */}
      <div className="relative z-10 flex flex-col items-center" style={{ marginBottom: 40 }}>
        {/* Kingdom name */}
        <div
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 12,
            letterSpacing: '12px',
            color: '#c8a862',
            opacity: phase !== 'initial' ? 0.8 : 0,
            transition: 'opacity 1.5s ease',
            marginBottom: 16,
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(200,168,98,0.3)',
          }}
        >
          AELINDRA · THE FORSAKEN
        </div>

        {/* Main title */}
        <div
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '8px',
            background: 'linear-gradient(180deg, #fff 0%, #ffd700 40%, #b8860b 70%, #5c4a1e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(200,168,98,0.6))',
            animation: phase !== 'initial' ? 'nameReveal 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' : 'none',
            opacity: 0,
          }}
        >
          KNIGHT
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#a09080',
            marginTop: 20,
            letterSpacing: '2px',
            opacity: phase === 'menu' ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        >
          "The world hated him. He saved it anyway."
        </div>
      </div>

      {/* Menu buttons */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 mt-8"
        style={{
          opacity: menuVisible ? 1 : 0,
          transform: menuVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}
      >
        <TitleButton label="✦ BEGIN THE JOURNEY ✦" primary onClick={() => setScreen('prologue')} />
        <TitleButton label="✦ CONTINUE ✦" onClick={() => {
          const save = localStorage.getItem('aelindra_save_0');
          if (save) { useGameStore.getState().loadGame(0); } 
          else { useGameStore.getState().addNotification({ type: 'warning', title: 'No Save Found', message: 'Start a new journey.', icon: '💾' }); }
        }} />
      </div>

      {/* Version */}
      <div
        className="absolute bottom-6"
        style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#4a3a30', letterSpacing: '2px' }}
      >
        FORSAKEN EDITION v1.0.0
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
