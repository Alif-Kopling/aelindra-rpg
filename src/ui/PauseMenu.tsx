import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { SKILL_TREE } from '../utils/constants';

type PauseTab = 'main' | 'skills' | 'settings' | 'controls' | 'save' | 'quests';

const PauseMenu: React.FC = () => {
  const { isPaused, togglePause, settings, updateSettings, saveGame, loadGame, saveSlots, quests, player, setScreen } = useGameStore();
  const [tab, setTab] = React.useState<PauseTab>('main');

  if (!isPaused) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      style={{ zIndex: 95, background: 'rgba(0,0,0,0.85)' }}
    >
      {/* Vignette overlay */}
      <div className="absolute inset-0 vignette" />

      <div
        style={{
          width: 'min(95vw, 520px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, rgba(8,5,14,0.99), rgba(14,8,22,0.99))',
          border: '1px solid rgba(184,134,11,0.4)',
          borderRadius: 6,
          boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(184,134,11,0.08)',
          animation: 'fadeIn 0.3s ease-out',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Title */}
        <div className="text-center py-3 sm:py-6" style={{ borderBottom: '1px solid rgba(184,134,11,0.2)' }}>
          <div style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(16px, 4vw, 22px)',
            fontWeight: 900,
            color: '#f4e4c1',
            textShadow: '0 0 20px rgba(184,134,11,0.4)',
            letterSpacing: '4px',
          }}>
            PAUSED
          </div>
          <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 'clamp(9px, 1.8vw, 11px)', color: '#8fa8b8', marginTop: 4 }}>
            {player.name} · Level {player.stats.level}
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex border-b overflow-x-auto" style={{ borderColor: 'rgba(184,134,11,0.2)' }}>
          {(['main', 'skills', 'settings', 'controls', 'save', 'quests'] as PauseTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 sm:py-3 transition-all duration-200 whitespace-nowrap"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(7px, 1.4vw, 9px)',
                letterSpacing: '1px',
                color: tab === t ? '#ffd700' : '#8fa8b8',
                background: tab === t ? 'rgba(184,134,11,0.1)' : 'transparent',
                borderBottom: tab === t ? '2px solid #b8860b' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ minHeight: 'clamp(200px, 50vh, 300px)', padding: 'clamp(12px, 3vw, 24px)' }}>
          {tab === 'main' && (
            <MainTab togglePause={togglePause} setScreen={setScreen} setTab={setTab} />
          )}
          {tab === 'skills' && (
            <SkillsTab />
          )}
          {tab === 'settings' && (
            <SettingsTab settings={settings} updateSettings={updateSettings} />
          )}
          {tab === 'controls' && (
            <ControlsTab />
          )}
          {tab === 'save' && (
            <SaveTab saveSlots={saveSlots} saveGame={saveGame} loadGame={loadGame} />
          )}
          {tab === 'quests' && (
            <QuestsTab quests={quests} />
          )}
        </div>
      </div>
    </div>
  );
};

