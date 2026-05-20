import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { ITEMS_DB } from '../utils/constants';

const NameInputScreen: React.FC = () => {
  const { setScreen, setPlayerName, addItem } = useGameStore();
  const [name, setName] = useState('Alden');
  const [confirmed, setConfirmed] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    setTimeout(() => inputRef.current?.focus(), 600);
  }, []);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('A knight without a name is forgotten. Enter yours.'); return; }
    if (trimmed.length > 16) { setError('Names are short. Legends are long.'); return; }

    setConfirmed(true);
    setPlayerName(trimmed);

    // Give starting items
    addItem({ ...ITEMS_DB.health_potion, quantity: 3 });
    addItem({ ...ITEMS_DB.blacksmiths_gift, quantity: 1 });

    setTimeout(() => setScreen('game'), 1500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
    setError('');
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0a0810 0%, #050208 70%, #000005 100%)',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    >
      {/* Decorative background runes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.04 }}>
        {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ'].map((rune, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: 40 + Math.random() * 40,
              color: '#b8860b',
              left: `${(i * 6.25) % 100}%`,
              top: `${(i * 13) % 90}%`,
              fontFamily: 'serif',
            }}
          >
            {rune}
          </div>
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Main card */}
      <div
        style={{
          width: 500,
          padding: '48px 40px',
          background: 'linear-gradient(160deg, rgba(10,8,16,0.97), rgba(16,10,24,0.97))',
          border: '1px solid rgba(184,134,11,0.4)',
          borderRadius: 6,
          boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(184,134,11,0.08)',
          position: 'relative',
          zIndex: 10,
          animation: fadeIn ? 'slideUp 0.6s ease-out' : 'none',
        }}
      >
        {/* Corner decorations */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="absolute" style={{
            width: 20, height: 20,
            top: i < 2 ? 8 : 'auto',
            bottom: i >= 2 ? 8 : 'auto',
            left: i % 2 === 0 ? 8 : 'auto',
            right: i % 2 === 1 ? 8 : 'auto',
            borderTop: i < 2 ? '2px solid rgba(184,134,11,0.6)' : 'none',
            borderBottom: i >= 2 ? '2px solid rgba(184,134,11,0.6)' : 'none',
            borderLeft: i % 2 === 0 ? '2px solid rgba(184,134,11,0.6)' : 'none',
            borderRight: i % 2 === 1 ? '2px solid rgba(184,134,11,0.6)' : 'none',
          }} />
        ))}

        {/* Sword icon */}
        <div className="text-center mb-6">
          <div style={{ fontSize: 40, filter: 'drop-shadow(0 0 12px rgba(184,134,11,0.5))' }}>⚔️</div>
        </div>

        {/* Title */}
        <div className="text-center mb-2">
          <h2 style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 22,
            fontWeight: 900,
            color: '#f4e4c1',
            letterSpacing: '4px',
            textShadow: '0 0 20px rgba(184,134,11,0.3)',
          }}>
            Name Your Knight
          </h2>
        </div>

        {/* Flavor text */}
        <p style={{
          fontFamily: 'Lora, serif',
          fontStyle: 'italic',
          fontSize: 12,
          color: '#6a5a4a',
          textAlign: 'center',
          lineHeight: 1.7,
          marginBottom: 32,
        }}>
          "What is a knight without a name?<br />
          Nameless men are forgotten. Named men become legends."
        </p>

        {/* Input */}
        <div className="relative mb-2">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={handleKey}
            maxLength={16}
            disabled={confirmed}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${error ? '#8b0000' : 'rgba(184,134,11,0.5)'}`,
              borderRadius: 4,
              padding: '14px 20px',
              fontFamily: 'Cinzel, serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#ffd700',
              letterSpacing: '4px',
              textAlign: 'center',
              outline: 'none',
              boxShadow: `0 0 ${error ? '12px rgba(139,0,0,0.4)' : '12px rgba(184,134,11,0.15)'}`,
              transition: 'all 0.3s',
            }}
            placeholder="Alden"
          />
          <div style={{
            position: 'absolute',
            right: 12,
            bottom: 8,
            fontSize: '7px',
            fontFamily: 'Cinzel, serif',
            color: 'rgba(184,134,11,0.4)',
          }}>
            {name.length}/16
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            fontFamily: 'Lora, serif',
            fontStyle: 'italic',
            fontSize: 11,
            color: '#8b0000',
            textAlign: 'center',
            marginBottom: 8,
            animation: 'fadeIn 0.3s ease-out',
          }}>
            {error}
          </p>
        )}

        {/* Preset names */}
        <div className="flex justify-center gap-2 mt-3 mb-6">
          {['Alden', 'Cael', 'Daran', 'Kiran'].map(preset => (
            <button
              key={preset}
              onClick={() => { setName(preset); setError(''); inputRef.current?.focus(); }}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 9,
                color: name === preset ? '#ffd700' : '#6a5a4a',
                background: name === preset ? 'rgba(184,134,11,0.1)' : 'transparent',
                border: `1px solid ${name === preset ? 'rgba(184,134,11,0.4)' : 'rgba(100,80,60,0.3)'}`,
                borderRadius: 3,
                padding: '4px 10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          className="btn-fantasy w-full py-4 rounded-sm"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 14,
            letterSpacing: '3px',
            fontWeight: 700,
            color: confirmed ? '#ffd700' : '#f4e4c1',
            boxShadow: '0 0 20px rgba(184,134,11,0.2)',
            transition: 'all 0.3s',
            opacity: confirmed ? 0.7 : 1,
          }}
        >
          {confirmed ? '✦  Embarking...' : '✦  This is My Name'}
        </button>

        {/* Note */}
        <p style={{
          fontFamily: 'Lora, serif',
          fontStyle: 'italic',
          fontSize: 10,
          color: '#3a3040',
          textAlign: 'center',
          marginTop: 16,
        }}>
          Or press Enter to confirm
        </p>
      </div>
    </div>
  );
};

export default NameInputScreen;
