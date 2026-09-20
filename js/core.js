/* =============================================================================
   CORE — sof mantiq: holat mashinasi, eskrou, komissiya, ishonch bali
   Bu qatlam UI va saqlashdan mustaqil.
   ============================================================================= */

/* --------------------------------------------------------------- holatlar */

const HOLAT_MATN = {
  DRAFT:        { matn: 'Qoralama',           rang: 'kul' },
  PUBLISHED:    { matn: "E'lon qilingan",     rang: 'kok' },
  ASSIGNED:     { matn: 'Biriktirilgan',      rang: 'kok' },
  IN_PROGRESS:  { matn: 'Bajarilmoqda',       rang: 'sariq' },
  SUBMITTED:    { matn: 'Topshirilgan',       rang: 'sariq' },
  UNDER_REVIEW: { matn: 'Tekshiruvda',        rang: 'sariq' },
  REWORK:       { matn: 'Qayta ishlashga',    rang: 'qizil' },
  ACCEPTED:     { matn: 'Qabul qilindi',      rang: 'yashil' },
  PAID:         { matn: "To'landi",           rang: 'yashil' },
  DISPUTED:     { matn: 'Nizoda',             rang: 'qizil' },
  REJECTED:     { matn: 'Rad etildi',         rang: 'qizil' },
  CANCELLED:    { matn: 'Bekor qilindi',      rang: 'kul' }
};

const ESKROU_MATN = {
  PENDING:  'Kutilmoqda',
  FUNDED:   "Pul kiritildi",
  HELD:     'Eskrouda saqlanmoqda',
  RELEASED: "Ijrochiga o'tkazildi",
  REFUNDED: 'Korxonaga qaytarildi',
  SPLIT:    "Bo'lib berildi"
};

/* Deklarativ o'tish jadvali: kim huquqli + qanday shart.
   Holatni to'g'ridan-to'g'ri o'zgartirish taqiqlangan — faqat shu orqali. */
const OTISHLAR = {
  DRAFT: {
    PUBLISHED: {
      rol: ['korxona'],
      shart: (v) => v.eskrou && v.eskrou.holat === 'HELD',
      xato: "E'lon qilish uchun avval eskrouga pul kiritilishi kerak"
    }
  },
  PUBLISHED: {
    ASSIGNED: {
      rol: ['korxona'],
      shart: (v, ctx) => ctx.ijrochi && ctx.ijrochi.selfEmployment === 'VERIFIED',
      xato: "Ijrochi \"o'zini o'zi band qilgan\" maqomiga ega bo'lishi shart"
    },
    CANCELLED: { rol: ['korxona'], shart: () => true }
  },
  ASSIGNED: {
    IN_PROGRESS: { rol: ['fuqaro'], shart: () => true },
    CANCELLED:   { rol: ['korxona'], shart: () => true }
  },
  IN_PROGRESS: {
    SUBMITTED: {
      rol: ['fuqaro'],
      shart: (v, ctx) => !v.fotoTalab || (ctx.foto && ctx.foto.length > 0),
      xato: 'Bu vazifa uchun foto dalil majburiy'
    }
  },
  SUBMITTED:    { UNDER_REVIEW: { rol: ['korxona', 'tizim'], shart: () => true } },
  UNDER_REVIEW: {
    ACCEPTED: { rol: ['korxona', 'tizim'], shart: () => true },
    REWORK:   {
      rol: ['korxona'],
      shart: (v) => (v.qaytaIshlash || 0) < 2,
      xato: 'Qayta ishlash chegarasi (2 marta) tugadi — nizo ochiladi'
    },
    DISPUTED: { rol: ['korxona', 'fuqaro'], shart: () => true }
  },
  REWORK:   { IN_PROGRESS: { rol: ['fuqaro'], shart: () => true } },
  ACCEPTED: { PAID: { rol: ['tizim'], shart: () => true } },
  DISPUTED: {
    ACCEPTED:  { rol: ['moderator'], shart: () => true },
    CANCELLED: { rol: ['moderator'], shart: () => true },
    PAID:      { rol: ['moderator'], shart: () => true }
  }
};

