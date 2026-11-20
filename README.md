# HUNAR — Bandlik platformasi

**Ish qidirayotgan fuqarolar va ishchi qidirayotgan korxonalarni bogʻlaydigan platforma.**
Oʻrtachirchiq tumani (Toshkent viloyati) pilot loyihasi — ishlaydigan demo.

> Build-tool, paket va internet talab qilmaydi.
> `index.html` ni brauzerda ochsangiz — ishlaydi.

---

## Nima uchun bu platforma

| Muammo | Hozirgi holat |
|---|---|
| **Korxonada ishchi yoʻq** | Toʻqimachilik/qadoqlash korxonalari doimiy shtat uchun yotoqxona va ovqat xarajatini koʻtara olmaydi |
| **Fuqaroda ish yoʻq** | Mahallada hunari bor, ammo fabrikaga chiqa olmaydigan uy bekalari va yoshlar rasman ishsiz |

**Yechim sikli:** vazifa eʼlon qilinadi → fuqaro javob beradi → sifat tasdiqlanadi
→ kafolatlangan (eskrou) toʻlov.

Huquqiy tayanch — **PQ-4742 "Oʻzini oʻzi band qilish"**. Fuqaro birinchi
buyurtmadan oldin shu maqomni oladi: daromadidan soliq olinmaydi, u rasman
"band" hisoblanadi va ishsizlar roʻyxatidan chiqadi.

---

## Ishga tushirish

`index.html` ni brauzerda oching. Yoki lokal server orqali:

```bash
cd ~/Documents/bandlik_project && python3 -m http.server 8000
```

Yuqori oʻngdagi **↻** tugmasi demoni boshidan boshlaydi (kirish oqimi bilan).

---

## Foydalanuvchi tajribasi

Auditoriya — **mahalladagi oddiy odam**: arzon Android telefon, sekin internet,
raqamli savodxonlik turlicha. Butun interfeys shunga moslangan.

### Kirish oqimi

Saytga kirgan odam birinchi boʻlib **"Nima qilmoqchisiz?"** savolini koʻradi —
roʻyxatdan oʻtishdan ham oldin:

```
Xush kelibsiz → Ish qidiryapman / Ishchi qidiryapman → telefon → SMS kod
→ ism (yoki korxona) → mahalla → koʻnikma → Tayyor
```

Har ekranda **bitta savol**, katta tugma, aniq qadam koʻrsatkichi va orqaga
qaytish imkoni. Telefon raqami va STIR yozilayotganda avtomatik formatlanadi.
SMS kodi demo rejimida ekranda koʻrsatiladi.

### Asosiy qarorlar

| Qaror | Sabab |
|---|---|
| Yorqin, iliq ranglar (koʻk → binafsha, zargʻaldoq CTA) | Bandlik — umid mavzusi. Qorongʻi, rasmiy interfeys begonalashtiradi |
| Tugma balandligi kamida **52px** | Barmoq bilan bosish uchun; keksa foydalanuvchi ham adashmaydi |
| Summa — eng katta element | Foydalanuvchi birinchi navbatda "qancha pul?" deb qaraydi |
| Telefonda **pastki navigatsiya** | Bosh barmoq yetadigan joy; yuqori tablar telefonda noqulay |
| Jargon yoʻq: "Nechta?", "Necha kunda?" | "Miqdor", "deadline" oʻrniga kundalik til |
| Foto qoʻshilmaguncha topshirish tugmasi **oʻchiq** | Xatoni oldindan toʻsish — bosgandan keyin xato chiqarishdan yaxshiroq |

### Rasmlar haqida

Barcha vizual element — **ichki SVG**. Sabab: sekin internetda tashqi foto
yuklanmaydi va "singan rasm" koʻrinadi. SVG bir zumda chiziladi, tarmoq talab
qilmaydi va hech qachon buzilmaydi.

Haqiqiy foto qoʻshmoqchi boʻlsangiz — [`js/rasmlar.js`](js/rasmlar.js)
faylining boshidagi `FOTO` obyektiga URL yozing:

```js
const FOTO = {
  tikuvchilik: 'https://images.unsplash.com/photo-XXXX?w=600&q=70',
  qadoqlash:   '',   // boʻsh qoldirilsa — gradient + ikonka
  ...
};
```

Foto yuklanmasa avtomatik illyustratsiyaga qaytadi — sayt buzilmaydi.

---

## Demo stsenariysi (5 daqiqa)

Yuqoridagi **Demo** panelidan rollar orasida oʻtasiz.

1. **Kirish oqimi** — "Ish qidiryapman" ni tanlang, roʻyxatdan oʻting.
2. **Maqom gateʼi** — ishlar roʻyxati koʻrinmaydi. Bu qasddan: maqom olinmaguncha
   toʻlovli ish qabul qilib boʻlmaydi. "Ariza berish" → "Tasdiqni olish".
3. **Ish tanlash** — 4 ta vazifa, har birida **moslik foizi**
   (koʻnikma + mahalla + ishonch + tajriba). "Olaman" bosing.
