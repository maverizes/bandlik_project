# BANDLIK PLATFORMASI — AI KODLASH PROMPTLARI

> Manba: `Bandlik_Platformasi_Taqdimot (3).pptx` (13 slayd) asosida tuzilgan.
> Bu hujjat loyihaning **manba brifi** (source of truth). Har bosqichda
> shu yerdagi talablarga qaytib tekshiriladi.
>
> Ishlatish tartibi: MASTER PROMPT → tasdiqlash → bosqichlar birma-bir (1 → 11).
> Har bosqichda faqat shu modul yoziladi — bitta soʻrovda hamma narsa emas.

---

## 1. MASTER PROMPT

Sen tajribali full-stack muhandis va solution architektsan. Biz Oʻzbekiston uchun
"Hududiy bandlik va ishlab chiqarish hamkorlik platformasi"ni noldan quramiz.
Ishchi nomi: HUNAR (nomni keyin oʻzgartirsak boʻladi).

Bu xabar — loyihaning toʻliq konteksti. Hozircha KOD YOZMA. Avval:
1) Kontekstni tushunganingni 10 qatorda tasdiqla,
2) Taklif qilingan arxitektura va papka tuzilmasini chiqar,
3) Prisma schema (barcha modellar) loyihasini chiqar,
4) Bosqichlar roʻyxatini (roadmap) chiqar.

Men "OK, 1-bosqichni boshla" deganimdan keyingina kod yozishni boshlaysan.

### A. MUAMMO (nima uchun bu platforma kerak)

Ikki tomonlama muammo, bitta yechim:

**1) Korxonalarda ishchi kuchi tanqisligi**
- Toʻqimachilik, qadoqlash, savdo korxonalari doimiy shtat uchun yotoqxona,
  ovqat va ijtimoiy sharoit taʼminlashga majbur.
- Bu xarajat kichik va oʻrta korxona uchun ogʻir — ishchi yollash sekinlashadi.
- Natija: buyurtmalar kechikadi, quvvat toʻliq ishlamaydi.

**2) Band boʻlmagan, ammo hunarli fuqarolar**
- Mahallabay/xonadonbay tizimi orqali aniqlangan uy bekalari, yoshlar,
  tomorqa egalari rasman ishsiz.
- Ular doimiy fabrika ishiga chiqa olmaydi, lekin uyida qism-qism ish bajaradi.
- "Temir daftar", "Ayollar daftari", "Yoshlar daftari"da roʻyxatga olingan.

**Yechim:** korxona va fuqaroni bevosita bogʻlaydigan raqamli platforma.
Asosiy sikl: Vazifa eʼlon qilinadi → Fuqaro javob beradi → Sifat tasdiqlanadi
→ Kafolatlangan (eskrou) toʻlov amalga oshadi.

### B. HUQUQIY ASOS VA INTEGRATSIYA

- Platforma PQ-4742-son qaror asosidagi "Oʻzini oʻzi band qilish" tizimiga
  tayanadi — yangi byurokratiya yaratilmaydi.
- Fuqaro birinchi buyurtmadan OLDIN shaxsiy kabinet orqali "oʻzini oʻzi band
  qilgan shaxs" maqomini oladi.
- Bu maqom: (a) daromaddan jismoniy shaxs daromad soligʻi olinmaydi,
  (b) fuqaro rasman "band" hisoblanadi va ishsizlar roʻyxatidan chiqadi,
  (c) raqamli mehnat tarixi (reyting) shakllanadi.
- Demak platformada `SelfEmploymentRegistration` bosqichi MAJBURIY gate boʻlishi
  kerak: maqom olinmaguncha fuqaro toʻlovli vazifa qabul qila olmaydi.

### C. QAMROV (universal, lekin pilot tor)

Platforma bandlikka aloqador istalgan tashkilot uchun ochiq. Sohalar:

1. Ishlab chiqarish sexlari
2. Umumiy ovqatlanish va mehmondoʻstlik
3. Savdo va chakana tarmoqlar
4. Qishloq xoʻjaligi va chorvachilik
5. Qurilish va taʼmirlash ishlari
6. Transport va yetkazib berish
7. Korporativ va ofis xizmatlari
8. IT va raqamli xizmatlar

**Birinchi bosqichda 4 ta pilot yoʻnalish (MVP shu 4 tasiga qaratilsin):**