/* Yagona kirish nuqtasi. Ruxsatni va shartni tekshiradi, audit yozadi. */
function otish(vazifa, yangiHolat, rol, ctx) {
  ctx = ctx || {};
  const joriy = vazifa.holat;
  const qoida = (OTISHLAR[joriy] || {})[yangiHolat];

  if (!qoida) {
    return { ok: false, xato: `"${HOLAT_MATN[joriy].matn}" holatidan "${HOLAT_MATN[yangiHolat].matn}" ga o'tib bo'lmaydi` };
  }
  if (qoida.rol.indexOf(rol) === -1) {
    return { ok: false, xato: `Bu amal uchun sizda ruxsat yo'q (${rol})` };
  }
  if (!qoida.shart(vazifa, ctx)) {
    return { ok: false, xato: qoida.xato || 'Shart bajarilmadi' };
  }

  const eski = vazifa.holat;
  vazifa.holat = yangiHolat;
  return { ok: true, eski, yangi: yangiHolat };
}

/* -------------------------------------------------------------------- pul */

function jamiSumma(v) { return v.narx * v.miqdor; }

function komissiyaHisobla(summa) {
  const foizdan = Math.round(summa * KOMISSIYA.foiz / 100);
  return Math.max(foizdan, KOMISSIYA.minimal);
}

/* Double-entry: har amal ikki yozuv — debit va kredit. Hech qachon o'chirilmaydi. */
function ledgerYoz(store, tur, yozuvlar, izoh) {
  const tranzaksiya = {
    id: 'tx' + (store.ledger.length + 1),
    tur, izoh,
    vaqt: Date.now(),
    yozuvlar
  };
  const jami = yozuvlar.reduce((s, y) => s + (y.yonalish === 'DEBIT' ? y.summa : -y.summa), 0);
  if (jami !== 0) {
    console.warn('Ledger muvozanati buzildi:', tranzaksiya);
  }
  store.ledger.push(tranzaksiya);
  return tranzaksiya;
}

/* Eskrou hayot sikli */
const Eskrou = {
  yarat(v) {
    const summa = jamiSumma(v);
    return {
      holat: 'PENDING', summa,
      komissiya: komissiyaHisobla(summa),
      ozodQilingan: 0, qaytarilgan: 0,
      autoReleaseKun: AUTO_RELEASE_KUN
    };
  },

  pulKirit(store, v) {
    const e = v.eskrou;
    if (e.holat !== 'PENDING') return { ok: false, xato: 'Eskrou allaqachon faollashtirilgan' };
    const korxona = store.korxonalar.find(c => c.id === v.korxona);
    if (!korxona) return { ok: false, xato: 'Korxona topilmadi' };
    if (korxona.balans < e.summa) return { ok: false, xato: 'Korxona hisobida mablag\' yetarli emas' };

    korxona.balans -= e.summa;
    e.holat = 'HELD';
    ledgerYoz(store, 'ESKROU_KIRIM', [
      { hisob: 'korxona:' + korxona.id, yonalish: 'CREDIT', summa: e.summa },
      { hisob: 'eskrou',                yonalish: 'DEBIT',  summa: e.summa }
    ], `"${v.nom}" uchun eskrou`);
    return { ok: true };
  },

  ozodQil(store, v, ulushFoiz) {
    const e = v.eskrou;
    if (e.holat !== 'HELD') return { ok: false, xato: 'Eskrou HELD holatida emas' };

    const ulush = ulushFoiz === undefined ? 100 : ulushFoiz;
    const ijrochiga = Math.round(e.summa * ulush / 100);
    const qaytadi   = e.summa - ijrochiga;
    const komissiya = ijrochiga > 0 ? komissiyaHisobla(ijrochiga) : 0;
    const sof       = ijrochiga - komissiya;

    const yozuvlar = [{ hisob: 'eskrou', yonalish: 'CREDIT', summa: e.summa }];
    if (sof > 0)       yozuvlar.push({ hisob: 'fuqaro:' + v.ijrochi, yonalish: 'DEBIT', summa: sof });
    if (komissiya > 0) yozuvlar.push({ hisob: 'platforma_komissiya', yonalish: 'DEBIT', summa: komissiya });
    if (qaytadi > 0)   yozuvlar.push({ hisob: 'korxona:' + v.korxona, yonalish: 'DEBIT', summa: qaytadi });

    ledgerYoz(store, ulush === 100 ? 'ESKROU_OZOD' : 'ESKROU_BOLINDI', yozuvlar,
      `"${v.nom}" — ijrochiga ${ulush}%`);

    e.holat = ulush === 100 ? 'RELEASED' : 'SPLIT';
    e.ozodQilingan = ijrochiga;
    e.qaytarilgan = qaytadi;
    e.sof = sof;
    e.komissiyaOlingan = komissiya;

    if (qaytadi > 0) {
      const korxona = store.korxonalar.find(c => c.id === v.korxona);
      if (korxona) korxona.balans += qaytadi;
    }
    store.komissiyaJami = (store.komissiyaJami || 0) + komissiya;
    return { ok: true, ijrochiga: sof, komissiya, qaytadi };
  },

  qaytar(store, v) {
    const e = v.eskrou;
    if (e.holat !== 'HELD') return { ok: false, xato: 'Eskrou HELD holatida emas' };
    const korxona = store.korxonalar.find(c => c.id === v.korxona);
    if (!korxona) return { ok: false, xato: 'Korxona topilmadi' };
    korxona.balans += e.summa;
    e.holat = 'REFUNDED';
    e.qaytarilgan = e.summa;
    ledgerYoz(store, 'ESKROU_QAYTDI', [
      { hisob: 'eskrou',                yonalish: 'CREDIT', summa: e.summa },
      { hisob: 'korxona:' + korxona.id, yonalish: 'DEBIT',  summa: e.summa }
    ], `"${v.nom}" — bekor qilindi`);
    return { ok: true };
  }
};

