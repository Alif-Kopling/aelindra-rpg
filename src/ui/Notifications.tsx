import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { Notification } from '../utils/types';

const NOTIF_STYLES: Record<Notification['type'], { border: string; glow: string; bg: string }> = {
  info:    { border: 'rgba(65,105,225,0.6)',  glow: 'rgba(65,105,225,0.2)',  bg: 'rgba(0,0,30,0.9)' },
  success: { border: 'rgba(50,205,50,0.6)',   glow: 'rgba(50,205,50,0.2)',   bg: 'rgba(0,20,0,0.9)' },
  warning: { border: 'rgba(255,165,0,0.6)',   glow: 'rgba(255,165,0,0.2)',   bg: 'rgba(30,15,0,0.9)' },
  danger:  { border: 'rgba(220,20,60,0.6)',   glow: 'rgba(220,20,60,0.2)',   bg: 'rgba(30,0,0,0.9)' },
  lore:    { border: 'rgba(184,134,11,0.6)',  glow: 'rgba(184,134,11,0.2)',  bg: 'rgba(20,12,0,0.9)' },
};

const Notifications: React.FC = () => {
  const { notifications } = useGameStore();

  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: 16, right: 16, zIndex: 70, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}
    >
      {notifications.map((notif) => (
        <NotifCard key={notif.id} notif={notif} />
      ))}
    </div>
  );
};

const NotifCard: React.FC<{ notif: Notification }> = ({ notif }) => {
  const style = NOTIF_STYLES[notif.type];

  return (
    <div
      className="notif-anim"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 4,
        padding: '10px 14px',
        boxShadow: `0 0 15px ${style.glow}, 0 4px 20px rgba(0,0,0,0.5)`,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      {notif.icon && (
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{notif.icon}</span>
      )}
      <div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 11,
          fontWeight: 700,
          color: '#f4e4c1',
          marginBottom: 2,
          letterSpacing: '1px',
        }}>
          {notif.title}
        </div>
        <div style={{
          fontFamily: 'Lora, serif',
          fontSize: 10,
          fontStyle: 'italic',
          color: '#8fa8b8',
          lineHeight: 1.5,
        }}>
          {notif.message}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
