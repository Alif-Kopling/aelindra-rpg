import * as React from 'react';
import { useGameStore } from '../store/gameStore';

const ASH_COUNT = 40;
const EMBER_COUNT = 12;

const QUOTE = '"Even in a dying world, someone still leaves the lantern on."';

// ── Particle Engine ──────────────────────────────────────────

interface AshParticle {
  x: number; y: number; size: number; speedY: number; speedX: number; alpha: number; drift: number; phase: number;
}

function useAshParticles(count: number): AshParticle[] {
  return React.useMemo(() => {
    const p: AshParticle[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 3,
        speedY: 0.08 + Math.random() * 0.2,
        speedX: -0.05 + Math.random() * 0.1,
        alpha: 0.15 + Math.random() * 0.35,
        drift: Math.random() * 100,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return p;
  }, [count]);
}

// ── Sub-components ──────────────────────────────────────────

const BackgroundLayer = React.memo(function BackgroundLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Sky gradient - cold death */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #050508 0%, #0a0a14 30%, #0f0f1e 55%, #14101a 75%, #0d0a10 100%)',
      }} />

      {/* Ruined village silhouette - far */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '18%', left: 0, right: 0, height: '35%',
        opacity: 0.12,
        backgroundImage: `
          radial-gradient(ellipse 40px 50px at 15% 100%, #0f0f1e, transparent),
          radial-gradient(ellipse 30px 40px at 25% 100%, #0f0f1e, transparent),
          radial-gradient(ellipse 50px 60px at 38% 100%, #0f0f1e, transparent),
          radial-gradient(ellipse 25px 35px at 50% 100%, #0f0f1e, transparent),
          radial-gradient(ellipse 60px 70px at 62% 100%, #0f0f1e, transparent),
          radial-gradient(ellipse 35px 45px at 75% 100%, #0f0f1e, transparent),
          radial-gradient(ellipse 45px 55px at 88% 100%, #0f0f1e, transparent)
        `,
      }} />

      {/* Dead trees silhouette */}
      {[12, 30, 52, 72, 90].map((pos) => (
        <div key={pos} aria-hidden="true" style={{
          position: 'absolute', bottom: '22%', left: `${pos}%`,
          width: 3, height: `${12 + Math.sin(pos) * 8}%`,
          background: 'linear-gradient(to top, rgba(15,10,12,0.3), transparent)',
          transform: `rotate(${(pos - 50) * 0.3}deg)`,
          transformOrigin: 'bottom center',
        }} />
      ))}

      {/* Distant warm light - the lantern / Tam philosophy */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '28%', right: '22%',
        width: 80, height: 120,
        background: 'radial-gradient(ellipse at 50% 70%, rgba(255,180,80,0.08) 0%, rgba(255,140,50,0.04) 30%, transparent 65%)',
      }}>
        <div style={{
          position: 'absolute', bottom: 10, left: '50%', marginLeft: -3,
          width: 6, height: 10,
          borderRadius: '3px 3px 1px 1px',
          background: '#ffa040',
          boxShadow: '0 0 20px rgba(255,160,64,0.5), 0 0 60px rgba(255,120,40,0.2)',
          animation: 'lanternGlow 3s ease-in-out infinite',
        }} />
        {/* Window frame silhouette */}
        <div style={{
          position: 'absolute', bottom: 0, left: -15,
          width: 36, height: 30,
          border: '1px solid rgba(40,30,20,0.4)',
          borderRadius: 2,
          background: 'rgba(5,3,2,0.3)',
        }} />
      </div>

      {/* Thin fog layer */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(150,160,170,0.03) 0%, transparent 50%)',
        animation: 'fogDrift 20s ease-in-out infinite',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 70% 30%, rgba(130,140,150,0.02) 0%, transparent 45%)',
        animation: 'fogDrift 25s ease-in-out infinite reverse',
      }} />

      {/* Subtle vignette overlay */}
      <div className="vignette" style={{ position: 'absolute', inset: 0 }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.5) 50%, transparent 100%)',
      }} />
    </div>
  );
});