- **P1. Ishlab chiqarish autsorsingi** — toʻqimachilik/qadoqlash vazifalarini
  kichik qismlarga boʻlib, uy sharoitida bajartirish (piecework).
- **P2. B2B savdo bozori** — doʻkonni bir nechta taʼminotchi bilan bogʻlash,
  ochiq narx raqobati (RFQ → bir necha taklif → tanlov).
- **P3. Qishloq xoʻjaligi va chorvachilik** — xaridor talabini yer/chorva egalari
  bilan moslashtirish, kafolatlangan xarid shartnomasi.
- **P4. Bandlik va ijtimoiy himoya** — "oʻzini oʻzi band qilish"ga ulash,
  ishsizlik statistikasini kamaytirish, boshqarma uchun hisobot.

### D. PILOT LOYIHA PARAMETRLARI

- **Hudud:** Nurafshon shahri, Toshkent viloyati. 1 ta mahalla fuqarolar
  yigʻinidan boshlanadi.
- **Muddat:** 3 oy.
- **Maqsad:** 50–100 roʻyxatdan oʻtgan fuqaro, 2–3 hamkor korxona
  (toʻqimachilik/qadoqlash).
- **Moliyalashtirish:** davlat byudjetidan mablagʻ talab qilinmaydi. Platforma
  korxonalardan olinadigan kichik komissiya hisobidan oʻzini moliyalashtiradi.
  => Kodda `CommissionPolicy` (foiz + minimal summa, soha boʻyicha sozlanadigan).

**Amalga oshirish grafigi:**

| Muddat | Bosqich | Mazmun |
|---|---|---|
| 1–2-hafta | Kelishuv | Boshqarma bilan hamkorlik, korxona/fuqaro roʻyxati |
| 3–4-hafta | Ishga tushirish | Sinov platformasi + oʻzini oʻzi band qilish roʻyxati |
| 2-oy | Amaliy ish | Birinchi buyurtmalar, sifat nazorati, toʻlov sinovi |
| 3-oy | Kengaytirish | Natijalarni jamlash, shahar/tuman miqyosiga taklif |

### E. FOYDALANUVCHI ROLLARI (RBAC)

| Rol | Vazifasi |
|---|---|
| `WORKER` | Fuqaro / ijrochi (oʻzini oʻzi band qilgan shaxs) |
| `COMPANY_OWNER` | Korxona egasi/rahbari |
| `COMPANY_MANAGER` | Korxona xodimi (vazifa eʼlon qiladi, sifat qabul qiladi) |
| `COURIER` | Kuryer (u ham "oʻzini oʻzi band qilish" orqali roʻyxatda) |
| `HUB_OPERATOR` | Ombor/punkt operatori (viloyat, tuman, mahalla) |
| `MAHALLA_COORDINATOR` | Mahalla koordinatori: fuqarolarni roʻyxatga oladi, tasdiqlaydi |
| `DEPT_ANALYST` | Boshqarma tahlilchisi (faqat oʻqish + hisobot eksporti) |
| `DEPT_ADMIN` | Boshqarma admini (hudud kesimida toʻliq monitoring) |
| `MODERATOR` | Nizolar, shikoyatlar, qora roʻyxat |
| `SUPER_ADMIN` | Tizim admini |

Har bir endpoint uchun aniq RBAC matritsasi yoziladi. **Boshqarma rollari HECH
QACHON toʻlov yoki shaxsiy hujjat skanini koʻra olmaydi — faqat agregat va maqom.**

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
  fayllarida, **kodda hardcode matn boʻlmasin**
- Mobil: keyingi bosqichda Expo (React Native), API bir xil
- Test: Vitest (unit) + Playwright (e2e) + Prisma test DB
- Deploy: Docker Compose (dev) + GitHub Actions CI

**Nofunksional talablar:**

- **Mobile-first.** Foydalanuvchining katta qismi arzon Android telefonda, sekin
  internetda. Sahifa ogʻirligi kichik, rasm lazy, offline-tolerant formalar.
- **Past raqamli savodxonlik** hisobga olinsin: katta tugmalar, ikonka + matn,
  sodda til, har bir qadamda "keyingi qadam nima" koʻrsatilsin.
