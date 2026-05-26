import * as React from 'react';
import { useGameStore } from '../store/gameStore';

const HOTBAR_SIZE = 8;

const ITEM_IMAGES: Record<string, string> = {
  health_potion: '/assets/images/items/health_potion.png',
  iron_sword: '/assets/images/items/iron_sword.png',
  forsaken_blade: '/assets/images/items/forsaken_blade.png',
  knight_armor: '/assets/images/items/knight_armor.png',
  wanderers_ring: '/assets/images/items/wanderers_ring.png',
  blacksmiths_gift: '/assets/images/items/blacksmiths_gift.png',
};

const HUD: React.FC = () => {
  const {
    player,
    currentZone,
    skillPoints,
    hotbar,
    recallToTown,
    returnToBattlefield,
    hasRecallPortal,
    isAutoPlay,
    toggleAutoPlay,
    isAutoDialogue,
    toggleAutoDialogue,
    killCount,
    inventory,
    isCinematicGrainActive,
  } = useGameStore();
  const { stats, name, comboCount, ultimateCharge } = player;

  const hpPct = (stats.hp / stats.maxHp) * 100;
  const staminaPct = (stats.stamina / stats.maxStamina) * 100;

  const isInTown = currentZone === 'village';
  const isRecallActive = hasRecallPortal;

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ fontFamily: 'Cinzel, serif' }}>
      <div
        className="absolute inset-0"
        style={{
          opacity: isCinematicGrainActive ? 0.03 : 0,
          mixBlendMode: 'overlay',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.95) 0.5px, transparent 0.8px), radial-gradient(circle, rgba(0,0,0,0.9) 0.45px, transparent 0.75px)',
          backgroundSize: '3px 3px, 4px 4px',
          backgroundPosition: '0 0, 1px 1px',
          transition: 'opacity 180ms ease',
        }}
      />

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
        {skillPoints > 0 && (
          <div style={{
            fontSize: '9px',
            color: '#ffd700',
            marginTop: 4,
            letterSpacing: '1px',
            textShadow: '0 0 8px rgba(255,215,0,0.35)',
          }}>
            {skillPoints} UNSPENT SKILL POINT{skillPoints === 1 ? '' : 'S'}
          </div>
        )}
      </div>

      {/* Idle Stats Dashboard (bottom-left) + Trust */}
      <div className="absolute bottom-24 left-4" style={{ pointerEvents: 'auto' }}>
        <div style={{
          fontSize: '8px',
          color: '#8fa8b8',
          letterSpacing: '1px',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          lineHeight: '14px',
        }}>
          <div>EXP: {stats.exp}/{stats.expToNext}</div>
          <div>GOLD: {inventory.gold}</div>
          <div>KILLS: {killCount}</div>
          <TrustBars />
        </div>
      </div>

      {/* Recall Portal Button (bottom-right) */}
      <div className="absolute bottom-24 right-4" style={{ pointerEvents: 'auto' }}>
        {!isInTown ? (
          <button
            onClick={() => recallToTown()}
            style={{
              background: 'linear-gradient(135deg, #1a1a3a, #0d0d2a)',
              border: '1px solid #4169e1',
              borderRadius: 6,
              color: '#88bbff',
              padding: '6px 12px',
              fontSize: '10px',
              fontFamily: 'Cinzel, serif',
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: '0 0 12px rgba(65,105,225,0.3)',
            }}
          >
            ⟐ RECALL
          </button>
        ) : isRecallActive && (
          <button
            onClick={() => returnToBattlefield()}
            style={{
              background: 'linear-gradient(135deg, #3a1a1a, #2a0d0d)',
              border: '1px solid #ff4444',
              borderRadius: 6,
              color: '#ff8888',
              padding: '6px 12px',
              fontSize: '10px',
              fontFamily: 'Cinzel, serif',
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: '0 0 12px rgba(255,68,68,0.3)',
            }}
          >
            ⟐ RETURN
          </button>
        )}
      </div>

      {/* Toggle Buttons (top-right below zone) */}
      <div className="absolute top-24 right-6 text-right" style={{ pointerEvents: 'auto' }}>
        <button
          onClick={() => toggleAutoPlay()}
          style={{
            fontSize: '9px',
            color: isAutoPlay ? '#ffd700' : '#666',
            background: 'none',
            border: `1px solid ${isAutoPlay ? '#ffd700' : '#444'}`,
            borderRadius: 4,
            padding: '2px 8px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '1px',
            marginBottom: 4,
            display: 'block',
            width: '100%',
          }}
        >
          AUTO {isAutoPlay ? '⚔️' : '☐'}
        </button>
        <button
          onClick={() => toggleAutoDialogue()}
          style={{
            fontSize: '9px',
            color: isAutoDialogue ? '#ffd700' : '#666',
            background: 'none',
            border: `1px solid ${isAutoDialogue ? '#ffd700' : '#444'}`,
            borderRadius: 4,
            padding: '2px 8px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '1px',
            display: 'block',
            width: '100%',
          }}
        >
          STORY {isAutoDialogue ? '📖' : '☐'}
        </button>
      </div>

      {/* Bottom: Combo + Hotbar + Ultimate */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        {/* Combo - above hotbar */}
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

        {/* Hotbar */}
        <div className="flex items-center gap-1" style={{ pointerEvents: 'auto' }}>
          {hotbar.map((itemId, i) => (
            <div
              key={i}
              onClick={() => useGameStore.getState().useHotbarItem(i)}
              style={{
                width: 42,
                height: 42,
                background: itemId ? 'rgba(20,20,35,0.85)' : 'rgba(10,10,20,0.5)',
                border: itemId ? '1px solid rgba(184,134,11,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: itemId ? 'pointer' : 'default',
                position: 'relative',
                boxShadow: itemId ? '0 0 6px rgba(184,134,11,0.15)' : 'none',
              }}
            >
              {itemId && (
                <>
                  <img
                    src={ITEM_IMAGES[itemId] || ''}
                    alt={itemId}
                    style={{
                      width: 24,
                      height: 24,
                      imageRendering: 'pixelated',
                    }}
                  />
                  <span style={{
                    fontSize: '6px',
                    color: '#b8860b',
                    marginTop: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {getItemShortName(itemId)}
                  </span>
                </>
              )}
              <span style={{
                position: 'absolute',
                top: 2,
                left: 4,
                fontSize: '7px',
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'monospace',
              }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Ultimate bar - below hotbar */}
        {ultimateCharge > 0 && (
          <div className="flex items-center gap-2 justify-center">
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
      </div>
    </div>
  );
};

function TrustBars() {
  const npcTrust = useGameStore((s) => s.npcTrust);
  const npcLabels: Record<string, string> = {
    edric: 'Edric',
    nun: 'Nun',
    evelyne: 'Evelyne',
    tam: 'Tam',
  };
  return (
    <div style={{ marginTop: 8 }}>
      {Object.entries(npcTrust).map(([id, val]) => (
        <div key={id} className="flex items-center gap-1" style={{ marginBottom: 2 }}>
          <span style={{
            fontSize: '6px',
            color: '#888',
            width: 30,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {npcLabels[id] || id}
          </span>
          <div style={{
            width: 50,
            height: 3,
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${val}%`,
              height: '100%',
              background: val < 35 ? '#cc3333' : val < 65 ? '#ccaa33' : '#33cc66',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

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

function getItemShortName(itemId: string): string {
  const names: Record<string, string> = {
    health_potion: 'POT',
    iron_sword: 'SWD',
    forsaken_blade: 'FSWD',
    knight_armor: 'ARM',
    wanderers_ring: 'RNG',
    blacksmiths_gift: 'GFT',
  };
  return names[itemId] || itemId.slice(0, 3).toUpperCase();
}

export default HUD;