const AshCanvas = React.memo(function AshCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particles = useAshParticles(ASH_COUNT);
  const embers = useAshParticles(EMBER_COUNT);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', resize);

    const ash = particles.map(p => ({ ...p, x: (p.x / 100) * w, y: (p.y / 100) * h }));
    const ember = embers.map(p => ({ ...p, x: (p.x / 100) * w, y: (p.y / 100) * h }));

    let animId: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      for (const p of ash) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin((frame + p.phase) * 0.008 + p.drift * 0.001) * 0.15;
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,175,170,${p.alpha})`;
        ctx.fill();
      }

      for (const p of ember) {
        p.y -= 0.15 + Math.sin((frame + p.phase) * 0.02) * 0.05;
        p.x += Math.sin((frame + p.phase) * 0.01) * 0.2;
        if (p.y < -20) { p.y = h + 10; p.x = Math.random() * w; }

        const flicker = 0.5 + Math.sin(frame * 0.05 + p.phase) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,120,40,${p.alpha * flicker * 0.7})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,100,${p.alpha * flicker * 0.4})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [particles, embers]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.8 }}
      aria-hidden="true"
    />
  );
});

const TitleContent = React.memo(function TitleContent({ ready }: { ready: boolean }) {
  return (
    <div
      className="relative"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1), transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
        transitionDelay: '400ms',
        zIndex: 2,
      }}
    >
      {/* Tagline */}
      <p
        style={{
          margin: 0,
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(9px, 1vw, 12px)',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: 'rgba(160,170,185,0.7)',
          marginBottom: 20,
          marginLeft: 2,
        }}
      >
        A Dark Fantasy Action RPG
      </p>

      {/* Title */}
      <h1
        style={{
          margin: 0,
          fontFamily: 'Cinzel Decorative, serif',
          fontWeight: 900,
          fontSize: 'clamp(48px, 10vw, 110px)',
          lineHeight: 0.88,
          letterSpacing: '0.02em',
          color: '#f0e0c8',
          textShadow: '0 0 60px rgba(200,160,80,0.12), 0 2px 0 rgba(0,0,0,0.3)',
        }}
      >
        Aelindra
      </h1>

      <h2
        style={{
          margin: '12px 0 0 2px',
          fontFamily: 'Cinzel, serif',
          fontWeight: 400,
          fontSize: 'clamp(16px, 2.2vw, 28px)',
          letterSpacing: '0.3em',
          color: '#c8a862',
          textShadow: '0 0 30px rgba(200,168,98,0.15)',
        }}
      >
        The Forsaken Knight
      </h2>

      {/* Divider */}
      <div
        style={{
          width: 'clamp(40px, 6vw, 80px)',
          height: 1.5,
          background: 'linear-gradient(90deg, rgba(200,168,98,0.6), rgba(200,168,98,0.05))',
          margin: '24px 0 20px 2px',
          borderRadius: 1,
        }}
      />

      {/* Quote - Tam philosophy */}
      <p
        style={{
          margin: 0,
          maxWidth: 520,
          fontFamily: 'Lora, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(13px, 1.4vw, 16px)',
          lineHeight: 1.7,
          color: 'rgba(180,190,200,0.7)',
          letterSpacing: '0.02em',
        }}
      >
        {QUOTE}
      </p>
    </div>
  );
});

// ── Button Components ───────────────────────────────────────

const PrimaryButton = React.memo(function PrimaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="title-btn primary"
      aria-label={label}
      style={{
        width: '100%',
        borderRadius: 6,
        border: '1px solid rgba(200,168,98,0.5)',
        background: 'linear-gradient(135deg, rgba(60,45,25,0.9), rgba(90,65,30,0.85))',
        color: '#f0e0c0',
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(13px, 1.2vw, 15px)',
        letterSpacing: '0.12em',
        padding: '14px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        transition: 'transform 200ms ease, box-shadow 250ms ease, border-color 200ms ease, background 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(232,191,108,0.9)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(182,134,56,0.3), 0 0 20px rgba(200,168,98,0.1)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(70,50,28,0.95), rgba(100,72,35,0.9))';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200,168,98,0.5)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(60,45,25,0.9), rgba(90,65,30,0.85))';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
    >
      {label}
    </button>
  );
});

const SecondaryButton = React.memo(function SecondaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="title-btn secondary"
      aria-label={label}
      style={{
        width: '100%',
        borderRadius: 6,
        border: '1px solid rgba(140,155,170,0.3)',
        background: 'linear-gradient(135deg, rgba(16,20,28,0.85), rgba(12,14,20,0.85))',
        color: '#c8d2de',
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(12px, 1.1vw, 14px)',
        letterSpacing: '0.1em',
        padding: '12px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        transition: 'transform 200ms ease, box-shadow 250ms ease, border-color 200ms ease, background 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(180,195,210,0.6)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(22,28,38,0.9), rgba(16,18,26,0.9))';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(140,155,170,0.3)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16,20,28,0.85), rgba(12,14,20,0.85))';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.985)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
    >
      {label}
    </button>
  );
});

const MiniButton = React.memo(function MiniButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        flex: 1,
        borderRadius: 5,
        border: '1px solid rgba(140,150,165,0.2)',
        background: 'rgba(14,18,26,0.6)',
        color: '#a0aec0',
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(10px, 1vw, 12px)',
        letterSpacing: '0.08em',
        padding: '8px 6px',
        cursor: 'pointer',
        transition: 'transform 160ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200,168,98,0.4)';
        e.currentTarget.style.background = 'rgba(22,28,38,0.8)';
        e.currentTarget.style.color = '#d0d8e0';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(140,150,165,0.2)';
        e.currentTarget.style.background = 'rgba(14,18,26,0.6)';
        e.currentTarget.style.color = '#a0aec0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
    >
      {label}
    </button>
  );
});

// ── Modal Components ────────────────────────────────────────

const ModalCard = React.memo(function ModalCard({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const backdropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{
        background: 'rgba(4,6,9,0.75)',
        backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: 'min(420px, calc(100% - 32px))',
          borderRadius: 8,
          border: '1px solid rgba(200,168,98,0.25)',
          background: 'linear-gradient(145deg, rgba(10,12,18,0.98), rgba(14,10,8,0.98))',
          padding: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: '#e8d8b0', letterSpacing: '0.1em', fontSize: 14, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none', border: 'none', color: '#8a7a60',
              fontFamily: 'Cinzel, serif', fontSize: 16, cursor: 'pointer',
              padding: '2px 8px', borderRadius: 3,
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a862'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8a7a60'; }}
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});

const SettingsPanel = React.memo(function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useGameStore();

  const sliders = React.useMemo(() => [
    { label: 'Master', value: settings.masterVolume, onChange: (v: number) => updateSettings({ masterVolume: v }) },
    { label: 'Music', value: settings.musicVolume, onChange: (v: number) => updateSettings({ musicVolume: v }) },
    { label: 'SFX', value: settings.sfxVolume, onChange: (v: number) => updateSettings({ sfxVolume: v }) },
    { label: 'Ambient', value: settings.ambientVolume, onChange: (v: number) => updateSettings({ ambientVolume: v }) },
  ], [settings, updateSettings]);

  return (
    <ModalCard title="Settings" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <span style={{ fontFamily: 'Cinzel, serif', color: '#b8a888', fontSize: 11, letterSpacing: '0.05em' }}>{s.label}</span>
              <span style={{ fontFamily: 'monospace', color: '#8898a8', fontSize: 11 }}>{s.value}%</span>
            </div>
            <input
              type="range"
              min={0} max={100}
              value={s.value}
              onChange={(e) => s.onChange(Number(e.target.value))}
              aria-label={`${s.label} volume`}
              style={{
                width: '100%', height: 4, borderRadius: 2,
                appearance: 'none',
                background: `linear-gradient(90deg, rgba(200,168,98,0.6) ${s.value}%, rgba(60,60,70,0.3) ${s.value}%)`,
                outline: 'none', cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </div>
    </ModalCard>
  );
});

const CreditsPanel = React.memo(function CreditsPanel({ onClose }: { onClose: () => void }) {
  return (
    <ModalCard title="Credits" onClose={onClose}>
      <div style={{ fontFamily: 'Lora, serif', color: '#b8c0c8', lineHeight: 1.8, fontSize: 13 }}>
        <div><strong style={{ color: '#e8d0a0', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>Aelindra: The Forsaken Knight</strong></div>
        <div style={{ marginTop: 6, color: '#8898a8' }}>Built with Phaser 3 · React · Zustand · TypeScript</div>
        <div style={{ marginTop: 14, borderTop: '1px solid rgba(200,168,98,0.1)', paddingTop: 12 }}>
          <div><span style={{ color: '#c8a862' }}>▸</span> Story World: Aelindra Chronicles</div>
          <div><span style={{ color: '#c8a862' }}>▸</span> Main Hero: Alden</div>
          <div><span style={{ color: '#c8a862' }}>▸</span> Light: Tam</div>
        </div>
        <div style={{ marginTop: 14, fontStyle: 'italic', color: '#687880', fontSize: 11 }}>
          "Di tengah malam tergelap, masih ada satu lilin kecil yang menyala."
        </div>
      </div>
    </ModalCard>
  );
});

// ── Main Title Screen ───────────────────────────────────────

const TitleScreen: React.FC = () => {
  const { setScreen, addNotification } = useGameStore();

  const requestFullscreen = React.useCallback(() => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      }
    } catch {} // silently fail on unsupported browsers
  }, []);
  const [ready, setReady] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCredits, setShowCredits] = React.useState(false);

  React.useEffect(() => {
    const t1 = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(t1);
  }, []);

  const continueGame = React.useCallback(() => {
    try {
      const save = localStorage.getItem('aelindra_save_0');
      if (!save) {
        addNotification({ type: 'warning', title: 'No Save Found', message: 'Start a new journey.', icon: '💾' });
        return;
      }
      const parsed = JSON.parse(save);
      if (!parsed || !parsed.player) {
        addNotification({ type: 'warning', title: 'Save Corrupted', message: 'The save data appears damaged.', icon: '⚠️' });
        return;
      }
      useGameStore.getState().loadGame(0);
    } catch {
      addNotification({ type: 'warning', title: 'Save Error', message: 'Could not load save data.', icon: '⚠️' });
    }
  }, [addNotification]);

  const handleQuit = React.useCallback(() => {
    addNotification({ type: 'info', title: 'Quit', message: 'Close tab/window untuk keluar dari game.', icon: '🚪', duration: 2200 });
  }, [addNotification]);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#050508' }}>
      <style>{`
        @keyframes lanternGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,160,64,0.5), 0 0 60px rgba(255,120,40,0.2); opacity: 0.9; }
          50% { box-shadow: 0 0 30px rgba(255,180,80,0.7), 0 0 80px rgba(255,140,50,0.3); opacity: 1; }
        }
        @keyframes fogDrift {
          0% { transform: translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateX(3%) scale(1.05); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 14px; height: 14px; border-radius: 50%;
          background: #c8a862;
          border: 2px solid rgba(200,168,98,0.3);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(200,168,98,0.2);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%;
          background: #c8a862;
          border: 2px solid rgba(200,168,98,0.3);
          cursor: pointer;
        }
      `}</style>

      <BackgroundLayer />
      <AshCanvas />

      <main
        className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 md:px-12"
        style={{ zIndex: 2 }}
      >
        <TitleContent ready={ready} />

        <div
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s cubic-bezier(0.23, 1, 0.32, 1), transform 1s cubic-bezier(0.23, 1, 0.32, 1)',
            transitionDelay: '800ms',
            zIndex: 2,
          }}
        >
          <div className="flex flex-col gap-3 sm:max-w-[320px]" style={{ marginTop: 36 }}>
            <PrimaryButton label="Begin New Journey" onClick={() => { requestFullscreen(); setScreen('prologue'); }} />
            <SecondaryButton label="Continue" onClick={continueGame} />
          </div>

          <div className="flex gap-2 sm:max-w-[320px]" style={{ marginTop: 12 }}>
            <MiniButton label="Settings" onClick={() => setShowSettings(true)} />
            <MiniButton label="Credits" onClick={() => setShowCredits(true)} />
            <MiniButton label="Quit" onClick={handleQuit} />
          </div>
        </div>

        {/* Version footer */}
        <p
          style={{
            position: 'absolute',
            bottom: 24,
            left: 28,
            fontFamily: 'Cinzel, serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'rgba(120,135,150,0.4)',
            textTransform: 'uppercase',
            zIndex: 2,
          }}
        >
          Forsaken Edition v1.0.0
        </p>
      </main>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showCredits && <CreditsPanel onClose={() => setShowCredits(false)} />}
    </div>
  );
};

export default TitleScreen;
