# BANDLIK PLATFORMASI — AI KODLASH PROMPTLARI

> Manba: `Bandlik_Platformasi_Taqdimot (3).pptx` (13 slayd) asosida tuzilgan.
> Bu hujjat loyihaning **manba brifi** (source of truth). Har bosqichda
> shu yerdagi talablarga qaytib tekshiriladi.
>
> Ishlatish tartibi: MASTER PROMPT → tasdiqlash → bosqichlar birma-bir (1 → 11).
> Har bosqichda faqat shu modul yoziladi — bitta so'rovda hamma narsa emas.

---

## 1. MASTER PROMPT

Sen tajribali full-stack muhandis va solution architektsan. Biz O'zbekiston uchun
"Hududiy bandlik va ishlab chiqarish hamkorlik platformasi"ni noldan quramiz.
Ishchi nomi: HUNAR (nomni keyin o'zgartirsak bo'ladi).

Bu xabar — loyihaning to'liq konteksti. Hozircha KOD YOZMA. Avval:
1) Kontekstni tushunganingni 10 qatorda tasdiqla,
2) Taklif qilingan arxitektura va papka tuzilmasini chiqar,
3) Prisma schema (barcha modellar) loyihasini chiqar,
4) Bosqichlar ro'yxatini (roadmap) chiqar.

Men "OK, 1-bosqichni boshla" deganimdan keyingina kod yozishni boshlaysan.

### A. MUAMMO (nima uchun bu platforma kerak)

Ikki tomonlama muammo, bitta yechim:

**1) Korxonalarda ishchi kuchi tanqisligi**
- To'qimachilik, qadoqlash, savdo korxonalari doimiy shtat uchun yotoqxona,
  ovqat va ijtimoiy sharoit ta'minlashga majbur.
- Bu xarajat kichik va o'rta korxona uchun og'ir — ishchi yollash sekinlashadi.
- Natija: buyurtmalar kechikadi, quvvat to'liq ishlamaydi.

**2) Band bo'lmagan, ammo hunarli fuqarolar**
- Mahallabay/xonadonbay tizimi orqali aniqlangan uy bekalari, yoshlar,
  tomorqa egalari rasman ishsiz.
- Ular doimiy fabrika ishiga chiqa olmaydi, lekin uyida qism-qism ish bajaradi.
- "Temir daftar", "Ayollar daftari", "Yoshlar daftari"da ro'yxatga olingan.

**Yechim:** korxona va fuqaroni bevosita bog'laydigan raqamli platforma.
Asosiy sikl: Vazifa e'lon qilinadi → Fuqaro javob beradi → Sifat tasdiqlanadi
→ Kafolatlangan (eskrou) to'lov amalga oshadi.

### B. HUQUQIY ASOS VA INTEGRATSIYA

- Platforma PQ-4742-son qaror asosidagi "O'zini o'zi band qilish" tizimiga
  tayanadi — yangi byurokratiya yaratilmaydi.
- Fuqaro birinchi buyurtmadan OLDIN shaxsiy kabinet orqali "o'zini o'zi band
  qilgan shaxs" maqomini oladi.
- Bu maqom: (a) daromaddan jismoniy shaxs daromad solig'i olinmaydi,
  (b) fuqaro rasman "band" hisoblanadi va ishsizlar ro'yxatidan chiqadi,
  (c) raqamli mehnat tarixi (reyting) shakllanadi.
- Demak platformada `SelfEmploymentRegistration` bosqichi MAJBURIY gate bo'lishi
  kerak: maqom olinmaguncha fuqaro to'lovli vazifa qabul qila olmaydi.

### C. QAMROV (universal, lekin pilot tor)

Platforma bandlikka aloqador istalgan tashkilot uchun ochiq. Sohalar:

1. Ishlab chiqarish sexlari
2. Umumiy ovqatlanish va mehmondo'stlik
3. Savdo va chakana tarmoqlar
4. Qishloq xo'jaligi va chorvachilik
5. Qurilish va ta'mirlash ishlari
6. Transport va yetkazib berish
7. Korporativ va ofis xizmatlari
8. IT va raqamli xizmatlar

**Birinchi bosqichda 4 ta pilot yo'nalish (MVP shu 4 tasiga qaratilsin):**

- **P1. Ishlab chiqarish autsorsingi** — to'qimachilik/qadoqlash vazifalarini
  kichik qismlarga bo'lib, uy sharoitida bajartirish (piecework).
- **P2. B2B savdo bozori** — do'konni bir nechta ta'minotchi bilan bog'lash,
  ochiq narx raqobati (RFQ → bir necha taklif → tanlov).
- **P3. Qishloq xo'jaligi va chorvachilik** — xaridor talabini yer/chorva egalari
  bilan moslashtirish, kafolatlangan xarid shartnomasi.
- **P4. Bandlik va ijtimoiy himoya** — "o'zini o'zi band qilish"ga ulash,
  ishsizlik statistikasini kamaytirish, boshqarma uchun hisobot.