- **SMS fallback:** push kelmasa SMS. Telegram bot — ikkinchi kanal.
- Barcha maʼlumot Oʻzbekiston hududida saqlanadi (data residency).
- "Shaxsga doir maʼlumotlar toʻgʻrisida"gi qonun talablariga mos: rozilik
  (consent) yozuvi, maqsad cheklovi, saqlash muddati, oʻchirish soʻrovi.

### G. MAʼLUMOTLAR MODELI (asosiy entitilar)

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

### H. HOLAT MASHINALARI (qatʼiy amal qilinadi)

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
Har oʻtish QR skan + vaqt + joylashuv + masʼul shaxs bilan yoziladi.

**KYC / SelfEmployment:**
```
NOT_STARTED → PENDING → VERIFIED | REJECTED → EXPIRED
```

Har bir oʻtish uchun: kim huquqli, qanday shart, qanday audit yozuvi — alohida
`transitions.ts` faylida deklarativ tasvirlanadi. **Holatni toʻgʻridan-toʻgʻri
UPDATE qilish taqiqlanadi**, faqat service qatlami orqali.

### I. XAVFSIZLIK VA ISHONCH TIZIMI (6 qatlam)

1. **Davlat bazasi orqali shaxsni tasdiqlash** — roʻyxatdan oʻtishda maʼlumot
   Soliq qoʻmitasi / IIV bazasidan avtomatik tekshiriladi.
2. **Yuz orqali jonli tekshirish (liveness)** — katta buyurtma qabul qilishda
   yoki pul yechishda qayta biometrik tasdiqlash. Maqsad: hisob "ijarasi"ga qarshi.
3. **Kafolatlangan toʻlov (eskrou)** — pul oldindan platformada saqlanadi, faqat
   sifat tasdiqlangach ijrochiga oʻtkaziladi.
4. **Ishonch bali / reyting** — har bitim asosida shakllanadi; past koʻrsatkichli
   hisoblar avtomatik cheklanadi (limit, moderatsiya, yangi vazifa taqiqi).
5. **Qora roʻyxat shaxs darajasida** — blokirovka PINFL (JSHSHIR)
   identifikatoriga bogʻlanadi, yangi hisob bilan qaytib boʻlmaydi. PINFL ochiq
   saqlanmaydi: `pinflHash = HMAC-SHA256(pinfl, SERVER_SECRET)` — unique indeks.
6. **Korxonani tekshirish (KYB)** — eʼlon beruvchi tashkilotning yuridik maqomi
   Soliq bazasidan tasdiqlanadi (soxta korxonaga qarshi).

**Qoʻshimcha texnik himoya:**

- 1 PINFL = 1 faol hisob. Qurilma barmoq izi (device fingerprint) yoziladi.
- OTP: rate-limit (IP + telefon), 5 urinish, 15 daqiqa blok, kod hash bilan saqlanadi.
- Barcha pul operatsiyalari idempotent (`Idempotency-Key` header).
- `AuditLog`: kim, qachon, nima, eski→yangi qiymat. Append-only.
- Nozik maydonlar (passport seriya, PINFL, karta) — application-level encryption.
- OWASP Top 10: parametrlashtirilgan soʻrovlar, CSRF, CSP, rate limit, fayl
  yuklashda MIME+hajm+antivirus tekshiruvi, SSRF himoyasi.
- Fraud qoidalari dvigateli: bir IP/qurilmadan koʻp hisob, gʻayritabiiy tez
  qabul-topshirish, bir xil foto takrori (perceptual hash), narxdan chetlanish.

### J. LOGISTIKA (uch pogʻonali tarmoq)

```
Viloyat markazi      → yirik tarqatish omborxonasi
Tuman/shahar markazi → kichik yigʻish-tarqatish punkti
Mahalla nuqtasi      → MAVJUD bino (alohida qurilish shart emas)
```

- **Birlashtirilgan marshrut:** bir hududdagi barcha buyurtmalar (B2B ham,
  qishloq xoʻjaligi ham, xomashyo/tayyor mahsulot ham) BITTA yoʻnalishga
  birlashtiriladi → xarajat kamayadi. `RouteBatchingService`: hudud + sana +
  sigʻim boʻyicha guruhlash, oddiy nearest-neighbour marshrut.
- **Kuryerlik — yangi bandlik manbai:** mahalliy fuqaro "oʻzini oʻzi band qilish"
  orqali kuryer sifatida roʻyxatdan oʻtadi, tashqi kompaniya shart emas. Kuryer
  ham eskrou orqali haq oladi, uning ham reytingi bor.
