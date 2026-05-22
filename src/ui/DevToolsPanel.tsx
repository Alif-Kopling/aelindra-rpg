import * as React from 'react';
import { useGameStore } from '../store/gameStore';

type DevToolsPanelProps = {
  onTriggerFinalBossDefeat: () => void;
};

const ZONES = ['village', 'forest', 'castle', 'catacombs', 'cathedral', 'mountain', 'battlefield'] as const;

const DevToolsPanel: React.FC<DevToolsPanelProps> = ({ onTriggerFinalBossDefeat }) => {
  const [open, setOpen] = React.useState(false);
  const { setScreen, setZone, setStoryFlag, closeDialogue, addNotification } = useGameStore();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const jumpToZone = (zone: string) => {
    closeDialogue();
    setStoryFlag('intro_seen', true);
    setScreen('game');
    setZone(zone);
    addNotification({
      type: 'info',
      title: 'Dev Jump',
      message: `Jumped to zone: ${zone}`,
      icon: '🧪',
      duration: 1800,
    });
  };

  const jumpToEnding = () => {
    closeDialogue();
    setStoryFlag('intro_seen', true);
    setScreen('ending');
  };

  const jumpToEpilogue = () => {
    closeDialogue();
    setStoryFlag('intro_seen', true);
    setScreen('epilogue');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute top-3 left-3 pointer-events-auto"
        style={{
          zIndex: 1200,
          padding: '6px 10px',
          fontSize: 11,
          fontFamily: 'monospace',
          color: '#d4c39a',
          background: 'rgba(10,10,14,0.82)',
          border: '1px solid rgba(212,195,154,0.4)',
          borderRadius: 4,
          letterSpacing: '0.5px',
        }}
      >
        ;
      </button>
    );
  }

  return (
    <div
      className="absolute top-3 left-3 pointer-events-auto"
      style={{
        zIndex: 1200,
        width: 320,
        background: 'rgba(8,8,12,0.94)',
        border: '1px solid rgba(212,195,154,0.35)',
        borderRadius: 6,
        padding: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#d4c39a' }}>Dev Tools</div>
        <button
          onClick={() => setOpen(false)}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#f0dfb6',
            border: '1px solid rgba(212,195,154,0.35)',
            background: 'rgba(20,20,30,0.8)',
            borderRadius: 4,
            padding: '2px 8px',
          }}
        >
          Hide
        </button>
      </div>

      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9a927e', marginBottom: 6 }}>
        Jump Zone
      </div>
      <div className="grid grid-cols-2 gap-2" style={{ marginBottom: 10 }}>
        {ZONES.map((zone) => (
          <button
            key={zone}
            onClick={() => jumpToZone(zone)}
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#f4e4c1',
              border: '1px solid rgba(212,195,154,0.28)',
              background: 'rgba(22,22,32,0.85)',
              borderRadius: 4,
              padding: '5px 6px',
              textTransform: 'uppercase',
            }}
          >
            {zone}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9a927e', marginBottom: 6 }}>
        Story Skip
      </div>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={jumpToEnding}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#f4e4c1',
            border: '1px solid rgba(212,195,154,0.28)',
            background: 'rgba(22,22,32,0.85)',
            borderRadius: 4,
            padding: '6px 8px',
          }}
        >
          Open Ending Screen
        </button>
        <button
          onClick={jumpToEpilogue}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#f4e4c1',
            border: '1px solid rgba(212,195,154,0.28)',
            background: 'rgba(22,22,32,0.85)',
            borderRadius: 4,
            padding: '6px 8px',
          }}
        >
          Open Epilogue Screen
        </button>
        <button
          onClick={onTriggerFinalBossDefeat}
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#ffe3b3',
            border: '1px solid rgba(255,189,89,0.4)',
            background: 'rgba(48,30,12,0.85)',
            borderRadius: 4,
            padding: '6px 8px',
          }}
        >
          Trigger Final Boss Defeated
        </button>
      </div>
    </div>
  );
};

export default DevToolsPanel;
