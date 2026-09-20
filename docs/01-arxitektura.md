# 01 — Arxitektura va papka tuzilmasi

> MASTER PROMPT 2-bandiga javob.

## 1. Umumiy qaror

**Modulli monolit, monorepo ichida.** Mikroservis emas.

Sabab: pilot 3 oy, jamoa kichik, domenlar (vazifa ↔ eskrou ↔ logistika) bir-biri
bilan tranzaksion bog'langan. Mikroservisda eskrou va vazifa holati orasida
taqsimlangan tranzaksiya muammosi paydo bo'ladi — bu pilot uchun ortiqcha xavf.
Modullar `packages/core` ichida aniq chegaralangani uchun keyinchalik ajratish
mumkin.

## 2. Monorepo tuzilmasi

Brifdagi tuzilmaga **2 ta qo'shimcha** kiritdim (sababi bilan):

```
hunar/
├── apps/
│   ├── web/                    Next.js 15 — UI + Route Handlers
│   └── worker/                 (QO'SHILDI) BullMQ jarayonlari alohida process
│
├── packages/
│   ├── db/                     Prisma schema, migratsiya, seed, client
│   ├── core/                   (QO'SHILDI) domen mantiqi: state machine, policy
│   ├── ui/                     shadcn/ui asosidagi umumiy komponentlar
│   ├── integrations/           tashqi adapterlar (interface + mock + real)
│   ├── i18n/                   tarjima xabarlari
│   └── config/                 eslint, tsconfig, tailwind preset
│
├── docs/                       loyiha hujjatlari (shu papka)
├── docker/                     compose fayllari, init skriptlar
└── .github/workflows/          CI
```

**Nega `apps/worker` alohida:** eskrou auto-release, oylik hisobot, marshrut
hisobi va SMS navbati — bular uzoq ishlaydigan vazifalar. Ularni Next.js
serverless-mos jarayonida ushlab turish ishonchsiz. Alohida process gorizontal
kengayadi va web'ni sekinlashtirmaydi.

**Nega `packages/core` alohida:** holat mashinalari va siyosatlar (`RiskPolicy`,
`CommissionPolicy`, `TrustScore` formulasi) sof funksiyalar — DB va HTTP'ga
bog'liq emas. Ularni ajratish: (a) `apps/web` va `apps/worker` ikkalasi
ishlatadi, (b) test yozish oson, (c) kelajakdagi mobil ilova ham qayta ishlatadi.

## 3. `apps/web` ichki tuzilmasi

```
apps/web/src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/           landing, kirish, ommaviy oferta
│   │   ├── (worker)/           ishlar · mening ishlarim · hamyon · profil
│   │   ├── (company)/          e'lon berish · nomzodlar · sifat · hisob-kitob
│   │   ├── (courier)/          bugungi marshrut · skan
│   │   ├── (hub)/              kelgan/ketgan · inventarizatsiya
│   │   ├── (mahalla)/          fuqaroni ro'yxatga olish · tasdiqlash
│   │   ├── (dept)/             boshqarma dashboardi · hisobot eksporti
│   │   ├── (moderator)/        nizolar · qora ro'yxat · fraud navbati
│   │   └── (admin)/            sozlamalar · foydalanuvchilar · seed
│   └── api/                    Route Handlers (yupqa qatlam)
│
├── server/
│   ├── services/               ★ BIZNES MANTIQ SHU YERDA
│   ├── repositories/           Prisma so'rovlari (service ularni chaqiradi)
│   ├── rbac/                   requireRole(), ruxsat matritsasi
│   ├── validation/             Zod sxemalari (har input uchun)
│   ├── errors/                 RFC 7807 problem+json
│   └── audit/                  AuditLog yozuvchi
│
├── components/                 sahifaga xos komponentlar
└── lib/                        klient yordamchi funksiyalar
```

### Qatlam qoidalari (buzilmaydi)

```
Route Handler  →  Service  →  Repository  →  Prisma
     ↑              ↓
   Zod         packages/core (state machine, policy)
```

| Qoida | Nima uchun |
|---|---|
| Route Handler'da biznes mantiq **yo'q** — faqat auth, Zod parse, service chaqirish, javob formatlash | Mantiq testlanadigan va qayta ishlatiladigan bo'lib qoladi |
| Service'dan tashqarida `prisma.*.update({ status })` **taqiqlangan** | Holat faqat state machine orqali o'zgaradi |
| Har bir service metodi — bitta biznes amal, bitta tranzaksiya | Yarim bajarilgan holat bo'lmaydi |
| Har bir pul amali `Idempotency-Key` talab qiladi | Takroriy so'rov ikki marta to'lamaydi |

## 4. Holat mashinasi — texnik yechim

Har domen uchun `packages/core/src/<domain>/transitions.ts`:

```ts
// Namuna — deklarativ ta'rif, kod emas
export const taskTransitions: TransitionTable<TaskStatus, TaskContext> = {
  PUBLISHED: {
    ASSIGNED: {
      roles: ['COMPANY_MANAGER', 'COMPANY_OWNER'],
      guard: (ctx) => ctx.escrow.status === 'HELD'
                   && ctx.worker.selfEmployment === 'VERIFIED',
      audit: 'TASK_ASSIGNED',
    },
    CANCELLED: { roles: [...], guard: ..., audit: 'TASK_CANCELLED' },
  },
  // ...
}
```

`TransitionService.apply(entity, nextStatus, actor)` — yagona kirish nuqtasi:
ruxsatni tekshiradi → guard'ni bajaradi → tranzaksiyada statusni yangilaydi →
`AuditLog` yozadi → hodisa (event) chiqaradi.

> Shu sababli "holatni to'g'ridan-to'g'ri UPDATE qilish taqiqlangan" qoidasi
> texnik jihatdan majburlanadi, shunchaki kelishuv emas.