- Har topshirish nuqtasida QR skan + foto + vaqt = `Handover` yozuvi.

### K. BOSHQARMA DASHBOARDI

"Toshkent viloyati Kambagʻallikni qisqartirish va bandlik boshqarmasi,
Nurafshon shahar boʻlimi" uchun real vaqtli panel.

**Kutilayotgan natija:**
- "Temir daftar" / "Ayollar daftari" / "Yoshlar daftari"dagi fuqarolar sonini
  qisqartirish → panelda: nechta fuqaro roʻyxatdan chiqdi (oy kesimida).
- Norasmiy uy mehnatini rasmiylashtirish → "oʻzini oʻzi band qilgan" maqomini
  olganlar soni, ularning jami rasmiy daromadi.
- Har oy aniq raqamli hisobot → PDF/XLSX eksport, avtomatik oylik snapshot.
- KSB korxonalarning barqaror ishlashiga koʻmaklashish → faol korxona soni,
  eʼlon qilingan/bajarilgan vazifa nisbati (fill rate).

**KPIʼlar** (mahalla / tuman / soha / jins / yosh kesimida filtrlanadi):
roʻyxatdan oʻtgan fuqaro · maqom olgan fuqaro · faol ijrochi (30 kun) · eʼlon
qilingan vazifa · bajarilgan vazifa · oʻrtacha bajarilish vaqti · jami toʻlangan
summa · ijrochining oʻrtacha oylik daromadi · faol korxona · vazifa fill rate ·
nizo ulushi · registrdan chiqqanlar · kuryer soni va yetkazishlar

Grafiklar: vaqt qatori (oylik), mahalla boʻyicha reyting jadvali, soha boʻyicha
taqsimot. Eksport: XLSX + PDF (rasmiy blank formatida).

**Maxfiylik:** boshqarma foydalanuvchisi shaxsiy maʼlumotni koʻrmaydi — faqat
agregat; 5 tadan kam yozuvli kesim yashiriladi (k-anonimlik). Har eksport
`AuditLog`da.

### L. TASHQI INTEGRATSIYALAR

Har biri uchun `packages/integrations/<name>` ichida: `interface` +
`MockProvider` (MVP uchun ishlaydigan) + `RealProvider` (stub). ENV flag orqali
almashadi. **Hech qanday integratsiya yoʻqligi MVPni toʻxtatmasin.**

| Adapter | Vazifasi |
|---|---|
| `IdentityProvider` | OneID / IIV passport tekshiruvi |
| `TaxProvider` | Soliq qoʻmitasi: STIR, "oʻzini oʻzi band qilish" maqomi, daromad |
| `LivenessProvider` | Yuz orqali jonli tekshirish |
| `PaymentProvider` | Payme / Click / Uzum (toʻlov qabul qilish + payout) |
| `SmsProvider` | Eskiz.uz / Play Mobile |
| `TelegramBot` | Bildirishnoma + oddiy vazifa qabul qilish |
| `RegistryProvider` | "Temir daftar" / "ayollar" / "yoshlar" roʻyxati importi |

> **MUHIM OGOHLANTIRISH (kodga izoh sifatida yoziladi):**
> Haqiqiy eskrou (uchinchi shaxs pulini ushlab turish) Oʻzbekistonda bank yoki
> toʻlov tashkiloti litsenziyasini talab qiladi. Shuning uchun pul harakati
> `LedgerService` (double-entry) orqali abstraksiya qilinadi; MVPda "virtual
> hamyon + mock provider", ishlab chiqarishda esa hamkor bank/PSP hisobi
> ulanadi. Kodda bu chegara aniq ajratilgan boʻlsin.

### M. KELAJAK STRATEGIYASI

Xitoy tajribasi ("Sharq–Gʻarb hamkorligi", 1996-yildan): rivojlangan sharqiy
provinsiyalar kambagʻal gʻarbiy provinsiyalar bilan yagona "chiqish hududi –
kirish hududi" axborot tizimi orqali bogʻlangan (5 mln+ qishloq ishchisi band
boʻldi, ~800 qoʻshma sanoat zonasi, 30 yil sinovdan oʻtgan tizim).