/* ------------------------------------------------------------ ishonch bali */

function trustHisobla(f, store) {
  const komponentlar = [
    { nom: 'Bajarilgan vazifalar', ball: Math.min(25, f.bajargan * 2),                  maks: 25 },
    { nom: 'Muddatga rioya',       ball: f.bajargan > 0 ? 20 : 10,                       maks: 20 },
    { nom: 'Shaxs tasdiqlangan',   ball: f.selfEmployment === 'VERIFIED' ? 20 : 0,       maks: 20 },
    { nom: "Qayta ishlash kamligi", ball: 15,                                            maks: 15 },
    { nom: 'Nizosiz ishlash',      ball: 10,                                             maks: 10 },
    { nom: 'Faoliyat davomiyligi', ball: Math.min(10, Math.floor(f.bajargan / 2)),       maks: 10 }
  ];
  const jami = komponentlar.reduce((s, k) => s + k.ball, 0);
  return { ball: Math.min(100, jami), komponentlar };
}

/* Cheklovlar — past ishonch bali avtomatik cheklanadi */
function cheklov(trust) {
  if (trust < 40) return { maksVazifa: 1, maksSumma: 300_000,   izoh: 'Past ishonch bali — cheklangan rejim' };
  if (trust < 65) return { maksVazifa: 2, maksSumma: 1_500_000, izoh: "O'rtacha ishonch bali" };
  return { maksVazifa: 5, maksSumma: 99_000_000, izoh: 'Yuqori ishonch bali — cheklov yo\'q' };
}

/* --------------------------------------------------------- moslik (matching) */

function moslikBali(vazifa, fuqaro) {
  const qismlar = [];

  const kerakli = vazifa.konikma || [];
  const bor = kerakli.filter(k => fuqaro.konikma.indexOf(k) !== -1).length;
  const konikmaBall = kerakli.length ? bor / kerakli.length : 1;
  qismlar.push({ nom: 'Ko\'nikma mosligi', qiymat: konikmaBall, ogirlik: 0.40 });

  const masofaBall = vazifa.mahalla === fuqaro.mahalla ? 1 : 0.4;
  qismlar.push({ nom: 'Mahalla yaqinligi', qiymat: masofaBall, ogirlik: 0.25 });

  const trustBall = Math.min(1, fuqaro.trust / 100);
  qismlar.push({ nom: 'Ishonch bali', qiymat: trustBall, ogirlik: 0.20 });

  const tajribaBall = Math.min(1, fuqaro.bajargan / 10);
  qismlar.push({ nom: 'Tajriba', qiymat: tajribaBall, ogirlik: 0.15 });

  const jami = qismlar.reduce((s, q) => s + q.qiymat * q.ogirlik, 0);
  return { ball: Math.round(jami * 100), qismlar };
}

/* ------------------------------------------------------------- k-anonimlik */

/* Boshqarma uchun: 5 tadan kam yozuvli kesim yashiriladi */
const K_ANONIM = 5;
function kAnonim(son) {
  return son < K_ANONIM && son > 0 ? null : son;
}
