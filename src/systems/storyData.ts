import { DialogueLine } from '../utils/types';

// ── PROLOGUE ──────────────────────────────────────────────────

export const PROLOGUE_NARRATION: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Di kerajaan Aelindra, tempat cahaya lilin nggak pernah bisa nyampe ke lorong paling dalem kastil...', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'Ada seorang ksatria yang cintanya sama rajanya lebih besar dari cintanya sama nama dia sendiri.', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'Namanya Alden.', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'Dan di malam saat bintang-bintang menolak buat bersinar — semua yang dia punya, semua yang dia sumpah buat lindungin... direbut dari dia.', emotion: 'sad', isNarration: true },
];

// ── CHAPTER HEADERS ───────────────────────────────────────────

export const CHAPTER_1: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Bab I — The Forsaken Knight', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'Dikhianati sama orang yang dulu dia layanin. Diburu sama orang yang dulu dia panggil saudara. Satu-satunya jalan Alden cuma nerobos kegelapan.', emotion: 'determined', isNarration: true },
];

// ── VILLAGE ZONE ──────────────────────────────────────────────

export const VILLAGE_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Desa Harrowmere bertahan hidup di ujung kerajaan — tempat dimana harapan pelan-pelan mati.', emotion: 'sad', isNarration: true },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Demi dewa-dewa lama... lo beneran sampe. Pas gue potong rantai itu, gue ragu lo bakal kuat sampe malem.', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo pertaruhin semuanya buat gue, Edric. Masa gue balas dengan mati?', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Hmph. Masih keras kepala. Bagus. Tapi desa ini udah dipenuhi mayat hidup. Mereka dateng dari kuburan tua tiap malem sekarang.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Ulahan Valther?', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Siapa lagi? Segelnya mulai lemah — yang mati nggak bisa diem. Kalo lo mau tembus ke kastil, lo harus bersihin jalan.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Berarti gue mulai gali kuburan.', emotion: 'determined' },
];

export const VILLAGE_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*ngos-ngosan* ...Mereka dateng terus.', emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Itu baru gelombang pertama. Ada yang lebih parah bergerak di balik reruntuhan gereja.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Korupsinya nyebar lebih cepet dari yang gue kira.', emotion: 'sad' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Lo nggak bisa ngelakuin ini sendirian, nak. Biar gue bantu — beneran kali ini.', emotion: 'determined' },
];

export const VILLAGE_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Kak Alden! Kakak nggak papa!', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tam... kamu harusnya di dalem.', emotion: 'neutral' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Aku bawa ini buat Kakak. Mama bilang ini punya kakek buyut aku — jimat ksatria. Buat pelindung.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '*nerima jimatnya pelan* ...Makasih, Tam. Bakal aku bawa terus.', emotion: 'sad' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Kakak bakal ngelawan orang jahat itu, kan? Kakak bakal bikin semuanya bener lagi?', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Aku sumpah.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Jalan ke hutan udah kebuka sekarang. Tapi Alden... hati-hati. Hutan Fogbound punya mulut sendiri — dan lagi bisik-bisik.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue pernah selamat dari yang lebih ganas dari bisikan.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Oh ya? Pergilah. Dan balik hidup-hidup — atau gue seret lo balik sendiri.', emotion: 'happy' },
];

// ── FOREST ZONE ───────────────────────────────────────────────

export const FOREST_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Hutan Fogbound bernafas. Makhluk hidup dari akar yang melilit dan kabut yang merayap. Kata orang, pohon-pohonnya inget setiap dosa yang pernah dilakukan di bawah mereka.', emotion: 'sad', isNarration: true },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Kamu bawa beban raja yang mati di pundakmu, ksatria muda. Gue bisa rasain dari sini.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo siapa?', emotion: 'neutral' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Gue adalah suara yang belum ditelan hutan ini. Gue udah jalan di jalur ini tiga puluh tahun, dan gue liat sendiri apa yang dilakukan tuan Valther ke negeri ini.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther ngikutin sesuatu?', emotion: 'shocked' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Di bawah kastil. Lebih tua dari kerajaan ini. Kegelapan yang tersegel yang bisikin janji ke siapa pun yang mau denger. Valther denger... dan raja harus mati buat buka segel pertama.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau gitu gue bakal hancurin Valther sebelum dia buka segel lain.', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Hutan ini bakal uji tekadmu. Mari kita liat apa keyakinanmu lebih tajam dari pedangmu.', emotion: 'neutral' },
];

