import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTrustDiscount } from '../systems/dialogueEngine';

const ITEM_IMAGES: Record<string, string> = {
  health_potion: '/assets/images/items/health_potion.png',
  iron_sword: '/assets/images/items/iron_sword.png',
  forsaken_blade: '/assets/images/items/forsaken_blade.png',
  knight_armor: '/assets/images/items/knight_armor.png',
  wanderers_ring: '/assets/images/items/wanderers_ring.png',
  blacksmiths_gift: '/assets/images/items/blacksmiths_gift.png',
};

const Shop: React.FC = () => {
  const {
    player,
    inventory,
    isShopOpen,
    setShopOpen,
    upgradeWeapon,
    upgradeArmor,
    buyPotion,
  } = useGameStore();

  const [activeTab, setActiveTab] = React.useState<'upgrade' | 'item'>('upgrade');
  const [clickAudio, setClickAudio] = React.useState<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Setup click sound effect
    const audio = new Audio('/assets/audio/dialog-sound.mp3');
    audio.volume = 0.25;
    setClickAudio(audio);
  }, []);

  const playClick = () => {
    if (clickAudio) {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    }
  };

  if (!isShopOpen) return null;

  const { npcTrust } = useGameStore();
  const edricDiscount = getTrustDiscount(npcTrust, 'edric');

  const weaponLvl = player.weaponLevel || 1;
  const armorLvl = player.armorLevel || 1;

  const weaponUpgradeCost = Math.max(10, (60 + (weaponLvl - 1) * 30) - edricDiscount);
  const armorUpgradeCost = Math.max(10, (50 + (armorLvl - 1) * 25) - edricDiscount);
  const potionCost = Math.max(10, 30 - edricDiscount);

  const handleWeaponUpgrade = () => {
    if (inventory.gold >= weaponUpgradeCost) {
      playClick();
      upgradeWeapon(weaponUpgradeCost);
    }
  };

  const handleArmorUpgrade = () => {
    if (inventory.gold >= armorUpgradeCost) {
      playClick();
      upgradeArmor(armorUpgradeCost);
    }
  };

  const handleBuyPotion = () => {
    if (inventory.gold >= potionCost) {
      playClick();
      buyPotion(potionCost);
    }
  };

  const currentPotionCount = inventory.items.find(i => i.id === 'health_potion')?.quantity || 0;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      style={{
        zIndex: 90,
        background: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: 'min(720px, 95vw)',
          height: 'min(500px, 85vh)',
          background: 'linear-gradient(180deg, #120f17 0%, #0c0a0f 100%)',
          border: '2px solid #8b6914',
          borderRadius: '8px',
          boxShadow: '0 0 30px rgba(139, 105, 20, 0.4), inset 0 0 25px rgba(0, 0, 0, 0.7)',
          padding: '24px',
          color: '#f4e4c1',
          fontFamily: "'Cinzel', serif",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: 'rgba(139, 105, 20, 0.3)' }}>
          <div>
            <h2 className="text-xl font-bold tracking-widest text-yellow-500 uppercase" style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.4)' }}>
              Edric's Blacksmith Shop
            </h2>
            <p className="text-xs italic text-gray-400 mt-1">"Survive, boy. That's an order."</p>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-yellow-600/30">
            <svg width="18" height="18" viewBox="0 0 16 16" className="text-yellow-500">
              <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2"/>
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <text x="8" y="11" textAnchor="middle" fontSize="9" fill="currentColor" fontWeight="bold">G</text>
            </svg>
            <span className="text-yellow-400 font-bold text-sm tracking-wider">{inventory.gold} <span className="text-xs text-yellow-600">G</span></span>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6 min-h-0">
          {/* Left Panel: Edric Portrait & Chat */}
          <div className="w-full sm:w-1/3 flex flex-col items-center justify-center bg-black/35 rounded p-3 sm:p-4 border border-yellow-900/20">
            <div
              className="w-24 h-24 rounded overflow-hidden mb-3 border-2 border-yellow-700/60"
              style={{
                background: 'linear-gradient(135deg, #2a1a0a, #000)',
                boxShadow: '0 0 15px rgba(139, 105, 20, 0.25)',
              }}
            >
              <img
                src="/assets/images/npc-blacksmith.png"
                alt="Old Edric"
                className="w-full h-full object-cover object-top"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="text-center">
              <h3 className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Old Edric</h3>
              <p className="text-xxs text-gray-500 italic mt-0.5">The Village Smithy</p>
              {edricDiscount > 0 && (
                <p className="text-xxs text-green-500 mt-1 font-bold">
                  ✦ Trust Discount: -{edricDiscount}G
                </p>
              )}
            </div>
            <div className="mt-4 p-3 bg-black/50 border border-yellow-800/10 rounded text-center">
              <p className="text-xxs italic leading-relaxed text-yellow-100/70">
                {inventory.gold < 30
                  ? '"No coin, no steel, Alden. Go slay some of those wretches first."'
                  : '"My hammer is yours, boy. Keep your blade sharp and your wits sharper."'}
              </p>
            </div>
          </div>

          {/* Right Panel: Shop Items */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => { playClick(); setActiveTab('upgrade'); }}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded border transition-all ${
                  activeTab === 'upgrade'
                    ? 'bg-yellow-800/35 border-yellow-600 text-yellow-400 font-bold shadow-[0_0_8px_rgba(234,179,8,0.2)]'
                    : 'bg-transparent border-yellow-900/40 text-gray-400 hover:border-yellow-700/60'
                }`}
              >
                Upgrades
              </button>
              <button
                onClick={() => { playClick(); setActiveTab('item'); }}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded border transition-all ${
                  activeTab === 'item'
                    ? 'bg-yellow-800/35 border-yellow-600 text-yellow-400 font-bold shadow-[0_0_8px_rgba(234,179,8,0.2)]'
                    : 'bg-transparent border-yellow-900/40 text-gray-400 hover:border-yellow-700/60'
                }`}
              >
                Consumables
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-0">
              {activeTab === 'upgrade' ? (
                <>
                  {/* Weapon Upgrade */}
                  <div className="flex items-center justify-between p-3 rounded bg-black/25 border border-yellow-900/25 hover:border-yellow-600/35 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="bg-yellow-900/20 w-10 h-10 flex items-center justify-center rounded border border-yellow-800/20">
                        <img src={ITEM_IMAGES.iron_sword} alt="sword" className="w-7 h-7" style={{ imageRendering: 'pixelated' }} />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-yellow-400 tracking-wider">Pedang Ksatria (Lv. {weaponLvl})</h4>
                        <p className="text-xxs text-gray-400 mt-0.5">Meningkatkan damage tebasan Alden (+3 Attack)</p>
                      </div>
                    </div>
                    <button
                      onClick={handleWeaponUpgrade}
                      disabled={inventory.gold < weaponUpgradeCost}
                      className={`flex flex-col items-center justify-center px-4 py-1.5 rounded border text-xs tracking-widest uppercase transition-all min-w-[90px] ${
                        inventory.gold >= weaponUpgradeCost
                          ? 'bg-yellow-800/30 border-yellow-600 text-yellow-300 hover:bg-yellow-800/50 hover:scale-105 active:scale-95'
                          : 'bg-gray-900/20 border-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-bold">Tempa</span>
                      <span className="text-xxs text-yellow-500 mt-0.5 font-sans">{weaponUpgradeCost} G</span>
                    </button>
                  </div>

                  {/* Armor Upgrade */}
                  <div className="flex items-center justify-between p-3 rounded bg-black/25 border border-yellow-900/25 hover:border-yellow-600/35 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="bg-yellow-900/20 w-10 h-10 flex items-center justify-center rounded border border-yellow-800/20">
                        <img src={ITEM_IMAGES.knight_armor} alt="armor" className="w-7 h-7" style={{ imageRendering: 'pixelated' }} />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-yellow-400 tracking-wider">Zirah Pelat (Lv. {armorLvl})</h4>
                        <p className="text-xxs text-gray-400 mt-0.5">Meningkatkan ketahanan dari luka (+2 Defense)</p>
                      </div>
                    </div>
                    <button
                      onClick={handleArmorUpgrade}
                      disabled={inventory.gold < armorUpgradeCost}
                      className={`flex flex-col items-center justify-center px-4 py-1.5 rounded border text-xs tracking-widest uppercase transition-all min-w-[90px] ${
                        inventory.gold >= armorUpgradeCost
                          ? 'bg-yellow-800/30 border-yellow-600 text-yellow-300 hover:bg-yellow-800/50 hover:scale-105 active:scale-95'
                          : 'bg-gray-900/20 border-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-bold">Tempa</span>
                      <span className="text-xxs text-yellow-500 mt-0.5 font-sans">{armorUpgradeCost} G</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Potion Purchase */}
                  <div className="flex items-center justify-between p-3 rounded bg-black/25 border border-yellow-900/25 hover:border-yellow-600/35 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="bg-yellow-900/20 w-10 h-10 flex items-center justify-center rounded border border-yellow-800/20">
                        <img src={ITEM_IMAGES.health_potion} alt="potion" className="w-7 h-7" style={{ imageRendering: 'pixelated' }} />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-yellow-400 tracking-wider">Healing Draught (x{currentPotionCount})</h4>
                        <p className="text-xxs text-gray-400 mt-0.5">Ramuan merah untuk memulihkan HP Alden saat terluka.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleBuyPotion}
                      disabled={inventory.gold < potionCost}
                      className={`flex flex-col items-center justify-center px-4 py-1.5 rounded border text-xs tracking-widest uppercase transition-all min-w-[90px] ${
                        inventory.gold >= potionCost
                          ? 'bg-yellow-800/30 border-yellow-600 text-yellow-300 hover:bg-yellow-800/50 hover:scale-105 active:scale-95'
                          : 'bg-gray-900/20 border-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-bold">Beli</span>
                      <span className="text-xxs text-yellow-500 mt-0.5 font-sans">{potionCost} G</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer / Exit Button */}
            <div className="mt-4 border-t pt-3 flex justify-end" style={{ borderColor: 'rgba(139, 105, 20, 0.2)' }}>
              <button
                onClick={() => { playClick(); setShopOpen(false); }}
                className="px-6 py-2 bg-yellow-900/20 hover:bg-yellow-800/35 border border-yellow-600/50 hover:border-yellow-500 text-yellow-400 rounded text-xs tracking-widest uppercase transition-all active:scale-95 shadow-[0_0_12px_rgba(139,105,20,0.1)]"
              >
                Kembali Bertualang
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Corners */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos}`}
            style={{
              width: 16,
              height: 16,
              borderTop: i < 2 ? '3px solid #8b6914' : 'none',
              borderBottom: i >= 2 ? '3px solid #8b6914' : 'none',
              borderLeft: i % 2 === 0 ? '3px solid #8b6914' : 'none',
              borderRight: i % 2 === 1 ? '3px solid #8b6914' : 'none',
              borderRadius: i === 0 ? '6px 0 0 0' : i === 1 ? '0 6px 0 0' : i === 2 ? '0 0 0 6px' : '0 0 6px 0',
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
