import { DialogueLine } from '../utils/types';

/** Injects tone-choice beats into canon scenes — outcomes merge back to main script */
export function enrichDialogueWithChoices(lines: DialogueLine[], sceneId: string): DialogueLine[] {
  const out = lines.map((l) => ({ ...l }));

  switch (sceneId) {
    case 'village_entry':
      injectAtSpeaker(out, 'Alden', 0, getRandomChoices(villageEdricResponseChoices(), 'edric'));
      break;
    case 'village_round2':
      injectAtSpeaker(out, 'Alden', 1, getRandomChoices(villageTamPromiseChoices(), 'tam'));
      break;
    case 'forest_entry':
      injectAtSpeaker(out, 'Alden', 2, getRandomChoices(forestNunTrustChoices(), 'nun'));
      break;
    case 'castle_entry':
      injectAtSpeaker(out, 'Alden', 3, getRandomChoices(castleEvelyneAccusationChoices(), 'evelyne'));
      break;
    case 'battlefield_entry':
      injectAtSpeaker(out, 'Alden', 0, getRandomChoices(battlefieldValtherChoices(), 'valther'));
      break;
    case 'catacombs_entry':
      injectAtSpeaker(out, 'Alden', 1, getRandomChoices(catacombsValtherTauntChoices(), 'valther'));
      break;
    case 'cathedral_entry':
      injectAtSpeaker(out, 'Alden', 1, getRandomChoices(cathedralNunFaithChoices(), 'nun'));
      break;
    case 'mountain_entry':
      injectAtSpeaker(out, 'Alden', 1, getRandomChoices(mountainResolveChoices(), 'nun'));
      break;
    default:
      break;
  }

  return out;
}

function getRandomChoices(allChoices: DialogueLine['choices'], npcId: string): DialogueLine['choices'] {
  if (!allChoices || allChoices.length <= 2) return allChoices;
  
  // Shuffle array
  const shuffled = [...allChoices].sort(() => Math.random() - 0.5);
  
  // Determine count: 
  // Tam is simple (always 2), Bosses/Evelyne are complex (always 3), others are random 2 or 3.
  let count = 2;
  if (npcId === 'tam') {
    count = 2;
  } else if (npcId === 'evelyne' || npcId === 'valther' || npcId === 'blind_king') {
    count = 3;
  } else {
    count = Math.random() < 0.5 ? 2 : 3;
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function injectAtSpeaker(
  lines: DialogueLine[],
  speakerPrefix: string,
  occurrence: number,
  choices: DialogueLine['choices'],
) {
  let count = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].speaker.startsWith(speakerPrefix)) {
      count++;
      if (count === occurrence) {
        lines[i] = { ...lines[i], choices };
        return;
      }
    }
  }
}

function villageEdricResponseChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Terima kasih, kawan lama.',
      tone: 'calm',
      npcId: 'edric',
      trustDelta: 3,
      aldenLine: 'Kamu pertaruhkan nyawamu demi aku, Edric. Utang ini akan kubayar dengan darah kalau perlu.',
      cinematic: 'zoom',
    },
    {
      text: 'Masih galak kayak biasa ya, pak tua.',
      tone: 'sarcastic',
      npcId: 'edric',
      trustDelta: 1,
      aldenLine: 'Kalau mayat hidup itu setengah sekeras kepala kamu, desa ini beneran tamat.',
      cinematic: 'none',
    },
    {
      text: 'Biar aku yang bersihin setiap kuburan itu.',
      tone: 'determined',
      npcId: 'edric',
      trustDelta: 2,
      aldenLine: 'Minggir. Bakal kubuka jalan nembus apapun yang Valther kirim.',
      cinematic: 'zoom',
    },
    {
      text: '...Aku pikir aku bakal mati di rantai itu.',
      tone: 'emotional',
      npcId: 'edric',
      trustDelta: 4,
      aldenLine: 'Pas pedang itu jatuh, aku berdoa kamu yang ada di depan palu — bukan algojo itu.',
      cinematic: 'dramatic',
      pauseMs: 600,
    },
    {
      text: '...',
      tone: 'silent',
      npcId: 'edric',
      trustDelta: 0,
      aldenLine: '...',
      cinematic: 'none',
      pauseMs: 800,
    },
  ];
}

function villageTamPromiseChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Aku bersumpah demi pedangku.',
      tone: 'determined',
      npcId: 'tam',
      trustDelta: 2,
      flavorFlag: 'tam_oath_determined',
      aldenLine: 'Demi baja ini aku bersumpah — Harrowmere bakal liat fajar lagi.',
      cinematic: 'zoom',
    },
    {
      text: 'Kakak bakal usaha, nak.',
      tone: 'calm',
      npcId: 'tam',
      trustDelta: 2,
      aldenLine: 'Kakak nggak bisa janjiin dunia, Tam. Cuma janji kakak nggak bakal berhenti berjuang.',
      cinematic: 'none',
    },
    {
      text: 'Pahlawan itu cuma orang bodoh yang selamat.',
      tone: 'sarcastic',
      npcId: 'tam',
      trustDelta: 0,
      aldenLine: 'Pahlawan itu orang bodoh dengan keberuntungan. Keberuntunganku udah abis sekali — sekarang mau aku ambil balik.',
      cinematic: 'none',
    },
    {
      text: 'Jimat kamu bakal jaga kakak tetep hidup.',
      tone: 'emotional',
      npcId: 'tam',
      trustDelta: 3,
      flavorFlag: 'tam_charm_bond',
      aldenLine: 'Jimat ini... lebih hangat dari baju besi manapun. Makasih ya.',
      cinematic: 'dramatic',
      pauseMs: 500,
    },
    {
      text: '*mengangguk pelan*',
      tone: 'silent',
      npcId: 'tam',
      trustDelta: 1,
      aldenLine: '*Alden berlutut sejajar dengan mata Tam, lalu mengangguk sekali.*',
      cinematic: 'none',
      pauseMs: 700,
    },
  ];
}

function forestNunTrustChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Kasih tau aku semuanya.',
      tone: 'calm',
      npcId: 'nun',
      trustDelta: 2,
      aldenLine: 'Bicara jujur, Suster. Segel mana yang pecah duluan — dan di mana?',
      cinematic: 'zoom',
    },
    {
      text: 'Selalu penuh teka-teki.',
      tone: 'sarcastic',
      npcId: 'nun',
      trustDelta: 0,
      aldenLine: 'Kalo teka-teki bisa bunuh Valther, kamu udah jadi jenderal pasukanku.',
      cinematic: 'none',
    },
    {
      text: 'Biar aku sendiri yang hancurin setiap segel.',
      tone: 'determined',
      npcId: 'nun',
      trustDelta: 2,
      aldenLine: 'Tunjukin aku di mana busuknya. Bakal aku beresin segel demi segel.',
      cinematic: 'zoom',
    },
    {
      text: 'Raja pantes dapetin yang lebih baik dari kita.',
      tone: 'emotional',
      npcId: 'nun',
      trustDelta: 3,
      flavorFlag: 'nun_king_grief',
      aldenLine: 'Beliau percaya sama aku. Aku udah gagal sebelum pedang itu nyentuh beliau.',
      cinematic: 'dramatic',
      pauseMs: 550,
    },
    {
      text: '...',
      tone: 'silent',
      npcId: 'nun',
      trustDelta: 1,
      aldenLine: '...',
      cinematic: 'none',
      pauseMs: 750,
    },
  ];
}

function castleEvelyneAccusationChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Anda berhak melakukan itu.',
      tone: 'calm',
      npcId: 'evelyne',
      trustDelta: 3,
      aldenLine: 'Kalo aku jadi Anda, aku bakal lakuin hal yang sama. Tuduh aku lagi kalo itu bisa kurangin rasa sedih Anda.',
      cinematic: 'dramatic',
    },
    {
      text: 'Air mata Anda terlambat, Putri.',
      tone: 'sarcastic',
      npcId: 'evelyne',
      trustDelta: -2,
      aldenLine: 'Nangis sekarang? Di mana Anda pas rantai itu nyayat pergelangan tanganku?',
      cinematic: 'zoom',
    },
    {
      text: 'Tugasku nggak pernah berakhir.',
      tone: 'determined',
      npcId: 'evelyne',
      trustDelta: 2,
      aldenLine: 'Gantung aku, bakar aku, lupain aku — aku tetep perisai Anda.',
      cinematic: 'zoom',
    },
    {
      text: 'Aku juga menyayangi beliau.',
      tone: 'emotional',
      npcId: 'evelyne',
      trustDelta: 4,
      flavorFlag: 'evelyne_shared_grief',
      aldenLine: 'Aku menyayangi ayah Anda. Kebenaran itu nggak ikut mati bareng beliau.',
      cinematic: 'dramatic',
      pauseMs: 650,
    },
    {
      text: '*tidak bisa bicara*',
      tone: 'silent',
      npcId: 'evelyne',
      trustDelta: 1,
      aldenLine: '*Alden menunduk, tidak mampu menjawab.*',
      cinematic: 'dramatic',
      pauseMs: 900,
    },
  ];
}

function battlefieldValtherChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Ini berakhir hari ini, Valther.',
      tone: 'determined',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: 'Nggak ada lagi segel. Nggak ada lagi bisikan. Cuma baja.',
      cinematic: 'zoom',
    },
    {
      text: 'Dulu kamu saudaraku di medan perang.',
      tone: 'emotional',
      npcId: 'valther',
      trustDelta: 0,
      flavorFlag: 'valther_remembrance',
      aldenLine: 'Aku inget ksatria kayak gimana kamu dulu — sebelum kegelapan jawab panggilanmu.',
      cinematic: 'dramatic',
      pauseMs: 600,
    },
    {
      text: 'Nikmatin takhta mayatmu itu.',
      tone: 'sarcastic',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: 'Kursinya nyaman? Dibangun dari petani sampe raja.',
      cinematic: 'none',
    },
    {
      text: 'Aku nggak bakal jadi wadahmu.',
      tone: 'calm',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: 'Kamu bilang aku persembahan terakhir. Makasih, tapi aku tolak.',
      cinematic: 'zoom',
    },
    {
      text: '...',
      tone: 'silent',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: '*Alden mengangkat pedangnya tanpa sepatah kata pun.*',
      cinematic: 'dramatic',
      pauseMs: 700,
    },
  ];
}

function catacombsValtherTauntChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Aku nggak peduli seberapa dalem ini.',
      tone: 'determined',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: 'Segel, jebakan, seluruh kerajaan — aku bakal gali sampe nemu kamu.',
      cinematic: 'zoom',
    },
    {
      text: 'Kenapa kamu ngikutin kegelapan?',
      tone: 'calm',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: 'Waktu kita sama-sama di medan perang, kamu ksatria paling berani. Apa yang ngubah kamu?',
      cinematic: 'dramatic',
    },
    {
      text: 'Kamu cuma setan pengecut di balik topeng.',
      tone: 'sarcastic',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: 'Bersembunyi di katakombe, ngirim mayat buat perangin perangmu. Sultan pengecut.',
      cinematic: 'none',
    },
    {
      text: 'Aku tau rasa sakit yang kamu bawa.',
      tone: 'emotional',
      npcId: 'valther',
      trustDelta: 0,
      flavorFlag: 'catacombs_valther_pity',
      aldenLine: 'Aku tau rasanya dikhianati. Tapi kamu jadi pengkhianat, bukan korbannya.',
      cinematic: 'dramatic',
      pauseMs: 600,
    },
    {
      text: '...',
      tone: 'silent',
      npcId: 'valther',
      trustDelta: 0,
      aldenLine: '*Alden menarik pedangnya sebagai jawaban.*',
      cinematic: 'dramatic',
      pauseMs: 700,
    },
  ];
}

function cathedralNunFaithChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Aku butuh bimbinganmu.',
      tone: 'calm',
      npcId: 'nun',
      trustDelta: 2,
      aldenLine: 'Kamu udah liat lebih banyak dari aku. Ajarin aku liat apa yang kamu liat.',
      cinematic: 'zoom',
    },
    {
      text: 'Tempat ini ngerasa aneh.',
      tone: 'sarcastic',
      npcId: 'nun',
      trustDelta: 0,
      aldenLine: 'Abu suci, patung patah, altar palsu — Valther bener-bener dekor ulang tempat ibadah.',
      cinematic: 'none',
    },
    {
      text: 'Tunjukin aku jalan — atau minggir.',
      tone: 'determined',
      npcId: 'nun',
      trustDelta: 2,
      aldenLine: 'Diam dan liat. Aku bakal bersihin Katedral ini dari panggung sandiwaranya.',
      cinematic: 'zoom',
    },
    {
      text: 'Aku capek, Suster.',
      tone: 'emotional',
      npcId: 'nun',
      trustDelta: 3,
      flavorFlag: 'cathedral_nun_exhaustion',
      aldenLine: 'Aku capek. Tapi aku nggak bisa berhenti. Ajarin aku caranya terus jalan.',
      cinematic: 'dramatic',
      pauseMs: 550,
    },
    {
      text: '...',
      tone: 'silent',
      npcId: 'nun',
      trustDelta: 1,
      aldenLine: '*Alden menatap patung yang patah, tangannya gemetar.*',
      cinematic: 'dramatic',
      pauseMs: 750,
    },
  ];
}

function mountainResolveChoices(): DialogueLine['choices'] {
  return [
    {
      text: 'Gunung ini nggak akan nahan aku.',
      tone: 'determined',
      npcId: 'nun',
      trustDelta: 2,
      aldenLine: 'Salju, es, tebing, apa aja. Aku tetep naik.',
      cinematic: 'zoom',
    },
    {
      text: 'Gunung ini dingin kayak hati Valther.',
      tone: 'sarcastic',
      npcId: 'nun',
      trustDelta: 0,
      aldenLine: 'Mungkin kalo aku bakar seluruh puncak ini, isinya juga bakal cair.',
      cinematic: 'none',
    },
    {
      text: 'Biar alam yang uji aku.',
      tone: 'calm',
      npcId: 'nun',
      trustDelta: 2,
      aldenLine: 'Gunung bisa uji fisik. Tapi dia nggak tau apa yang udah aku lewatin.',
      cinematic: 'zoom',
    },
    {
      text: 'Kadang aku takut nggak sampe.',
      tone: 'emotional',
      npcId: 'nun',
      trustDelta: 3,
      flavorFlag: 'mountain_nun_fear',
      aldenLine: 'Bukan dinginnya, Suster. Tapi... apa yang bakal aku temuin di puncak.',
      cinematic: 'dramatic',
      pauseMs: 600,
    },
    {
      text: '...',
      tone: 'silent',
      npcId: 'nun',
      trustDelta: 1,
      aldenLine: '*Alden mengikat tali di pinggangnya dan mulai mendaki.*',
      cinematic: 'dramatic',
      pauseMs: 800,
    },
  ];
}

export function sceneIdFromLines(lines: DialogueLine[]): string | null {
  const first = lines[0]?.text?.slice(0, 40) ?? '';
  if (first.includes('Harrowmere') || first.includes('Desa Harrowmere')) return 'village_entry';
  if (first.includes('Fogbound') || first.includes('Hutan Fogbound')) return 'forest_entry';
  if (first.includes('Puri Aelindra') || first.includes('castle')) return 'castle_entry';
  if (first.includes('Medan Perang') || first.includes('Battlefield')) return 'battlefield_entry';
  if (first.includes('Tam') && lines.some((l) => l.text.includes('jimat'))) return 'village_round2';
  if (first.includes('Katakombe')) return 'catacombs_entry';
  if (first.includes('Katedral Abu')) return 'cathedral_entry';
  if (first.includes('Puncak Frostpeak')) return 'mountain_entry';
  return null;
}