export const FOREST_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*ngap-ngapan* ...Binatang-binatang ini... nggak wajar. Mata mereka...', emotion: 'sad' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Dulu mereka penjaga hutan. Korupsi itu muter mereka jadi cangkang kosong. Kayak Valther muter balik kebenaran.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Ada berapa segel?', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Empat. Kematian raja buka yang pertama. Tiap segel yang pecah bikin yang kuno makin kuat. Kalo empat-empatnya jatuh...', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Apa yang terjadi kalo empat-empatnya jatuh?', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Lo nggak mau tau. Tapi lo bakal liat sendiri kalo nggak cepet-cepet.', emotion: 'sad' },
];

export const FOREST_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*ambruk ke satu lutut* ...Mereka tuh... banyak banget...', emotion: 'neutral' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Hutan ini nangis. Dia nggak mau lawan lo — dia dipaksa.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tolong gue. Lo tau lebih banyak dari yang lo omongin.', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Gue udah kasih lo semua yang gue bisa. Tapi ini — pedupaan yang diberkati sebelum korupsi mulai. Cahayanya mungkin bisa nembus kegelapan kalo semuanya keliatan hopeless.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Makasih. Gue aja nggak tau nama lo.', emotion: 'sad' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Nama itu barang berat, ksatria. Pikul namamu sendiri dulu. Sekarang pergilah — kastil udah nunggu. Kebenaran lo juga.', emotion: 'determined' },
];

// ── CASTLE ZONE ───────────────────────────────────────────────

export const CASTLE_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Kastil Aelindra. Dulu jadi mercusuar harapan dan kehormatan. Sekarang jadi makam kenangan — dan kebenaran yang dikubur di dalemnya.', emotion: 'sad', isNarration: true },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '...Alden?', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Putri... Gue... gue tau lo punya hak buat bunuh gue di sini juga.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*suara gemetar* Lo tau nggak seberapa sakitnya buat gue percaya lo bisa bunuh? Tiap malem gue mimpiin wajah ayah — dan tangan lo penuh darah dia.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue juga sayang sama dia. Dia kayak bapak buat gue. Gue nggak bakal pernah—', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Gue tau. Gue nemu buku hariannya. Disembunyiin di ruang kerja pribadinya — yang Valther bilang "disegel buat penyelidikan."', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Buku harian itu... ngebuktiin Valther bersalah?', emotion: 'shocked' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Itu ngebuktiin ayah tau kalo Valther lagi dimakan sama sesuatu. Dan malam dia mati... dia mau ngadepin Valther.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Berarti Valther diemin dia duluan.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Gue nuduh lo. Gue biarin mereka rantai lo. Gue biarin mereka seret lo ke tiang gantungan... dan lo masih balik juga.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue balik karena tugas gue nggak pernah berakhir. Cuma berubah bentuk.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*ngusap air mata* Kastil ini penuh sama prajurit bangkitnya Valther. Mereka setia sama Blind King — penjaga yang Valther korup buat nahan segel kedua.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau gitu gue kirim dia balik ke kuburnya.', emotion: 'determined' },
];

export const CASTLE_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*bersandar di pilar hancur* ...Prajurit-prajurit ini... dulu mereka saudara gue.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Iya. Dan sekarang jadi boneka. Valther nggak peduli siapa yang dia hancurin — yang penting segelnya pecah.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Korupsinya nyampe sedalem apa?', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Sampe ke akar kastil. Ada ruang di bawah singgasana — brankas yang nggak pernah dibuka sejak zaman kakek gue. Di situ segel kedua berada.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Dan Blind King njagain itu.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Dia dulu pelindung paling setia keluarga kami. Korupsi itu... muterin kesetiaan dia jadi belenggu.', emotion: 'sad' },
];

