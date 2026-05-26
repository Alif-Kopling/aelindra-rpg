import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { DialogueTone } from '../utils/types';
import { TONE_COLORS, TONE_LABELS } from '../systems/dialogueEngine';

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
  if (blipAudio.ended || blipAudio.paused) {
    blipAudio.currentTime = 0;
    blipAudio.play().catch(() => {});
  }
};

const DialogueSystem: React.FC = () => {
  const {
    dialogue,
    advanceDialogue,
    pickDialogueChoice,
    closeDialogue,
    isAutoDialogue,
  } = useGameStore();

  const [displayText, setDisplayText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [showContinue, setShowContinue] = React.useState(false);
  const [portraitVisible, setPortraitVisible] = React.useState(false);
  const [selectedChoice, setSelectedChoice] = React.useState<number | null>(null);
  const [lineFade, setLineFade] = React.useState(true);
  const typingTimerRef = React.useRef<number | null>(null);
  const charIndexRef = React.useRef(0);
  const autoAdvanceRef = React.useRef<number | null>(null);

  const currentLine = dialogue.lines[dialogue.currentIndex];
  const hasChoices = Boolean(showContinue && !isTyping && currentLine?.choices?.length);

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
    setSelectedChoice(null);
    setLineFade(false);
    const t = window.setTimeout(() => setLineFade(true), 40);
    return () => window.clearTimeout(t);
  }, [dialogue.currentIndex]);

  React.useEffect(() => {
    if (!dialogue.isOpen || !currentLine) {
      setDisplayText('');
      setIsTyping(false);
      setShowContinue(false);
      setPortraitVisible(false);
      setSelectedChoice(null);
      return;
    }

    if (currentLine.choices?.length && dialogue.awaitingChoice) {
      setDisplayText(currentLine.text);
      setIsTyping(false);
      setShowContinue(true);
      setPortraitVisible(true);
      return;
    }

    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    charIndexRef.current = 0;
    setDisplayText('');
    setIsTyping(true);
    setShowContinue(false);
    setPortraitVisible(true);

    const speed = currentLine.isNarration ? 22 : (currentLine.pauseAfterMs ? 34 : 28);

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
  }, [dialogue.currentIndex, dialogue.isOpen, dialogue.awaitingChoice, currentLine, finishTyping]);

  const handleAdvance = React.useCallback(() => {
    if (hasChoices || (currentLine?.choices?.length && showContinue)) return;
    if (isTyping) {
      finishTyping();
      return;
    }
    advanceDialogue();
  }, [hasChoices, currentLine, showContinue, isTyping, finishTyping, advanceDialogue]);

  React.useEffect(() => {
    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (isAutoDialogue && showContinue && dialogue.isOpen && !hasChoices) {
      autoAdvanceRef.current = window.setTimeout(() => {
        handleAdvance();
      }, 2500);
    }
    return () => {
      if (autoAdvanceRef.current) window.clearTimeout(autoAdvanceRef.current);
    };
  }, [isAutoDialogue, showContinue, dialogue.isOpen, handleAdvance, hasChoices]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!dialogue.isOpen) return;
      if (hasChoices) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= (currentLine?.choices?.length ?? 0)) {
          e.preventDefault();
          pickDialogueChoice(num - 1);
        }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleAdvance();
      }
      if (e.key === 'Escape') {
        return;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dialogue.isOpen, handleAdvance, closeDialogue, hasChoices, currentLine, pickDialogueChoice]);

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
    <div
      className="absolute inset-0 flex flex-col justify-end pb-8 pointer-events-none"
      style={{ zIndex: 100, opacity: lineFade ? 1 : 0, transition: 'opacity 220ms ease' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)',
          zIndex: 1,
        }}
      />

      {sceneImage && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url('${sceneImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.45) contrast(1.1)',
            opacity: portraitVisible ? 1 : 0,
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          background: sceneImage ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.55)',
          transition: 'background 0.5s ease',
        }}
        onClick={hasChoices ? undefined : handleAdvance}
      />

      {isNarration && (
        <>
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent opacity-80" />
        </>
      )}

      <div
        className="relative mx-auto w-full max-w-3xl px-4 pointer-events-auto"
        onClick={hasChoices ? undefined : handleAdvance}
        style={{ cursor: hasChoices ? 'default' : 'pointer' }}
      >
        {isNarration ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-600/60 font-serif mb-4">
              {currentLine.speaker}
            </div>
            <div
              className="text-xl md:text-2xl italic font-serif leading-relaxed"
              style={{ color: '#c8a882', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}
            >
              {displayText}
              {isTyping && <span className="inline-block w-2 h-5 bg-amber-600 ml-1 animate-pulse" />}
            </div>
          </div>
        ) : (
          <div
            className="relative bg-zinc-950/95 border border-white/10 rounded-lg shadow-2xl overflow-hidden"
            style={{
              boxShadow: hasChoices
                ? `0 0 40px ${portraitData.border}33, 0 12px 48px rgba(0,0,0,0.85)`
                : '0 12px 48px rgba(0,0,0,0.85)',
            }}
          >
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${portraitData.border}, transparent)` }} />

            <div className="p-6 flex gap-6">
              <div className="flex-shrink-0 relative">
                <div
                  className="w-20 h-20 rounded border-2 border-white/20 bg-black overflow-hidden shadow-inner"
                  style={{
                    borderColor: portraitData.border,
                    transform: portraitVisible ? 'scale(1)' : 'scale(0.85)',
                    transition: 'transform 280ms ease, box-shadow 280ms ease',
                    boxShadow: `0 0 16px ${portraitData.border}44`,
                  }}
                >
                  {portraitData.img ? (
                    <img src={portraitData.img} alt={currentLine.speaker} className="w-full h-full object-cover object-top pixelated" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">{portraitData.emoji}</div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-bold tracking-widest uppercase font-serif" style={{ color: portraitData.border }}>
                    {currentLine.speaker}
                  </span>
                  {emotion !== 'neutral' && (
                    <span className="text-[10px] italic opacity-50 uppercase" style={{ color: textColor }}>
                      {emotion}
                    </span>
                  )}
                </div>
                <div className="text-base leading-relaxed font-serif min-h-[4rem]" style={{ color: textColor }}>
                  {displayText}
                  {isTyping && <span className="inline-block w-1.5 h-4 bg-amber-600/80 ml-1 animate-pulse" />}
                </div>
              </div>
            </div>

            {hasChoices && currentLine.choices && (
              <div className="px-4 pb-4 pt-0 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-amber-600/50 mb-2 font-serif">
                  Bagaimana tanggapan Alden?
                </div>
                <div className="flex flex-col gap-2">
                  {currentLine.choices.map((choice, i) => {
                    const tone = choice.tone as DialogueTone;
                    const toneColor = TONE_COLORS[tone];
                    const isSelected = selectedChoice === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setSelectedChoice(i)}
                        onMouseLeave={() => setSelectedChoice(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          pickDialogueChoice(i);
                        }}
                        className="text-left rounded-md transition-all duration-200"
                        style={{
                          padding: '10px 14px',
                          border: `1px solid ${isSelected ? toneColor : 'rgba(255,255,255,0.12)'}`,
                          background: isSelected
                            ? `linear-gradient(90deg, ${toneColor}22, rgba(10,10,18,0.95))`
                            : 'rgba(12,12,20,0.9)',
                          boxShadow: isSelected ? `0 0 14px ${toneColor}44` : 'none',
                          transform: isSelected ? 'translateX(4px)' : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif text-sm" style={{ color: isSelected ? '#f4e4c1' : '#c8c0b0' }}>
                            {choice.text}
                          </span>
                          <span
                            className="text-[9px] uppercase tracking-wider shrink-0"
                            style={{ color: toneColor }}
                          >
                            {TONE_LABELS[tone]}
                          </span>
                        </div>
                        <span className="text-[9px] opacity-35 font-mono">[{i + 1}]</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {showContinue && !hasChoices && (
              <div className="absolute bottom-2 right-4 flex items-center gap-2 animate-pulse">
                <span className="text-[9px] uppercase tracking-widest text-white/30">
                  {dialogue.currentIndex < dialogue.lines.length - 1 ? 'Lanjut' : 'Tutup'}
                </span>
                <div className="w-1.5 h-1.5 rotate-45 border-r-2 border-b-2" style={{ borderColor: portraitData.border }} />
              </div>
            )}

            <div className="absolute top-3 right-4 flex gap-1">
              {dialogue.lines.map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= dialogue.currentIndex ? portraitData.border : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueSystem;
