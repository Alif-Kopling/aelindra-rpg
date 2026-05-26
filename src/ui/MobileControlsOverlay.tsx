import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  MessageSquare,
  Flame,
  Wind,
  ArrowUp,
  Sword,
  Menu,
  Briefcase,
  Heart
} from 'lucide-react';

const MobileControlsOverlay: React.FC = () => {
  const { touchInput, setTouchInput, screen, deviceType } = useGameStore();

  if (screen !== 'game' || deviceType !== 'mobile') return null;

  const handleButton = (action: keyof typeof touchInput, active: boolean) => {
    setTouchInput({ [action]: active });
  };

  // Helper for mouse/touch down
  const createHandlers = (action: keyof typeof touchInput) => ({
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      handleButton(action, true);
    },
    onMouseUp: (e: React.MouseEvent) => {
      e.preventDefault();
      handleButton(action, false);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      e.preventDefault();
      handleButton(action, false);
    },
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      handleButton(action, true);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      handleButton(action, false);
    },
  });

  const buttonStyle: React.CSSProperties = {
    userSelect: 'none',
    touchAction: 'none',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Cinzel, serif',
    fontWeight: 'bold',
    color: '#e8d8b0',
    border: '1px solid rgba(200, 168, 98, 0.4)',
    background: 'rgba(15, 15, 25, 0.65)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.05s ease, background 0.1s ease',
    gap: 1,
    position: 'absolute',
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-40 w-full h-full"
      style={{ touchAction: 'none' }}
    >
      {/* Top Bar for settings/menu triggers on mobile */}
      <div className="absolute top-4 right-4 flex gap-3 pointer-events-auto">
        <button
          onClick={() => useGameStore.getState().togglePause()}
          style={{
            ...buttonStyle,
            position: 'static',
            width: 44,
            height: 44,
            borderRadius: 6,
            fontSize: 8,
          }}
        >
          <Menu size={16} />
          <span>MENU</span>
        </button>
        <button
          onClick={() => useGameStore.getState().toggleInventory()}
          style={{
            ...buttonStyle,
            position: 'static',
            width: 44,
            height: 44,
            borderRadius: 6,
            fontSize: 8,
          }}
        >
          <Briefcase size={16} />
          <span>BAG</span>
        </button>
      </div>

      {/* D-Pad Area - Left Bottom (Ergonomic placement) */}
      <div className="absolute bottom-10 left-10 flex gap-6 pointer-events-auto">
        <div
          {...createHandlers('left')}
          style={{
            ...buttonStyle,
            position: 'static',
            width: 72,
            height: 72,
            boxShadow: touchInput.left ? '0 0 15px rgba(200, 168, 98, 0.6)' : buttonStyle.boxShadow,
            borderColor: touchInput.left ? '#ffd700' : buttonStyle.borderColor,
            background: touchInput.left ? 'rgba(200, 168, 98, 0.3)' : buttonStyle.background,
            transform: touchInput.left ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          <ArrowLeft size={28} />
        </div>
        <div
          {...createHandlers('right')}
          style={{
            ...buttonStyle,
            position: 'static',
            width: 72,
            height: 72,
            boxShadow: touchInput.right ? '0 0 15px rgba(200, 168, 98, 0.6)' : buttonStyle.boxShadow,
            borderColor: touchInput.right ? '#ffd700' : buttonStyle.borderColor,
            background: touchInput.right ? 'rgba(200, 168, 98, 0.3)' : buttonStyle.background,
            transform: touchInput.right ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          <ArrowRight size={28} />
        </div>
      </div>

      {/* Action Buttons Area - Crescent Layout Bottom Right */}
      <div className="absolute bottom-0 right-0 w-[320px] h-[320px] pointer-events-auto">
        
        {/* ATTACK (Large central button, naturally positioned for right thumb) */}
        <div
          {...createHandlers('attack')}
          style={{
            ...buttonStyle,
            bottom: 40,
            right: 40,
            width: 90,
            height: 90,
            fontSize: 10,
            borderColor: '#e8d8b0',
            boxShadow: touchInput.attack ? '0 0 20px rgba(200, 168, 98, 0.8)' : '0 6px 16px rgba(0, 0, 0, 0.6)',
            background: touchInput.attack ? 'rgba(232, 191, 108, 0.45)' : 'rgba(30, 25, 15, 0.85)',
            transform: touchInput.attack ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          <Sword size={32} />
          <span>ATTACK</span>
        </div>

        {/* JUMP (Directly above Attack) */}
        <div
          {...createHandlers('jump')}
          style={{
            ...buttonStyle,
            bottom: 145,
            right: 35,
            width: 62,
            height: 62,
            fontSize: 8,
            boxShadow: touchInput.jump ? '0 0 15px rgba(200, 168, 98, 0.6)' : buttonStyle.boxShadow,
            borderColor: touchInput.jump ? '#ffd700' : buttonStyle.borderColor,
            background: touchInput.jump ? 'rgba(200, 168, 98, 0.3)' : buttonStyle.background,
            transform: touchInput.jump ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          <ArrowUp size={22} />
          <span>JUMP</span>
        </div>

        {/* DASH (To the left of Attack) */}
        <div
          {...createHandlers('dash')}
          style={{
            ...buttonStyle,
            bottom: 30,
            right: 145,
            width: 62,
            height: 62,
            fontSize: 8,
            boxShadow: touchInput.dash ? '0 0 15px rgba(200, 168, 98, 0.6)' : buttonStyle.boxShadow,
            borderColor: touchInput.dash ? '#ffd700' : buttonStyle.borderColor,
            background: touchInput.dash ? 'rgba(200, 168, 98, 0.3)' : buttonStyle.background,
            transform: touchInput.dash ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          <Wind size={20} />
          <span>DASH</span>
        </div>

        {/* PARRY (Diagonally top-left of Attack) */}
        <div
          {...createHandlers('parry')}
          style={{
            ...buttonStyle,
            bottom: 115,
            right: 120,
            width: 54,
            height: 54,
            fontSize: 8,
            boxShadow: touchInput.parry ? '0 0 15px rgba(200, 168, 98, 0.6)' : buttonStyle.boxShadow,
            borderColor: touchInput.parry ? '#ffd700' : buttonStyle.borderColor,
            background: touchInput.parry ? 'rgba(200, 168, 98, 0.3)' : buttonStyle.background,
            transform: touchInput.parry ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          <Shield size={18} />
          <span>PARRY</span>
        </div>

        {/* ULTIMATE (Top arch, above Parry) */}
        <div
          {...createHandlers('ultimate')}
          style={{
            ...buttonStyle,
            bottom: 190,
            right: 105,
            width: 52,
            height: 52,
            fontSize: 8,
            color: '#ffa040',
            borderColor: 'rgba(255, 160, 64, 0.5)',
            boxShadow: touchInput.ultimate ? '0 0 20px rgba(255, 160, 64, 0.7)' : buttonStyle.boxShadow,
            background: touchInput.ultimate ? 'rgba(255, 160, 64, 0.3)' : buttonStyle.background,
            transform: touchInput.ultimate ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          <Flame size={18} />
          <span>ULT</span>
        </div>

        {/* INTERACT / TALK (Outer top arch) */}
        <div
          {...createHandlers('interact')}
          style={{
            ...buttonStyle,
            bottom: 195,
            right: 175,
            width: 50,
            height: 50,
            fontSize: 8,
            boxShadow: touchInput.interact ? '0 0 15px rgba(200, 168, 98, 0.6)' : buttonStyle.boxShadow,
            borderColor: touchInput.interact ? '#ffd700' : buttonStyle.borderColor,
            background: touchInput.interact ? 'rgba(200, 168, 98, 0.3)' : buttonStyle.background,
            transform: touchInput.interact ? 'scale(0.92)' : 'scale(1)',
          }}
        >
          <MessageSquare size={16} />
          <span>TALK</span>
        </div>

        {/* POTION (Far left middle, easy to reach with thumb) */}
        <div
          onClick={() => {
            const store = useGameStore.getState();
            const slot = store.hotbar.indexOf('health_potion');
            if (slot >= 0) store.useHotbarItem(slot);
          }}
          style={{
            ...buttonStyle,
            bottom: 110,
            right: 195,
            width: 50,
            height: 50,
            fontSize: 8,
            borderColor: 'rgba(220, 80, 80, 0.5)',
          }}
        >
          <Heart size={16} color="#ff6b6b" />
          <span>POTION</span>
        </div>
      </div>
    </div>
  );
};

export default MobileControlsOverlay;
