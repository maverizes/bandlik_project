/* =============================================================================
   HUNAR — demo ma'lumotlari (seed)
   Pilot: Nurafshon shahri, Toshkent viloyati
   ============================================================================= */

const MAHALLALAR = [
  { id: 'm1', nom: "Yangi hayot" },
  { id: 'm2', nom: "Do'stlik" },
  { id: 'm3', nom: "Navro'z" },
  { id: 'm4', nom: "Bunyodkor" },
  { id: 'm5', nom: "Istiqlol" }
];

const KONIKMALAR = [
  { id: 'k1', nom: 'Tikuvchilik',        soha: 'Ishlab chiqarish' },
  { id: 'k2', nom: 'Qadoqlash',          soha: 'Ishlab chiqarish' },
  { id: 'k3', nom: 'Yorliq yopishtirish', soha: 'Ishlab chiqarish' },
  { id: 'k4', nom: 'Saralash',           soha: 'Ishlab chiqarish' },
  { id: 'k5', nom: 'Kashtachilik',       soha: 'Ishlab chiqarish' },
  { id: 'k6', nom: 'Yig\'ish (montaj)',  soha: 'Ishlab chiqarish' }
];

const KORXONALAR = [
  {
    id: 'c1', nom: 'Nurafshon Teks', stir: '301 456 789',
    soha: 'To\'qimachilik', manzil: "Nurafshon sh., Sanoat ko'chasi 12",
    masul: 'Rustam Ochilov', tel: '+998 90 123 45 67',
    kyb: 'VERIFIED', balans: 48_500_000
  },
  {
    id: 'c2', nom: 'Oq Qadoq', stir: '302 778 114',
    soha: 'Qadoqlash', manzil: "Nurafshon sh., Bog' ko'chasi 4",
    masul: 'Nodira Ahmedova', tel: '+998 91 220 11 08',
    kyb: 'VERIFIED', balans: 22_100_000
  }
];

/* Fuqarolar. selfEmployment: NOT_STARTED | PENDING | VERIFIED
   registry: temir daftar / ayollar / yoshlar daftari belgisi */
