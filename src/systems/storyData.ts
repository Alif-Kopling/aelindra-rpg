import { DialogueLine } from '../utils/types';

// ── PROLOGUE ──────────────────────────────────────────────────

export const PROLOGUE_NARRATION: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Di kerajaan Aelindra, tempat cahaya lilin tak pernah mampu menjangkau lorong-lorong paling gelap puri...', emotion: 'neutral', isNarration: true },
  { speaker: '— Narator —', text: 'Hiduplah seorang kesatria yang cintanya kepada rajanya melebihi cintanya kepada namanya sendiri.', emotion: 'neutral', isNarration: true },
  { speaker: '— Narator —', text: 'Namanya Alden.', emotion: 'neutral', isNarration: true },
  { speaker: '— Narator —', text: 'Dan pada malam ketika bintang-bintang enggan bersinar — segala yang ia miliki, segala yang ia sumpahi untuk dilindungi... direnggut darinya.', emotion: 'sad', isNarration: true },
];

// ── CHAPTER HEADERS ───────────────────────────────────────────

export const CHAPTER_1: DialogueLine[] = [
  { speaker: '— Narator —', sceneImage: 'last-scene-mc-kabur-dari-penjara.jpeg', text: 'Bab I — Ksatria Terbuang', emotion: 'neutral', isNarration: true },
  { speaker: '— Narator —', sceneImage: 'last-scene-mc-kabur-dari-penjara.jpeg', text: 'Dikhianati oleh orang yang dahulu ia layani. Diburu oleh orang yang dahulu ia panggil saudara. Hanya satu jalan tersisa bagi Alden: menerobos kegelapan.', emotion: 'determined', isNarration: true },
];

// ── VILLAGE ZONE ──────────────────────────────────────────────

export const VILLAGE_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Desa Harrowmere bertahan di ujung kerajaan — tempat di mana harapan perlahan-lahan padam.', emotion: 'sad', isNarration: true },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Demi para dewa purba... kamu benar-benar selamat. Saat kupotong rantai itu, kuragu kamu akan bertahan hingga senja.', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu pertaruhkan segalanya demi aku, Edric. Masa kubalas dengan kematian?', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Hmph. Masih keras kepala. Bagus. Namun desa ini telah dipenuhi mayat hidup. Mereka muncul dari kuburan tua setiap malam kini.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Ulahan Valther?', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Siapa lagi? Segelnya mulai lemah — yang mati tak bisa diam. Bila kamu ingin menembus puri, kamu harus membersihkan jalan.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Berarti aku mulai menggali kuburan.', emotion: 'determined' },
];

export const VILLAGE_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*terengah-engah* ...Mereka terus berdatangan.', emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Itu baru gelombang pertama. Sesuatu yang lebih jahat bergerak di balik reruntuhan gereja.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Korupsinya menyebar lebih cepat dari dugaanku.', emotion: 'sad' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Kamu tak bisa melakukannya sendirian, nak. Biar aku membantu — sungguh kali ini.', emotion: 'determined' },
];

export const VILLAGE_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Kak Alden! Kakak tidak apa-apa!', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tam... kamu seharusnya berada di dalam.', emotion: 'neutral' },
  { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Aku membawa ini untuk Kakak. Ibu bilang ini milik kakek buyutku — jimat seorang kesatria. Untuk melindungi.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '*menerima jimat itu perlahan* ...Terima kasih, Tam. Akan kubawa selalu.', emotion: 'sad' },
  { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Kakak akan melawan orang jahat itu, bukan? Kakak akan membuat semuanya benar kembali?', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku bersumpah.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Jalan menuju hutan telah terbuka. Namun Alden... berhati-hatilah. Hutan Fogbound memiliki mulutnya sendiri — dan ia sedang berbisik.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku pernah selamat dari yang lebih buas daripada bisikan.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Oh ya? Pergilah. Dan kembalilah hidup-hidup — atau aku akan menyeretmu pulang sendiri.', emotion: 'happy' },
];

// ── FOREST ZONE ───────────────────────────────────────────────

