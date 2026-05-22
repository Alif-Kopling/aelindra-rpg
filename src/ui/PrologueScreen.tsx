import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { playBGM, stopBGM, setBGMVolume } from '../utils/bgm';

interface CinematicLine {
  speaker: string;
  portrait?: string;
  text: string;
  emotion?: string;
  isNarration?: boolean;
  image: string;
}

const PORTRAIT_COLORS: Record<string, { bg: string; border: string; emoji: string; img?: string }> = {
  alden:      { bg: '#1a2a3a', border: '#4169e1', emoji: '⚔️', img: '/assets/images/knight_player.png' },
  evelyne:    { bg: '#2a1a2a', border: '#da70d6', emoji: '👑', img: '/assets/images/evelyn-princess.png' },
  valther:    { bg: '#1a0505', border: '#8b0000', emoji: '🗡️', img: '/assets/images/valther.svg' },
  king:       { bg: '#2a2010', border: '#b8860b', emoji: '♔', img: '/assets/images/king.svg' },
  blacksmith: { bg: '#2a1a0a', border: '#8b6914', emoji: '🔨', img: '/assets/images/npc-blacksmith.png' },
  nun:        { bg: '#0a0a1a', border: '#9370db', emoji: '✝️', img: '/assets/images/npc-thenun.png' },
  boy:        { bg: '#1a2a10', border: '#32cd32', emoji: '🌟', img: '/assets/images/npc-villages-boy.png' },
  blind_king: { bg: '#1a1028', border: '#9b59b6', emoji: '♔', img: '/assets/images/blind_king_boss.png' },
  ashen_knight:{ bg: '#141820', border: '#7f8c8d', emoji: '💀', img: '/assets/images/boss_ashen_knight.png' },
  default:    { bg: '#0a0a14', border: '#b8860b', emoji: '👤' },
};

const EMOTION_COLORS: Record<string, string> = {
  neutral:    '#f4e4c1',
  angry:      '#ff6b6b',
  sad:        '#8fa8b8',
  happy:      '#ffd700',
  shocked:    '#ffffff',
  determined: '#ffa500',
  loving:     '#ffb6c1',
};

