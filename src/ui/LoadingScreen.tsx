import * as React from 'react';

interface LoadingScreenProps {
  progress: number;
}

const LOADING_TIPS = [
  '"Even in a dying world, someone still leaves the lantern on."',
  '"Forgotten swords still remember the weight of oaths."',
  '"The old gods do not answer—so we must answer for ourselves."',
  '"A knight is not measured by victories, but by what they protect."',
  '"The embers of the past still glow beneath the ash."',
];

function useEmberParticles(count: number) {
  return React.useMemo(() => {
    const p: { x: number; y: number; size: number; speed: number; phase: number; alpha: number }[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: Math.random() * 100,
        y: 90 + Math.random() * 20,
        size: 1.5 + Math.random() * 2.5,
        speed: 0.05 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.4,
      });
    }
    return p;
  }, [count]);
}

const EmberCanvas: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particles = useEmberParticles(16);

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

    const embers = particles.map(p => ({ ...p, x: (p.x / 100) * w, y: (p.y / 100) * h }));

    let animId: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      for (const p of embers) {
        p.y -= p.speed;
        p.x += Math.sin((frame + p.phase) * 0.015) * 0.15;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const flicker = 0.6 + Math.sin(frame * 0.04 + p.phase) * 0.4;
        const fade = Math.min(1, ((h - p.y) / h) * 2);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,120,40,${p.alpha * flicker * fade * 0.6})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,100,${p.alpha * flicker * fade * 0.3})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.6 }}
      aria-hidden="true"
    />
  );
};

const ProgressFill: React.FC<{ value: number }> = ({ value }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className="relative"
      style={{ width: 240, height: 3 }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Game loading progress"
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(60,50,40,0.3)',
          borderRadius: 2,
          border: '1px solid rgba(184,134,11,0.12)',
        }}
      />
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: `${clamped}%`,
          background: 'linear-gradient(90deg, #8a6a20, #c8a862 60%, #ffd700)',
          borderRadius: 2,
          transition: 'width 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
          boxShadow: '0 0 6px rgba(200,168,98,0.35)',
        }}
      />
    </div>
  );
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % LOADING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0a0810 0%, #050208 60%, #000005 100%)',
        zIndex: 1000,
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading game assets"
    >
      <EmberCanvas />

      {/* Vignette overlay */}
      <div className="absolute inset-0 vignette" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full" style={{ gap: 0 }}>
        {/* Emblem mark */}
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            border: '1.5px solid rgba(184,134,11,0.45)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '1px solid rgba(184,134,11,0.3)',
              transform: 'rotate(45deg)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 10,
                height: 1.5,
                background: '#c8a862',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 4px rgba(200,168,98,0.3)',
              }}
            />
          </div>
        </div>

        <h2
          style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 18,
            fontWeight: 900,
            color: '#f4e4c1',
            letterSpacing: '0.4em',
            textShadow: '0 0 20px rgba(184,134,11,0.2)',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Aelindra
        </h2>

        <p
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 9,
            color: '#6a5a4a',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            margin: '8px 0 0 0',
            lineHeight: 1,
          }}
        >
          The Forsaken Knight
        </p>

        {/* Loading tip */}
        <p
          key={tipIndex}
          style={{
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
            fontSize: 11,
            color: 'rgba(140,130,115,0.6)',
            textAlign: 'center',
            maxWidth: 320,
            lineHeight: 1.6,
            margin: '44px 0 28px',
            transition: 'opacity 0.4s ease',
          }}
        >
          {LOADING_TIPS[tipIndex]}
        </p>

        <ProgressFill value={progress} />

        <p
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 9,
            color: 'rgba(120,105,80,0.5)',
            letterSpacing: '0.25em',
            marginTop: 12,
          }}
        >
          {progress < 100 ? `${progress}%` : '✦  Entering the Forsaken Lands'}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