export const FOREST_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Hutan Fogbound bernapas. Makhluk hidup dari akar yang melilit dan kabut yang merayap. Konon, pepohonannya mengingat setiap dosa yang pernah dilakukan di bawah naungannya.', emotion: 'sad', isNarration: true },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Kamu membawa beban raja yang gugur di pundakmu, kesatria muda. Aku dapat merasakannya dari sini.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Siapakah engkau?', emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Aku adalah suara yang belum ditelan hutan ini. Aku telah menapaki jalan ini selama tiga puluh tahun, dan kusaksikan sendiri apa yang dilakukan Tuan Valther terhadap negeri ini.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther mengikuti sesuatu?', emotion: 'shocked' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Di bawah puri. Sesuatu yang lebih tua dari kerajaan ini. Kegelapan tersegel yang membisikkan janji kepada siapa pun yang mau mendengar. Valther mendengarnya... dan raja harus mati untuk membuka segel pertama.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau begitu akan kuhancurkan Valther sebelum ia membuka segel lainnya.', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Hutan ini akan menguji tekadmu. Mari kita lihat apakah keyakinanmu lebih tajam daripada pedangmu.', emotion: 'neutral' },
];

export const FOREST_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*terengah-engah* ...Binatang-binatang ini... tak wajar. Mata mereka...', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Dahulu mereka penjaga hutan. Korupsi itu memelintir mereka menjadi cangkang kosong. Seperti Valther memelintir kebenaran.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Ada berapa segel?', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Empat. Kematian raja membuka yang pertama. Tiap segel yang pecah membuat yang kuno semakin kuat. Bila keempatnya jatuh...', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Apa yang terjadi bila keempatnya jatuh?', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Kamu tak ingin tahu. Namun kamu akan menyaksikannya sendiri bila tak segera bertindak.', emotion: 'sad' },
];

export const FOREST_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*ambruk pada satu lutut* ...Mereka... begitu banyak...', emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Hutan ini menangis. Ia tak ingin melawanmu — ia dipaksa.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tolong aku. Kamu tahu lebih banyak dari yang kamu katakan.', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Aku telah memberikan semua yang aku bisa. Namun ini — pedupaan yang diberkati sebelum korupsi mulai. Cahayanya mungkin mampu menembus kegelapan bila segalanya tampak mustahil.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Terima kasih. Aku bahkan tak tahu namamu.', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Nama adalah beban berat, kesatria. Pikullah namamu sendiri dahulu. Kini pergilah — puri telah menanti. Kebenaranmu pun demikian.', emotion: 'determined' },
];

// ── CASTLE ZONE ───────────────────────────────────────────────
export const CASTLE_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Puri Aelindra. Dahulu menjadi mercusuar harapan dan kehormatan. Kini menjadi makam kenangan — dan kebenaran yang terkubur di dalamnya.', emotion: 'sad', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku pulang... namun tak ada sambutan hangat di sini.', emotion: 'sad' },
  { speaker: '— Alden —', text: 'Aku ingat hari itu... sebelum segalanya hancur.', emotion: 'sad', sceneImage: 'Scene2-evelyn-and-mc.png' },
  { speaker: 'Evelyne', portrait: 'evelyne', text: 'Alden, kamu berjanji akan menjagaku selamanya, bukan?', emotion: 'loving', sceneImage: 'Scene2-evelyn-and-mc.png' },
  { speaker: 'Alden', portrait: 'alden', text: 'Selalu, Paduka Putri. Nyawaku adalah perisai bagimu.', emotion: 'determined', sceneImage: 'Scene2-evelyn-and-mc.png' },
  { speaker: '— Alden —', text: 'Janji yang kini hanya tinggal abu.', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '...Alden?', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Paduka Putri... Aku... aku tahu kamu berhak menghabisi aku di sini juga.', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '*suara bergetar* Tahukah kamu betapa sakitnya percaya bahwa kamu mampu membunuh? Setiap malam kumimpikan wajah ayah — dan tangammu berlumuran darahnya.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku pun menyayanginya. Ia bagaikan ayah bagiku. Aku tak akan pernah—', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Aku tahu. Aku menemukan buku hariannya. Tersembunyi di ruang kerja pribadinya — yang Valther katakan "disegel untuk penyelidikan."', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Buku harian itu... membuktikan Valther bersalah?', emotion: 'shocked' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Itu membuktikan ayah tahu bahwa Valther sedang dimakan oleh sesuatu. Dan malam ia gugur... ia hendak menghadapi Valther.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Berarti Valther mendiamkannya lebih dulu.', emotion: 'determined' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Aku menuduhmu. Aku biarkan mereka merantaimu. Aku biarkan mereka menyeretmu ke tiang gantungan... dan kamu tetap kembali juga.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku kembali karena tugasku tak pernah berakhir. Hanya berubah wujud.', emotion: 'determined' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '*menyeka air mata* Puri ini dipenuhi prajurit bangkitkan Valther. Mereka setia kepada Blind King — penjaga yang Valther korupsi untuk menahan segel kedua.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau begitu akan kukirim ia kembali ke kuburnya.', emotion: 'determined' },
];