const PROLOGUE_CINEMATIC: CinematicLine[] = [
  // 1. CASTLE_DIALOGUE_INTRO — Di Kastel (sebelum tragedi)
  {
    image: 'scene1-before-tragedy.jpeg',
    speaker: 'Alden',
    portrait: 'alden',
    text: 'Baginda... patroli timur lapor liat cahaya aneh di dekat segel kuno. Gue minta izin nyelidikin.',
    emotion: 'determined',
  },
  {
    image: 'scene1-before-tragedy.jpeg',
    speaker: 'King Aldric',
    portrait: 'king',
    text: 'Alden... pedang paling gue percaya. Gue rasa sesuatu bergerak di kegelapan lama. Tapi malam ini — deket-deket gue. Gue nggak enak.',
    emotion: 'sad',
  },
  {
    image: 'Scene2-evelyn-and-mc.png',
    speaker: 'Princess Evelyne',
    portrait: 'evelyne',
    text: 'Alden, please... dengerin ayah. Jangan kejar bayangan di gelap malam ini.',
    emotion: 'sad',
  },
  {
    image: 'Scene2-evelyn-and-mc.png',
    speaker: 'Alden',
    portrait: 'alden',
    text: 'Gue jagain raja dengan nyawa gue, Putri. Dan gue lindungin lo juga.',
    emotion: 'determined',
  },
  {
    image: 'Scene2-evelyn-and-mc.png',
    speaker: 'King Aldric',
    portrait: 'king',
    text: '...Lo selalu gitu, nak. Makanya gue percaya lo di atas yang lain.',
    emotion: 'sad',
  },
  // 2. BETRAYAL_SCENE — Malam Pembunuhan
  {
    image: 'scene3-The-Tragedy.jpeg',
    speaker: '— Narrator —',
    text: 'Tiga jam kemudian. Teriakan robek tembok kastil.',
    isNarration: true,
    emotion: 'shocked',
  },
  {
    image: 'scene3-The-Tragedy.jpeg',
    speaker: 'Valther',
    portrait: 'valther',
    text: 'TANGKAP DIA! Ksatria Alden udah bunuh raja kita! Gue liat sendiri!',
    emotion: 'angry',
  },
  {
    image: 'scene3-The-Tragedy.jpeg',
    speaker: 'Alden',
    portrait: 'alden',
    text: 'Apa— Nggak! Gue nemuin dia kayak gini! Valther, lo TAU gue nggak bakal—',
    emotion: 'shocked',
  },
  {
    image: 'scene3-The-Tragedy.jpeg',
    speaker: 'Valther',
    portrait: 'valther',
    text: 'Pedangnya di tangan lo, pengkhianat. Nggak ada yang perlu dibahas lagi.',
    emotion: 'neutral',
  },
  {
    image: 'scene4-evelyn-marah-kepada-mc.png',
    speaker: 'Princess Evelyne',
    portrait: 'evelyne',
    text: '...Lo... Lo bunuh dia. Lo bunuh ayah gue.',
    emotion: 'sad',
  },
  {
    image: 'scene4-evelyn-marah-kepada-mc.png',
    speaker: 'Alden',
    portrait: 'alden',
    text: 'Putri, tolong— gue sumpah demi apapun yang gue punya—',
    emotion: 'sad',
  },
  {
    image: 'scene4-evelyn-marah-kepada-mc.png',
    speaker: 'Princess Evelyne',
    portrait: 'evelyne',
    text: 'Bawa dia pergi. Gue nggak sanggup liat dia.',
    emotion: 'angry',
  },
  // 3. ESCAPE_NARRATION — Edric Membebaskan Alden
  {
    image: 'scene5-mc-dipenjara-atas-fitnah.jpeg',
    speaker: '— Narrator —',
    text: 'Mereka seret dia ke penjara dingin yang lembap, nunggu eksekusi saat fajar.',
    isNarration: true,
    emotion: 'sad',
  },
  {
    image: 'scene5-mc-dipenjara-atas-fitnah.jpeg',
    speaker: 'Alden',
    portrait: 'alden',
    text: 'Dikhianati... sama kerajaan yang gue sumpah buat lindungin. Segini akhirnya?',
    emotion: 'sad',
  },
  {
    image: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg',
    speaker: '— Narrator —',
    text: 'Tapi di jam paling gelap, langkah kaki berat mendekat. Edric, pandai besi kerajaan — satu-satunya orang yang masih percaya.',
    isNarration: true,
    emotion: 'neutral',
  },
  {
    image: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg',
    speaker: 'Old Edric',
    portrait: 'blacksmith',
    text: 'Lo nggak ngelakuin itu. Tau ini tulang-tulang tua gue. Sekarang LARI, nak. Lari dan cari kebenaran.',
    emotion: 'determined',
  },
  {
    image: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg',
    speaker: 'Alden',
    portrait: 'alden',
    text: '...Edric...',
    emotion: 'sad',
  },
  {
    image: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg',
    speaker: 'Old Edric',
    portrait: 'blacksmith',
    text: 'Jangan berani nangis. Belum. Bertahan dulu. Nanti baru bersedih.',
    emotion: 'determined',
  },
  // 4. CHAPTER_1 — Narration Pembuka
  {
    image: 'last-scene-mc-kabur-dari-penjara.jpeg',
    speaker: '— Narrator —',
    text: 'Chapter I — The Forsaken Knight',
    isNarration: true,
    emotion: 'neutral',
  },
  {
    image: 'last-scene-mc-kabur-dari-penjara.jpeg',
    speaker: '— Narrator —',
    text: 'Diburu sama orang yang dulu dia panggil saudara, Alden kabur ke malam yang hujan. Satu-satunya jalan dia cuma nerobos kegelapan.',
    isNarration: true,
    emotion: 'determined',
  },
];

