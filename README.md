# HUNAR — Bandlik platformasi

**Hududiy bandlik va ishlab chiqarish hamkorlik platformasi.**
Nurafshon shahri (Toshkent viloyati) pilot loyihasi — ishlaydigan demo versiya.

> Bu **demo**: build-tool, paket va internet talab qilmaydi.
> `index.html` ni brauzerda ochsangiz — ishlaydi.

---

## Nima uchun bu platforma

Ikki tomonlama muammo, bitta yechim:

| Muammo | Hozirgi holat |
|---|---|
| **Korxonada ishchi yo'q** | To'qimachilik/qadoqlash korxonalari doimiy shtat uchun yotoqxona va ovqat xarajatini ko'tara olmaydi |
| **Fuqaroda ish yo'q** | Mahallada hunari bor, ammo fabrikaga chiqa olmaydigan uy bekalari va yoshlar rasman ishsiz |

**Yechim sikli:** vazifa e'lon qilinadi → fuqaro javob beradi → sifat tasdiqlanadi
→ kafolatlangan (eskrou) to'lov.

Huquqiy tayanch — **PQ-4742 "O'zini o'zi band qilish"**. Fuqaro birinchi
buyurtmadan oldin shu maqomni oladi: daromadidan soliq olinmaydi, u rasman
"band" hisoblanadi va ishsizlar ro'yxatidan chiqadi.

---

## Demoni ishga tushirish

`index.html` ni brauzerda oching. Yoki lokal server orqali:

```bash
cd ~/Documents/bandlik_project && python3 -m http.server 8000
```

Yuqori o'ng burchakdagi **↻** tugmasi demoni boshlang'ich holatga qaytaradi.

---

## Demo stsenariysi (5 daqiqada ko'rsatish uchun)

Yuqoridagi rol almashtirgich orqali bir foydalanuvchidan boshqasiga o'tasiz.

### 1. Fuqaro — maqom gate'i
Demo **Dilnoza Karimova** nomidan ochiladi. U hali maqom olmagan, shuning uchun
**ishlar ro'yxati ko'rinmaydi** — bu qasddan qilingan:

> Maqom olinmaguncha to'lovli vazifa qabul qilib bo'lmaydi.

"Ariza berish" → "Maqomni tasdiqlash" bosing. Endi 4 ta vazifa ochiladi,
har birida **moslik foizi** ko'rsatiladi (ko'nikma + mahalla + ishonch + tajriba).

### 2. Fuqaro → "Olaman"
Biror vazifaga ariza bering.

### 3. Korxona — nomzodni biriktirish
**Korxona** roliga o'ting. Vazifa ostida nomzodlar ko'rinadi (ishonch bali va
moslik bilan). "Biriktirish" bosing.

### 4. Fuqaro — ishni bajarish
**Fuqaro** → "Mening ishlarim" → "Ishni boshlash" → "Foto qo'shish" →
"Ishni topshirish".

> Fotosiz topshirishga urinib ko'ring — tizim rad etadi.

### 5. Korxona — sifat va to'lov
**Korxona** → "Qabul qilish va to'lash". Eskrou ochiladi, komissiya ushlab
qolinadi, qolgan summa fuqaro hamyoniga tushadi.

### 6. Boshqarma — monitoring
**Boshqarma** roli: KPI'lar, oylik dinamika, **ijtimoiy registrdan chiqqanlar**
va mahalla kesimi. Diqqat qiling:

- Shaxsiy ma'lumot, telefon, hujjat va to'lov tafsiloti **ko'rinmaydi**
- 5 tadan kam yozuvli mahalla `<5` deb yashiriladi (k-anonimlik)
- CSV eksport ishlaydi va audit jurnaliga yoziladi

### 7. Moderator — nizo
**Moderator** roli: ochiq nizo, tomonlar yozishmasi va uchta qaror varianti.
"Bo'lib berish (50/50)" ni tanlang — eskrou aniq bo'linadi, daftar mutanosib qoladi.

---

## Nima ishlaydi (demo qamrovi)