Bizning yoʻl:
- **1-bosqich:** Nurafshon pilot (toʻqimachilik/qadoqlash, 3 oy).
- **2-bosqich:** respublika miqyosi — yagona maʼlumotlar bazasi asosida, masalan
  Fargʻona vodiysining ortiqcha ishchi kuchini Toshkent/Sirdaryo sanoat zonalari
  bilan bogʻlash.

**Arxitektura talabi:** markazlashgan, koʻp-hududli (multi-region tenancy).
Boshidanoq har bir yozuvda `regionId/districtId/mahallaId` boʻlsin, RBAC hudud
boʻyicha cheklansin, va "ortiqcha ishchi kuchi hududi ↔ talab hududi"ni
moslashtirish uchun `LaborSupplyDemandIndex` (hudud × soha × koʻnikma kesimida
taklif/talab balansi) modeli oldindan koʻzda tutilsin.

### N. ISH USLUBI TALABLARI

- Har bosqichda: toʻliq ishlaydigan kod, migratsiya, seed va qisqa test.
- TypeScript strict, `any` ishlatilmaydi. Har service uchun Zod sxema.
- Biznes mantiq `src/server/services/*` da, Route Handler faqat yupqa qatlam.
- Fayl yozishdan oldin qaysi fayllar yaratilayotgani roʻyxat qilinadi.
- Taxmin qilish kerak boʻlsa — taxmin ochiq yoziladi, ish toʻxtamaydi.
- Har javob oxirida: "Keyingi qadam" va tekshirish buyruqlari.
- UI matnlari faqat oʻzbek tilida (lotin), tarjima fayli orqali.
- Seed maʼlumot real boʻlsin: Nurafshon shahri mahallalari, toʻqimachilik/
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

### Bosqich 2 — Profillar, KYC/KYB, "Oʻzini oʻzi band qilish"

- `WorkerProfile`: koʻnikmalar (`Skill` katalogi), daraja, haftalik boʻsh vaqt,
  uy sharoiti (tikuv mashinasi, joy hajmi va h.k.), maksimal yuk, mahalla
- `CompanyProfile`: STIR/INN, yuridik manzil, soha, masʼul shaxs
- `CourierProfile`: transport turi, sigʻim, xizmat hududi
- `KycVerification`: passport/ID + PINFL. PINFL OCHIQ SAQLANMAYDI —
  `pinflHash = HMAC-SHA256(pinfl, SECRET)` unique indeks. Provider interfeysi
  + `MockIdentityProvider` (test PINFLʼlar roʻyxati bilan)
- `KybVerification`: `MockTaxProvider` orqali STIR tekshiruvi
- `SelfEmploymentRegistration`: ariza formasi → status oqimi → maqom hujjati.
  **GATE:** maqom `VERIFIED` boʻlmaguncha foydalanuvchi toʻlovli vazifa QABUL
  QILA OLMAYDI (service qatlamida majburiy tekshiruv + test)
- `RegistryFlag`: temir daftar / ayollar / yoshlar daftari — CSV import (admin)
  va fuqaro registrdan chiqqanida `exitedAt` yozilishi
- `ConsentRecord`: shaxsiy maʼlumotga rozilik (matn versiyasi bilan)
- `MAHALLA_COORDINATOR` uchun panel: fuqaroni roʻyxatga olish/tasdiqlash

`AuditLog` barcha maqom oʻzgarishlarida yozilsin.

### Bosqich 3 — Vazifalar bozori (P1: ishlab chiqarish autsorsingi)

- `Task` modeli: sarlavha, soha, tavsif, birlik narxi, miqdor, jami summa,
  muddat, xomashyo kim tomonidan, olib ketish/yetkazish nuqtasi, sifat mezoni
  (checklist), foto dalil talabi, kerakli koʻnikmalar, minimal reyting
- `TaskBatch`/`TaskItem`: katta buyurtmani boʻlaklarga boʻlish (masalan 10 000
  dona qadoq → 100 tadan 100 ta boʻlak)
- **Korxona oqimi:** eʼlon yaratish sehrgari (wizard) → koʻrib chiqish → eʼlon
  qilish (eʼlon qilishda eskrou hold talab qilinadi — hozircha mock)
- **Fuqaro oqimi:** lenta (yaqin mahalla + koʻnikma boʻyicha saralangan), filtr,
  vazifa kartasi, "Olaman" tugmasi → `Application` → `Assignment`