export const CASTLE_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*bersandar pada pilar runtuh* ...Prajurit-prajurit ini... dahulu mereka saudaraku.', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Benar. Dan kini menjadi boneka. Valther tak peduli siapa yang ia hancurkan — yang penting segelnya pecah.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Seberapa dalam korupsi ini merasuk?', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Hingga ke akar puri. Ada ruang di bawah singgasana — brankas yang tak pernah dibuka sejak zaman kakekku. Di situlah segel kedua berada.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Dan Blind King menjaganya.', emotion: 'determined' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Ia dahulu pelindung paling setia keluarga kami. Korupsi itu... memelintir kesetiaannya menjadi belenggu.', emotion: 'sad' },
];

export const CASTLE_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*terengah-engah* Halamannya bersih... untuk sementara.', emotion: 'neutral' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Alden, dengarkan aku. Blind King — tak bisa dikalahkan hanya dengan kekuatan. Buku harian ayah mengatakan ia memiliki kelemahan. Sebuah nama. Nama aslinya.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Nama aslinya?', emotion: 'neutral' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Sebelum menjadi Blind King, ia adalah Sir Galen — kesatria yang mengajari ayahku memegang pedang. Bila kamu sebut nama itu... mungkin bisa melemahkan korupsinya, sesaat saja.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Galen... aku pernah mendengar cerita tentangnya. Mereka memanggilnya Knight of the Dawn.', emotion: 'determined' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Kalau begitu, ingatkan ia tentang fajar. Sebelum kamu tebas ia... ingatkan ia siapa dirinya dahulu.', emotion: 'sad' },
];

export const CASTLE_BOSS_PRE: DialogueLine[] = [
  { speaker: 'Blind King', portrait: 'blind_king', text: 'Siapa... yang berani... mendekati ambang segel?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sir Galen. Ini aku — Alden. Bocah yang dulu rajamu angkat ketika aku tak punya apa-apa.', emotion: 'determined' },
  { speaker: 'Blind King', portrait: 'blind_king', text: 'Nama itu... Tidak. Nama itu telah mati. Aku kini hanya rasa lapar.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu dahulu Knight of the Dawn. Kamu mengajar setiap prajurit kerajaan yang pernah mengabdi. Dan di dalam cangkang korupmu — kamu masih ingat bagaimana rasanya kehormatan.', emotion: 'determined' },
  { speaker: 'Blind King', portrait: 'blind_king', text: '*raungan mengerikan* PERGILAH KAU AKAN DIMAKAN!', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Maafkan aku, Sir Galen. Aku akan mengakhiri ini.', emotion: 'sad' },
];

export const CASTLE_BOSS_POST: DialogueLine[] = [
  { speaker: 'Blind King', portrait: 'blind_king', text: 'Alden... bocah yang dulu tak punya apa-apa... kini memikul segalanya.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sir Galen... kamu bebas sekarang.', emotion: 'sad' },
  { speaker: 'Blind King', portrait: 'blind_king', text: 'Valther... turun ke katakombe. Segel ketiga... jangan sampai jatuh. Jangan biarkan dia... menyelesaikan ritual.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tidak akan.', emotion: 'determined' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '*berlari masuk* Alden! Kamu berhasil... kamu benar-benar berhasil.', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Katakombe. Di situlah Valther menuju. Ia hendak membuka segel ketiga.', emotion: 'determined' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Berarti kamu akan mengejarnya.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku harus. Tetaplah di sini — jagalah puri. Bila aku tak kembali...', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Jangan. Jangan kamu ucapkan itu. Kamu akan kembali. Karena aku yang memerintahkan — sebagai putrimu, dan sebagai perempuan yang berhutang budi yang takkan terbayar.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Aku akan bertemu kamu lagi, Evelyne. Aku berjanji.', emotion: 'determined' },
];

// ── CATACOMBS ZONE ────────────────────────────────────────────

export const CATACOMBS_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Katakombe Terkutuk. Labirin tulang dan kesunyian. Tiap langkah bergema kayak detak jantung di kegelapan.', emotion: 'sad', isNarration: true },
  { speaker: 'Valther', portrait: 'valther', text: '*tepuk tangan pelan* Bravo. Beneran, bravo. Kamu babat pion-pion aku kayak pedang panas nembus salju. Aku hampir terkesan.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther. Berakhir di sini.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Berakhir? Oh, ksatria bodohku sayang — ini belum dimulai. Kematian raja cuma nada pertama dari simfoni. Kamu pikir kamu pahlawan di cerita ini?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku tau aku siapa. Aku tau aku berjuang buat apa.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Kamu berjuang buat hantu. Kerajaan yang buang kamu. Putri yang hukum kamu. Tapi kamu masih bertahan. Bisa dibilang keren kalo nggak sekonyol itu.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Bilang aja aku buta. Aku masih liat lebih jelas dari kamu — karena aku bukan yang ngabdi sama bayangan.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: '*ketawa dingin* Katakombe ini bakal telan tekad kamu. Kita liat apa kamu masih percaya kehormatan pas kamu dikubur di dalemnya.', emotion: 'angry' },
];

export const CATACOMBS_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*tangan nahan di tembok batu dingin, napas ngos-ngosan* ...Dalem apa sih terowongan ini?', emotion: 'neutral' },
  { speaker: '— Narator —', text: 'Temboknya sendiri kayak bernafas. Bisik-bisik samar melingkar di ujung pendengaran.', isNarration: true, emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku nggak bakal denger. Nggak bakal.', emotion: 'determined' },
  { speaker: '— Narator —', text: 'Tapi bisikan itu tau namanya. Mereka udah nungguin dia.', isNarration: true, emotion: 'sad' },
];

export const CATACOMBS_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*jatuh ke lutut* ...Tiap langkah... gelapnya makin berat...', emotion: 'sad' },
  { speaker: 'Valther', portrait: 'valther', text: '*gema dari dalam gua* Segel ketiga hampir kebuka, Alden. Kamu rasain? Dunia bergetar di ujung sesuatu yang indah?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu... gila.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Bukan. Aku sadar. Segel di bawah medan perang itu yang terakhir. Dateng dan cari aku, ksatria cilik. Kalo kamu berani.', emotion: 'angry' },
  { speaker: '— Narator —', text: 'Tanah bergetar. Di suatu tempat jauh di bawah, segel ketiga mengerang — dan nyaris pecah.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: '*dorong diri bangkit* Belum... belum telat...', emotion: 'determined' },
];

// ── CATHEDRAL ZONE ─────────────────────────────────────────────

export const CATHEDRAL_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Katedral Abu berdiri di atas kota seperti doa yang gagal dikabulkan. Loncengnya retak, patung-patungnya tanpa wajah, dan altar-altar tua dipenuhi abu yang tak pernah dingin.', emotion: 'sad', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Ini tempat penghakiman?', emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Bukan. Ini tempat orang-orang datang buat diampuni, lalu dipaksa menanggung dosa yang bukan milik mereka.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther ada di sini?', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Dia nyentuh altar, memelintir doa jadi rantai. Kalau kamu mau lewat, kamu harus putuskan pengakuan palsu yang dia tanam di tanah ini.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau begitu aku hancurin gerejanya sampai tersisa kebenaran.', emotion: 'determined' },
];