| Modul | Holat |
|---|---|
| "O'zini o'zi band qilish" majburiy gate | ✅ |
| Vazifa holat mashinasi (12 holat) | ✅ |
| Moslik algoritmi (izohlangan ball) | ✅ |
| Foto dalil majburiyligi | ✅ |
| Sifat nazorati: qabul / qayta ishlash / rad | ✅ |
| Eskrou: HELD → RELEASED / REFUNDED / SPLIT | ✅ |
| Double-entry buxgalteriya daftari | ✅ |
| Komissiya (5%, min 20 000 so'm) | ✅ |
| Ishonch bali + avtomatik cheklovlar | ✅ |
| Nizo va moderator qarori | ✅ |
| Boshqarma paneli + k-anonimlik + CSV | ✅ |
| Audit jurnali | ✅ |
| Logistika: 3 pog'onali tarmoq ko'rinishi | ✅ (ko'rsatma) |
| KYC / liveness / SMS / to'lov provayderi | ⬜ mock |
| B2B bozori (RFQ), Agro modul | ⬜ keyingi bosqich |

---

## Fayllar

```
bandlik_project/
├── index.html
├── css/
│   ├── style.css          ranglar, layout, mavzu
│   └── components.css     vazifa kartasi, hamyon, panel, nizo
├── js/
│   ├── data.js            seed: mahallalar, korxonalar, 27 fuqaro, vazifalar
│   ├── core.js            ★ holat mashinasi, eskrou, komissiya, ishonch bali
│   ├── store.js           holat + localStorage + amallar
│   ├── charts.js          SVG grafiklar
│   ├── views.js           4 rol uchun ko'rinishlar
│   └── app.js             router va amallar
└── docs/                  to'liq texnik loyiha (quyida)
```

### `js/core.js` — eng muhim fayl

Bu yerda uch narsa bor va ular UI'dan mustaqil:

1. **`OTISHLAR`** — deklarativ holat jadvali: qaysi holatdan qaysisiga, kim
   huquqli, qanday shart bilan. Holatni to'g'ridan-to'g'ri o'zgartirib
   bo'lmaydi — faqat `otish()` orqali.
2. **`Eskrou`** — pul hayot sikli. Har amal ikki yozuvli (double-entry)
   daftarga tushadi va yozuvlar hech qachon o'chirilmaydi.
3. **`trustHisobla` / `moslikBali`** — ishonch bali va moslik, komponentlarga
   ajratilgan holda (foydalanuvchiga "nega shunday" deb ko'rsatish uchun).

---

## Texnik loyiha (`docs/`)

Demo — bu to'liq platformaning ko'rinadigan qismi. To'liq texnik loyiha:

| Fayl | Mazmuni |
|---|---|
| [`docs/PROMPTS.md`](docs/PROMPTS.md) | Loyihaning manba brifi va 11 bosqichli reja |
| [`docs/00-kontekst.md`](docs/00-kontekst.md) | Kontekst, qabul qilingan taxminlar, eskrou/litsenziya chegarasi |
| [`docs/01-arxitektura.md`](docs/01-arxitektura.md) | Monorepo tuzilmasi, qatlam qoidalari, RBAC matritsasi |
| [`docs/schema.draft.prisma`](docs/schema.draft.prisma) | Ma'lumotlar modeli: 64 model, 38 enum |

> **Eslatma:** `schema.draft.prisma` hali `prisma validate` dan o'tkazilmagan
> (tarmoqqa ulanish bo'lmadi). 1-bosqichda birinchi ish — uni tekshirish.

Ishlab chiqarish versiyasi uchun mo'ljallangan stek: Next.js 15 + TypeScript +
PostgreSQL/Prisma + Redis/BullMQ.

---

## Muhim texnik qaror: eskrou va litsenziya

Haqiqiy eskrou (uchinchi shaxs pulini ushlab turish) O'zbekistonda bank yoki
to'lov tashkiloti litsenziyasini talab qiladi.

Shuning uchun pul harakati **`Eskrou` + ledger abstraksiyasi** orqali
ajratilgan:

- **Demoda:** virtual hamyon, haqiqiy pul harakati yo'q
- **Ishlab chiqarishda:** `escrow` hisobi hamkor bank/PSP hisobiga bog'lanadi

Ledger mantig'i o'zgarmaydi — faqat provayder almashadi. Demak litsenziya
masalasi hal bo'lgunga qadar ham platformani to'liq qurib, sinovdan
o'tkazib bo'ladi.

---

## Pilot parametrlari

| | |
|---|---|
| Hudud | Nurafshon shahri, 1 mahalladan boshlab |
| Muddat | 3 oy |
| Maqsad | 50–100 fuqaro, 2–3 korxona (to'qimachilik/qadoqlash) |
| Byudjet | **Talab qilinmaydi** — platforma korxona komissiyasi hisobidan ishlaydi |