4. **Korxona** roliga oʻting → nomzodni "Tanlash".
5. **Fuqaro** → "Mening ishlarim" → boshlash → foto → topshirish.
6. **Korxona** → sifat roʻyxatini tekshirib "Qabul qilish va toʻlash".
   Eskrou ochiladi, komissiya ushlanadi, qolgani hamyonga tushadi.
7. **Boshqarma** → KPIʼlar, registrdan chiqqanlar, k-anonimlik, CSV eksport.
8. **Moderator** → nizo, tomonlar izohi, "Boʻlib berish (50/50)" qarori.

---

## Nima ishlaydi

| Modul | Holat |
|---|---|
| Kirish oqimi: rol tanlash + roʻyxatdan oʻtish | ✅ |
| "Oʻzini oʻzi band qilish" majburiy gate | ✅ |
| Vazifa holat mashinasi (12 holat) | ✅ |
| Moslik algoritmi (izohlangan ball) | ✅ |
| Sifat nazorati: qabul / tuzatish / rad | ✅ |
| Eskrou: HELD → RELEASED / REFUNDED / SPLIT | ✅ |
| Double-entry buxgalteriya daftari | ✅ |
| Komissiya (5%, eng kami 20 000 soʻm) | ✅ |
| Ishonch bali + avtomatik cheklovlar | ✅ |
| Nizo va moderator qarori | ✅ |
| Boshqarma paneli + k-anonimlik + CSV | ✅ |
| Audit jurnali | ✅ |
| Logistika: 3 pogʻonali tarmoq | ✅ (koʻrsatma) |
| KYC / liveness / SMS / toʻlov provayderi | ⬜ mock |
| B2B bozori (RFQ), Agro modul | ⬜ keyingi bosqich |

---

## Fayllar

```
bandlik_project/
├── index.html
├── css/
│   ├── style.css          ranglar, layout, tugma, pastki navigatsiya
│   ├── components.css     vazifa kartasi, hamyon, panel, nizo
│   └── onboarding.css     kirish oqimi
├── js/
│   ├── data.js            seed: mahallalar, korxonalar, 27 fuqaro, vazifalar
│   ├── core.js            ★ holat mashinasi, eskrou, komissiya, ishonch bali
│   ├── rasmlar.js         SVG illyustratsiyalar + foto sozlamasi
│   ├── store.js           holat + localStorage + amallar
│   ├── onboarding.js      kirish oqimi
│   ├── charts.js          SVG grafiklar
│   ├── views.js           4 rol uchun koʻrinishlar
│   └── app.js             router, pastki navigatsiya, amallar
└── docs/                  toʻliq texnik loyiha
```

### `js/core.js` — eng muhim fayl

UIʼdan butunlay mustaqil uch narsa:

1. **`OTISHLAR`** — deklarativ holat jadvali: qaysi holatdan qaysisiga, kim
   huquqli, qanday shart bilan. Holat faqat `otish()` orqali oʻzgaradi.
2. **`Eskrou`** — pul hayot sikli. Har amal ikki yozuvli daftarga tushadi,
   yozuvlar hech qachon oʻchirilmaydi.
3. **`trustHisobla` / `moslikBali`** — komponentlarga ajratilgan holda, chunki
   foydalanuvchiga "nega shunday" deb koʻrsatish kerak.

---

## Texnik loyiha (`docs/`)

| Fayl | Mazmuni |
|---|---|
| [`docs/PROMPTS.md`](docs/PROMPTS.md) | Manba brif va 11 bosqichli reja |
| [`docs/00-kontekst.md`](docs/00-kontekst.md) | Kontekst, taxminlar, eskrou/litsenziya chegarasi |
| [`docs/01-arxitektura.md`](docs/01-arxitektura.md) | Monorepo, qatlam qoidalari, RBAC matritsasi |
| [`docs/schema.draft.prisma`](docs/schema.draft.prisma) | 64 model, 38 enum |

> `schema.draft.prisma` hali `prisma validate` dan oʻtkazilmagan (tarmoq yoʻq edi).
> Ishlab chiqarish bosqichida birinchi ish — uni tekshirish.

Ishlab chiqarish uchun moʻljallangan stek: Next.js 15 + TypeScript +
PostgreSQL/Prisma + Redis/BullMQ.

---

## Eskrou va litsenziya

Haqiqiy eskrou Oʻzbekistonda bank yoki toʻlov tashkiloti litsenziyasini talab
qiladi. Shuning uchun pul harakati abstraksiya orqali ajratilgan:

- **Demoda:** virtual hamyon, haqiqiy pul harakati yoʻq
- **Ishlab chiqarishda:** `eskrou` hisobi hamkor bank/PSP hisobiga bogʻlanadi

Ledger mantigʻi oʻzgarmaydi — faqat provayder almashadi.

---

## Pilot parametrlari

| | |
|---|---|
| Hudud | Oʻrtachirchiq tumani, 1 mahalladan boshlab |
| Muddat | 3 oy |
| Maqsad | 50–100 fuqaro, 2–3 korxona |
| Byudjet | **Talab qilinmaydi** — korxona komissiyasi hisobidan |