export const CATHEDRAL_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*menatap patung malaikat yang patah* ...Mereka bahkan nggak sempat mati dengan tenang.', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Mereka dipakai sebagai saksi palsu. Valther suka tempat sakral. Di sana, rasa bersalah paling mudah dijadikan senjata.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku mulai ngerti kenapa dia bikin dunia ini sekarat.', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Biar dunia lupa siapa korban dan siapa pelaku. Itu caranya bertahan hidup.', emotion: 'sad' },
];

export const CATHEDRAL_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*terhuyung di lantai marmer retak* ...Suara-suara ini... aku dengar namaku di tiap sudut.', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Karena tempat ini menghafal rasa malu. Napas kamu sendiri dibikin jadi hukuman.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau rasa malu ini palsu, kenapa masih kerasa berat?', emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Karena kebohongan yang lama cukup untuk jadi tulang. Sekarang dengarkan aku baik-baik: ambil relik dari ruang choir. Kamu butuh itu buat memecah segel gunung.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gunung?', emotion: 'shocked' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Ya. Sisa perjalanan kamu bukan bawah tanah lagi. Ini pendakian. Dan pendakian selalu lebih kejam daripada jatuh.', emotion: 'sad' },
];

export const CATHEDRAL_BOSS_PRE: DialogueLine[] = [
  { speaker: 'Saint of Rot', portrait: 'saint_of_rot', text: 'Doa-doamu bocor ke lantai, ksatria. Semua yang suci pada akhirnya hanya menunggu busuknya tiba.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku udah liat busuknya manusia. Kamu cuma versi yang nyerobot mimbar.', emotion: 'determined' },
  { speaker: 'Saint of Rot', portrait: 'saint_of_rot', text: 'Aku dulu menjaga iman mereka. Lalu iman mereka meninggalkanku. Sekarang aku menjaga sisa-isa yang tersisa: ketakutan.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau begitu, aku cabut rasa takut itu dari akarnya.', emotion: 'determined' },
];