export const CASTLE_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*megap-megap* Halamannya bersih... buat sementara.', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Alden, dengerin gue. Blind King — nggak bisa dikalahin cuma pake kekuatan doang. Buku harian ayah bilang dia punya kelemahan. Sebuah nama. Nama aslinya.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Nama aslinya?', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Sebelum jadi Blind King, dia adalah Sir Galen — ksatria yang ngajarin ayah gue megang pedang. Kalo lo sebut nama itu... mungkin bisa ngelemahin korupsinya, sebentar aja.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Galen... gue pernah denger cerita tentang dia. Mereka panggil dia Knight of the Dawn.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Kalau gitu ingetin dia tentang fajar. Sebelum lo tebas dia... ingetin dia siapa dulu dirinya.', emotion: 'sad' },
];

export const CASTLE_BOSS_PRE: DialogueLine[] = [
  { speaker: 'Blind King', text: 'Siapa... yang berani... mendekati ambang segel?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sir Galen. Ini gue — Alden. Bocah yang dulu raja lo angkat pas gue nggak punya apa-apa.', emotion: 'determined' },
  { speaker: 'Blind King', text: 'Nama itu... Tidak. Nama itu udah mati. Gue sekarang cuma rasa lapar.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo dulu Knight of the Dawn. Lo ngajar setiap prajurit kerajaan yang pernah ngabdi. Dan di dalem cangkang korup lo — lo masih inget gimana rasanya kehormatan.', emotion: 'determined' },
  { speaker: 'Blind King', text: '*teriakan mengerikan* PERGI DARI SINI ATAU LO AKAN DIMAKAN!', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Maaf, Sir Galen. Gue bakal akhiri ini.', emotion: 'sad' },
];

export const CASTLE_BOSS_POST: DialogueLine[] = [
  { speaker: 'Blind King', text: 'Alden... bocah yang dulu nggak punya apa-apa... sekarang pikul semuanya.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sir Galen... lo bebas sekarang.', emotion: 'sad' },
  { speaker: 'Blind King', text: 'Valther... turun ke katakombe. Segel ketiga... jangan sampai jatuh. Jangan biarkan dia... menyelesaikan ritual.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Nggak bakal.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*lari masuk* Alden! Lo berhasil... lo beneran berhasil.', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Katakombe. Di situ Valther menuju. Dia mau buka segel ketiga.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Berarti lo bakal kejar dia.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue harus. Tetap di sini — jagain kastil. Kalo gue nggak balik...', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Jangan. Jangan ngomong gitu. Lo bakal balik. Karena gue yang nyuruh — sebagai putri lo, dan sebagai perempuan yang punya hutang budi yang nggak bakal kebayar.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Gue bakal ketemu lo lagi, Evelyne. Gue janji.', emotion: 'determined' },
];

// ── CATACOMBS ZONE ────────────────────────────────────────────

export const CATACOMBS_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Katakombe Sunken. Labirin tulang dan kesunyian. Tiap langkah bergema kayak detak jantung di kegelapan.', emotion: 'sad', isNarration: true },
  { speaker: 'Valther', portrait: 'valther', text: '*tepuk tangan pelan* Bravo. Beneran, bravo. Lo babat pion-pion gue kayak pedang panas nembus salju. Gue hampir terkesan.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther. Berakhir di sini.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Berakhir? Oh, ksatria bodohku sayang — ini belum dimulai. Kematian raja cuma nada pertama dari simfoni. Lo pikir lo pahlawan di cerita ini?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue tau gue siapa. Gue tau gue berjuang buat apa.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Lo berjuang buat hantu. Kerajaan yang buang lo. Putri yang hukum lo. Tapi lo masih bertahan. Bisa dibilang keren kalo nggak sekonyol itu.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Bilang aja gue buta. Gue masih liat lebih jelas dari lo — karena gue bukan yang ngabdi sama bayangan.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: '*ketawa dingin* Katakombe ini bakal telan tekad lo. Kita liat apa lo masih percaya kehormatan pas lo dikubur di dalemnya.', emotion: 'angry' },
];

export const CATACOMBS_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*tangan nahan di tembok batu dingin, napas ngos-ngosan* ...Dalem apa sih terowongan ini?', emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'Temboknya sendiri kayak bernafas. Bisik-bisik samar melingkar di ujung pendengaran.', isNarration: true, emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue nggak bakal denger. Nggak bakal.', emotion: 'determined' },
  { speaker: '— Narrator —', text: 'Tapi bisikan itu tau namanya. Mereka udah nungguin dia.', isNarration: true, emotion: 'sad' },
];

