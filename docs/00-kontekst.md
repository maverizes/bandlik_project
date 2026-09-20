# 00 — Kontekstni tushunganim (tasdiq)

> MASTER PROMPT 1-bandiga javob.

1. **Ikki tomonlama muammo, bitta yechim.** Bir tomonda KSB korxonalar doimiy
   shtat uchun yotoqxona/ovqat xarajatini ko'tara olmay ishchi topolmayapti;
   ikkinchi tomonda mahallada hunari bor, ammo fabrikaga chiqa olmaydigan
   fuqarolar rasman ishsiz turibdi.
2. **Mahsulot — vositachi platforma, yangi byurokratiya emas.** Asosiy sikl:
   vazifa e'lon qilinadi → fuqaro javob beradi → sifat tasdiqlanadi → eskrou
   orqali kafolatlangan to'lov.
3. **Huquqiy tayanch PQ-4742 "o'zini o'zi band qilish".** Bu ixtiyoriy qadam
   emas — `SelfEmploymentRegistration` MAJBURIY gate: maqom `VERIFIED`
   bo'lmaguncha fuqaro to'lovli vazifa qabul qila olmaydi.
4. **MVP 4 ta pilot yo'nalishga qaratiladi** (P1 autsorsing, P2 B2B bozor,
   P3 agro, P4 bandlik/ijtimoiy himoya), lekin ma'lumotlar modeli 8 ta sohaga
   kengayishga tayyor bo'ladi.
5. **Pilot tor va aniq:** Nurafshon shahri, 1 mahalladan boshlab, 3 oy,
   50–100 fuqaro, 2–3 to'qimachilik/qadoqlash korxonasi.
6. **Byudjet talab qilinmaydi** — platforma korxonadan olinadigan komissiya
   hisobidan yashaydi, demak `CommissionPolicy` birinchi kundanoq modelda bo'ladi.
7. **Foydalanuvchi — arzon Android telefonda, sekin internetda, raqamli
   savodxonligi past.** Bu kosmetik talab emas: u UI, bildirishnoma kanali
   (SMS fallback) va forma dizayniga bevosita ta'sir qiladi.
8. **Ishonch — mahsulotning o'zagi, qo'shimcha emas.** 6 qatlam (KYC, liveness,
   eskrou, reyting, PINFL bo'yicha qora ro'yxat, KYB) hammasi MVPda bo'lishi shart.
9. **Boshqarma dashboardi — "sotuv" moduli.** U registrdan chiqqanlar sonini
   ko'rsatadi, lekin shaxsiy ma'lumotni hech qachon ko'rsatmaydi (faqat agregat,
   k-anonimlik ≥ 5).
10. **Arxitektura boshidanoq ko'p-hududli.** Nurafshon pilot — respublika
    miqyosidagi "ortiqcha ishchi kuchi hududi ↔ talab hududi" tizimining birinchi
    bo'lagi, shuning uchun har yozuvda hudud identifikatori va
    `LaborSupplyDemandIndex` oldindan ko'zda tutiladi.

---

## Men qabul qilgan taxminlar

Brifda ochiq qoldirilgan joylar. Ish to'xtamasligi uchun quyidagicha qabul
qildim — kelishmasangiz ayting, o'zgartiraman.

| # | Taxmin | Sabab |
|---|---|---|
| T1 | Valyuta — **UZS**, butun so'mda (tiyinsiz), `Decimal(18,2)` | Piecework narxi so'mda; Decimal float xatosidan himoya qiladi |
| T2 | MVPda **bitta til to'liq** (uz-Latn), qolgan ikkitasi karkas sifatida | Tarjima fayllari tayyor bo'ladi, lekin 3 tilni to'ldirish MVPni sekinlashtiradi |
| T3 | Auto-release muddati **5 kun**, `Setting` orqali sozlanadi | Brifda default 5 kun deyilgan |
| T4 | Qayta ishlash (rework) limiti **2 marta**, keyin avtomatik nizo | Brifda "maksimum 2 marta" |
| T5 | `TrustScore` boshlang'ich qiymati **50**, KYC tasdiqlangach +15 | Yangi foydalanuvchi bloklanmasligi, lekin katta ishga ham darrov kirmasligi uchun |
| T6 | k-anonimlik chegarasi **5** | Brifda "5 tadan kam yozuvli kesim yashiriladi" |
| T7 | MVPda push yo'q, faqat **SMS + Telegram + IN_APP** | Push uchun mobil ilova kerak, u keyingi bosqichda |
| T8 | Bitta `User` bir nechta rolga ega bo'la oladi (`UserRole[]`) | Amalda korxona egasi ham ijrochi bo'lishi mumkin |

---

## Men aniq ajratgan chegara: eskrou va litsenziya

Brifdagi ogohlantirishni arxitekturaga quyidagicha kiritdim:

- Platforma **hech qachon** to'g'ridan-to'g'ri pul ushlab turmaydi degan
  taxminni qilmaymiz — buni `LedgerService` abstraksiyasi hal qiladi.
- MVPda: **virtual hamyon + `MockPaymentProvider`** (haqiqiy pul harakati yo'q,
  demo rejim).
- Ishlab chiqarishda: `escrow_account` hisobi hamkor bank/PSP'ning real
  hisobiga bog'lanadi, `RealPaymentProvider` ulanadi.
- Kodda bu chegara `packages/integrations/payment` da aniq ajratilgan; ledger
  mantig'i provayderdan mustaqil va o'zgarmaydi.

> Bu shuni anglatadiki, litsenziya masalasi hal bo'lgunga qadar ham platformani
> to'liq qurib, sinovdan o'tkazib bo'ladi.