const FUQAROLAR = [
  { id: 'w1',  nom: 'Dilnoza Karimova',   mahalla: 'm1', yosh: 34, jins: 'F', konikma: ['k1','k5'], trust: 50, selfEmployment: 'NOT_STARTED', registry: ['ayollar'],           bajargan: 0,  daromad: 0 },
  { id: 'w2',  nom: 'Gulnora Tosheva',    mahalla: 'm1', yosh: 41, jins: 'F', konikma: ['k1','k3'], trust: 82, selfEmployment: 'VERIFIED',    registry: ['ayollar'],           bajargan: 14, daromad: 4_120_000 },
  { id: 'w3',  nom: 'Shahzod Umarov',     mahalla: 'm2', yosh: 23, jins: 'M', konikma: ['k2','k6'], trust: 74, selfEmployment: 'VERIFIED',    registry: ['yoshlar'],           bajargan: 9,  daromad: 2_640_000 },
  { id: 'w4',  nom: 'Muqaddas Yo\'ldosheva', mahalla: 'm2', yosh: 29, jins: 'F', konikma: ['k1'],  trust: 91, selfEmployment: 'VERIFIED',    registry: ['temir','ayollar'],   bajargan: 22, daromad: 6_890_000 },
  { id: 'w5',  nom: 'Bekzod Rahimov',     mahalla: 'm3', yosh: 26, jins: 'M', konikma: ['k2','k4'], trust: 68, selfEmployment: 'VERIFIED',    registry: ['yoshlar'],           bajargan: 7,  daromad: 1_950_000 },
  { id: 'w6',  nom: 'Zulfiya Nazarova',   mahalla: 'm3', yosh: 38, jins: 'F', konikma: ['k5','k1'], trust: 77, selfEmployment: 'VERIFIED',    registry: ['ayollar'],           bajargan: 11, daromad: 3_310_000 },
  { id: 'w7',  nom: 'Jasur Qodirov',      mahalla: 'm4', yosh: 31, jins: 'M', konikma: ['k6'],     trust: 63, selfEmployment: 'PENDING',     registry: ['temir'],             bajargan: 3,  daromad: 720_000 },
  { id: 'w8',  nom: 'Nilufar Sobirova',   mahalla: 'm4', yosh: 45, jins: 'F', konikma: ['k3','k4'], trust: 88, selfEmployment: 'VERIFIED',    registry: ['ayollar'],           bajargan: 18, daromad: 5_240_000 },
  { id: 'w9',  nom: 'Sardor Eshonov',     mahalla: 'm5', yosh: 22, jins: 'M', konikma: ['k2'],     trust: 55, selfEmployment: 'VERIFIED',    registry: ['yoshlar'],           bajargan: 4,  daromad: 980_000 },
  { id: 'w10', nom: 'Ozoda Mirzayeva',    mahalla: 'm5', yosh: 36, jins: 'F', konikma: ['k1','k4'], trust: 79, selfEmployment: 'VERIFIED',    registry: ['ayollar','temir'],   bajargan: 13, daromad: 3_870_000 },
  { id: 'w11', nom: 'Aziza Tursunova',    mahalla: 'm1', yosh: 27, jins: 'F', konikma: ['k5'],     trust: 71, selfEmployment: 'VERIFIED',    registry: ['yoshlar','ayollar'], bajargan: 8,  daromad: 2_240_000 },
  { id: 'w12', nom: 'Doniyor Hakimov',    mahalla: 'm2', yosh: 33, jins: 'M', konikma: ['k4','k6'], trust: 66, selfEmployment: 'VERIFIED',    registry: ['temir'],             bajargan: 6,  daromad: 1_610_000 },
  { id: 'w13', nom: 'Sevara Abdullayeva',   mahalla: 'm1', yosh: 39, jins: 'F', konikma: ['k1','k3'], trust: 76, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 10, daromad: 2_980_000 },
  { id: 'w14', nom: 'Kamola Rustamova',     mahalla: 'm1', yosh: 44, jins: 'F', konikma: ['k1'],      trust: 84, selfEmployment: 'VERIFIED', registry: ['temir','ayollar'],   bajargan: 16, daromad: 4_760_000 },
  { id: 'w15', nom: 'Malika Ergasheva',     mahalla: 'm1', yosh: 28, jins: 'F', konikma: ['k5','k1'], trust: 69, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 6,  daromad: 1_820_000 },
  { id: 'w16', nom: 'Dildora Salimova',     mahalla: 'm1', yosh: 32, jins: 'F', konikma: ['k3','k4'], trust: 73, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 9,  daromad: 2_510_000 },
  { id: 'w17', nom: 'Hulkar Normatova',     mahalla: 'm1', yosh: 24, jins: 'F', konikma: ['k2'],      trust: 61, selfEmployment: 'VERIFIED', registry: ['yoshlar','ayollar'], bajargan: 5,  daromad: 1_340_000 },
  { id: 'w18', nom: 'Nargiza Qosimova',     mahalla: 'm2', yosh: 37, jins: 'F', konikma: ['k1','k5'], trust: 81, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 12, daromad: 3_640_000 },
  { id: 'w19', nom: 'Shohida Tolipova',     mahalla: 'm2', yosh: 30, jins: 'F', konikma: ['k2','k3'], trust: 70, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 8,  daromad: 2_180_000 },
  { id: 'w20', nom: 'Zebo Xolmatova',       mahalla: 'm2', yosh: 47, jins: 'F', konikma: ['k4'],      trust: 78, selfEmployment: 'VERIFIED', registry: ['temir','ayollar'],   bajargan: 11, daromad: 3_020_000 },
  { id: 'w21', nom: 'Feruza Sattorova',     mahalla: 'm3', yosh: 35, jins: 'F', konikma: ['k1'],      trust: 75, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 9,  daromad: 2_690_000 },
  { id: 'w22', nom: 'Madina Ibragimova',    mahalla: 'm3', yosh: 26, jins: 'F', konikma: ['k5'],      trust: 67, selfEmployment: 'VERIFIED', registry: ['yoshlar'],           bajargan: 6,  daromad: 1_710_000 },
  { id: 'w23', nom: 'Gulbahor Mamatova',    mahalla: 'm3', yosh: 42, jins: 'F', konikma: ['k3','k4'], trust: 80, selfEmployment: 'VERIFIED', registry: ['temir','ayollar'],   bajargan: 13, daromad: 3_450_000 },
  { id: 'w24', nom: 'Charos Nurmatova',     mahalla: 'm4', yosh: 33, jins: 'F', konikma: ['k1','k3'], trust: 72, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 8,  daromad: 2_240_000 },
  { id: 'w25', nom: 'Sitora Abdurahmonova', mahalla: 'm4', yosh: 25, jins: 'F', konikma: ['k2'],      trust: 64, selfEmployment: 'VERIFIED', registry: ['yoshlar'],           bajargan: 5,  daromad: 1_280_000 },
  { id: 'w26', nom: 'Laylo Qurbonova',      mahalla: 'm4', yosh: 40, jins: 'F', konikma: ['k4','k1'], trust: 77, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 10, daromad: 2_850_000 },
  { id: 'w27', nom: 'Nodira Bekmurodova',   mahalla: 'm5', yosh: 29, jins: 'F', konikma: ['k5','k3'], trust: 71, selfEmployment: 'VERIFIED', registry: ['ayollar'],           bajargan: 7,  daromad: 1_990_000 }
];