export const CATACOMBS_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*jatuh ke lutut* ...Tiap langkah... gelapnya makin berat...', emotion: 'sad' },
  { speaker: 'Valther', portrait: 'valther', text: '*gema dari dalam gua* Segel ketiga hampir kebuka, Alden. Lo rasain? Dunia bergetar di ujung sesuatu yang indah?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo... gila.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Bukan. Gue sadar. Segel di bawah medan perang itu yang terakhir. Dateng dan cari gue, ksatria cilik. Kalo lo berani.', emotion: 'angry' },
  { speaker: '— Narrator —', text: 'Tanah bergetar. Di suatu tempat jauh di bawah, segel ketiga mengerang — dan nyaris pecah.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: '*dorong diri bangkit* Belum... belum telat...', emotion: 'determined' },
];

// ── BATTLEFIELD ZONE ──────────────────────────────────────────

export const BATTLEFIELD_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Medan Perang Ruined. Dulu tempat keberanian dan pengorbanan. Sekarang kuburan harapan — dan panggung buat babak terakhir.', emotion: 'sad', isNarration: true },
  { speaker: 'Valther', portrait: 'valther', text: 'Selamat datang di ujung perjalanan lo, Alden. Harus gue akui — gue nggak nyangka lo bakal sampe sini.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Mana segelnya, Valther?', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Di mana-mana. Di bawah kaki lo. Di udara yang lo hirup. Segel terakhir bukan pintu — ini medan perangnya sendiri. Darah seribu prajurit yang ngasih makannya.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo bunuh orang-orang nggak berdosa cuma buat buka gembok?', emotion: 'angry' },
  { speaker: 'Valther', portrait: 'valther', text: 'Nggak berdosa? Nggak ada yang nggak berdosa. Cuma ada yang ngabdi sama terang — dan yang cukup berani buat ngerangkul gelap.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo nggak ngerangkul gelap. Lo tenggelam di dalemnya. Dan gue bakal tarik lo naik — atau tebas lo jatuh.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: '*nyengir* Kalau gitu dateng. Ayo kita akhiri tarian ini beneran.', emotion: 'angry' },
];

export const BATTLEFIELD_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*basah kuyup keringat dan darah* ...Berapa lagi?', emotion: 'neutral' },
  { speaker: 'Valther', portrait: 'valther', text: 'Sebanyak yang diperlukan. Segel itu MAKAN dari konflik, Alden. Tiap ayunan pedang, tiap tetes darah tumpah — itu bikin gue makin deket ke kebangkitan.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau gitu gue selesaiin ini cepat.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Lo masih nggak ngerti. Lo nggak bakal pernah nghentiin gue. Lo dari awal cuma bahan terakhir.', emotion: 'angry' },
];

export const BATTLEFIELD_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*berjuang berdiri, pedang gemetar* Gue... masih berdiri... Valther.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Iya. Lo berdiri. Dan itu yang gue butuhin.', emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'Langit robek. Pilar kegelapan menyembur dari jantung medan perang. Dan Valther mulai berubah.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'Yang kuno udah nunggu berabad-abad buat wadah yang layak buat kekuatannya. Lo pikir gue bakal biarin dia MANGSA gue? Nggak, Alden. Gue yang bakal MANGSA dia.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo udah gila.', emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'Gue nggak ilang apa-apa. Gue dapet SEGALANYA. Saksikan — kegagalan tuhan lo yang menjelma!', emotion: 'angry' },
];

export const BATTLEFIELD_BOSS_PRE: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Ashen Knight bangkit. Wujud Valther sekarang kolosus bengkok dari bayangan dan amarah cair — yang kuno terlahir setengah dari dagingnya.', emotion: 'shocked', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther! Lo masih di dalem! Lawan!', emotion: 'determined' },
  { speaker: 'Ashen Knight', text: '*suara berlapis sesuatu yang kuno dan mengerikan* Valther... SUDAH... HILANG. Sekarang cuma ada rasa lapar.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Nggak. Gue udah kehilangan terlalu banyak buat kalah sama bayangan pake muka orang mati.', emotion: 'determined' },
  { speaker: 'Ashen Knight', text: 'Lo udah kalah, ksatria cilik. Lo kalah sejak lo cinta sama kerajaan yang nggak bakal pernah balas cinta lo.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Mungkin. Tapi gue nggak berjuang buat kerajaannya. Gue berjuang buat orang-orang DI DALEMNYA.', emotion: 'determined' },
  { speaker: '— Narrator —', text: 'Saat kegelapan mutlak Ashen Knight hampir menelan sisa jiwanya, Jimat Ksatria dari Tam di dadanya mendadak terasa hangat. Di saat yang sama, Pedupaan Suci dari Wandering Nun memancarkan cahaya keemasan lembut, menghalau kabut hitam di sekelilingnya.', emotion: 'loving', isNarration: true },
  { speaker: '— Narrator —', text: 'Alden mengangkat Forsaken Blade pemberian Edric satu kali terakhir. Beratnya setiap teman yang jatuh, setiap sumpah yang patah, setiap luka — disalurin ke satu tebasan mahadahsyat.', emotion: 'determined', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Demi Aelindra. Demi semua yang nggak bisa gue selametin. GUE AKHIRI INI.', emotion: 'determined' },
];