const MainTab: React.FC<{ togglePause: () => void; setScreen: (s: any) => void; setTab: (tab: PauseTab) => void }> = ({ togglePause, setScreen, setTab }) => {
  const menuItems = [
    { label: '▶  Resume', action: togglePause, color: '#ffd700' },
    { label: '🗺  World Map', action: () => {}, color: '#f4e4c1' },
    { label: '🌟  Skill Tree', action: () => setTab('skills'), color: '#f4e4c1' },
    { label: '📜  Codex', action: () => {}, color: '#f4e4c1' },
    { label: '🏠  Return to Title', action: () => setScreen('title'), color: '#ff6b6b' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {menuItems.map(({ label, action, color }) => (
        <button
          key={label}
          onClick={action}
          className="btn-fantasy py-3 px-6 text-left rounded-sm transition-all duration-200"
          style={{ fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '1px', color }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const SkillsTab: React.FC = () => {
  const { skillPoints, unlockedSkills, unlockSkill } = useGameStore();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#b8860b', letterSpacing: '2px' }}>
            SKILL TREE
          </div>
          <div style={{ fontFamily: 'Lora, serif', fontSize: 11, color: '#8fa8b8', fontStyle: 'italic', marginTop: 4 }}>
            Spend points on combat identity, not raw inflation.
          </div>
        </div>
        <div style={{
          padding: '6px 10px',
          borderRadius: 4,
          border: '1px solid rgba(184,134,11,0.35)',
          background: 'rgba(0,0,0,0.25)',
          fontFamily: 'Cinzel, serif',
          fontSize: 11,
          color: '#ffd700',
          letterSpacing: '1px',
        }}>
          {skillPoints} POINT{skillPoints === 1 ? '' : 'S'}
        </div>
      </div>

      {SKILL_TREE.map((skill) => {
        const unlocked = unlockedSkills.includes(skill.id);
        const canAfford = skillPoints >= skill.cost;
        const meetsReq = skill.prerequisites.every((req) => unlockedSkills.includes(req));
        const canUnlock = !unlocked && canAfford && meetsReq;

        return (
          <div
            key={skill.id}
            style={{
              background: unlocked ? 'rgba(24, 20, 12, 0.9)' : 'rgba(10, 10, 16, 0.72)',
              border: `1px solid ${unlocked ? 'rgba(255,215,0,0.65)' : 'rgba(184,134,11,0.22)'}`,
              borderRadius: 6,
              padding: '12px 14px',
              boxShadow: unlocked ? '0 0 18px rgba(255,215,0,0.08)' : 'none',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: unlocked ? '#ffd700' : '#f4e4c1', fontWeight: 700 }}>
                  {skill.name}
                </div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 10, color: '#8fa8b8', fontStyle: 'italic', marginTop: 4, lineHeight: 1.5 }}>
                  {skill.description}
                </div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, color: '#b8860b', marginTop: 8, letterSpacing: '1px' }}>
                  COST {skill.cost} | {skill.category.toUpperCase()}
                  {skill.prerequisites.length > 0 && (
                    <span style={{ color: meetsReq ? '#32cd32' : '#ff6b6b', marginLeft: 10 }}>
                      REQ: {skill.prerequisites.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 9,
                  color: unlocked ? '#32cd32' : '#8fa8b8',
                  letterSpacing: '1px',
                }}>
                  {unlocked ? 'UNLOCKED' : canAfford ? 'READY' : 'LOCKED'}
                </div>
                {!unlocked && (
                  <button
                    onClick={() => unlockSkill(skill.id)}
                    disabled={!canUnlock}
                    className="btn-fantasy px-3 py-1 rounded-sm"
                    style={{
                      fontSize: 9,
                      opacity: canUnlock ? 1 : 0.45,
                      cursor: canUnlock ? 'pointer' : 'not-allowed',
                    }}
                  >
                    UNLOCK
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SettingsTab: React.FC<{ settings: any; updateSettings: (s: any) => void }> = ({ settings, updateSettings }) => {
  const sliders = [
    { key: 'masterVolume', label: 'Master Volume', icon: '🔊' },
    { key: 'musicVolume', label: 'Music', icon: '🎵' },
    { key: 'sfxVolume', label: 'Sound FX', icon: '⚔️' },
    { key: 'ambientVolume', label: 'Ambience', icon: '🌧️' },
  ];

  const toggles = [
    { key: 'showDamageNumbers', label: 'Damage Numbers' },
    { key: 'screenShake', label: 'Screen Shake' },
    { key: 'showFPS', label: 'Show FPS' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {sliders.map(({ key, label, icon }) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: '#f4e4c1' }}>{icon} {label}</span>
            <span style={{ fontSize: '10px', fontFamily: 'Cinzel, serif', color: '#b8860b' }}>{settings[key]}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings[key]}
            onChange={(e) => updateSettings({ [key]: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#b8860b' }}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2 mt-2">
        {toggles.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: '#f4e4c1' }}>{label}</span>
            <button
              onClick={() => updateSettings({ [key]: !settings[key] })}
              style={{
                width: 44,
                height: 22,
                borderRadius: 11,
                background: settings[key] ? '#b8860b' : '#333',
                border: '1px solid rgba(184,134,11,0.4)',
                position: 'relative',
                transition: 'background 0.3s',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 2,
                left: settings[key] ? 24 : 2,
                transition: 'left 0.3s',
              }} />
            </button>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: '#f4e4c1', marginBottom: 6 }}>Particle Quality</div>
        <div className="flex gap-2">
          {['low', 'medium', 'high'].map((q) => (
            <button
              key={q}
              onClick={() => updateSettings({ particleQuality: q })}
              className="btn-fantasy px-4 py-1 rounded-sm"
              style={{
                fontSize: 9,
                background: settings.particleQuality === q ? 'rgba(184,134,11,0.3)' : undefined,
                borderColor: settings.particleQuality === q ? '#ffd700' : undefined,
              }}
            >
              {q.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SaveTab: React.FC<{ saveSlots: any[]; saveGame: (slot: number) => void; loadGame: (slot: number) => void }> = ({ saveSlots, saveGame, loadGame }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex flex-col gap-3">
      {saveSlots.map((slot, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(20,15,10,0.6)',
            border: '1px solid rgba(184,134,11,0.3)',
            borderRadius: 4,
            padding: '12px 16px',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: '#f4e4c1', marginBottom: 3 }}>
                Slot {i + 1}
                {slot.isEmpty ? (
                  <span style={{ fontSize: 9, color: '#666', marginLeft: 8 }}>— Empty —</span>
                ) : (
                  <span style={{ fontSize: 9, color: '#b8860b', marginLeft: 8 }}>{slot.playerName} · Lv.{slot.level}</span>
                )}
              </div>
              {!slot.isEmpty && (
                <div style={{ fontSize: '9px', fontFamily: 'Cinzel, serif', color: '#8fa8b8' }}>
                  {slot.zone} · {formatTime(slot.playtime)} · {new Date(slot.timestamp).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => saveGame(i)}
                className="btn-fantasy px-3 py-1 rounded-sm"
                style={{ fontSize: 8 }}
              >
                SAVE
              </button>
              {!slot.isEmpty && (
                <button
                  onClick={() => loadGame(i)}
                  className="btn-fantasy px-3 py-1 rounded-sm"
                  style={{ fontSize: 8, borderColor: '#4169e1', color: '#87ceeb' }}
                >
                  LOAD
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ControlsTab: React.FC = () => {
  const controls = [
    {
      title: 'MOVEMENT',
      keys: [
        { key: 'WASD', desc: 'Move' },
        { key: 'SPACE / SHIFT', desc: 'Dash (i-frames, directional)' },
        { key: 'A/D + DASH', desc: 'Dash in held direction (air OK)' },
        { key: 'W / SPACE', desc: 'Jump / double jump' },
      ],
    },
    {
      title: 'COMBAT',
      keys: [
        { key: 'L / MOUSE 1', desc: 'Combo chain (5 hits → finisher)' },
        { key: 'HOLD L', desc: 'Charged heavy slash' },
        { key: 'MID-SWING + DASH', desc: 'Attack cancel into dash' },
        { key: 'F', desc: 'Parry / counter' },
        { key: 'RIGHT CLICK', desc: 'Forsaken Slash (ultimate)' },
      ],
    },
    {
      title: 'STORY',
      keys: [
        { key: '1–5', desc: 'Dialogue tone choice' },
        { key: 'CLICK / Z', desc: 'Advance dialogue' },
        { key: 'E', desc: 'Talk to NPCs' },
      ],
    },
    {
      title: 'ACTIONS',
      keys: [
        { key: 'TAB', desc: 'Inventory' },
        { key: '1–8', desc: 'Hotbar' },
        { key: 'ESC', desc: 'Pause' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {controls.map((cat) => (
        <div key={cat.title}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#b8860b', letterSpacing: '2px', marginBottom: 8 }}>{cat.title}</div>
          <div className="flex flex-col gap-2">
            {cat.keys.map(k => (
              <div key={k.key} className="flex justify-between items-center" style={{ background: 'rgba(20,15,10,0.6)', padding: '6px 10px', borderRadius: 3 }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 11, color: '#f4e4c1', fontWeight: 600 }}>{k.key}</span>
                <span style={{ fontFamily: 'Lora, serif', fontSize: 10, color: '#8fa8b8', fontStyle: 'italic' }}>{k.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const QuestsTab: React.FC<{ quests: any[] }> = ({ quests }) => {
  const active = quests.filter(q => q.status === 'active');
  const completed = quests.filter(q => q.status === 'completed');

  if (quests.length === 0) {
    return (
      <div className="text-center py-8" style={{ opacity: 0.5 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📜</div>
        <div style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: 12, color: '#8fa8b8' }}>
          No quests yet. Speak with villagers.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" style={{ maxHeight: 280, overflowY: 'auto' }}>
      {active.length > 0 && (
        <>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#b8860b', letterSpacing: '2px' }}>ACTIVE</div>
          {active.map(quest => (
            <QuestEntry key={quest.id} quest={quest} />
          ))}
        </>
      )}
      {completed.length > 0 && (
        <>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#32cd32', letterSpacing: '2px', marginTop: 8 }}>COMPLETED</div>
          {completed.map(quest => (
            <QuestEntry key={quest.id} quest={quest} completed />
          ))}
        </>
      )}
    </div>
  );
};

const QuestEntry: React.FC<{ quest: any; completed?: boolean }> = ({ quest, completed }) => (
  <div style={{
    background: 'rgba(20,15,10,0.6)',
    border: `1px solid ${completed ? 'rgba(50,205,50,0.3)' : 'rgba(184,134,11,0.3)'}`,
    borderRadius: 4,
    padding: '10px 14px',
    opacity: completed ? 0.6 : 1,
  }}>
    <div className="flex items-start gap-2 mb-2">
      <span style={{ fontSize: 14 }}>{quest.isMain ? '⭐' : '📜'}</span>
      <div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: '#f4e4c1', fontWeight: 600 }}>{quest.title}</div>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 10, fontStyle: 'italic', color: '#8fa8b8', marginTop: 2 }}>
          {quest.description}
        </div>
      </div>
    </div>
    {!completed && quest.objectives.map((obj: any) => (
      <div key={obj.id} className="flex items-center gap-2 mt-1">
        <div style={{ fontSize: 8 }}>{obj.completed ? '✅' : '◻'}</div>
        <div style={{ fontSize: '9px', fontFamily: 'Cinzel, serif', color: obj.completed ? '#32cd32' : '#f4e4c1' }}>
          {obj.description} ({obj.current}/{obj.required})
        </div>
      </div>
    ))}
    <div className="flex gap-3 mt-2" style={{ fontSize: '9px', fontFamily: 'Cinzel, serif', color: '#b8860b' }}>
      <span>+{quest.rewards.exp} EXP</span>
      <span>+{quest.rewards.gold} Gold</span>
    </div>
  </div>
);

export default PauseMenu;