## 5. RBAC matritsasi (asosiy resurslar)

`✓` = ruxsat · `A` = faqat agregat (shaxsiy ma'lumotsiz) · `O` = faqat o'ziniki
· `H` = faqat o'z hududi · bo'sh = ruxsat yo'q

| Resurs | WORKER | COMPANY_* | COURIER | HUB_OP | MAHALLA_COORD | DEPT_ANALYST | DEPT_ADMIN | MODERATOR | SUPER_ADMIN |
|---|---|---|---|---|---|---|---|---|---|
| Vazifa — ko'rish | ✓ | O | | | H(A) | A | A | ✓ | ✓ |
| Vazifa — yaratish | | ✓ | | | | | | | ✓ |
| Ariza berish | ✓ | | | | | | | | |
| Sifat qabul qilish | | ✓ | | | | | | ✓ | ✓ |
| Hamyon / balans | O | O | O | | | | | | ✓ |
| Pul o'tkazmasi | O | O | O | | | | | | ✓ |
| Shaxsiy hujjat (KYC skan) | O | | O | | | | | ✓ | ✓ |
| Fuqaroni ro'yxatga olish | | | | | H | | | | ✓ |
| Maqom tasdiqlash | | | | | H | | | ✓ | ✓ |
| Yuk / handover | O | O | O | H | | | A | | ✓ |
| Nizo hal qilish | | | | | | | | ✓ | ✓ |
| Qora ro'yxat | | | | | | | | ✓ | ✓ |
| Dashboard KPI | | | | | H(A) | A | A | | ✓ |
| Hisobot eksporti | | | | | | A | A | | ✓ |
| Tizim sozlamalari | | | | | | | | | ✓ |

**Qattiq qoida:** `DEPT_ANALYST` va `DEPT_ADMIN` uchun kod darajasida
`personalDataGuard` — bu rollar telefon, PINFL, passport, karta, to'lov
tafsilotiga so'rov yubora olmaydi. Faqat `*.aggregate.*` service metodlari ochiq.

## 6. Tashqi integratsiyalar — adapter namunasi

```
packages/integrations/<name>/
├── index.ts          export { createProvider }  ← ENV flag bo'yicha tanlaydi
├── types.ts          interface + Zod sxema
├── mock.ts           MockProvider — MVPda TO'LIQ ISHLAYDI
└── real.ts           RealProvider — stub, TODO bilan
```

ENV: `IDENTITY_PROVIDER=mock|oneid`, `PAYMENT_PROVIDER=mock|payme|click`,
`SMS_PROVIDER=mock|eskiz`, va h.k.

> **Qoida:** hech qanday integratsiya yo'qligi MVPni to'xtatmaydi. `pnpm dev`
> toza mashinada, hech qanday tashqi kalit bo'lmasa ham to'liq ishlaydi.

## 7. Ko'p-hududlilik (multi-region tenancy)

- Deyarli har bir asosiy modelda `regionId`, `districtId`, `mahallaId`.
- RBAC middleware foydalanuvchi hududini so'rovga avtomatik qo'shadi
  (`scopeToRegion`), `H` belgili rollar uchun majburiy.
- `LaborSupplyDemandIndex` — hudud × soha × ko'nikma kesimida taklif/talab
  balansi. Pilotda bitta shahar, lekin model kengayishga tayyor.

## 8. Xavfsizlikning 6 qatlami — qayerda joylashadi

| # | Qatlam | Joylashuvi |
|---|---|---|
| 1 | Shaxsni tasdiqlash | `integrations/identity` + `services/kyc.service.ts` |
| 2 | Liveness | `integrations/liveness` + `core/risk/RiskPolicy.ts` (trigger qoidalari) |
| 3 | Eskrou | `services/escrow.service.ts` + `core/escrow/transitions.ts` |
| 4 | Reyting / TrustScore | `core/trust/score.ts` + `services/rating.service.ts` |
| 5 | Qora ro'yxat (PINFL hash) | `services/blacklist.service.ts`, `Blacklist.pinflHash` unique |
| 6 | KYB | `integrations/tax` + `services/kyb.service.ts` |

Ro'yxatning to'liq, fayl-funksiya darajasidagi varianti 11-bosqichda
`docs/security-checklist.md` sifatida chiqariladi.

## 9. Nofunksional talablarning texnik aksi

| Talab | Yechim |
|---|---|
| Sekin internet | RSC + minimal klient JS, rasm `next/image` lazy, ro'yxatlar kursor-paginatsiya |
| Offline-tolerant forma | Forma holati `localStorage` da draft sifatida, qayta yuborish tugmasi |
| Past raqamli savodxonlik | Har ekranda 1 ta asosiy harakat, `min-height: 48px` tugma, ikonka + matn, qadam indikatori |
| SMS fallback | `NotificationService` kanal zanjiri: TELEGRAM → IN_APP → SMS (narx bo'yicha) |
| Data residency | Barcha servis O'zbekiston hududidagi infratuzilmada; S3 mos ombor lokal |
| Shaxsiy ma'lumot qonuni | `ConsentRecord` (matn versiyasi bilan), saqlash muddati `Setting`da, o'chirish so'rovi oqimi |

## 10. Ochiq savollar (javob kerak, lekin ishni to'xtatmaydi)

1. Komissiya foizi qancha? (MVPda `Setting` orqali, default 5% taklif qilaman)
2. Boshqarma hisoboti qaysi rasmiy blank formatida bo'lishi kerak? (namuna kerak)
3. Mahalla nuqtasi sifatida qaysi bino ishlatiladi — FYG binosimi?
4. Kuryer haqi kim tomonidan to'lanadi: korxonami yoki platformami?