export const BATTLEFIELD_BOSS_POST: DialogueLine[] = [
  { speaker: 'Ashen Knight', text: '*hancur* Nggak mungkin... yang kuno janji... keabadian...', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Dia bohong.', emotion: 'determined' },
  { speaker: 'Ashen Knight', text: 'Lo... bocah... bodoh... lo cuma... nunda yang nggak bisa dihindarin... kegelapan... selalu... balik...', emotion: 'angry' },
  { speaker: '— Narrator —', text: 'Ashen Knight hancur jadi abu. Pilar kegelapan pecah. Dan buat pertama kalinya dalam berbulan-bulan — matahari nyentuh medan perang.', isNarration: true, emotion: 'neutral' },
];

// ── ENDING ────────────────────────────────────────────────────

export const ENDING_SCENE: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Kegelapan tersegel. Yang kuno — akhirnya bungkam.', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'Tapi luka yang dibawa Alden... terlalu dalem. Bahkan buat ksatria yang udah selamat dari semuanya.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narrator —', text: 'Di tengah kesunyian medan perang, langkah kaki terburu-buru memecah keheningan. Evelyne, yang menyusul dengan rasa cemas yang tak tertahankan, jatuh terduduk di samping ksatria itu.', isNarration: true, emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*berlutut di sampingnya, tangan nahan lukanya* Alden. Alden, jangan pergi. Please. Tabibnya dateng—', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Nggak apa-apa. Gue... gue nggak dingin. Aneh ya.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*air mata jatuh* Jangan berani-beraninya lo nerima ini. Lawan.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Evelyne. Kerajaan ini milik lo sekarang. Dan lo bakal jadi... lo bakal jadi ratu yang luar biasa. Gue selalu tau.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Bilang ke Tam kalo pahlawan yang dia percayain... itu nyata.', emotion: 'sad' },
  { speaker: '— Narrator —', text: 'Kerajaan akhirnya tau kebenaran. Dan nangis buat ksatria yang mereka tinggalin.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narrator —', text: 'Bertahun-tahun kemudian, sebuah patung besar didirikan di ibu kota — dengan bunga yang selalu ada di kakinya.', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'Dan di tiangnya, terukir huruf emas, kata-kata yang dipilih sendiri oleh putri:', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: '"Di sini terbaring Alden — ksatria yang dibenci dunia... yang menyelamatkan semua orang."', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'Dan di suatu tempat di balik sinar matahari, di luar jangkauan bayangan... seorang raja dan ksatria paling setianya berjalan bersama lagi.', isNarration: true, emotion: 'loving' },
];

// ── NPC SIDE DIALOGUES (optional, still available) ────────────

export const BLACKSMITH_DIALOGUE: DialogueLine[] = [
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Lo masih idup, tolol keras kepala. Bagus. Duduk. Biar gue liat luka lo.', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue nggak bisa lama-lama, Edric. Mereka bakal nyari.', emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Biarin mereka dateng. Tiga puluh tahun gue ngayun palu di tangan ini. Ini — gue udah bikin sesuatu buat lo.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'The Forsaken Blade. Nggak cocok buat istana raja. Tapi sempurna buat ksatria yang berjuang buat kebenaran di gelap.', emotion: 'determined' },
];