/* Kuryerlar */
const KURYERLAR = [
  { id: 'k-1', nom: 'Otabek Yusupov', mahalla: 'm2', transport: 'Yengil avtomobil', sigim: 400, trust: 80 },
  { id: 'k-2', nom: 'Farrux Ismoilov', mahalla: 'm4', transport: 'Damas',            sigim: 700, trust: 74 }
];

/* Yetkazib berish nuqtalari (3 pog'ona) */
const HUBLAR = [
  { id: 'h1', tur: 'VILOYAT',  nom: 'Toshkent viloyat omborxonasi', manzil: 'Nurafshon sh., Sanoat zonasi' },
  { id: 'h2', tur: 'TUMAN',    nom: 'Nurafshon shahar punkti',      manzil: "Nurafshon sh., Markaziy ko'cha 1" },
  { id: 'h3', tur: 'MAHALLA',  nom: "Yangi hayot FYG binosi",       manzil: "Yangi hayot MFY" },
  { id: 'h4', tur: 'MAHALLA',  nom: "Do'stlik FYG binosi",          manzil: "Do'stlik MFY" }
];

/* Komissiya siyosati — platforma shu hisobdan yashaydi */
const KOMISSIYA = { foiz: 5, minimal: 20_000 };

/* Auto-release: korxona javob bermasa necha kundan keyin avtomatik to'lov */
const AUTO_RELEASE_KUN = 5;

/* ---------------------------------------------------------------------------
   Vazifalar. Holatlar:
   DRAFT · PUBLISHED · ASSIGNED · IN_PROGRESS · SUBMITTED · UNDER_REVIEW
   · REWORK · ACCEPTED · PAID · DISPUTED · CANCELLED
   --------------------------------------------------------------------------- */