export const CATHEDRAL_BOSS_POST: DialogueLine[] = [
  { speaker: 'Saint of Rot', portrait: 'saint_of_rot', text: '*patah* Mereka... bahkan tak pernah... mendengarkan...', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sekarang kamu bisa diem.', emotion: 'determined' },
  { speaker: '— Narator —', text: 'Dari bawah altar, Alden menemukan relik tua yang dingin seperti tulang. Di permukaannya terukir arah ke Puncak Frostpeak — tempat segel kuno berikutnya berakar di batu dan salju.', isNarration: true, emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Gunung itu bukan tempat buat hidup. Tapi mungkin tempat buat ngeliat kebenaran dari atas.', emotion: 'sad' },
];

// ── MOUNTAIN ZONE ──────────────────────────────────────────────

export const MOUNTAIN_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Puncak Frostpeak memotong langit seperti pisau beku. Angin di sana tidak bertiup, ia menghakimi.', emotion: 'sad', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Udara ini... kayak nggak mau aku masuk.', emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Gunung menolak mereka yang datang dengan niat kosong. Bagus. Berarti dia masih punya pendirian.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther taruh segel di sini?', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Bukan taruh. Dia kubur sumpah kuno di bawah es. Ada penjaga yang menolak turun dari puncak karena dia percaya tugasnya belum selesai.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau penjaganya jalan menghalangi, aku mintain dia minggir. Kalau nggak bisa... aku lawan.', emotion: 'determined' },
];

export const MOUNTAIN_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*menarik napas berat* ...Setiap tebing di sini kayak mau menjatuhkan aku.', emotion: 'neutral' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Karena gunung cuma peduli pada dua hal: apa yang sanggup kamu pikul, dan apa yang siap kamu tinggalkan.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku udah ninggalin terlalu banyak.', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Maka jangan tinggalkan dirimu sendiri.', emotion: 'determined' },
];

export const MOUNTAIN_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*lutut menyentuh salju* ...Tangan aku udah nggak kerasa.', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Itu tanda baik. Berarti rasa sakitnya belum menang.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu selalu nyari cara buat bikin aku maju.', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Karena ada hal yang harus dilihat dari puncak sebelum kamu turun lagi: manusia bisa bohong, kerajaan bisa bohong, tapi jejak darah selalu jujur.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Dan aku harus balik turun ke medan perang.', emotion: 'determined' },
];

export const MOUNTAIN_BOSS_PRE: DialogueLine[] = [
  { speaker: 'Penjaga yang Gugur', portrait: 'fallen_guardian', text: 'Siapa yang mengganggu kubur sumpah ini?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku bukan pengganggu. Aku penutup luka yang kamu biarkan terbuka.', emotion: 'determined' },
  { speaker: 'Penjaga yang Gugur', portrait: 'fallen_guardian', text: 'Aku bersumpah menjaga segel terakhir sampai nafas terakhir. Kalau aku jatuh, semuanya jatuh bersamaku.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau sumpah itu masih hidup, bantu aku selesaiin ini.', emotion: 'determined' },
];