export const VILLAGE_BOY_DIALOGUE: DialogueLine[] = [
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Kak ksatria! Apa lo beneran Alden? Yang katanya bunuh raja?', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: '...Lo harusnya lari dari gue, nak. Semua orang juga gitu.', emotion: 'sad' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Tapi lo nyelametin mama gue dari monster tadi malem. Orang jahat nggak bakal ngelakuin itu.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...', emotion: 'sad' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Gue percaya sama lo, Kak. Gue bakal selalu percaya.', emotion: 'happy' },
];

export const NUN_DIALOGUE: DialogueLine[] = [
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Lo udah dateng jauh, anak. Lebih jauh dari yang berani kebanyakan orang.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Jalan di depan masih panjang.', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Semua jalan berakhir di suatu tempat. Pastiin jalan lo berakhir dengan lo berdiri — bukan berlutut.', emotion: 'determined' },
];

export const EVELYNE_TURNING_POINT: DialogueLine[] = [
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Gue nemu buku harian ayah. Dia nulis... dia nulis kalo Valther sering nanya aneh-aneh tentang segel.', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Putri—', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Jangan. Belum. Gue harus ngomong ini. Gue... gue salah tentang lo.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Lo punya alasan buat percaya apa yang lo percayain.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Gue punya alasan buat nanya yang bener duluan. Gue nggak. Maaf, Alden.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Lo nggak perlu minta maaf ke gue.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Harus.', emotion: 'determined' },
];

// ── OLD DIALOGUES (kept for backward compat but not used in rounds) ──

export const CASTLE_DIALOGUE_INTRO: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: 'Baginda... patroli timur lapor liat cahaya aneh di dekat segel kuno. Gue minta izin buat nyelidikin.', emotion: 'determined' },
  { speaker: 'King Aldric', portrait: 'king', text: 'Alden... pedang paling gue percaya. Gue merasa sesuatu bergerak di kegelapan lama. Tapi malam ini — tetep di dekat gue. Gue nggak enak.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Gue bakal jagain Baginda dengan nyawa gue.', emotion: 'determined' },
  { speaker: 'King Aldric', portrait: 'king', text: '...Lo selalu gitu, nak. Makanya gue percaya lo di atas yang lain.', emotion: 'sad' },
];

export const BETRAYAL_SCENE: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Tiga jam kemudian. Teriakan robek tembok kastil.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'TANGKAP DIA! Ksatria Alden udah bunuh raja kita! Gue liat sendiri!', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Apa— Nggak! Gue nemuin dia kayak gini! Valther, lo TAU gue nggak bakal pernah—', emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'Pedangnya di tangan lo, pengkhianat. Nggak ada yang perlu dibahas lagi.', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '...Lo... Lo bunuh dia. Lo bunuh ayah gue.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Putri, tolong— gue sumpah demi apapun yang gue punya—', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Bawa dia pergi. Gue nggak sanggup liat dia.', emotion: 'angry' },
];

export const ESCAPE_NARRATION: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Mereka seret dia ke halaman eksekusi saat fajar.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narrator —', text: 'Tapi pandai besi tua, Edric — satu-satunya orang yang masih percaya — potong rantai dia di gelap sebelum lonceng berbunyi.', isNarration: true, emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Lo nggak ngelakuin itu. Tau ini tulang-tulang tua gue. Sekarang LARI, nak. Lari dan cari kebenaran.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Edric...', emotion: 'sad' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Jangan berani nangis. Belum. Bertahan dulu. Nanti baru bersedih.', emotion: 'determined' },
];

export const FINAL_BATTLE_DIALOGUE: DialogueLine[] = [
  { speaker: 'Valther', portrait: 'valther', text: 'Masih idup? Masih megang teguh omong kosong soal kehormatan? Lo peninggalan dari dunia mati, Alden.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Mungkin. Tapi peninggalan ini bakal hancurin lo.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Kegelapan di bawah kerajaan ini ABADI. Walaupun lo bunuh gue, dia bakal cari wadah lain.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Kalau gitu gue segel dia pake napas terakhir gue kalo harus.', emotion: 'determined' },
];

export const QUEST_INTRO_VILLAGE: DialogueLine[] = [
  { speaker: 'Frightened Villager', text: 'Mayat hidup udah nyerang ladang kami tiap malem! Tolong, kami nggak punya tempat tujuan!', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tetap di dalem kalo udah gelap. Gue yang urus.', emotion: 'determined' },
];
