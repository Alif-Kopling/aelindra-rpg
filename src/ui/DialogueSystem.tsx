import * as React from 'react';
import { useGameStore } from '../store/gameStore';

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
  saint_of_rot: { bg: '#0f1a0a', border: '#4a7c3f', emoji: '☠', img: '/assets/images/saint_of_rot_boss.png' },
  fallen_guardian: { bg: '#0d1820', border: '#6eb5d4', emoji: '🛡', img: '/assets/images/fallen_guardian_boss.png' },
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

let blipAudio: HTMLAudioElement | null = null;
const playBlip = () => {
  if (!blipAudio) {
    blipAudio = new Audio('/assets/audio/dialog-sound.mp3');
    blipAudio.volume = 0.15;
  }
  blipAudio.currentTime = 0;
  blipAudio.play().catch(() => {});
};

const DialogueSystem: React.FC = () => {
  const { dialogue, advanceDialogue, closeDialogue, isAutoDialogue } = useGameStore();
  const [displayText, setDisplayText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [showContinue, setShowContinue] = React.useState(false);
  const [portraitVisible, setPortraitVisible] = React.useState(false);
  const typingTimerRef = React.useRef<number | null>(null);
  const charIndexRef = React.useRef(0);
  const autoAdvanceRef = React.useRef<number | null>(null);

  const currentLine = dialogue.lines[dialogue.currentIndex];

  const finishTyping = React.useCallback(() => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setDisplayText(currentLine?.text || '');
    setIsTyping(false);
    setShowContinue(true);
  }, [currentLine]);

  React.useEffect(() => {
    if (!dialogue.isOpen || !currentLine) {
      setDisplayText('');
      setIsTyping(false);
      setShowContinue(false);
      setPortraitVisible(false);
      return;
    }

    // Reset for new line
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    charIndexRef.current = 0;
    setDisplayText('');
    setIsTyping(true);
    setShowContinue(false);
    setPortraitVisible(true);

    const speed = currentLine.isNarration ? 20 : 30;
    
    typingTimerRef.current = window.setInterval(() => {
      charIndexRef.current++;
      const nextText = currentLine.text.slice(0, charIndexRef.current);
      setDisplayText(nextText);
      
      if (!currentLine.isNarration && charIndexRef.current % 2 === 0) {
        playBlip();
      }

      if (charIndexRef.current >= currentLine.text.length) {
        finishTyping();
      }
    }, speed);

    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, [dialogue.currentIndex, dialogue.isOpen, currentLine, finishTyping]);

  const handleAdvance = React.useCallback(() => {
    if (isTyping) {
      finishTyping();
      return;
    }
    advanceDialogue();
  }, [isTyping, finishTyping, advanceDialogue]);

  // Auto-dialogue: advance automatically when typing finishes
  React.useEffect(() => {
    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (isAutoDialogue && showContinue && dialogue.isOpen) {
      autoAdvanceRef.current = window.setTimeout(() => {
        handleAdvance();
      }, 2500);
    }
    return () => {
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, [isAutoDialogue, showContinue, dialogue.isOpen, handleAdvance]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!dialogue.isOpen) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleAdvance();
      }
      if (e.key === 'Escape') {
        closeDialogue();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dialogue.isOpen, handleAdvance, closeDialogue]);

  if (!dialogue.isOpen || !currentLine) return null;

  const isNarration = currentLine.isNarration;
  const emotion = currentLine.emotion || 'neutral';
  const textColor = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
  const portrait = currentLine.portrait || 'default';
  const portraitData = PORTRAIT_COLORS[portrait] || PORTRAIT_COLORS.default;
  const sceneImage = currentLine.sceneImage
    ? `/assets/images/animation/${currentLine.sceneImage}`
    : null;

  return (
    <div className="absolute inset-0 flex flex-col justify-end pb-8 pointer-events-none" style={{ zIndex: 100 }}>
      {/* Dark vignette cinematic overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* Background Image / Overlay */}
      {sceneImage && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{
          backgroundImage: `url('${sceneImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5) contrast(1.1)',
          opacity: portraitVisible ? 1 : 0,
        }} />
      )}
      <div className="absolute inset-0 pointer-events-auto" style={{
        background: sceneImage ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)',
        transition: 'background 0.5s ease',
      }} onClick={handleAdvance} />

      {/* Cinematic Bars for Narration */}
      {isNarration && (
        <>
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent opacity-80" />
        </>
      )}

      {/* Main Container */}
      <div className="relative mx-auto w-full max-w-3xl px-4 pointer-events-auto cursor-pointer" onClick={handleAdvance}>
        {isNarration ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-600/60 font-serif mb-4">
              {currentLine.speaker}
            </div>
            <div className="text-xl md:text-2xl italic font-serif leading-relaxed" style={{ color: '#c8a882', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
              {displayText}
              {isTyping && <span className="inline-block w-2 h-5 bg-amber-600 ml-1 animate-pulse" />}
            </div>
          </div>
        ) : (
          <div className="relative bg-zinc-950/95 border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Accent Bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${portraitData.border}, transparent)` }} />
            
            <div className="p-6 flex gap-6">
              {/* Portrait */}
              <div className="flex-shrink-0 relative">
                <div className="w-20 h-20 rounded border-2 border-white/20 bg-black overflow-hidden shadow-inner transform transition-transform duration-300"
                     style={{ borderColor: portraitData.border, transform: portraitVisible ? 'scale(1)' : 'scale(0.8)' }}>
                  {portraitData.img ? (
                    <img src={portraitData.img} alt={currentLine.speaker} className="w-full h-full object-cover object-top pixelated" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">{portraitData.emoji}</div>
                  )}
                </div>
              </div>

              {/* Text Area */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-bold tracking-widest uppercase font-serif" style={{ color: portraitData.border }}>
                    {currentLine.speaker}
                  </span>
                  {emotion !== 'neutral' && (
                    <span className="text-[10px] italic opacity-40 uppercase tracking-tighter" style={{ color: textColor }}>
                      {emotion}
                    </span>
                  )}
                </div>
                <div className="text-base leading-relaxed font-serif min-h-[4rem]" style={{ color: textColor }}>
                  {displayText}
                  {isTyping && <span className="inline-block w-1.5 h-4 bg-amber-600/80 ml-1" />}
                </div>
              </div>
            </div>

            {/* Continue Prompt */}
            {showContinue && (
              <div className="absolute bottom-2 right-4 flex items-center gap-2 animate-bounce">
                <span className="text-[9px] uppercase tracking-widest text-white/30">
                  {dialogue.currentIndex < dialogue.lines.length - 1 ? 'Next' : 'Close'}
                </span>
                <div className="w-1.5 h-1.5 rotate-45 border-r-2 border-b-2" style={{ borderColor: portraitData.border }} />
              </div>
            )}

            {/* Progress Dots */}
            <div className="absolute top-3 right-4 flex gap-1">
              {dialogue.lines.map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full transition-colors duration-300"
                     style={{ background: i <= dialogue.currentIndex ? portraitData.border : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueSystem;
