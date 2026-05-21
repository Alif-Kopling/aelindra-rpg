import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { Item, ItemRarity } from '../utils/types';

const RARITY_COLORS: Record<ItemRarity, { border: string; glow: string; label: string }> = {
  common:    { border: '#666', glow: 'transparent', label: '#aaa' },
  uncommon:  { border: '#32cd32', glow: 'rgba(50,205,50,0.2)', label: '#32cd32' },
  rare:      { border: '#4169e1', glow: 'rgba(65,105,225,0.2)', label: '#87ceeb' },
  epic:      { border: '#9370db', glow: 'rgba(147,112,219,0.2)', label: '#da70d6' },
  legendary: { border: '#ffd700', glow: 'rgba(255,215,0,0.3)', label: '#ffd700' },
};

const Inventory: React.FC = () => {
  const { isInventoryOpen, toggleInventory, inventory, player, equipItem, removeItem, healPlayer, addNotification } = useGameStore();
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [hoveredItem, setHoveredItem] = React.useState<Item | null>(null);

  if (!isInventoryOpen) return null;

  const handleItemAction = (item: Item) => {
    if (item.type === 'consumable') {
      if (item.id === 'health_potion') {
        healPlayer(50);
        removeItem(item.id, 1);
        addNotification({ type: 'success', title: 'Used Healing Draught', message: 'Restored 50 HP.', icon: '🧪' });
      }
      setSelectedItem(null);
    } else if (['weapon', 'armor', 'accessory'].includes(item.type)) {
      equipItem(item.id);
      addNotification({ type: 'info', title: 'Equipped', message: `${item.name} equipped.`, icon: '⚔️' });
      setSelectedItem(null);
    }
  };

  const isEquipped = (item: Item) => {
    return (
      player.equippedWeapon === item.id ||
      player.equippedArmor === item.id ||
      player.equippedAccessory === item.id
    );
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      style={{ zIndex: 85, background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="relative"
        style={{
          width: 680,
          background: 'linear-gradient(135deg, rgba(8,8,16,0.98), rgba(16,10,24,0.98))',
          border: '1px solid rgba(184,134,11,0.5)',
          borderRadius: 6,
          boxShadow: '0 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(184,134,11,0.1)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(184,134,11,0.3)' }}>
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700, color: '#f4e4c1', letterSpacing: '3px' }}>
              INVENTORY
            </h2>
            <p style={{ fontFamily: 'Lora, serif', fontSize: 11, color: '#8fa8b8', fontStyle: 'italic', marginTop: 2 }}>
              {inventory.items.length} / {inventory.maxSlots} items  ·  {inventory.gold} 💰 Gold
            </p>
          </div>
          <button
            onClick={toggleInventory}
            className="btn-fantasy px-3 py-1"
            style={{ fontSize: 11, borderRadius: 3 }}
          >
            ✕ Close
          </button>
        </div>

        <div className="flex">
          {/* Grid */}
          <div className="p-4 flex-1">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {/* Filled slots */}
              {inventory.items.map((item) => {
                const rarity = RARITY_COLORS[item.rarity];
                const equipped = isEquipped(item);
                return (
                  <div
                    key={item.id + Math.random()}
                    className="relative cursor-pointer transition-transform duration-100 hover:scale-105"
                    style={{
                      width: 72,
                      height: 72,
                      background: equipped
                        ? `linear-gradient(135deg, ${rarity.glow}, rgba(255,215,0,0.1))`
                        : `linear-gradient(135deg, rgba(20,15,30,0.9), rgba(10,8,16,0.9))`,
                      border: `1px solid ${equipped ? '#ffd700' : rarity.border}`,
                      borderRadius: 4,
                      boxShadow: equipped ? '0 0 10px rgba(255,215,0,0.4)' : `0 0 8px ${rarity.glow}`,
                    }}
                    onClick={() => setSelectedItem(item === selectedItem ? null : item)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex items-center justify-center h-full" style={{ fontSize: 28 }}>
                      {item.icon}
                    </div>

                    {/* Quantity badge */}
                    {item.stackable && item.quantity > 1 && (
                      <div
                        className="absolute bottom-1 right-1"
                        style={{ fontSize: '9px', fontFamily: 'Cinzel, serif', color: '#fff', background: 'rgba(0,0,0,0.8)', padding: '1px 4px', borderRadius: 2 }}
                      >
                        {item.quantity}
                      </div>
                    )}

                    {/* Equipped badge */}
                    {equipped && (
                      <div
                        className="absolute top-0 left-0 px-1"
                        style={{ fontSize: '8px', fontFamily: 'Cinzel, serif', color: '#ffd700', background: 'rgba(0,0,0,0.8)', borderRadius: '4px 0 4px 0', padding: '1px 3px' }}
                      >
                        EQ
                      </div>
                    )}

                    {/* Rarity indicator */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b"
                      style={{ background: rarity.border, opacity: 0.8 }}
                    />
                  </div>
                );
              })}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, inventory.maxSlots - inventory.items.length) }, (_, i) => (
                <div
                  key={`empty_${i}`}
                  style={{
                    width: 72,
                    height: 72,
                    background: 'rgba(10,10,16,0.5)',
                    border: '1px solid rgba(60,60,80,0.4)',
                    borderRadius: 4,
                  }}
                />
              )).slice(0, 18)}
            </div>
          </div>

          {/* Side panel - Item detail */}
          <div
            style={{
              width: 200,
              borderLeft: '1px solid rgba(184,134,11,0.2)',
              padding: 16,
            }}
          >
            {selectedItem ? (
              <ItemDetail item={selectedItem} onAction={handleItemAction} />
            ) : hoveredItem ? (
              <ItemDetail item={hoveredItem} onAction={() => {}} readonly />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ opacity: 0.4 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎒</div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 11, fontStyle: 'italic', color: '#8fa8b8' }}>
                  Select an item to inspect
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Equipment row */}
        <div style={{ borderTop: '1px solid rgba(184,134,11,0.2)', padding: '12px 16px' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 10, color: '#b8860b', letterSpacing: '2px', marginBottom: 8 }}>
            EQUIPPED
          </div>
          <div className="flex gap-3">
            {[
              { slot: 'Weapon', id: player.equippedWeapon },
              { slot: 'Armor', id: player.equippedArmor },
              { slot: 'Accessory', id: player.equippedAccessory },
            ].map(({ slot, id }) => {
              const item = inventory.items.find(i => i.id === id);
              return (
                <div
                  key={slot}
                  className="flex items-center gap-2"
                  style={{
                    background: 'rgba(20,15,10,0.8)',
                    border: '1px solid rgba(184,134,11,0.4)',
                    borderRadius: 4,
                    padding: '6px 10px',
                    minWidth: 120,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item?.icon || '—'}</span>
                  <div>
                    <div style={{ fontSize: '8px', fontFamily: 'Cinzel, serif', color: '#b8860b', letterSpacing: '1px' }}>{slot}</div>
                    <div style={{ fontFamily: 'Lora, serif', fontSize: 10, color: '#f4e4c1' }}>{item?.name || 'None'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemDetail: React.FC<{ item: Item; onAction: (item: Item) => void; readonly?: boolean }> = ({ item, onAction, readonly }) => {
  const rarity = RARITY_COLORS[item.rarity];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 32 }}>{item.icon}</span>
        <div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 12, fontWeight: 700, color: '#f4e4c1' }}>{item.name}</div>
          <div style={{ fontSize: '9px', fontFamily: 'Cinzel, serif', color: rarity.label }}>
            {item.rarity.toUpperCase()} · {item.type.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: 'Lora, serif',
        fontSize: 11,
        fontStyle: 'italic',
        color: '#8fa8b8',
        lineHeight: 1.6,
        marginBottom: 12,
        padding: '8px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 3,
        border: '1px solid rgba(184,134,11,0.1)',
      }}>
        "{item.description}"
      </div>

      {item.stats && (
        <div className="mb-3">
          {Object.entries(item.stats).map(([stat, val]) => (
            <div key={stat} className="flex justify-between" style={{ fontSize: 10, fontFamily: 'Cinzel, serif', color: '#f4e4c1', marginBottom: 3 }}>
              <span style={{ color: '#b8860b' }}>{stat.toUpperCase()}</span>
              <span style={{ color: '#32cd32' }}>+{val}</span>
            </div>
          ))}
        </div>
      )}

      {!readonly && (
        <button
          onClick={() => onAction(item)}
          className="btn-fantasy w-full py-2 rounded-sm"
          style={{ fontSize: 9 }}
        >
          {item.type === 'consumable' ? '▶ USE' : '▶ EQUIP'}
        </button>
      )}
    </div>
  );
};

export default Inventory;
