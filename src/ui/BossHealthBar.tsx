import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const BossHealthBar: React.FC = () => {
  const { activeBoss } = useGameStore();
  const [visible, setVisible] = useState(false);
  const [prevHp, setPrevHp] = useState(0);
  const [damageFlash, setDamageFlash] = useState(false);
  const prevHpRef = useRef(0);

  useEffect(() => {
    if (activeBoss?.isActive) {
      setVisible(true);
      setPrevHp(activeBoss.hp);
    } else {
      const t = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(t);
    }
  }, [activeBoss?.isActive]);

  useEffect(() => {
    if (!activeBoss) return;
    if (activeBoss.hp < prevHpRef.current) {
      setDamageFlash(true);
      setTimeout(() => setDamageFlash(false), 200);
    }
    prevHpRef.current = activeBoss.hp;
    setPrevHp(activeBoss.hp);
  }, [activeBoss?.hp]);

  if (!visible || !activeBoss) return null;

  const hpPct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
  const phaseThresholds = activeBoss.maxPhase >= 2 ? [50] : [];
  if (activeBoss.maxPhase >= 3) phaseThresholds.push(25);

  const barColor = hpPct > 60 ? '#dc143c' : hpPct > 30 ? '#ff6600' : '#ff0000';

  return (
    <div
      className="absolute top-8 left-1/2 pointer-events-none"
      style={{
        transform: 'translateX(-50%)',
        zIndex: 90,
        width: 'min(600px, 80vw)',
        animation: visible ? 'slideUp 0.5s ease-out' : 'none',
        opacity: activeBoss.isActive ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Boss name */}
      <div className="text-center mb-2">
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 16,
          fontWeight: 900,
          color: '#cc0000',
          textShadow: '0 0 15px rgba(200,0,0,0.6), 0 0 30px rgba(200,0,0,0.3)',
          letterSpacing: '3px',
          animation: 'textGlow 2s ease-in-out infinite',
        }}>
          {activeBoss.name}
        </div>
        <div style={{
          fontFamily: 'Lora, serif',
          fontSize: 11,
          fontStyle: 'italic',
          color: '#8fa8b8',
          marginTop: 2,
        }}>
          ✦ {activeBoss.title} ✦
        </div>
      </div>

      {/* Phase indicators */}
      {activeBoss.maxPhase > 1 && (
        <div className="flex justify-center gap-2 mb-2">
          {Array.from({ length: activeBoss.maxPhase }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-1"
              style={{
                fontSize: '9px',
                fontFamily: 'Cinzel, serif',
                color: i + 1 === activeBoss.phase ? '#ff4444' : '#444',
              }}
            >
              {i + 1 <= activeBoss.phase ? '◆' : '◇'}
              PHASE {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* HP Bar container */}
      <div style={{
        height: 20,
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(139,0,0,0.8)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 0 20px rgba(139,0,0,0.4)',
      }}>
        {/* HP fill */}
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${hpPct}%`,
            background: damageFlash
              ? '#ffffff'
              : `linear-gradient(90deg, ${barColor}aa, ${barColor}, ${barColor}cc)`,
            boxShadow: `0 0 10px ${barColor}88`,
            animation: 'bossBarPulse 1.5s ease-in-out infinite',
          }}
        />

        {/* Phase separator lines */}
        {phaseThresholds.map((pct) => (
          <div
            key={pct}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'rgba(255,215,0,0.8)',
              boxShadow: '0 0 4px rgba(255,215,0,0.6)',
            }}
          />
        ))}

        {/* HP text */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: '10px',
            fontFamily: 'Cinzel, serif',
            color: '#fff',
            textShadow: '1px 1px 2px #000',
            fontWeight: 600,
          }}
        >
          {activeBoss.hp} / {activeBoss.maxHp}
        </div>
      </div>

      {/* Phase warning */}
      {activeBoss.phase >= 2 && (
        <div className="text-center mt-1">
          <span style={{
            fontSize: '10px',
            fontFamily: 'Cinzel, serif',
            color: activeBoss.phase >= 3 ? '#ff0000' : '#ff6600',
            animation: 'pulse 1s ease-in-out infinite',
            fontWeight: 600,
          }}>
            {activeBoss.phase >= 3 ? 'Enraged' : `— Phase ${activeBoss.phase} —`}
          </span>
        </div>
      )}
    </div>
  );
};

export default BossHealthBar;
