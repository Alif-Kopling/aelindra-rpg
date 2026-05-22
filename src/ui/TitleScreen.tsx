import * as React from 'react';
import { useGameStore } from '../store/gameStore';

const TitleScreen: React.FC = () => {
  const { setScreen, settings, updateSettings, addNotification } = useGameStore();
  const [ready, setReady] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCredits, setShowCredits] = React.useState(false);

  React.useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  const continueGame = () => {
    const save = localStorage.getItem('aelindra_save_0');
    if (!save) {
      addNotification({
        type: 'warning',
        title: 'No Save Found',
        message: 'Start a new journey.',
        icon: '💾',
      });
      return;
    }
    useGameStore.getState().loadGame(0);
  };

  const handleQuit = () => {
    window.close();
    addNotification({
      type: 'info',
      title: 'Quit',
      message: 'Close tab/window untuk keluar dari game.',
      icon: '🚪',
      duration: 2200,
    });
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(100% 70% at 50% 10%, #1f2937 0%, #0d1117 45%, #07090d 100%)',
      }}
    >
      <style>
        {`
          @keyframes titleFadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes softPulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50% { opacity: 0.85; transform: scale(1.05); }
          }
          .title-btn {
            transition: transform 180ms ease, box-shadow 220ms ease, border-color 200ms ease, filter 200ms ease;
          }
          .title-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.06);
          }
          .title-btn:active {
            transform: translateY(0) scale(0.985);
          }
          .title-btn.primary:hover {
            border-color: rgba(246, 212, 141, 0.95);
            box-shadow: 0 16px 36px rgba(182, 134, 56, 0.35);
          }
          .title-btn.secondary:hover {
            border-color: rgba(193, 207, 222, 0.75);
            box-shadow: 0 12px 28px rgba(28, 42, 62, 0.32);
          }
          .title-mini {
            transition: transform 160ms ease, box-shadow 200ms ease, border-color 180ms ease, background-color 180ms ease;
          }
          .title-mini:hover {
            transform: translateY(-1px);
            border-color: rgba(211, 186, 141, 0.72);
            background: rgba(24, 30, 40, 0.9);
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
          }
          .title-mini:active {
            transform: translateY(0) scale(0.99);
          }
        `}
      </style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(55% 30% at 50% 75%, rgba(231,179,89,0.14), transparent 70%)',
          animation: 'softPulse 6s ease-in-out infinite',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '34%',
          background:
            'linear-gradient(to top, rgba(8,9,12,0.95) 0%, rgba(8,9,12,0.65) 52%, transparent 100%)',
        }}
      />

      <main
        className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 md:px-10"
        style={{
          opacity: ready ? 1 : 0,
          animation: ready ? 'titleFadeUp 760ms ease-out' : undefined,
        }}
      >
        <div className="max-w-2xl">
          <p
            style={{
              marginBottom: 14,
              fontFamily: 'Cinzel, serif',
              fontSize: 12,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#9fb0c1',
            }}
          >
            A Dark Fantasy Action RPG
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: 'Cinzel Decorative, serif',
              lineHeight: 0.92,
              fontSize: 'clamp(42px, 8vw, 88px)',
              letterSpacing: '0.02em',
              color: '#f3e5c4',
              textShadow: '0 0 40px rgba(223,176,87,0.22)',
            }}
          >
            Aelindra
            <br />
            <span style={{ color: '#e3b25e' }}>The Forsaken Knight</span>
          </h1>

          <p
            style={{
              marginTop: 18,
              marginBottom: 30,
              maxWidth: 640,
              fontFamily: 'Lora, serif',
              fontSize: 'clamp(14px, 2.1vw, 18px)',
              lineHeight: 1.72,
              color: '#cbd3dc',
            }}
          >
            Betrayed by the crown he once served, a fallen knight cuts through cursed realms
            to uncover the truth and decide the fate of Aelindra.
          </p>

          <div className="flex flex-col gap-3 sm:max-w-[340px]">
            <PrimaryButton label="Begin New Journey" onClick={() => setScreen('prologue')} />
            <SecondaryButton label="Continue" onClick={continueGame} />
          </div>

          <div className="mt-6 flex gap-2 sm:max-w-[340px]">
            <MiniButton label="Settings" onClick={() => setShowSettings(true)} />
            <MiniButton label="Credits" onClick={() => setShowCredits(true)} />
            <MiniButton label="Quit" onClick={handleQuit} />
          </div>
        </div>

        <footer
          style={{
            position: 'absolute',
            bottom: 20,
            left: 24,
            fontFamily: 'Cinzel, serif',
            fontSize: 11,
            letterSpacing: '0.16em',
            color: '#8a96a3',
            textTransform: 'uppercase',
          }}
        >
          Forsaken Edition v1.0.0
        </footer>
      </main>

      {showSettings && (
        <ModalCard title="Settings" onClose={() => setShowSettings(false)}>
          <SliderRow label="Master" value={settings.masterVolume} onChange={(v) => updateSettings({ masterVolume: v })} />
          <SliderRow label="Music" value={settings.musicVolume} onChange={(v) => updateSettings({ musicVolume: v })} />
          <SliderRow label="SFX" value={settings.sfxVolume} onChange={(v) => updateSettings({ sfxVolume: v })} />
          <SliderRow label="Ambient" value={settings.ambientVolume} onChange={(v) => updateSettings({ ambientVolume: v })} />
        </ModalCard>
      )}

      {showCredits && (
        <ModalCard title="Credits" onClose={() => setShowCredits(false)}>
          <div style={{ fontFamily: 'Lora, serif', color: '#d5dbe2', lineHeight: 1.72, fontSize: 14 }}>
            <div><strong style={{ color: '#f1ddb1' }}>Aelindra: The Forsaken Knight</strong></div>
            <div>Built with Phaser 3, React, Zustand, TypeScript.</div>
            <div style={{ marginTop: 8 }}>Story World: Aelindra Chronicles</div>
            <div>Main Hero: Alden</div>
          </div>
        </ModalCard>
      )}
    </div>
  );
};

const PrimaryButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="title-btn primary"
    style={{
      borderRadius: 8,
      border: '1px solid rgba(232,191,108,0.78)',
      background: 'linear-gradient(135deg, rgba(82,56,25,0.95), rgba(121,85,38,0.92))',
      color: '#f7e6bf',
      fontFamily: 'Cinzel, serif',
      fontSize: 15,
      letterSpacing: '0.06em',
      padding: '12px 14px',
      textAlign: 'left',
      boxShadow: '0 10px 26px rgba(182,134,56,0.25)',
    }}
  >
    {label}
  </button>
);

const SecondaryButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="title-btn secondary"
    style={{
      borderRadius: 8,
      border: '1px solid rgba(155,171,189,0.42)',
      background: 'linear-gradient(135deg, rgba(20,25,34,0.9), rgba(16,18,25,0.9))',
      color: '#d5dfeb',
      fontFamily: 'Cinzel, serif',
      fontSize: 15,
      letterSpacing: '0.06em',
      padding: '12px 14px',
      textAlign: 'left',
      boxShadow: '0 8px 20px rgba(0,0,0,0.24)',
    }}
  >
    {label}
  </button>
);

const MiniButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="title-mini"
    style={{
      flex: 1,
      borderRadius: 7,
      border: '1px solid rgba(169,178,190,0.36)',
      background: 'rgba(18,23,31,0.78)',
      color: '#c8d2de',
      fontFamily: 'Cinzel, serif',
      fontSize: 12,
      letterSpacing: '0.05em',
      padding: '9px 6px',
    }}
  >
    {label}
  </button>
);

const ModalCard: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(4,6,9,0.72)' }}>
    <div
      style={{
        width: 'min(460px, calc(100% - 30px))',
        borderRadius: 10,
        border: '1px solid rgba(233,196,118,0.42)',
        background: 'linear-gradient(145deg, rgba(12,15,21,0.97), rgba(17,13,10,0.95))',
        padding: 16,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div style={{ fontFamily: 'Cinzel, serif', color: '#eedab1', letterSpacing: '0.08em' }}>{title}</div>
        <button onClick={onClose} style={{ color: '#d7c6a4', fontFamily: 'monospace', fontSize: 14 }}>X</button>
      </div>
      {children}
    </div>
  </div>
);

const SliderRow: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 10 }}>
    <div className="mb-1 flex items-center justify-between">
      <span style={{ fontFamily: 'Cinzel, serif', color: '#cab38a', fontSize: 12 }}>{label}</span>
      <span style={{ fontFamily: 'monospace', color: '#9eb0c1', fontSize: 12 }}>{value}%</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%' }} />
  </div>
);

export default TitleScreen;