- `MatchingService`: koʻnikma mosligi, masofa (mahalla), reyting, oldingi tajriba,
  yuklama — 0..1 ball. Qanday hisoblanganini izohlab koʻrsat ("nega menga
  koʻrsatildi")
- Holat mashinasi `transitions.ts` deklarativ; toʻgʻridan-toʻgʻri status UPDATE
  taqiqlangan
- Bildirishnoma: yangi mos vazifa, ariza qabul qilindi, muddat yaqinlashdi

UI: juda sodda. Fuqaro uchun 3 ta ekran — "Ishlar", "Mening ishlarim", "Hamyon".

### Bosqich 4 — Topshirish, sifat nazorati, nizolar

- `Submission`: ijrochi ishni topshiradi — foto/video dalil (S3), izoh, miqdor
- `QcReview`: korxona qabul qiladi / qayta ishlashga qaytaradi / rad etadi.
  Sabab kodlari roʻyxati. Qayta ishlash maksimum 2 marta.
- **Avtomatik qabul:** korxona N kun (default 5) javob bermasa — avtomatik
  `ACCEPTED` (BullMQ kechiktirilgan vazifa)
- `Dispute`: nizo ochish, xabar almashish, dalil qoʻshish, `MODERATOR` qarori:
  ijrochi foydasiga / korxona foydasiga / boʻlib berish (`SPLIT`). Qaror
  eskrouga bevosita taʼsir qiladi.
- **Ish tarixi:** har bir yakunlangan vazifa fuqaroning "raqamli mehnat tarixi"ga
  yoziladi (kelajakda rasmiy ish yoki oʻz biznesiga zamin)
- Barcha oʻtishlar `AuditLog`da

### Bosqich 5 — Hamyon, eskrou, komissiya, toʻlovlar

> Eng ehtiyotkorlik talab qiladigan qism.

- `LedgerService`: **DOUBLE-ENTRY**. `LedgerEntry` oʻchirilmaydi/oʻzgartirilmaydi,
  faqat qarama-qarshi yozuv (reversal). Hisoblar: `company_wallet`,
  `worker_wallet`, `courier_wallet`, `escrow_account`, `platform_commission`,
  `gateway`
- `EscrowHold`: `PENDING → FUNDED → HELD → RELEASED | REFUNDED | SPLIT`
  - vazifa eʼlon qilinganda hold; `ACCEPTED` boʻlganda release;
    `CANCELLED`/rad boʻlganda refund; nizo `SPLIT` boʻlsa boʻlinadi
- `CommissionPolicy`: soha boʻyicha foiz + minimal summa; komissiya
  **KORXONADAN** olinadi (davlat byudjetidan mablagʻ talab qilinmaydi).
  Har chegirma `CommissionCharge` sifatida yoziladi.
- `PaymentProvider` interfeysi + `MockPaymentProvider` (toʻlov qabul qilish,
  payout, webhook). Webhook idempotent (`PaymentProviderEvent` unique eventId).
- `Payout`: ijrochi pul yechadi → `LivenessCheck` talab qilinadi (birinchi payout,
  limitdan katta summa yoki yangi qurilma boʻlsa)
- Barcha pul endpointlari `Idempotency-Key` header talab qiladi
- Hamyon UI: balans, kutilayotgan (eskrouda), tarix, chek (PDF)
- **Testlar majburiy:** eskrou hayot sikli, SPLIT, auto-release, ikki marta
  toʻlash (double-spend) muhofazasi

### Bosqich 6 — Reyting, ishonch bali, antifrod, qora roʻyxat

- `Rating`: ikki tomonlama (korxona ↔ ijrochi), 1–5 + mezonlar (sifat, muddat,
  muloqot), izoh moderatsiyasi
- `TrustScore`: 0–100. Formula (sozlanadigan ogʻirliklar bilan): bajarilgan
  vazifa soni, muddatga rioya, qayta ishlash ulushi, nizo ulushi, KYC darajasi,
  faoliyat davomiyligi, bekor qilishlar. Har komponentni alohida koʻrsat va
  "reytingni qanday oshirish mumkin" tavsiyasini chiqar.
- **Avtomatik cheklovlar:** `TrustScore < X` → bir vaqtda 1 vazifa, katta summali
  vazifa taqiqi, majburiy moderatsiya
- `Blacklist`: PINFL HASH boʻyicha. Blok yangi hisob ochishga ham tarqaladi.
  Sabab, muddat, kim qoʻygan, `Appeal` (shikoyat) jarayoni
- `FraudSignal` dvigateli (qoidalar):
  - bir qurilma/IPʼdan bir nechta hisob
  - gʻayritabiiy tez qabul → topshirish
  - takroriy dalil fotosi (perceptual hash)
  - bozor narxidan keskin chetlanish
  - yangi hisob + katta summa

  Har signal ball beradi, chegaradan oshsa moderator navbatiga tushadi.
- `LivenessProvider` trigger qoidalari markazlashgan `RiskPolicy` da

### Bosqich 7 — Logistika: 3 pogʻonali tarmoq va kuryer

- `Hub`: `REGION_WAREHOUSE` | `DISTRICT_POINT` | `MAHALLA_POINT`.
  Ish vaqti, masʼul, sigʻim.
- `Shipment` + `ShipmentLeg`: xomashyoni ijrochiga yetkazish VA tayyor
  mahsulotni korxonaga qaytarish — ikkalasi ham
- `Handover`: har nuqtada QR skan + foto + GPS + vaqt + masʼul shaxs
- `RouteBatchingService`: hudud + sana + sigʻim boʻyicha guruhlash, bir
  hududdagi BARCHA buyurtmalar (autsorsing + B2B + agro) bitta marshrutga
  birlashtiriladi. Oddiy nearest-neighbour + qoʻlda tartiblash imkoni.
- `CourierProfile` + kuryer ekranlari: bugungi marshrut, skan, muammo belgilash
- Kuryer haqi ham eskrou orqali; kuryer ham "oʻzini oʻzi band qilish" orqali
  roʻyxatdan oʻtgan boʻlishi shart
- `HUB_OPERATOR` paneli: kelgan/ketgan, inventarizatsiya

### Bosqich 8 — B2B bozori va Agro moduli

**B2B (doʻkon ↔ taʼminotchi, ochiq narx raqobati):**
- `B2bProduct` katalogi (oʻlchov birligi, kategoriya)
- `Rfq`: doʻkon talab eʼlon qiladi (mahsulot, hajm, yetkazish sanasi, hudud)
- `Quote`: taʼminotchilar taklif beradi (narx, muddat, sifat sharti).
  Taqqoslash jadvali — narx/muddat/reyting. Doʻkon tanlaydi → `PurchaseOrder`
- Yetkazish 7-bosqichdagi birlashtirilgan marshrutdan foydalanadi
- Toʻlov: eskrou orqali, qabul qilingach ozod qilinadi

**Agro (qishloq xoʻjaligi va chorvachilik):**
- `AgroListing`: yer/chorva egasi mahsulotni eʼlon qiladi (tur, hajm, yigʻim
  sanasi, sifat darajasi, foto)
- `AgroDemand`: xaridor talabi
- Moslashtirish: talab ↔ taklif (hudud, sana, hajm)
- `AgroContract`: **KAFOLATLANGAN XARID** — oldindan kelishilgan narx va hajm,
  qisman oldindan toʻlov (eskrouda), yigʻim-terimda yakuniy hisob-kitob
- Mavsumiy kalendar va ogohlantirishlar

### Bosqich 9 — Boshqarma dashboardi va hisobotlar

> Loyihaning "sotuv" moduli — sifatli qilinadi.

- KPI kartalari: roʻyxatdan oʻtgan fuqaro · "oʻzini oʻzi band qilgan" maqomini
  olganlar · faol ijrochi (30 kun) · eʼlon qilingan/bajarilgan vazifa · fill rate
  · jami toʻlangan summa · oʻrtacha oylik daromad · faol korxona · nizo ulushi ·
  **REGISTRDAN CHIQQANLAR** (temir daftar / ayollar / yoshlar — alohida va jami)
  · kuryer soni va yetkazishlar
- Filtr: sana oraligʻi, mahalla, tuman, soha, jins, yosh guruhi
- Grafiklar: oylik dinamika, mahalla reytingi, soha taqsimoti, daromad taqsimoti
- Oylik avtomatik `ReportSnapshot` (BullMQ cron) — oʻzgarmas tarixiy nusxa
- Eksport: XLSX va PDF (rasmiy hisobot koʻrinishida, sarlavhada
  "Toshkent viloyati Kambagʻallikni qisqartirish va bandlik boshqarmasi,
  Nurafshon shahar boʻlimi" va hisobot davri)
- **MAXFIYLIK:** boshqarma roli shaxsiy hujjat, telefon, karta, toʻlov
  tafsilotini KOʻRMAYDI. Faqat agregat. 5 tadan kam yozuvli kesim yashiriladi
  (k-anonimlik). Har bir eksport `AuditLog`ga yoziladi.
- `LaborSupplyDemandIndex`: hudud × soha × koʻnikma kesimida taklif/talab balansi

### Bosqich 10 — Bildirishnomalar, Telegram bot, SMS

- `NotificationTemplate` (uz-Latn / uz-Cyrl / ru) + kanal:
  `PUSH | SMS | TELEGRAM | IN_APP`
- Kanal tanlash siyosati: avval push/telegram, yetib bormasa SMS (narxni tejash)
- Hodisalar: yangi mos vazifa · ariza qabul qilindi · muddat 24 soat qoldi ·
  ish qabul qilindi · pul oʻtkazildi · nizo ochildi/hal boʻldi · yuk yetib keldi ·
  maqom tasdiqlandi
- Telegram bot: roʻyxatdan oʻtish havolasi, yangi vazifa xabari, "Olaman"
  tugmasi (deep link), hamyon balansi
- BullMQ navbat + qayta urinish + oʻchirilgan kanal sozlamalari
- Foydalanuvchi sozlamalari: qaysi xabarni qaysi kanalda olish, "bezovta
  qilmang" vaqti

### Bosqich 11 — Test, seed, hujjat, deploy

- **Vitest** (service qatlami): eskrou hayot sikli, holat mashinalari,
  komissiya hisobi, TrustScore, matching, k-anonimlik
- **Playwright e2e** — 3 ta toʻliq stsenariy:
  1. Fuqaro roʻyxatdan oʻtadi → maqom oladi → vazifa oladi → topshiradi →
     qabul qilinadi → pul oladi
  2. Korxona eʼlon beradi → eskrou → sifat rad → nizo → moderator SPLIT qarori
  3. B2B: RFQ → 3 taklif → tanlov → yetkazish → toʻlov
- **Demo seed:** Nurafshon, 5 mahalla, 2 korxona (toʻqimachilik + qadoqlash),
  20 fuqaro, 3 kuryer, 3 hub, 30 vazifa turli holatlarda, 3 oylik tarixiy
  maʼlumot (dashboard boʻsh koʻrinmasligi uchun)
- README (oʻzbek tilida): oʻrnatish, ENV, demo hisoblar, arxitektura sxemasi
- OpenAPI hujjati
- GitHub Actions: lint + typecheck + test + build
- Docker Compose (prod profil), migratsiya strategiyasi, backup eslatmasi
- **XAVFSIZLIK CHEK-ROʻYXATI:** 6 qatlamning har biri kodda qayerda amalga
  oshirilgani — fayl va funksiya nomi bilan jadval

---

## 3. QOʻSHIMCHA PROMPTLAR

### Dizayn / UX

Bandlik platformasining fuqaro ilovasi uchun UI kit va 5 ta asosiy ekran
dizaynini ber. Auditoriya: 25–55 yosh, mahalla aholisi, arzon Android telefon,
sekin internet, qisman past raqamli savodxonlik. Talab: katta tugma (min 48px),
ikonka + matn, har ekranda bitta asosiy harakat, summa va muddat eng koʻzga
tashlanadigan element, holat rangi bilan aniq (kutilmoqda / bajarilmoqda /
tasdiqlandi / toʻlandi). Rang palitrasi: davlat muassasasi bilan ishlash uchun
jiddiy, ammo iliq.

### Boshqarmaga texnik xulosa

Yuqoridagi platforma uchun boshqarmaga taqdim etiladigan 1 betlik texnik xulosa
yoz: arxitektura, xavfsizlikning 6 qatlami, byudjet talab qilinmasligi
(komissiya modeli), 3 oylik pilot rejasi va kutilayotgan raqamli natijalar.

### Xavfsizlik auditi

Ushbu kodni quyidagi nuqtai nazardan tekshir: hisob "ijarasi", bir shaxs
tomonidan bir necha hisob ochish, soxta korxona eʼloni, eskroudan pul oʻgʻirlash,
sifat dalilini qayta ishlatish (foto takrori), boshqarma rolidan shaxsiy
maʼlumot chiqib ketishi. Har bir xavf uchun: qayerda zaif, qanday tuzatish.