const PrologueScreen: React.FC = () => {
  const { setScreen, settings } = useGameStore();
  const [lineIndex, setLineIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [showContinue, setShowContinue] = React.useState(false);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [bgOpacity, setBgOpacity] = React.useState(0);

  const fullTextRef = React.useRef('');
  const typingTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = React.useRef(0);

  const currentLine = PROLOGUE_CINEMATIC[lineIndex];

  React.useEffect(() => {
    // Fade in scene wrapper
    setTimeout(() => setBgOpacity(1), 100);
  }, []);

  React.useEffect(() => {
    setBGMVolume(settings.musicVolume, settings.masterVolume);
    playBGM('prologue');
    return () => stopBGM();
  }, [settings.musicVolume, settings.masterVolume]);

  const finishTyping = React.useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayText(fullTextRef.current);
    setIsTyping(false);
    setShowContinue(true);
  }, []);

  const handleAdvance = React.useCallback(() => {
    if (isTyping) {
      finishTyping();
      return;
    }

    if (lineIndex < PROLOGUE_CINEMATIC.length - 1) {
      setLineIndex(prev => prev + 1);
    } else {
      // Transition to Name Input Screen
      setFadeOut(true);
      setTimeout(() => setScreen('nameInput'), 1200);
    }
  }, [isTyping, finishTyping, lineIndex, setScreen]);

  React.useEffect(() => {
    if (!currentLine) return;

    // Reset typewriter
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    charIndexRef.current = 0;
    setDisplayText('');
    setIsTyping(true);
    setShowContinue(false);
    fullTextRef.current = currentLine.text;

    const speed = currentLine.isNarration ? 25 : 35;

    typingTimerRef.current = setInterval(() => {
      charIndexRef.current++;
      setDisplayText(fullTextRef.current.slice(0, charIndexRef.current));

      if (charIndexRef.current >= fullTextRef.current.length) {
        finishTyping();
      }
    }, speed);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [lineIndex, currentLine, finishTyping]);

  // Handle keyboard inputs (Enter, Space, Z)
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleAdvance]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => setScreen('nameInput'), 1000);
  };

  const isNarration = currentLine?.isNarration;
  const emotion = currentLine?.emotion || 'neutral';
  const textColor = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
  const portrait = currentLine?.portrait || 'default';
  const portraitData = PORTRAIT_COLORS[portrait] || PORTRAIT_COLORS.default;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{
        background: '#000003',
        opacity: fadeOut ? 0 : bgOpacity,
        transition: 'opacity 1.2s ease',
      }}
    >
      {/* Background Image Container with dynamic pan zoom effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {currentLine && (
          <div
            key={currentLine.image}
            className="w-full h-full bg-cover bg-center transition-all duration-[6000ms] ease-out animate-fadeIn"
            style={{
              backgroundImage: `url('/assets/images/animation/${currentLine.image}')`,
              transform: isTyping ? 'scale(1.06)' : 'scale(1.0)',
              filter: 'brightness(0.75) contrast(1.05)',
            }}
          />
        )}
      </div>

      {/* Rain Particle Effect overlay */}
      <RainEffect />

      {/* Cinematic bars (Top & Bottom) */}
      <div className="absolute top-0 left-0 right-0 z-10" style={{ height: 80, background: 'rgba(0,0,0,0.92)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: 80, background: 'rgba(0,0,0,0.92)' }} />

      {/* Skip button top right */}
      <button
        onClick={handleSkip}
        className="absolute z-30"
        style={{
          top: 24,
          right: 32,
          fontFamily: 'Cinzel, serif',
          fontSize: 10,
          color: '#ffd700',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(184,134,11,0.5)',
          padding: '8px 16px',
          borderRadius: 4,
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(184,134,11,0.2)',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#ffd700';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(255,215,0,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(184,134,11,0.5)';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(184,134,11,0.2)';
        }}
      >
        SKIP PROLOGUE ▶▶
      </button>

      {/* Spacer for layout */}
      <div className="h-20" />

      {/* Dialogue area at the bottom */}
      <div
        className="relative z-20 w-full flex justify-center pb-24"
        style={{ animation: 'slideUp 0.6s ease-out' }}
      >
        {currentLine && (
          <div
            className="dialogue-box cursor-pointer"
            onClick={handleAdvance}
            style={{
              width: 'min(720px, 92vw)',
              padding: '22px 26px',
              borderRadius: 4,
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.85), inset 0 0 40px rgba(184,134,11,0.06)',
            }}
          >
            {/* Progress Bar inside box */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/40 overflow-hidden rounded-t-[4px]">
              <div 
                className="h-full bg-[#b8860b] transition-all duration-300"
                style={{ width: `${((lineIndex + 1) / PROLOGUE_CINEMATIC.length) * 100}%` }}
              />
            </div>

            {/* Content row */}
            {!isNarration ? (
              <div className="flex items-start gap-5">
                {/* Speaker Portrait */}
                <div
                  className="flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    width: 72,
                    height: 72,
                    background: portraitData.bg,
                    border: `2px solid ${portraitData.border}`,
                    borderRadius: 4,
                    boxShadow: `0 0 14px ${portraitData.border}30`,
                    fontSize: portraitData.img ? undefined : 32,
                  }}
                >
                  {portraitData.img ? (
                    <img
                      src={portraitData.img}
                      alt={currentLine.speaker}
                      className="w-full h-full object-cover object-top"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    portraitData.emoji
                  )}
                </div>

                {/* Name + Text info */}
                <div className="flex-1">
                  {/* Speaker name */}
                  <div className="mb-2" style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: portraitData.border,
                    textShadow: `0 0 8px ${portraitData.border}50`,
                    letterSpacing: '2px',
                  }}>
                    {currentLine.speaker}
                  </div>

                  {/* Dialogue text */}
                  <div style={{
                    fontFamily: 'Lora, serif',
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: textColor,
                    minHeight: 52,
                  }}>
                    {displayText}
                    {isTyping && (
                      <span className="animate-pulse" style={{ color: '#b8860b', marginLeft: 1 }}>▌</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Narration styling */
              <div className="text-center py-2">
                <div style={{
                  fontFamily: 'Lora, serif',
                  fontSize: 15,
                  fontStyle: 'italic',
                  lineHeight: 1.8,
                  color: '#c8a882',
                  textShadow: '0 0 20px rgba(200,168,130,0.2)',
                  minHeight: 52,
                }}>
                  {displayText}
                  {isTyping && (
                    <span className="animate-pulse" style={{ color: '#b8860b' }}>▌</span>
                  )}
                </div>
              </div>
            )}

            {/* Advance Indicator */}
            {showContinue && (
              <div className="flex items-center justify-end gap-2 mt-2">
                <span style={{
                  fontSize: '9px',
                  fontFamily: 'Cinzel, serif',
                  color: '#b8860b',
                  opacity: 0.8,
                }}>
                  {lineIndex < PROLOGUE_CINEMATIC.length - 1 ? 'Next' : 'Begin Legend'}
                </span>
                <div className="animate-bounce" style={{ color: '#b8860b', fontSize: 13 }}>▼</div>
              </div>
            )}

            {/* Decorative corners */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos}`}
                style={{
                  width: 12,
                  height: 12,
                  borderTop: i < 2 ? '2px solid #b8860b' : 'none',
                  borderBottom: i >= 2 ? '2px solid #b8860b' : 'none',
                  borderLeft: i % 2 === 0 ? '2px solid #b8860b' : 'none',
                  borderRight: i % 2 === 1 ? '2px solid #b8860b' : 'none',
                  borderRadius: i === 0 ? '4px 0 0 0' : i === 1 ? '0 4px 0 0' : i === 2 ? '0 0 0 4px' : '0 0 4px 0',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const RainEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: -20,
            width: 1,
            height: 12 + Math.random() * 16,
            background: 'rgba(140,160,200,0.18)',
            animation: `particleFall ${1.2 + Math.random() * 0.8}s linear ${Math.random() * 3}s infinite`,
            transform: 'skewX(-15deg)',
          }}
        />
      ))}
    </div>
  );
};

export default PrologueScreen;
