import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { Monitor, Smartphone, Gamepad2 } from 'lucide-react';

const DeviceSelectScreen: React.FC = () => {
  const { setDeviceType, setScreen, addNotification } = useGameStore();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  const selectDevice = (device: 'pc' | 'mobile' | 'console') => {
    setDeviceType(device);
    
    let message = '';
    let icon = '';
    if (device === 'pc') {
      message = 'Keyboard & Mouse mode active (WASD / J / Space)';
      icon = '🖥️';
    } else if (device === 'mobile') {
      message = 'Touchscreen controls active. On-screen buttons enabled.';
      icon = '📱';
    } else {
      message = 'Gamepad controls active. Plug in a controller.';
      icon = '🎮';
    }

    addNotification({
      type: 'info',
      title: 'Control Scheme Selected',
      message,
      icon,
      duration: 3000,
    });

    window.dispatchEvent(new CustomEvent('sfx:play', { detail: { key: 'sfx_equip', volume: 0.5, rate: 1 } }));
    setScreen('title');
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#050508',
        fontFamily: 'Cinzel, serif',
      }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(184, 134, 11, 0.05) 0%, rgba(5, 5, 8, 0.95) 80%)',
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px 0',
            fontFamily: 'Cinzel Decorative, serif',
            fontWeight: 900,
            fontSize: 'clamp(24px, 5vw, 48px)',
            color: '#f0e0c8',
            textShadow: '0 0 40px rgba(200, 160, 80, 0.15)',
            letterSpacing: '0.1em',
          }}
        >
          Select Your Input Device
        </h1>
        <p
          style={{
            margin: '0 0 40px 0',
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
            color: '#a0aec0',
            fontSize: 'clamp(12px, 1.8vw, 16px)',
            maxWidth: 500,
          }}
        >
          "How shall you brave the shadows of Aelindra?"
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-3xl">
          {/* PC OPTION */}
          <div
            onClick={() => selectDevice('pc')}
            style={{
              flex: 1,
              padding: '30px 20px',
              borderRadius: 8,
              border: '1px solid rgba(200, 168, 98, 0.2)',
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.6), rgba(10, 10, 15, 0.8))',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 191, 108, 0.8)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(182, 134, 56, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 168, 98, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
            }}
          >
            <Monitor size={48} color="#e8d8b0" style={{ marginBottom: 15 }} />
            <h3 style={{ color: '#e8d8b0', fontSize: 18, marginBottom: 8, letterSpacing: '0.05em' }}>PC / KEYBOARD</h3>
            <p style={{ color: '#8898a8', fontSize: 13, lineHeight: 1.5, margin: 0, fontFamily: 'sans-serif' }}>
              Standard WASD movement, Space to jump, J to attack, L for ultimate, Shift to dash.
            </p>
          </div>

          {/* MOBILE OPTION */}
          <div
            onClick={() => selectDevice('mobile')}
            style={{
              flex: 1,
              padding: '30px 20px',
              borderRadius: 8,
              border: '1px solid rgba(200, 168, 98, 0.2)',
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.6), rgba(10, 10, 15, 0.8))',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 191, 108, 0.8)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(182, 134, 56, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 168, 98, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
            }}
          >
            <Smartphone size={48} color="#e8d8b0" style={{ marginBottom: 15 }} />
            <h3 style={{ color: '#e8d8b0', fontSize: 18, marginBottom: 8, letterSpacing: '0.05em' }}>MOBILE / TOUCH</h3>
            <p style={{ color: '#8898a8', fontSize: 13, lineHeight: 1.5, margin: 0, fontFamily: 'sans-serif' }}>
              On-screen movement buttons and action buttons. Optimized for touchscreen play.
            </p>
          </div>

          {/* CONSOLE OPTION */}
          <div
            onClick={() => selectDevice('console')}
            style={{
              flex: 1,
              padding: '30px 20px',
              borderRadius: 8,
              border: '1px solid rgba(200, 168, 98, 0.2)',
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.6), rgba(10, 10, 15, 0.8))',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 191, 108, 0.8)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(182, 134, 56, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 168, 98, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
            }}
          >
            <Gamepad2 size={48} color="#e8d8b0" style={{ marginBottom: 15 }} />
            <h3 style={{ color: '#e8d8b0', fontSize: 18, marginBottom: 8, letterSpacing: '0.05em' }}>CONSOLE / GAMEPAD</h3>
            <p style={{ color: '#8898a8', fontSize: 13, lineHeight: 1.5, margin: 0, fontFamily: 'sans-serif' }}>
              Play with Xbox, PlayStation, or other controllers. Native stick and button mapping enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectScreen;
