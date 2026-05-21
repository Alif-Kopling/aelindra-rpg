import React from 'react';
import { useGameStore } from '../store/gameStore';

const HUD: React.FC = () => {
  const { player, currentZone } = useGameStore();
  const { stats, name, comboCount, ultimateCharge } = player;

  const hpPct = (stats.hp / stats.maxHp) * 100;
  const staminaPct = (stats.stamina / stats.maxStamina) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ fontFamily: 'Cinzel, serif' }}>

      {/* Top-left: Minimal HP + Name */}
      <div className="absolute top-6 left-6">
        <div style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#e8e0d0',
          letterSpacing: '2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          marginBottom: 6,
        }}>
          {name}
        </div>
        <div className="flex items-center gap-3">
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#ff6b6b',
            letterSpacing: '1px',
          }}>
            HP
          </span>
          <div style={{
            width: 160,
            height: 4,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(139,0,0,0.4)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${hpPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b0000, #dc143c, #ff4444)',
              boxShadow: '0 0 6px rgba(220,20,60,0.4)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span style={{
            fontSize: '9px',
            fontWeight: 600,
            color: '#32cd32',
            letterSpacing: '1px',
          }}>
            ST
          </span>
          <div style={{
            width: 120,
            height: 3,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(0,100,0,0.3)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${staminaPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #006400, #32cd32)',
              transition: 'width 0.2s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Top-right: Zone + Level */}
      <div className="absolute top-6 right-6 text-right">
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#b8860b',
          letterSpacing: '1px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
        }}>
          {getZoneName(currentZone)}
        </div>
        <div style={{
          fontSize: '9px',
          color: '#8fa8b8',
          marginTop: 2,
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          Lv.{stats.level} {player.cycle > 1 && <span style={{ color: '#ffd700', marginLeft: 6 }}>✦ Cycle {player.cycle}</span>}
        </div>
      </div>

      {/* Bottom: Minimal controls hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        {ultimateCharge > 0 && (
          <div className="flex items-center gap-2 justify-center mb-2">
            <span style={{ fontSize: '8px', color: '#b8860b', letterSpacing: '1px' }}>PASSION</span>
            <div style={{
              width: 100, height: 3,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(184,134,11,0.3)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                width: `${ultimateCharge}%`, height: '100%',
                background: ultimateCharge >= 100
                  ? 'linear-gradient(90deg, #b8860b, #ffd700)'
                  : 'linear-gradient(90deg, #4a3800, #8b6914)',
                boxShadow: ultimateCharge >= 100 ? '0 0 8px rgba(255,215,0,0.6)' : 'none',
                transition: 'width 0.3s ease',
              }} />
            </div>
            {ultimateCharge >= 100 && (
              <span style={{ fontSize: '8px', color: '#ffd700', letterSpacing: '1px' }}>
                READY
              </span>
            )}
          </div>
        )}

        {/* Combo */}
        {comboCount > 1 && (
          <div style={{
            fontSize: comboCount >= 4 ? '16px' : '12px',
            fontWeight: 700,
            color: comboCount >= 4 ? '#ffd700' : '#f4e4c1',
            textShadow: `0 0 ${comboCount * 4}px rgba(${comboCount >= 4 ? '255,215,0' : '244,228,193'},0.6)`,
            letterSpacing: '2px',
            textAlign: 'center',
          }}>
            {comboCount}x
          </div>
        )}
      </div>
    </div>
  );
};

function getZoneName(zoneId: string): string {
  const names: Record<string, string> = {
    village: 'Harrowmere Village',
    forest: 'Fogbound Forest',
    castle: 'Aelindra Castle Ruins',
    catacombs: 'Sunken Catacombs',
    battlefield: 'Ruined Battlefields',
    cathedral: 'Cathedral of Ash',
    mountain: 'Frostpeak Summit',
  };
  return names[zoneId] || zoneId;
}

export default HUD;