### D. PILOT LOYIHA PARAMETRLARI

- **Hudud:** Nurafshon shahri, Toshkent viloyati. 1 ta mahalla fuqarolar
  yig'inidan boshlanadi.
- **Muddat:** 3 oy.
- **Maqsad:** 50–100 ro'yxatdan o'tgan fuqaro, 2–3 hamkor korxona
  (to'qimachilik/qadoqlash).
- **Moliyalashtirish:** davlat byudjetidan mablag' talab qilinmaydi. Platforma
  korxonalardan olinadigan kichik komissiya hisobidan o'zini moliyalashtiradi.
  => Kodda `CommissionPolicy` (foiz + minimal summa, soha bo'yicha sozlanadigan).

**Amalga oshirish grafigi:**

| Muddat | Bosqich | Mazmun |
|---|---|---|
| 1–2-hafta | Kelishuv | Boshqarma bilan hamkorlik, korxona/fuqaro ro'yxati |
| 3–4-hafta | Ishga tushirish | Sinov platformasi + o'zini o'zi band qilish ro'yxati |
| 2-oy | Amaliy ish | Birinchi buyurtmalar, sifat nazorati, to'lov sinovi |
| 3-oy | Kengaytirish | Natijalarni jamlash, shahar/tuman miqyosiga taklif |

### E. FOYDALANUVCHI ROLLARI (RBAC)

| Rol | Vazifasi |
|---|---|
| `WORKER` | Fuqaro / ijrochi (o'zini o'zi band qilgan shaxs) |
| `COMPANY_OWNER` | Korxona egasi/rahbari |
| `COMPANY_MANAGER` | Korxona xodimi (vazifa e'lon qiladi, sifat qabul qiladi) |
| `COURIER` | Kuryer (u ham "o'zini o'zi band qilish" orqali ro'yxatda) |
| `HUB_OPERATOR` | Ombor/punkt operatori (viloyat, tuman, mahalla) |
| `MAHALLA_COORDINATOR` | Mahalla koordinatori: fuqarolarni ro'yxatga oladi, tasdiqlaydi |
| `DEPT_ANALYST` | Boshqarma tahlilchisi (faqat o'qish + hisobot eksporti) |
| `DEPT_ADMIN` | Boshqarma admini (hudud kesimida to'liq monitoring) |
| `MODERATOR` | Nizolar, shikoyatlar, qora ro'yxat |
| `SUPER_ADMIN` | Tizim admini |

Har bir endpoint uchun aniq RBAC matritsasi yoziladi. **Boshqarma rollari HECH
QACHON to'lov yoki shaxsiy hujjat skanini ko'ra olmaydi — faqat agregat va maqom.**

### F. TEXNIK STEK

- Monorepo: pnpm workspaces + Turborepo
- Web: Next.js 15 (App Router) + TypeScript (strict) + Tailwind + shadcn/ui
- API: Next.js Route Handlers (REST, OpenAPI hujjat bilan). MVP uchun
  Next.js fullstack yetarli
- DB: PostgreSQL 16 + Prisma ORM (migratsiyalar bilan)
- Cache/queue: Redis + BullMQ (SMS, hisobot, marshrut hisobi, eskrou timeout)
- Fayl: S3-mos (MinIO local) — hujjat, sifat foto, dalillar
- Validatsiya: Zod (har bir input uchun), xatolik formati RFC 7807
- Auth: telefon raqam + SMS OTP (asosiy), OneID SSO (ixtiyoriy), JWT + refresh
- i18n: next-intl — uz-Latn (default), uz-Cyrl, ru. Barcha UI matni tarjima
  fayllarida, **kodda hardcode matn bo'lmasin**
- Mobil: keyingi bosqichda Expo (React Native), API bir xil
- Test: Vitest (unit) + Playwright (e2e) + Prisma test DB
- Deploy: Docker Compose (dev) + GitHub Actions CI

**Nofunksional talablar:**

- **Mobile-first.** Foydalanuvchining katta qismi arzon Android telefonda, sekin
  internetda. Sahifa og'irligi kichik, rasm lazy, offline-tolerant formalar.
- **Past raqamli savodxonlik** hisobga olinsin: katta tugmalar, ikonka + matn,
  sodda til, har bir qadamda "keyingi qadam nima" ko'rsatilsin.
- **SMS fallback:** push kelmasa SMS. Telegram bot — ikkinchi kanal.
- Barcha ma'lumot O'zbekiston hududida saqlanadi (data residency).
- "Shaxsga doir ma'lumotlar to'g'risida"gi qonun talablariga mos: rozilik
  (consent) yozuvi, maqsad cheklovi, saqlash muddati, o'chirish so'rovi.

### G. MA'LUMOTLAR MODELI (asosiy entitilar)

**Identity/profil:** `User`, `Session`, `OtpCode`, `Device`, `WorkerProfile`,
`CompanyProfile`, `CourierProfile`, `Region`, `District`, `Mahalla`, `Skill`,
`WorkerSkill`

**Maqom va tekshiruv:** `KycVerification`, `KybVerification`, `LivenessCheck`,
`SelfEmploymentRegistration`, `RegistryFlag`, `ConsentRecord`

**Ish oqimi (P1):** `Task`, `TaskBatch`, `TaskItem`, `Application`, `Assignment`,
`Contract`, `Submission`, `QcReview`, `Dispute`, `DisputeMessage`, `DisputeDecision`

**P2 — B2B:** `B2bProduct`, `Rfq`, `Quote`, `PurchaseOrder`, `Invoice`

**P3 — Agro:** `AgroListing`, `AgroDemand`, `AgroContract`, `HarvestBatch`

**Pul:** `Wallet`, `LedgerEntry` (double-entry), `EscrowHold`, `Payout`,
`Transaction`, `CommissionPolicy`, `CommissionCharge`, `PaymentProviderEvent`

**Ishonch:** `Rating`, `TrustScore`, `Blacklist`, `FraudSignal`, `Appeal`

**Logistika:** `Hub`, `Shipment`, `ShipmentLeg`, `Route`, `RouteStop`, `Handover`

**Tizim:** `Notification`, `NotificationTemplate`, `AuditLog`, `Setting`,
`ReportSnapshot`, `FileObject`

### H. HOLAT MASHINALARI (qat'iy amal qilinadi)

**Task:**
```
DRAFT → PUBLISHED → ASSIGNED → IN_PROGRESS → SUBMITTED → UNDER_REVIEW
      → ACCEPTED → PAID
UNDER_REVIEW → REWORK → IN_PROGRESS            (maksimum 2 marta)
UNDER_REVIEW → REJECTED → DISPUTED → RESOLVED_WORKER | RESOLVED_COMPANY | SPLIT
PUBLISHED/ASSIGNED → CANCELLED                 (sabab + jarima siyosati bilan)
```

**Escrow:**
```
PENDING → FUNDED → HELD → RELEASED | REFUNDED | SPLIT
```
Auto-release: korxona qabul qilmasa N kundan keyin avtomatik ijrochi foydasiga.
N — sozlanadigan, default 5 kun.

**Shipment:**
```
CREATED → PICKED_UP → AT_MAHALLA_POINT → AT_DISTRICT_HUB → AT_REGION_HUB
        → OUT_FOR_DELIVERY → DELIVERED → CONFIRMED
```
Har o'tish QR skan + vaqt + joylashuv + mas'ul shaxs bilan yoziladi.

**KYC / SelfEmployment:**
```
NOT_STARTED → PENDING → VERIFIED | REJECTED → EXPIRED
```

Har bir o'tish uchun: kim huquqli, qanday shart, qanday audit yozuvi — alohida
`transitions.ts` faylida deklarativ tasvirlanadi. **Holatni to'g'ridan-to'g'ri
UPDATE qilish taqiqlanadi**, faqat service qatlami orqali.

### I. XAVFSIZLIK VA ISHONCH TIZIMI (6 qatlam)

1. **Davlat bazasi orqali shaxsni tasdiqlash** — ro'yxatdan o'tishda ma'lumot
   Soliq qo'mitasi / IIV bazasidan avtomatik tekshiriladi.
2. **Yuz orqali jonli tekshirish (liveness)** — katta buyurtma qabul qilishda
   yoki pul yechishda qayta biometrik tasdiqlash. Maqsad: hisob "ijarasi"ga qarshi.
3. **Kafolatlangan to'lov (eskrou)** — pul oldindan platformada saqlanadi, faqat
   sifat tasdiqlangach ijrochiga o'tkaziladi.
4. **Ishonch bali / reyting** — har bitim asosida shakllanadi; past ko'rsatkichli
   hisoblar avtomatik cheklanadi (limit, moderatsiya, yangi vazifa taqiqi).
5. **Qora ro'yxat shaxs darajasida** — blokirovka PINFL (JSHSHIR)
   identifikatoriga bog'lanadi, yangi hisob bilan qaytib bo'lmaydi. PINFL ochiq
   saqlanmaydi: `pinflHash = HMAC-SHA256(pinfl, SERVER_SECRET)` — unique indeks.
6. **Korxonani tekshirish (KYB)** — e'lon beruvchi tashkilotning yuridik maqomi
   Soliq bazasidan tasdiqlanadi (soxta korxonaga qarshi).

**Qo'shimcha texnik himoya:**

- 1 PINFL = 1 faol hisob. Qurilma barmoq izi (device fingerprint) yoziladi.
- OTP: rate-limit (IP + telefon), 5 urinish, 15 daqiqa blok, kod hash bilan saqlanadi.
- Barcha pul operatsiyalari idempotent (`Idempotency-Key` header).
- `AuditLog`: kim, qachon, nima, eski→yangi qiymat. Append-only.
- Nozik maydonlar (passport seriya, PINFL, karta) — application-level encryption.
- OWASP Top 10: parametrlashtirilgan so'rovlar, CSRF, CSP, rate limit, fayl
  yuklashda MIME+hajm+antivirus tekshiruvi, SSRF himoyasi.
- Fraud qoidalari dvigateli: bir IP/qurilmadan ko'p hisob, g'ayritabiiy tez
  qabul-topshirish, bir xil foto takrori (perceptual hash), narxdan chetlanish.

### J. LOGISTIKA (uch pog'onali tarmoq)

```
Viloyat markazi      → yirik tarqatish omborxonasi
Tuman/shahar markazi → kichik yig'ish-tarqatish punkti
Mahalla nuqtasi      → MAVJUD bino (alohida qurilish shart emas)
```

- **Birlashtirilgan marshrut:** bir hududdagi barcha buyurtmalar (B2B ham,
  qishloq xo'jaligi ham, xomashyo/tayyor mahsulot ham) BITTA yo'nalishga
  birlashtiriladi → xarajat kamayadi. `RouteBatchingService`: hudud + sana +
  sig'im bo'yicha guruhlash, oddiy nearest-neighbour marshrut.
- **Kuryerlik — yangi bandlik manbai:** mahalliy fuqaro "o'zini o'zi band qilish"
  orqali kuryer sifatida ro'yxatdan o'tadi, tashqi kompaniya shart emas. Kuryer
  ham eskrou orqali haq oladi, uning ham reytingi bor.
- Har topshirish nuqtasida QR skan + foto + vaqt = `Handover` yozuvi.

### K. BOSHQARMA DASHBOARDI

"Toshkent viloyati Kambag'allikni qisqartirish va bandlik boshqarmasi,
Nurafshon shahar bo'limi" uchun real vaqtli panel.

**Kutilayotgan natija:**
- "Temir daftar" / "Ayollar daftari" / "Yoshlar daftari"dagi fuqarolar sonini
  qisqartirish → panelda: nechta fuqaro ro'yxatdan chiqdi (oy kesimida).
- Norasmiy uy mehnatini rasmiylashtirish → "o'zini o'zi band qilgan" maqomini
  olganlar soni, ularning jami rasmiy daromadi.
- Har oy aniq raqamli hisobot → PDF/XLSX eksport, avtomatik oylik snapshot.
- KSB korxonalarning barqaror ishlashiga ko'maklashish → faol korxona soni,
  e'lon qilingan/bajarilgan vazifa nisbati (fill rate).

**KPI'lar** (mahalla / tuman / soha / jins / yosh kesimida filtrlanadi):
ro'yxatdan o'tgan fuqaro · maqom olgan fuqaro · faol ijrochi (30 kun) · e'lon
qilingan vazifa · bajarilgan vazifa · o'rtacha bajarilish vaqti · jami to'langan
summa · ijrochining o'rtacha oylik daromadi · faol korxona · vazifa fill rate ·
nizo ulushi · registrdan chiqqanlar · kuryer soni va yetkazishlar

Grafiklar: vaqt qatori (oylik), mahalla bo'yicha reyting jadvali, soha bo'yicha
taqsimot. Eksport: XLSX + PDF (rasmiy blank formatida).

**Maxfiylik:** boshqarma foydalanuvchisi shaxsiy ma'lumotni ko'rmaydi — faqat
agregat; 5 tadan kam yozuvli kesim yashiriladi (k-anonimlik). Har eksport
`AuditLog`da.

### L. TASHQI INTEGRATSIYALAR

Har biri uchun `packages/integrations/<name>` ichida: `interface` +
`MockProvider` (MVP uchun ishlaydigan) + `RealProvider` (stub). ENV flag orqali
almashadi. **Hech qanday integratsiya yo'qligi MVPni to'xtatmasin.**

| Adapter | Vazifasi |
|---|---|
| `IdentityProvider` | OneID / IIV passport tekshiruvi |
| `TaxProvider` | Soliq qo'mitasi: STIR, "o'zini o'zi band qilish" maqomi, daromad |
| `LivenessProvider` | Yuz orqali jonli tekshirish |
| `PaymentProvider` | Payme / Click / Uzum (to'lov qabul qilish + payout) |
| `SmsProvider` | Eskiz.uz / Play Mobile |
| `TelegramBot` | Bildirishnoma + oddiy vazifa qabul qilish |
| `RegistryProvider` | "Temir daftar" / "ayollar" / "yoshlar" ro'yxati importi |

> **MUHIM OGOHLANTIRISH (kodga izoh sifatida yoziladi):**
> Haqiqiy eskrou (uchinchi shaxs pulini ushlab turish) O'zbekistonda bank yoki
> to'lov tashkiloti litsenziyasini talab qiladi. Shuning uchun pul harakati
> `LedgerService` (double-entry) orqali abstraksiya qilinadi; MVPda "virtual
> hamyon + mock provider", ishlab chiqarishda esa hamkor bank/PSP hisobi
> ulanadi. Kodda bu chegara aniq ajratilgan bo'lsin.

### M. KELAJAK STRATEGIYASI

Xitoy tajribasi ("Sharq–G'arb hamkorligi", 1996-yildan): rivojlangan sharqiy
provinsiyalar kambag'al g'arbiy provinsiyalar bilan yagona "chiqish hududi –
kirish hududi" axborot tizimi orqali bog'langan (5 mln+ qishloq ishchisi band
bo'ldi, ~800 qo'shma sanoat zonasi, 30 yil sinovdan o'tgan tizim).

Bizning yo'l:
- **1-bosqich:** Nurafshon pilot (to'qimachilik/qadoqlash, 3 oy).
- **2-bosqich:** respublika miqyosi — yagona ma'lumotlar bazasi asosida, masalan
  Farg'ona vodiysining ortiqcha ishchi kuchini Toshkent/Sirdaryo sanoat zonalari
  bilan bog'lash.

**Arxitektura talabi:** markazlashgan, ko'p-hududli (multi-region tenancy).
Boshidanoq har bir yozuvda `regionId/districtId/mahallaId` bo'lsin, RBAC hudud
bo'yicha cheklansin, va "ortiqcha ishchi kuchi hududi ↔ talab hududi"ni
moslashtirish uchun `LaborSupplyDemandIndex` (hudud × soha × ko'nikma kesimida
taklif/talab balansi) modeli oldindan ko'zda tutilsin.

### N. ISH USLUBI TALABLARI

- Har bosqichda: to'liq ishlaydigan kod, migratsiya, seed va qisqa test.
- TypeScript strict, `any` ishlatilmaydi. Har service uchun Zod sxema.
- Biznes mantiq `src/server/services/*` da, Route Handler faqat yupqa qatlam.
- Fayl yozishdan oldin qaysi fayllar yaratilayotgani ro'yxat qilinadi.
- Taxmin qilish kerak bo'lsa — taxmin ochiq yoziladi, ish to'xtamaydi.
- Har javob oxirida: "Keyingi qadam" va tekshirish buyruqlari.
- UI matnlari faqat o'zbek tilida (lotin), tarjima fayli orqali.
- Seed ma'lumot real bo'lsin: Nurafshon shahri mahallalari, to'qimachilik/
  qadoqlash vazifa namunalari, 2 ta test korxona, 10 ta test fuqaro.

---

## 2. BOSQICH PROMPTLARI

Master prompt tasdiqlangandan keyin birma-bir ishlatiladi.

### Bosqich 1 — Skelet, auth, rollar

Yarat:
- Monorepo skeleti (pnpm + Turborepo): `apps/web`, `packages/db`, `packages/ui`,
  `packages/integrations`, `packages/config`
- Docker Compose: postgres, redis, minio
- Prisma init + migratsiya: `User`, `Session`, `OtpCode`, `Device`, `Region`,
  `District`, `Mahalla`, Role/Permission (enum + RBAC matritsa)
- Auth: telefon + SMS OTP (MockSmsProvider), JWT access/refresh, sessiya
  boshqaruvi, rate-limit (OTP: 5 urinish / 15 daqiqa blok, kod hash bilan saqlanadi)
- RBAC middleware + `requireRole()` helper + ruxsat matritsasi jadvali
- next-intl sozlamasi (uz-Latn default, uz-Cyrl, ru), barcha matn tarjima faylida
- Asosiy layout: mobile-first, katta tugmalar, shadcn/ui
- Seed: Toshkent viloyati → Nurafshon shahri → 5 ta mahalla + super admin

Oxirida: `pnpm dev` bilan ishga tushirish va OTP orqali kirishni qanday sinash
kerakligini yozib ber.

### Bosqich 2 — Profillar, KYC/KYB, "O'zini o'zi band qilish"

- `WorkerProfile`: ko'nikmalar (`Skill` katalogi), daraja, haftalik bo'sh vaqt,
  uy sharoiti (tikuv mashinasi, joy hajmi va h.k.), maksimal yuk, mahalla
- `CompanyProfile`: STIR/INN, yuridik manzil, soha, mas'ul shaxs
- `CourierProfile`: transport turi, sig'im, xizmat hududi
- `KycVerification`: passport/ID + PINFL. PINFL OCHIQ SAQLANMAYDI —
  `pinflHash = HMAC-SHA256(pinfl, SECRET)` unique indeks. Provider interfeysi
  + `MockIdentityProvider` (test PINFL'lar ro'yxati bilan)
- `KybVerification`: `MockTaxProvider` orqali STIR tekshiruvi
- `SelfEmploymentRegistration`: ariza formasi → status oqimi → maqom hujjati.
  **GATE:** maqom `VERIFIED` bo'lmaguncha foydalanuvchi to'lovli vazifa QABUL
  QILA OLMAYDI (service qatlamida majburiy tekshiruv + test)
- `RegistryFlag`: temir daftar / ayollar / yoshlar daftari — CSV import (admin)
  va fuqaro registrdan chiqqanida `exitedAt` yozilishi
- `ConsentRecord`: shaxsiy ma'lumotga rozilik (matn versiyasi bilan)
- `MAHALLA_COORDINATOR` uchun panel: fuqaroni ro'yxatga olish/tasdiqlash

`AuditLog` barcha maqom o'zgarishlarida yozilsin.

### Bosqich 3 — Vazifalar bozori (P1: ishlab chiqarish autsorsingi)

- `Task` modeli: sarlavha, soha, tavsif, birlik narxi, miqdor, jami summa,
  muddat, xomashyo kim tomonidan, olib ketish/yetkazish nuqtasi, sifat mezoni
  (checklist), foto dalil talabi, kerakli ko'nikmalar, minimal reyting
- `TaskBatch`/`TaskItem`: katta buyurtmani bo'laklarga bo'lish (masalan 10 000
  dona qadoq → 100 tadan 100 ta bo'lak)
- **Korxona oqimi:** e'lon yaratish sehrgari (wizard) → ko'rib chiqish → e'lon
  qilish (e'lon qilishda eskrou hold talab qilinadi — hozircha mock)
- **Fuqaro oqimi:** lenta (yaqin mahalla + ko'nikma bo'yicha saralangan), filtr,
  vazifa kartasi, "Olaman" tugmasi → `Application` → `Assignment`
- `MatchingService`: ko'nikma mosligi, masofa (mahalla), reyting, oldingi tajriba,
  yuklama — 0..1 ball. Qanday hisoblanganini izohlab ko'rsat ("nega menga
  ko'rsatildi")
- Holat mashinasi `transitions.ts` deklarativ; to'g'ridan-to'g'ri status UPDATE
  taqiqlangan
- Bildirishnoma: yangi mos vazifa, ariza qabul qilindi, muddat yaqinlashdi

UI: juda sodda. Fuqaro uchun 3 ta ekran — "Ishlar", "Mening ishlarim", "Hamyon".

### Bosqich 4 — Topshirish, sifat nazorati, nizolar

- `Submission`: ijrochi ishni topshiradi — foto/video dalil (S3), izoh, miqdor
- `QcReview`: korxona qabul qiladi / qayta ishlashga qaytaradi / rad etadi.
  Sabab kodlari ro'yxati. Qayta ishlash maksimum 2 marta.
- **Avtomatik qabul:** korxona N kun (default 5) javob bermasa — avtomatik
  `ACCEPTED` (BullMQ kechiktirilgan vazifa)
- `Dispute`: nizo ochish, xabar almashish, dalil qo'shish, `MODERATOR` qarori:
  ijrochi foydasiga / korxona foydasiga / bo'lib berish (`SPLIT`). Qaror
  eskrouga bevosita ta'sir qiladi.
- **Ish tarixi:** har bir yakunlangan vazifa fuqaroning "raqamli mehnat tarixi"ga
  yoziladi (kelajakda rasmiy ish yoki o'z biznesiga zamin)
- Barcha o'tishlar `AuditLog`da

### Bosqich 5 — Hamyon, eskrou, komissiya, to'lovlar

> Eng ehtiyotkorlik talab qiladigan qism.

- `LedgerService`: **DOUBLE-ENTRY**. `LedgerEntry` o'chirilmaydi/o'zgartirilmaydi,
  faqat qarama-qarshi yozuv (reversal). Hisoblar: `company_wallet`,
  `worker_wallet`, `courier_wallet`, `escrow_account`, `platform_commission`,
  `gateway`
- `EscrowHold`: `PENDING → FUNDED → HELD → RELEASED | REFUNDED | SPLIT`
  - vazifa e'lon qilinganda hold; `ACCEPTED` bo'lganda release;
    `CANCELLED`/rad bo'lganda refund; nizo `SPLIT` bo'lsa bo'linadi
- `CommissionPolicy`: soha bo'yicha foiz + minimal summa; komissiya
  **KORXONADAN** olinadi (davlat byudjetidan mablag' talab qilinmaydi).
  Har chegirma `CommissionCharge` sifatida yoziladi.
- `PaymentProvider` interfeysi + `MockPaymentProvider` (to'lov qabul qilish,
  payout, webhook). Webhook idempotent (`PaymentProviderEvent` unique eventId).
- `Payout`: ijrochi pul yechadi → `LivenessCheck` talab qilinadi (birinchi payout,
  limitdan katta summa yoki yangi qurilma bo'lsa)
- Barcha pul endpointlari `Idempotency-Key` header talab qiladi
- Hamyon UI: balans, kutilayotgan (eskrouda), tarix, chek (PDF)
- **Testlar majburiy:** eskrou hayot sikli, SPLIT, auto-release, ikki marta
  to'lash (double-spend) muhofazasi

### Bosqich 6 — Reyting, ishonch bali, antifrod, qora ro'yxat

- `Rating`: ikki tomonlama (korxona ↔ ijrochi), 1–5 + mezonlar (sifat, muddat,
  muloqot), izoh moderatsiyasi
- `TrustScore`: 0–100. Formula (sozlanadigan og'irliklar bilan): bajarilgan
  vazifa soni, muddatga rioya, qayta ishlash ulushi, nizo ulushi, KYC darajasi,
  faoliyat davomiyligi, bekor qilishlar. Har komponentni alohida ko'rsat va
  "reytingni qanday oshirish mumkin" tavsiyasini chiqar.
- **Avtomatik cheklovlar:** `TrustScore < X` → bir vaqtda 1 vazifa, katta summali
  vazifa taqiqi, majburiy moderatsiya
- `Blacklist`: PINFL HASH bo'yicha. Blok yangi hisob ochishga ham tarqaladi.
  Sabab, muddat, kim qo'ygan, `Appeal` (shikoyat) jarayoni
- `FraudSignal` dvigateli (qoidalar):
  - bir qurilma/IP'dan bir nechta hisob
  - g'ayritabiiy tez qabul → topshirish
  - takroriy dalil fotosi (perceptual hash)
  - bozor narxidan keskin chetlanish
  - yangi hisob + katta summa

  Har signal ball beradi, chegaradan oshsa moderator navbatiga tushadi.
- `LivenessProvider` trigger qoidalari markazlashgan `RiskPolicy` da

### Bosqich 7 — Logistika: 3 pog'onali tarmoq va kuryer

- `Hub`: `REGION_WAREHOUSE` | `DISTRICT_POINT` | `MAHALLA_POINT`.
  Ish vaqti, mas'ul, sig'im.
- `Shipment` + `ShipmentLeg`: xomashyoni ijrochiga yetkazish VA tayyor
  mahsulotni korxonaga qaytarish — ikkalasi ham
- `Handover`: har nuqtada QR skan + foto + GPS + vaqt + mas'ul shaxs
- `RouteBatchingService`: hudud + sana + sig'im bo'yicha guruhlash, bir
  hududdagi BARCHA buyurtmalar (autsorsing + B2B + agro) bitta marshrutga
  birlashtiriladi. Oddiy nearest-neighbour + qo'lda tartiblash imkoni.
- `CourierProfile` + kuryer ekranlari: bugungi marshrut, skan, muammo belgilash
- Kuryer haqi ham eskrou orqali; kuryer ham "o'zini o'zi band qilish" orqali
  ro'yxatdan o'tgan bo'lishi shart
- `HUB_OPERATOR` paneli: kelgan/ketgan, inventarizatsiya

### Bosqich 8 — B2B bozori va Agro moduli

**B2B (do'kon ↔ ta'minotchi, ochiq narx raqobati):**
- `B2bProduct` katalogi (o'lchov birligi, kategoriya)
- `Rfq`: do'kon talab e'lon qiladi (mahsulot, hajm, yetkazish sanasi, hudud)
- `Quote`: ta'minotchilar taklif beradi (narx, muddat, sifat sharti).
  Taqqoslash jadvali — narx/muddat/reyting. Do'kon tanlaydi → `PurchaseOrder`
- Yetkazish 7-bosqichdagi birlashtirilgan marshrutdan foydalanadi
- To'lov: eskrou orqali, qabul qilingach ozod qilinadi

**Agro (qishloq xo'jaligi va chorvachilik):**
- `AgroListing`: yer/chorva egasi mahsulotni e'lon qiladi (tur, hajm, yig'im
  sanasi, sifat darajasi, foto)
- `AgroDemand`: xaridor talabi
- Moslashtirish: talab ↔ taklif (hudud, sana, hajm)
- `AgroContract`: **KAFOLATLANGAN XARID** — oldindan kelishilgan narx va hajm,
  qisman oldindan to'lov (eskrouda), yig'im-terimda yakuniy hisob-kitob
- Mavsumiy kalendar va ogohlantirishlar

### Bosqich 9 — Boshqarma dashboardi va hisobotlar

> Loyihaning "sotuv" moduli — sifatli qilinadi.

- KPI kartalari: ro'yxatdan o'tgan fuqaro · "o'zini o'zi band qilgan" maqomini
  olganlar · faol ijrochi (30 kun) · e'lon qilingan/bajarilgan vazifa · fill rate
  · jami to'langan summa · o'rtacha oylik daromad · faol korxona · nizo ulushi ·
  **REGISTRDAN CHIQQANLAR** (temir daftar / ayollar / yoshlar — alohida va jami)
  · kuryer soni va yetkazishlar
- Filtr: sana oralig'i, mahalla, tuman, soha, jins, yosh guruhi
- Grafiklar: oylik dinamika, mahalla reytingi, soha taqsimoti, daromad taqsimoti
- Oylik avtomatik `ReportSnapshot` (BullMQ cron) — o'zgarmas tarixiy nusxa
- Eksport: XLSX va PDF (rasmiy hisobot ko'rinishida, sarlavhada
  "Toshkent viloyati Kambag'allikni qisqartirish va bandlik boshqarmasi,
  Nurafshon shahar bo'limi" va hisobot davri)
- **MAXFIYLIK:** boshqarma roli shaxsiy hujjat, telefon, karta, to'lov
  tafsilotini KO'RMAYDI. Faqat agregat. 5 tadan kam yozuvli kesim yashiriladi
  (k-anonimlik). Har bir eksport `AuditLog`ga yoziladi.
- `LaborSupplyDemandIndex`: hudud × soha × ko'nikma kesimida taklif/talab balansi

### Bosqich 10 — Bildirishnomalar, Telegram bot, SMS

- `NotificationTemplate` (uz-Latn / uz-Cyrl / ru) + kanal:
  `PUSH | SMS | TELEGRAM | IN_APP`
- Kanal tanlash siyosati: avval push/telegram, yetib bormasa SMS (narxni tejash)
- Hodisalar: yangi mos vazifa · ariza qabul qilindi · muddat 24 soat qoldi ·
  ish qabul qilindi · pul o'tkazildi · nizo ochildi/hal bo'ldi · yuk yetib keldi ·
  maqom tasdiqlandi
- Telegram bot: ro'yxatdan o'tish havolasi, yangi vazifa xabari, "Olaman"
  tugmasi (deep link), hamyon balansi
- BullMQ navbat + qayta urinish + o'chirilgan kanal sozlamalari
- Foydalanuvchi sozlamalari: qaysi xabarni qaysi kanalda olish, "bezovta
  qilmang" vaqti

### Bosqich 11 — Test, seed, hujjat, deploy

- **Vitest** (service qatlami): eskrou hayot sikli, holat mashinalari,
  komissiya hisobi, TrustScore, matching, k-anonimlik
- **Playwright e2e** — 3 ta to'liq stsenariy:
  1. Fuqaro ro'yxatdan o'tadi → maqom oladi → vazifa oladi → topshiradi →
     qabul qilinadi → pul oladi
  2. Korxona e'lon beradi → eskrou → sifat rad → nizo → moderator SPLIT qarori
  3. B2B: RFQ → 3 taklif → tanlov → yetkazish → to'lov
- **Demo seed:** Nurafshon, 5 mahalla, 2 korxona (to'qimachilik + qadoqlash),
  20 fuqaro, 3 kuryer, 3 hub, 30 vazifa turli holatlarda, 3 oylik tarixiy
  ma'lumot (dashboard bo'sh ko'rinmasligi uchun)
- README (o'zbek tilida): o'rnatish, ENV, demo hisoblar, arxitektura sxemasi
- OpenAPI hujjati
- GitHub Actions: lint + typecheck + test + build
- Docker Compose (prod profil), migratsiya strategiyasi, backup eslatmasi
- **XAVFSIZLIK CHEK-RO'YXATI:** 6 qatlamning har biri kodda qayerda amalga
  oshirilgani — fayl va funksiya nomi bilan jadval

---

## 3. QO'SHIMCHA PROMPTLAR

### Dizayn / UX

Bandlik platformasining fuqaro ilovasi uchun UI kit va 5 ta asosiy ekran
dizaynini ber. Auditoriya: 25–55 yosh, mahalla aholisi, arzon Android telefon,
sekin internet, qisman past raqamli savodxonlik. Talab: katta tugma (min 48px),
ikonka + matn, har ekranda bitta asosiy harakat, summa va muddat eng ko'zga
tashlanadigan element, holat rangi bilan aniq (kutilmoqda / bajarilmoqda /
tasdiqlandi / to'landi). Rang palitrasi: davlat muassasasi bilan ishlash uchun
jiddiy, ammo iliq.

### Boshqarmaga texnik xulosa

Yuqoridagi platforma uchun boshqarmaga taqdim etiladigan 1 betlik texnik xulosa
yoz: arxitektura, xavfsizlikning 6 qatlami, byudjet talab qilinmasligi
(komissiya modeli), 3 oylik pilot rejasi va kutilayotgan raqamli natijalar.

### Xavfsizlik auditi

Ushbu kodni quyidagi nuqtai nazardan tekshir: hisob "ijarasi", bir shaxs
tomonidan bir necha hisob ochish, soxta korxona e'loni, eskroudan pul o'g'irlash,
sifat dalilini qayta ishlatish (foto takrori), boshqarma rolidan shaxsiy
ma'lumot chiqib ketishi. Har bir xavf uchun: qayerda zaif, qanday tuzatish.
