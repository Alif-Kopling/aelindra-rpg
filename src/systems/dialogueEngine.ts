import { DialogueChoice, DialogueLine, DialogueTone } from '../utils/types';

export const TONE_LABELS: Record<DialogueTone, string> = {
  calm: 'Tenang',
  sarcastic: 'Sinis',
  determined: 'Tegas',
  emotional: 'Emosional',
  silent: 'Diam / Ragu',
};

export const TONE_COLORS: Record<DialogueTone, string> = {
  calm: '#8fa8b8',
  sarcastic: '#c9a86c',
  determined: '#ffa500',
  emotional: '#ffb6c1',
  silent: '#9a9aaa',
};

export function toneToEmotion(tone: DialogueTone): DialogueLine['emotion'] {
  switch (tone) {
    case 'calm':
      return 'neutral';
    case 'sarcastic':
      return 'neutral';
    case 'determined':
      return 'determined';
    case 'emotional':
      return 'sad';
    case 'silent':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function clampTrust(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export interface ChoiceResolutionContext {
  npcTrust: Record<string, number>;
  npcMood: Record<string, string>;
  speakerPortrait?: string;
}

/** NPC reaction lines after a tone pick — canon-safe flavor only */
export function resolveChoiceReactions(
  choice: DialogueChoice,
  ctx: ChoiceResolutionContext,
): DialogueLine[] {
  if (choice.reactionLines?.length) return choice.reactionLines;

  const npcKey = choice.npcId || 'default';
  const trust = ctx.npcTrust[npcKey] ?? 50;
  const preset = choice.reactions?.[npcKey] ?? choice.reactions?.default;
  if (preset) {
    return [{ ...preset, emotion: preset.emotion ?? toneToEmotion(choice.tone) }];
  }

  const templates = DEFAULT_REACTIONS[npcKey]?.[choice.tone];
  if (!templates) return [];

  const pick = trust >= 65 ? templates.high : trust <= 35 ? templates.low : templates.mid;
  return [
    {
      speaker: pick.speaker,
      portrait: pick.portrait,
      text: pick.text,
      emotion: pick.emotion,
    },
  ];
}

type ReactionTemplate = {
  speaker: string;
  portrait?: string;
  text: string;
  emotion?: DialogueLine['emotion'];
};

const DEFAULT_REACTIONS: Record<
  string,
  Partial<Record<DialogueTone, { low: ReactionTemplate; mid: ReactionTemplate; high: ReactionTemplate }>>
> = {
  edric: {
    calm: {
      low: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Hmph. Masih aja ngukur kata-kata kayak ksatria di istana.', emotion: 'neutral' },
      mid: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Bagus. Hati yang tenang bikin ayunan pedang lebih mantap.', emotion: 'neutral' },
      high: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Nah, ini baru bocah yang dulu aku lindungi. Sini — perapiannya udah anget.', emotion: 'happy' },
    },
    sarcastic: {
      low: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Bercanda nggak bakal nyembuhin luka-luka ini, nak.', emotion: 'angry' },
      mid: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Heh. Masa sulit emang butuh selera humor yang gelap, kurasa.', emotion: 'neutral' },
      high: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Ketawalah selagi bisa. Bakal aku jagain landasan tempa ini buat kamu.', emotion: 'happy' },
    },
    determined: {
      low: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Ada api di matamu... jangan biarin itu ngebakar kamu sampe hampa.', emotion: 'sad' },
      mid: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Itu tekad yang aku inget. Pergi dan buka jalan itu.', emotion: 'determined' },
      high: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Ya! Ayunkan pedangmu seolah seluruh kerajaan masih berdiri di belakangmu!', emotion: 'determined' },
    },
    emotional: {
      low: { speaker: 'Old Edric', portrait: 'blacksmith', text: '...Jangan tenggelam dalam rasa bersalah. Desa ini butuh kamu tegak berdiri.', emotion: 'sad' },
      mid: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Aku tau, nak. Aku tau. Pedang bisa nunggu — tarik napas dulu.', emotion: 'sad' },
      high: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Kamu udah mikul terlalu banyak. Biar orang tua ini bantu bagi bebannya.', emotion: 'loving' },
    },
    silent: {
      low: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Kata-kata itu gratis, Alden. Pake dong.', emotion: 'angry' },
      mid: { speaker: 'Old Edric', portrait: 'blacksmith', text: '...Ya. Kadang kebenaran emang nggak butuh suara.', emotion: 'neutral' },
      high: { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Diemnya kamu lebih keras daripada titah kebanyakan raja.', emotion: 'neutral' },
    },
  },
  nun: {
    calm: {
      low: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Ketenangan itu cocok buat kamu — untuk saat ini.', emotion: 'neutral' },
      mid: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Hutan ini dengerin jiwa-jiwa yang tenang dengan lebih baik.', emotion: 'neutral' },
      high: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Diemnya kamu adalah perisai. Tetep kayak gitu.', emotion: 'determined' },
    },
    sarcastic: {
      low: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Ejekan itu zirah yang rapuh, ksatria.', emotion: 'sad' },
      mid: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Bahkan pepohonan pun nyengir denger itu — tapi aku nggak.', emotion: 'neutral' },
      high: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Ketawa di dalem gelap itu masih termasuk doa.', emotion: 'happy' },
    },
    determined: {
      low: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Tekad tanpa ampun bakal jadi kekejaman.', emotion: 'sad' },
      mid: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Bagus. Jalan di depan menghargai keyakinan.', emotion: 'determined' },
      high: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Jalanlah — aku bakal bisikin petunjuk pas kamu ragu.', emotion: 'determined' },
    },
    emotional: {
      low: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Kesedihan itu jujur. Jangan biarin Valther jadiin itu senjata.', emotion: 'sad' },
      mid: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Langit denger rasa sakit itu. Begitu juga aku.', emotion: 'sad' },
      high: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Air mata itu nyiramin keberanian. Kamu nggak lemah karena nangis.', emotion: 'loving' },
    },
    silent: {
      low: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Kesunyian antara kamu dan Tuhan itu nggak kosong.', emotion: 'neutral' },
      mid: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: '...Aku bakal coba ngertiin apa yang nggak bisa kamu ucapin.', emotion: 'neutral' },
      high: { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Beberapa sumpah diucapin tanpa bahasa. Aku paham.', emotion: 'loving' },
    },
  },
  evelyne: {
    calm: {
      low: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Tenang sekali... di saat dunia terbakar. Mungkin itu sebabnya aku iri padamu.', emotion: 'sad' },
      mid: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Ketenanganmu membuatku lebih stabil daripada mahkota manapun.', emotion: 'neutral' },
      high: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Tetaplah seperti itu. Aku butuh satu jiwa di kastil ini yang masih bernapas teratur.', emotion: 'loving' },
    },
    sarcastic: {
      low: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Bahkan sekarang kamu masih bercanda? Aku tidak tahu harus kagum atau kesal.', emotion: 'angry' },
      mid: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Senyum yang pahit — namun aku mendapati diriku ikut tersenyum.', emotion: 'sad' },
      high: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Andai kecerdasanmu bisa membunuh Valther, kamu pasti sudah mengakhiri ini.', emotion: 'happy' },
    },
    determined: {
      low: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Jangan salah mengartikan balas dendam sebagai tugas, Alden.', emotion: 'sad' },
      mid: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Ya. Itulah ksatria yang berdiri di samping ayahku.', emotion: 'determined' },
      high: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Pergilah kalau begitu. Aku akan menjaga aula ini sampai kamu kembali.', emotion: 'determined' },
    },
    emotional: {
      low: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Tolong... jangan di sini. Tidak saat aku mencoba untuk tetap tegar.', emotion: 'sad' },
      mid: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Aku pernah menuduhmu. Aku tidak akan menuduh hatimu.', emotion: 'sad' },
      high: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Jika kita selamat, aku berhutang lebih banyak daripada yang bisa dibayar kerajaan.', emotion: 'loving' },
    },
    silent: {
      low: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Diammu terasa lebih tajam daripada pedang manapun yang pernah kupesan.', emotion: 'sad' },
      mid: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '...Aku tetap bisa mendengarmu.', emotion: 'sad' },
      high: { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Beberapa janji tidak butuh suara. Aku masih mempercayaimu.', emotion: 'loving' },
    },
  },
  tam: {
    determined: {
      low: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Kakak kelihatan seram kalau bilang begitu... tapi aku percaya!', emotion: 'shocked' },
      mid: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Ya! Tunjukkan pada orang jahat itu apa yang dilakukan ksatria asli!', emotion: 'happy' },
      high: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Aku tahu Kakak bakal bilang gitu! Kakak yang paling keren!', emotion: 'happy' },
    },
    emotional: {
      low: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Jangan sedih, Kak Alden... emm... nih, ambil jimatku lagi!', emotion: 'sad' },
      mid: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Aku bakal bilang ke semua orang kalau Kakak masih pahlawan kami.', emotion: 'happy' },
      high: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Nanti pas Kakak balik, kita latihan bareng ya?', emotion: 'happy' },
    },
    calm: {
      mid: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Oke... aku bakal nunggu di deket sumur buat kabar baiknya.', emotion: 'neutral' },
      high: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Suara Kakak selalu mirip kayak cerita yang mama ceritain.', emotion: 'happy' },
      low: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Aku harap Kakak bener.', emotion: 'sad' },
    },
    sarcastic: {
      mid: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Hehe — Kakak suaranya mirip Edric pas gosongin masakan.', emotion: 'happy' },
      high: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Wah mantap banget! Ngomong gitu lagi dong!', emotion: 'happy' },
      low: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Aku nggak ngerti... tapi aku percaya sama Kakak.', emotion: 'neutral' },
    },
    silent: {
      mid: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: '...Aku juga bakal jadi pemberani. Janji.', emotion: 'determined' },
      high: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Kakak nggak perlu ngomong apa-apa. Aku tau Kakak bakal menang.', emotion: 'happy' },
      low: { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Kakak... nggak apa-apa?', emotion: 'sad' },
    },
  },
};

export function applyNpcFlavorLine(
  lines: DialogueLine[],
  npcId: string,
  trust: number,
  mood: string | undefined,
): DialogueLine[] {
  if (trust < 70 && mood !== 'warm') return lines;

  return lines.map((line) => {
    if (line.portrait !== npcId && line.portrait !== 'blacksmith' && line.portrait !== 'nun' && line.portrait !== 'boy' && line.portrait !== 'evelyne') {
      return line;
    }
    if (line.speaker.startsWith('Alden') || line.isNarration) return line;
    if (trust >= 80 && line.emotion === 'neutral') {
      return { ...line, emotion: 'happy' as const };
    }
    return line;
  });
}