export const MOUNTAIN_BOSS_POST: DialogueLine[] = [
  { speaker: 'Penjaga yang Gugur', portrait: 'fallen_guardian', text: '...Akhirnya... ada yang mengerti beban ini...', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Pergilah. Sumpah kamu udah selesai.', emotion: 'sad' },
  { speaker: 'Penjaga yang Gugur', portrait: 'fallen_guardian', text: 'Segel terakhir ada di medan perang. Valther menunggu di sana karena dia percaya semua jalan akhirnya menuju darah.', emotion: 'sad' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Dan dia benar. Tapi kali ini darahnya bukan buat ritual. Itu buat mengakhirinya.', emotion: 'determined' },
];

// ── BATTLEFIELD ZONE ──────────────────────────────────────────

export const BATTLEFIELD_ENTRY: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Reruntuhan Medan Perang. Dulu tempat keberanian dan pengorbanan. Sekarang kuburan harapan — dan panggung buat babak terakhir.', emotion: 'sad', isNarration: true },
  { speaker: 'Valther', portrait: 'valther', text: 'Selamat datang di ujung perjalanan kamu, Alden. Harus aku akui — aku nggak nyangka kamu bakal sampe sini.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Mana segelnya, Valther?', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Di mana-mana. Di bawah kaki kamu. Di udara yang kamu hirup. Segel terakhir bukan pintu — ini medan perangnya sendiri. Darah seribu prajurit yang ngasih makannya.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu bunuh orang-orang nggak berdosa cuma buat buka gembok?', emotion: 'angry' },
  { speaker: 'Valther', portrait: 'valther', text: 'Nggak berdosa? Nggak ada yang nggak berdosa. Cuma ada yang ngabdi sama terang — dan yang cukup berani buat ngerangkul gelap.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu nggak ngerangkul gelap. Kamu tenggelam di dalemnya. Dan aku bakal tarik kamu naik — atau tebas kamu jatuh.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: '*nyengir* Kalau gitu dateng. Ayo kita akhiri tarian ini beneran.', emotion: 'angry' },
];

export const BATTLEFIELD_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*basah kuyup keringat dan darah* ...Berapa lagi?', emotion: 'neutral' },
  { speaker: 'Valther', portrait: 'valther', text: 'Sebanyak yang diperlukan. Segel itu MAKAN dari konflik, Alden. Tiap ayunan pedang, tiap tetes darah tumpah — itu bikin aku makin deket ke kebangkitan.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau gitu aku selesaiin ini cepat.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Kamu masih nggak ngerti. Kamu nggak bakal pernah nghentiin aku. Kamu dari awal cuma bahan terakhir.', emotion: 'angry' },
];

export const BATTLEFIELD_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*berjuang berdiri, pedang gemetar* Aku... masih berdiri... Valther.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Iya. Kamu berdiri. Dan itu yang aku butuhin.', emotion: 'neutral' },
  { speaker: '— Narator —', text: 'Langit robek. Pilar kegelapan menyembur dari jantung medan perang. Dan Valther mulai berubah.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'Yang kuno udah nunggu berabad-abad buat wadah yang layak buat kekuatannya. Kamu pikir aku bakal biarin dia MANGSA aku? Nggak, Alden. Aku yang bakal MANGSA dia.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu udah gila.', emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'Aku nggak ilang apa-apa. Aku dapet SEGALANYA. Saksikan — kegagalan tuhan kamu yang menjelma!', emotion: 'angry' },
];

export const BATTLEFIELD_BOSS_PRE: DialogueLine[] = [
  { speaker: '— Narator —', sceneImage: 'pict-animasi-boss-vs-mc.png', text: 'Ashen Knight bangkit. Wujud Valther sekarang kolosus bengkok dari bayangan dan amarah cair — yang kuno terlahir setengah dari dagingnya.', emotion: 'shocked', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', sceneImage: 'pict-animasi-boss-vs-mc.png', text: 'Valther! Kamu masih di dalem! Lawan!', emotion: 'determined' },
  { speaker: 'Ashen Knight', portrait: 'ashen_knight', sceneImage: 'pict-animasi-boss-vs-mc.png', text: '*suara berlapis sesuatu yang kuno dan mengerikan* Valther... SUDAH... HILANG. Sekarang cuma ada rasa lapar.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Nggak. Aku udah kehilangan terlalu banyak buat kalah sama bayangan pake muka orang mati.', emotion: 'determined' },
  { speaker: 'Ashen Knight', portrait: 'ashen_knight', sceneImage: 'pict-animasi-boss-vs-mc.png', text: 'Kamu udah kalah, ksatria cilik. Kamu kalah sejak kamu cinta sama kerajaan yang nggak bakal pernah balas cinta kamu.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Mungkin. Tapi aku nggak berjuang buat kerajaannya. Aku berjuang buat orang-orang DI DALEMNYA.', emotion: 'determined' },
  { speaker: '— Narator —', text: 'Saat kegelapan mutlak Ashen Knight hampir menelan sisa jiwanya, Jimat Ksatria dari Tam di dadanya mendadak terasa hangat. Di saat yang sama, Pedupaan Suci dari Biarawati Pengembara memancarkan cahaya keemasan lembut, menghalau kabut hitam di sekelilingnya.', emotion: 'loving', isNarration: true },
  { speaker: '— Narator —', text: 'Alden mengangkat Forsaken Blade pemberian Edric satu kali terakhir. Beratnya setiap teman yang jatuh, setiap sumpah yang patah, setiap luka — disalurin ke satu tebasan mahadahsyat.', emotion: 'determined', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Demi Aelindra. Demi semua yang nggak bisa aku selametin. AKU AKHIRI INI.', emotion: 'determined' },
];

export const BATTLEFIELD_BOSS_POST: DialogueLine[] = [
  { speaker: 'Ashen Knight', portrait: 'ashen_knight', text: '*hancur* Nggak mungkin... yang kuno janji... keabadian...', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Dia bohong.', emotion: 'determined' },
  { speaker: 'Ashen Knight', portrait: 'ashen_knight', text: 'Kamu... bocah... bodoh... kamu cuma... nunda yang nggak bisa dihindarin... kegelapan... selalu... balik...', emotion: 'angry' },
  { speaker: '— Narator —', text: 'Ashen Knight hancur jadi abu. Pilar kegelapan pecah. Dan buat pertama kalinya dalam berbulan-bulan — matahari nyentuh medan perang.', isNarration: true, emotion: 'neutral' },
];

// ── ENDING ────────────────────────────────────────────────────

export const ENDING_SCENE: DialogueLine[] = [
  { speaker: '— Narator —', text: 'Kegelapan tersegel. Yang kuno — akhirnya bungkam.', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narator —', text: 'Tapi luka yang dibawa Alden... terlalu dalem. Bahkan buat ksatria yang udah selamat dari semuanya.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narator —', text: 'Di tengah kesunyian medan perang, langkah kaki terburu-buru memecah keheningan. Evelyne, yang menyusul dengan rasa cemas yang tak tertahankan, jatuh terduduk di samping ksatria itu.', isNarration: true, emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '*berlutut di sampingnya, tangan nahan lukanya* Alden. Alden, jangan pergi. Please. Tabibnya dateng—', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Nggak apa-apa. Aku... aku nggak dingin. Aneh ya.', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: '*air mata jatuh* Jangan berani-beraninya kamu nerima ini. Lawan.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Evelyne. Kerajaan ini milik kamu sekarang. Dan kamu bakal jadi... kamu bakal jadi ratu yang luar biasa. Aku selalu tau.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Bilang ke Tam kalo pahlawan yang dia percayain... itu nyata.', emotion: 'sad' },
  { speaker: '— Narator —', text: 'Kerajaan akhirnya tau kebenaran. Dan nangis buat ksatria yang mereka tinggalin.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narator —', text: 'Bertahun-tahun kemudian, sebuah patung besar didirikan di ibu kota — dengan bunga yang selalu ada di kakinya.', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narator —', text: 'Dan di tiangnya, terukir huruf emas, kata-kata yang dipilih sendiri oleh putri:', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narator —', text: '"Di sini terbaring Alden — ksatria yang dibenci dunia... yang menyelamatkan semua orang."', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narator —', text: 'Dan di suatu tempat di balik sinar matahari, di luar jangkauan bayangan... seorang raja dan ksatria paling setianya berjalan bersama lagi.', isNarration: true, emotion: 'loving' },
];

// ── NPC SIDE DIALOGUES (optional, still available) ────────────

export const BLACKSMITH_DIALOGUE: DialogueLine[] = [
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Kamu masih idup, tolol keras kepala. Bagus. Duduk. Biar aku liat luka kamu.', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku nggak bisa lama-lama, Edric. Mereka bakal nyari.', emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Biarin mereka dateng. Tiga puluh tahun aku ngayun palu di tangan ini. Ini — aku udah bikin sesuatu buat kamu.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'The Forsaken Blade. Nggak cocok buat istana raja. Tapi sempurna buat ksatria yang berjuang buat kebenaran di gelap.', emotion: 'determined' },
];

export const VILLAGE_BOY_DIALOGUE: DialogueLine[] = [
  { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Kak ksatria! Apa kamu beneran Alden? Yang katanya bunuh raja?', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: '...Kamu harusnya lari dari aku, nak. Semua orang juga gitu.', emotion: 'sad' },
  { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Tapi kamu nyelametin mamaku dari monster tadi malem. Orang jahat nggak bakal ngelakuin itu.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...', emotion: 'sad' },
  { speaker: 'Tam (Anak Desa)', portrait: 'boy', text: 'Aku percaya sama kamu, Kak. Aku bakal selalu percaya.', emotion: 'happy' },
];

export const NUN_DIALOGUE: DialogueLine[] = [
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Kamu udah dateng jauh, anak. Lebih jauh dari yang berani kebanyakan orang.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Jalan di depan masih panjang.', emotion: 'determined' },
  { speaker: 'Biarawati Pengembara', portrait: 'nun', text: 'Semua jalan berakhir di suatu tempat. Pastiin jalan kamu berakhir dengan kamu berdiri — bukan berlutut.', emotion: 'determined' },
];

export const EVELYNE_TURNING_POINT: DialogueLine[] = [
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Aku nemu buku harian ayah. Dia nulis... dia nulis kalo Valther sering nanya aneh-aneh tentang segel.', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Putri—', emotion: 'neutral' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Jangan. Belum. Aku harus ngomong ini. Aku... aku salah tentang kamu.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Kamu punya alasan buat percaya apa yang kamu percayain.', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Aku punya alasan buat nanya yang bener duluan. Aku nggak. Maaf, Alden.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kamu nggak perlu minta maaf ke aku.', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', text: 'Harus.', emotion: 'determined' },
];

// ── OLD DIALOGUES (kept for backward compat but not used in rounds) ──

export const CASTLE_DIALOGUE_INTRO: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', sceneImage: 'scene1-before-tragedy.jpeg', text: 'Baginda... patroli timur lapor liat cahaya aneh di dekat segel kuno. Aku minta izin buat nyelidikin.', emotion: 'determined' },
  { speaker: 'King Aldric', portrait: 'king', sceneImage: 'scene1-before-tragedy.jpeg', text: 'Alden... pedang paling aku percaya. Aku merasa sesuatu bergerak di kegelapan lama. Tapi malam ini — tetep di dekat aku. Aku nggak enak.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', sceneImage: 'scene1-before-tragedy.jpeg', text: 'Aku bakal jagain Baginda dengan nyawaku.', emotion: 'determined' },
  { speaker: 'King Aldric', portrait: 'king', sceneImage: 'scene1-before-tragedy.jpeg', text: '...Kamu selalu gitu, nak. Makanya aku percaya kamu di atas yang lain.', emotion: 'sad' },
];

export const BETRAYAL_SCENE: DialogueLine[] = [
  { speaker: '— Narator —', sceneImage: 'scene3-The-Tragedy.jpeg', text: 'Tiga jam kemudian. Teriakan robek tembok kastil.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', sceneImage: 'scene3-The-Tragedy.jpeg', text: 'TANGKAP DIA! Ksatria Alden udah bunuh raja kita! Aku liat sendiri!', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', sceneImage: 'scene3-The-Tragedy.jpeg', text: 'Apa— Nggak! Aku nemuin dia kayak gini! Valther, kamu TAU aku nggak bakal pernah—', emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', sceneImage: 'scene3-The-Tragedy.jpeg', text: 'Pedangnya di tangan kamu, pengkhianat. Nggak ada yang perlu dibahas lagi.', emotion: 'neutral' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', sceneImage: 'scene4-evelyn-marah-kepada-mc.png', text: '...Kamu... Kamu bunuh dia. Kamu bunuh ayahku.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', sceneImage: 'scene4-evelyn-marah-kepada-mc.png', text: 'Putri, tolong— aku sumpah demi apapun yang aku punya—', emotion: 'sad' },
  { speaker: 'Putri Evelyne', portrait: 'evelyne', sceneImage: 'scene4-evelyn-marah-kepada-mc.png', text: 'Bawa dia pergi. Aku nggak sanggup liat dia.', emotion: 'angry' },
];

export const ESCAPE_NARRATION: DialogueLine[] = [
  { speaker: '— Narator —', sceneImage: 'scene5-mc-dipenjara-atas-fitnah.jpeg', text: 'Mereka seret dia ke halaman eksekusi saat fajar.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narator —', sceneImage: 'scene5-mc-dipenjara-atas-fitnah.jpeg', text: 'Tapi pandai besi tua, Edric — satu-satunya orang yang masih percaya — potong rantai dia di gelap sebelum lonceng berbunyi.', isNarration: true, emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', sceneImage: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg', text: 'Kamu nggak ngelakuin itu. Tau ini tulang-tulang tua aku. Sekarang LARI, nak. Lari dan cari kebenaran.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', sceneImage: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg', text: '...Edric...', emotion: 'sad' },
  { speaker: 'Old Edric', portrait: 'blacksmith', sceneImage: 'scene6-mc-diselamatkan-oleh-seseorang.jpeg', text: 'Jangan berani nangis. Belum. Bertahan dulu. Napi baru bersedih.', emotion: 'determined' },
];

export const FINAL_BATTLE_DIALOGUE: DialogueLine[] = [
  { speaker: 'Valther', portrait: 'valther', text: 'Masih idup? Masih megang teguh omong kosong soal kehormatan? Kamu peninggalan dari dunia mati, Alden.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Mungkin. Tapi peninggalan ini bakal hancurin kamu.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Kegelapan di bawah kerajaan ini ABADI. Walaupun kamu bunuh aku, dia bakal cari wadah lain.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau gitu aku segel dia pake napas terakhir aku kalo harus.', emotion: 'determined' },
];

export const QUEST_INTRO_VILLAGE: DialogueLine[] = [
  { speaker: 'Frightened Villager', text: 'Mayat hidup udah nyerang ladang kami tiap malem! Tolong, kami nggak punya tempat tujuan!', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tetap di dalem kalo udah gelap. Aku yang urus.', emotion: 'determined' },
];
