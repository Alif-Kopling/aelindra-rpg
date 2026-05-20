import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

const PORTRAIT_COLORS: Record<string, { bg: string; border: string; emoji: string; img?: string }> = {
  alden:      { bg: '#1a2a3a', border: '#4169e1', emoji: '⚔️', img: '/assets/images/knight_player.png' },
  evelyne:    { bg: '#2a1a2a', border: '#da70d6', emoji: '👑', img: '/assets/images/evelyn-princess.png' },
  valther:    { bg: '#1a0505', border: '#8b0000', emoji: '🗡️' },
  king:       { bg: '#2a2010', border: '#b8860b', emoji: '♔' },
  blacksmith: { bg: '#2a1a0a', border: '#8b6914', emoji: '🔨', img: '/assets/images/npc-blacksmith.png' },
  nun:        { bg: '#0a0a1a', border: '#9370db', emoji: '✝️', img: '/assets/images/npc-thenun.png' },
  boy:        { bg: '#1a2a10', border: '#32cd32', emoji: '🌟', img: '/assets/images/npc-villages-boy.png' },
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
    blipAudio.volume = 0.25;
  }
  blipAudio.currentTime = 0;
  blipAudio.play().catch(() => {});
};

const DialogueSystem: React.FC = () => {
  const { dialogue, advanceDialogue, closeDialogue } = useGameStore();
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [transitionDir, setTransitionDir] = useState<'in' | 'out'>('in');
  const [prevSpeaker, setPrevSpeaker] = useState('');
  const fullTextRef = useRef('');
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const charIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLine = dialogue.lines[dialogue.currentIndex];

  const finishTyping = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setDisplayText(fullTextRef.current);
    setIsTyping(false);
    setShowContinue(true);
  }, []);

  useEffect(() => {
    if (!dialogue.isOpen || !currentLine) return;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    charIndexRef.current = 0;
    setDisplayText('');
    setIsTyping(true);
    setShowContinue(false);
    fullTextRef.current = currentLine.text;

    if (!currentLine.isNarration) playBlip();

    const speakerChanged = currentLine.speaker !== prevSpeaker;
    const typeChar = () => {
      charIndexRef.current++;
      setDisplayText(fullTextRef.current.slice(0, charIndexRef.current));
      if (!currentLine.isNarration) {
        const ch = fullTextRef.current[charIndexRef.current - 1];
        if (ch === ' ' || charIndexRef.current === 1) playBlip();
      }
      if (charIndexRef.current >= fullTextRef.current.length) {
        finishTyping();
      }
    };

    if (speakerChanged) {
      setTransitionDir('out');
      const outTimer = setTimeout(() => {
        setTransitionDir('in');
        setPrevSpeaker(currentLine.speaker);
      }, 50);
      const typeTimer = setTimeout(() => {
        const baseSpeed = currentLine.isNarration ? 22 : 30;
        typingTimerRef.current = setInterval(typeChar, baseSpeed);
      }, 100);
      return () => {
        clearTimeout(outTimer);
        clearTimeout(typeTimer);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      };
    }

    const baseSpeed = currentLine.isNarration ? 22 : 30;
    typingTimerRef.current = setInterval(typeChar, baseSpeed);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [dialogue.currentIndex, dialogue.isOpen, currentLine, prevSpeaker, finishTyping]);

  const handleAdvance = useCallback(() => {
    if (isTyping) {
      finishTyping();
      return;
    }
    advanceDialogue();
  }, [isTyping, finishTyping, advanceDialogue]);

  useEffect(() => {
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

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end pb-6 pointer-events-none"
      style={{ zIndex: 80 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          background: isNarration
            ? 'rgba(0,0,0,0.85)'
            : 'rgba(0,0,0,0.55)',
          transition: 'background 0.4s ease',
        }}
        onClick={handleAdvance}
      />

      {/* Narration cinematic bars */}
      {isNarration && (
        <>
          <div className="absolute top-0 left-0 right-0" style={{
            height: 80, zIndex: 81,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)',
          }} />
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: 80, zIndex: 81,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
          }} />
        </>
      )}

      {/* Narration content */}
      {isNarration ? (
        <div
          className="relative pointer-events-auto cursor-pointer flex items-center justify-center"
          style={{ zIndex: 82, minHeight: 200 }}
          onClick={handleAdvance}
        >
          <div style={{
            maxWidth: 640,
            padding: '0 32px',
            transition: 'opacity 0.3s ease',
          }}>
            <div className="mb-1" style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 11,
              color: '#b8860b',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              textAlign: 'center',
              opacity: 0.6,
            }}>
              {currentLine.speaker}
            </div>
            <div style={{
              fontFamily: 'Lora, serif',
              fontSize: 16,
              fontStyle: 'italic',
              lineHeight: 2,
              color: '#c8a882',
              textShadow: '0 0 30px rgba(200,168,130,0.2)',
              textAlign: 'center',
            }}>
              {displayText}
              {isTyping && (
                <span style={{ color: '#b8860b', marginLeft: 2, opacity: 0.8 }}>▌</span>
              )}
            </div>
            {showContinue && (
              <div className="flex justify-center mt-6" style={{
                animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 9,
                  color: '#b8860b',
                  letterSpacing: '2px',
                  opacity: 0.6,
                  animation: 'pulse 2s infinite',
                }}>
                  [ Click or press Enter ]
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Dialogue Box */
        <div
          ref={containerRef}
          className="relative pointer-events-auto cursor-pointer mx-auto"
          onClick={handleAdvance}
          style={{
            width: 'min(720px, 92vw)',
            zIndex: 82,
            animation: dialogue.currentIndex === 0 ? 'slideUp 0.35s ease-out' : 'none',
          }}
        >
          {/* Speaker accent bar */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, ${portraitData.border}, ${portraitData.border}40, transparent)`,
            borderRadius: '2px 2px 0 0',
            transition: 'background 0.4s ease',
          }} />

          <div style={{
            background: 'linear-gradient(180deg, rgba(10,8,12,0.97), rgba(15,12,18,0.95))',
            border: `1px solid ${portraitData.border}30`,
            borderTop: 'none',
            borderBottom: `1px solid ${portraitData.border}20`,
            padding: '20px 24px',
            position: 'relative',
          }}>
            {/* Progress dots */}
            <div className="flex gap-1 absolute top-3 right-4">
              {dialogue.lines.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: i <= dialogue.currentIndex ? portraitData.border : `${portraitData.border}20`,
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Content row */}
            <div className="flex items-start gap-4">
              {/* Portrait */}
              <div
                className="flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  width: 72,
                  height: 72,
                  background: `linear-gradient(135deg, ${portraitData.bg}, #000)`,
                  border: `2px solid ${portraitData.border}`,
                  borderRadius: 6,
                  boxShadow: `0 0 16px ${portraitData.border}30, inset 0 0 20px rgba(0,0,0,0.5)`,
                  fontSize: portraitData.img ? undefined : 34,
                  transform: transitionDir === 'in' ? 'scale(1)' : 'scale(0.9)',
                  opacity: transitionDir === 'in' ? 1 : 0,
                  transition: 'transform 0.25s ease, opacity 0.25s ease',
                }}
              >
                {portraitData.img ? (
                  <img
                    src={portraitData.img}
                    alt={currentLine.speaker}
                    className="w-full h-full object-cover object-top"
                    style={{
                      imageRendering: 'pixelated',
                      transform: transitionDir === 'in' ? 'scale(1)' : 'scale(0.8)',
                      transition: 'transform 0.3s ease',
                      opacity: transitionDir === 'in' ? 1 : 0,
                    }}
                  />
                ) : (
                  <span style={{
                    transform: transitionDir === 'in' ? 'scale(1)' : 'scale(0.8)',
                    transition: 'transform 0.3s ease',
                  }}>
                    {portraitData.emoji}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Speaker name */}
                <div className="mb-1" style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 12,
                  fontWeight: 700,
                  color: portraitData.border,
                  textShadow: `0 0 12px ${portraitData.border}50`,
                  letterSpacing: '3px',
                  opacity: transitionDir === 'in' ? 1 : 0,
                  transform: `translateX(${transitionDir === 'in' ? '0' : '-8px'})`,
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}>
                  {currentLine.speaker}
                </div>

                {/* Emotion tag */}
                {emotion !== 'neutral' && (
                  <div className="mb-1" style={{
                    fontFamily: 'Lora, serif',
                    fontSize: 10,
                    fontStyle: 'italic',
                    color: textColor,
                    opacity: 0.5,
                  }}>
                    — {emotion}
                  </div>
                )}

                {/* Text */}
                <div style={{
                  fontFamily: 'Lora, serif',
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: textColor,
                  minHeight: 56,
                  opacity: transitionDir === 'in' ? 1 : 0,
                  transform: `translateY(${transitionDir === 'in' ? '0' : '6px'})`,
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                }}>
                  {displayText}
                  {isTyping && (
                    <span style={{ color: '#b8860b', marginLeft: 1, animation: 'pulse 0.8s infinite' }}>▌</span>
                  )}
                </div>
              </div>
            </div>

            {/* Continue indicator */}
            {showContinue && (
              <div className="flex items-center justify-end gap-2 mt-2" style={{
                animation: 'fadeIn 0.3s ease',
              }}>
                <span style={{
                  fontSize: 9,
                  fontFamily: 'Cinzel, serif',
                  color: portraitData.border,
                  opacity: 0.6,
                  letterSpacing: '1px',
                }}>
                  {dialogue.currentIndex < dialogue.lines.length - 1 ? 'Continue' : 'Close'}
                </span>
                <div style={{
                  color: portraitData.border,
                  fontSize: 12,
                  opacity: 0.8,
                  animation: 'bounce 1.2s infinite',
                }}>▼</div>
              </div>
            )}
          </div>

          {/* Decorative corners */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos}`}
              style={{
                width: 14,
                height: 14,
                borderTop: i < 2 ? `2px solid ${portraitData.border}` : 'none',
                borderBottom: i >= 2 ? `2px solid ${portraitData.border}` : 'none',
                borderLeft: i % 2 === 0 ? `2px solid ${portraitData.border}` : 'none',
                borderRight: i % 2 === 1 ? `2px solid ${portraitData.border}` : 'none',
                borderRadius: i === 0 ? '4px 0 0 0' : i === 1 ? '0 4px 0 0' : i === 2 ? '0 0 0 4px' : '0 0 4px 0',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DialogueSystem;
