import * as React from 'react';
import { useGameStore } from '../store/gameStore';
import { playBGM, stopBGM, setBGMVolume } from '../utils/bgm';

const EPILOGUE_LINES = [
  { text: 'Epilog â€” setelah perang berhenti, dunia nggak langsung sembuh.', delay: 0 },
  { text: 'Hanya luka yang akhirnya punya waktu buat terasa.', delay: 2800 },
  { text: 'Harrowmere dibangun ulang dari batu bekas reruntuhan. Tidak megah, tapi jujur.', delay: 6500 },
  { text: 'Old Edric membuka bengkel lagi. Palu lamanya memukul besi dengan ritme yang hampir mirip doa.', delay: 10500 },
  { text: 'Tam menanam bunga di kaki patung Alden setiap musim semi.', delay: 15000 },
  { text: 'Dia tumbuh jadi orang yang percaya kalau keberanian bukan soal menang, tapi soal tetap kembali.', delay: 19000 },
  { text: 'Evelyne naik takhta bukan sebagai ratu yang sempurna, tapi sebagai ratu yang ingat nama setiap korban.', delay: 23500 },
  { text: 'Dan Wandering Nun... meninggalkan surat tanpa nama. Isinya cuma satu kalimat:', delay: 28000 },
  { text: '"Jangan biarkan kemenangan membuatmu lupa pada yang harus dibayar."', delay: 31500 },
  { text: 'Beberapa orang bilang Alden mati di medan perang.', delay: 36000 },
  { text: 'Tapi cerita yang lebih tua selalu bilang sesuatu yang berbeda:', delay: 39500 },
  { text: 'bahwa seorang ksatria yang kehilangan segalanya akhirnya menemukan tempat untuk pulang.', delay: 43500, emphasis: true },
  { text: 'Dan selama nama itu masih diucapkan, Aelindra tidak sepenuhnya runtuh.', delay: 50000 },
];

const EpilogueScreen: React.FC = () => {
  const { setScreen, settings, player } = useGameStore();
  const [visibleLines, setVisibleLines] = React.useState<Set<number>>(new Set());
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    EPILOGUE_LINES.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => new Set([...prev, index]));
      }, line.delay);
    });

    setTimeout(() => setFinished(true), 56000);
  }, []);

  React.useEffect(() => {
    setBGMVolume(settings.musicVolume, settings.masterVolume);
    playBGM('epilogue');
  }, [settings.musicVolume, settings.masterVolume]);

  return (
    <div
      className="absolute inset-0 overflow-hidden flex flex-col items-center"
      style={{
        background: 'radial-gradient(ellipse at center, #171019 0%, #08060b 55%, #020203 100%)',
        zIndex: 100,
      }}
    >
      <style>
        {`
          @keyframes epilogueGlow {
            0%, 100% { opacity: 0.18; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.04); }
          }
          @keyframes epilogueFade {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(200,168,98,0.08), transparent 45%)',
          animation: 'epilogueGlow 10s ease-in-out infinite',
        }}
      />

      <div className="fixed top-0 left-0 right-0" style={{ height: '11vh', background: 'linear-gradient(to bottom, #000 70%, transparent)' }} />
      <div className="fixed bottom-0 left-0 right-0" style={{ height: '11vh', background: 'linear-gradient(to top, #000 70%, transparent)' }} />

      <div
        className="relative z-10 text-center overflow-y-auto custom-scrollbar"
        style={{
          maxWidth: 760,
          padding: '18vh 36px 22vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: '#c8a862',
            fontSize: 18,
            opacity: 0.85,
          }}
        >
          Epilog
        </div>

        {EPILOGUE_LINES.map((line, index) => (
          <div
            key={index}
            style={{
              fontFamily: line.emphasis ? 'Cinzel, serif' : 'Lora, serif',
              fontSize: line.emphasis ? 'clamp(18px, 2.8vw, 25px)' : 'clamp(13px, 2vw, 17px)',
              fontStyle: line.emphasis ? 'normal' : 'italic',
              fontWeight: line.emphasis ? 700 : 400,
              letterSpacing: line.emphasis ? '3px' : '0.8px',
              color: line.emphasis ? '#f2dfb2' : '#b8aca0',
              textShadow: line.emphasis ? '0 0 24px rgba(200,168,98,0.35)' : '0 2px 4px rgba(0,0,0,0.6)',
              lineHeight: 1.85,
              opacity: visibleLines.has(index) ? 1 : 0,
              transform: visibleLines.has(index) ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 1.8s ease, transform 1.8s ease',
            }}
          >
            {line.text}
          </div>
        ))}

        <div
          style={{
            marginTop: 40,
            paddingTop: 40,
            borderTop: '1px solid rgba(200,168,98,0.12)',
            opacity: finished ? 1 : 0,
            transform: finished ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 2s ease, transform 2s ease',
          }}
        >
          <div style={{ fontFamily: 'Cinzel Decorative, serif', color: '#c8a862', letterSpacing: '5px', fontSize: 'clamp(20px, 4vw, 34px)' }}>
            {player.name}
          </div>
          <div style={{ marginTop: 10, fontFamily: 'Lora, serif', color: '#8f8378', fontStyle: 'italic' }}>
            The Forsaken Knight, remembered.
          </div>
        </div>
      </div>

      {finished && (
        <div
          className="fixed bottom-[12vh] left-1/2 z-[100]"
          style={{
            transform: 'translateX(-50%)',
            animation: 'epilogueFade 2s ease forwards',
          }}
        >
          <button
            onClick={() => {
              stopBGM();
              setScreen('title');
            }}
            className="btn-fantasy py-4 px-14 rounded-sm transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 15,
              letterSpacing: '4px',
              color: '#c8a862',
              background: 'rgba(10, 5, 0, 0.82)',
              border: '1px solid rgba(200,168,98,0.35)',
              boxShadow: '0 0 32px rgba(0,0,0,0.55), inset 0 0 16px rgba(200,168,98,0.08)',
            }}
          >
            ✦ RETURN TO TITLE ✦
          </button>
        </div>
      )}
    </div>
  );
};

export default EpilogueScreen;