const VAZIFALAR = [
  {
    id: 't1', korxona: 'c1', nom: 'Bolalar futbolkasi — yeng tikish',
    tavsif: "Kesilgan bo'laklar tayyor. Yeng qismini overlok bilan tikish. Namuna va ip xomashyo bilan birga beriladi.",
    konikma: ['k1'], birlik: 'dona', narx: 2_500, miqdor: 400, muddatKun: 6,
    xomashyo: 'Korxonadan', pickup: 'h3', mahalla: 'm1',
    sifat: ['Chok tekis va uzluksiz', 'Ip rangi namunaga mos', "Ortiqcha ip qirqilgan"],
    fotoTalab: true, minTrust: 50, holat: 'PUBLISHED'
  },
  {
    id: 't2', korxona: 'c2', nom: 'Choy qutilarini yig\'ish va qadoqlash',
    tavsif: "Tayyor kartonni yig'ib, ichiga 25 dona paket joylash va yopishtirish.",
    konikma: ['k2'], birlik: 'dona', narx: 900, miqdor: 1200, muddatKun: 4,
    xomashyo: 'Korxonadan', pickup: 'h4', mahalla: 'm2',
    sifat: ['Quti shakli buzilmagan', 'Paket soni aniq 25 ta', 'Yopishtirish mustahkam'],
    fotoTalab: true, minTrust: 0, holat: 'PUBLISHED'
  },
  {
    id: 't3', korxona: 'c1', nom: 'Ko\'ylakka yorliq yopishtirish',
    tavsif: "Tayyor ko'ylaklarning bo'yin qismiga brend yorlig'ini tikish.",
    konikma: ['k3','k1'], birlik: 'dona', narx: 1_200, miqdor: 600, muddatKun: 5,
    xomashyo: 'Korxonadan', pickup: 'h3', mahalla: 'm1',
    sifat: ["Yorliq to'g'ri joyda", 'Tikuv ko\'rinmaydi'],
    fotoTalab: true, minTrust: 60, holat: 'PUBLISHED'
  },
  {
    id: 't4', korxona: 'c2', nom: 'Mahsulotni saralash va tarozida o\'lchash',
    tavsif: "Kelgan mahsulotni sifat bo'yicha saralab, 5 kg lik paketlarga bo'lish.",
    konikma: ['k4'], birlik: 'kg', narx: 700, miqdor: 800, muddatKun: 3,
    xomashyo: 'Korxonadan', pickup: 'h4', mahalla: 'm2',
    sifat: ['Vazn ±50 g aniqlikda', 'Sifatsiz mahsulot ajratilgan'],
    fotoTalab: false, minTrust: 0, holat: 'PUBLISHED'
  },
  /* --- allaqachon jarayonda bo'lgan vazifalar (demo uchun) --- */
  {
    id: 't5', korxona: 'c1', nom: 'Kashtali ro\'mol — naqsh tikish',
    tavsif: "Qo'lda kashta. Naqsh namunasi beriladi.",
    konikma: ['k5'], birlik: 'dona', narx: 14_000, miqdor: 40, muddatKun: 10,
    xomashyo: 'Korxonadan', pickup: 'h3', mahalla: 'm1',
    sifat: ['Naqsh namunaga mos', 'Orqa tomon toza'],
    fotoTalab: true, minTrust: 70, holat: 'UNDER_REVIEW',
    ijrochi: 'w6', topshirilgan: true
  },
  {
    id: 't6', korxona: 'c2', nom: 'Sovun qutilarini yig\'ish',
    tavsif: "Karton qutilarni yig'ish.",
    konikma: ['k2'], birlik: 'dona', narx: 800, miqdor: 900, muddatKun: 4,
    xomashyo: 'Korxonadan', pickup: 'h4', mahalla: 'm2',
    sifat: ['Quti shakli buzilmagan'],
    fotoTalab: true, minTrust: 0, holat: 'IN_PROGRESS',
    ijrochi: 'w3'
  },
  {
    id: 't7', korxona: 'c1', nom: 'Ayollar ko\'ylagi — chok tikish',
    tavsif: "Yon choklarni tikish.",
    konikma: ['k1'], birlik: 'dona', narx: 3_100, miqdor: 250, muddatKun: 7,
    xomashyo: 'Korxonadan', pickup: 'h3', mahalla: 'm1',
    sifat: ['Chok tekis', "O'lcham namunaga mos"],
    fotoTalab: true, minTrust: 60, holat: 'PAID',
    ijrochi: 'w4'
  },
  {
    id: 't8', korxona: 'c2', nom: 'Yorliq bosish va yopishtirish',
    tavsif: "Tayyor qutilarga shtrix-kod yorlig'ini yopishtirish.",
    konikma: ['k3'], birlik: 'dona', narx: 450, miqdor: 2000, muddatKun: 5,
    xomashyo: 'Korxonadan', pickup: 'h4', mahalla: 'm4',
    sifat: ['Yorliq tekis', 'Shtrix-kod o\'qiladi'],
    fotoTalab: true, minTrust: 0, holat: 'DISPUTED',
    ijrochi: 'w8'
  }
];

/* ---------------------------------------------------------------------------
   Dashboard uchun 3 oylik tarix (panel bo'sh ko'rinmasligi uchun)
   --------------------------------------------------------------------------- */
const TARIX = [
  { oy: 'Iyun',    royxat: 18, maqom: 11, vazifa: 14, bajarilgan: 12, tolov: 8_400_000,  registrChiqdi: 4,  kuryer: 1 },
  { oy: 'Iyul',    royxat: 34, maqom: 24, vazifa: 27, bajarilgan: 24, tolov: 17_900_000, registrChiqdi: 9,  kuryer: 2 },
  { oy: 'Avgust',  royxat: 52, maqom: 39, vazifa: 41, bajarilgan: 36, tolov: 28_300_000, registrChiqdi: 15, kuryer: 2 },
  { oy: 'Sentabr', royxat: 67, maqom: 48, vazifa: 56, bajarilgan: 47, tolov: 36_750_000, registrChiqdi: 21, kuryer: 3 }
];

/* Nizo (demo) */
const NIZOLAR = [
  {
    id: 'd1', vazifa: 't8', ochgan: 'w8', holat: 'OCHIQ',
    sabab: "Korxona 2000 donadan 180 tasini 'yorliq qiyshiq' deb rad etdi. Ijrochi rozi emas.",
    xabarlar: [
      { kim: 'w8',  matn: "Barcha yorliqlar namunaga qarab yopishtirildi. Rad etilgan qutilarning fotosi menda bor.", vaqt: '2 kun oldin' },
      { kim: 'c2',  matn: "180 ta qutida yorliq 3 mm dan ko'proq qiyshaygan. Mijoz qabul qilmaydi.", vaqt: '1 kun oldin' },
      { kim: 'w8',  matn: "Sifat mezonida aniq chegara ko'rsatilmagan edi.", vaqt: '22 soat oldin' }
    ]
  }
];
