# 00 — Kontekstni tushunganim (tasdiq)

> MASTER PROMPT 1-bandiga javob.

1. **Ikki tomonlama muammo, bitta yechim.** Bir tomonda KSB korxonalar doimiy
   shtat uchun yotoqxona/ovqat xarajatini koʻtara olmay ishchi topolmayapti;
   ikkinchi tomonda mahallada hunari bor, ammo fabrikaga chiqa olmaydigan
   fuqarolar rasman ishsiz turibdi.
2. **Mahsulot — vositachi platforma, yangi byurokratiya emas.** Asosiy sikl:
   vazifa eʼlon qilinadi → fuqaro javob beradi → sifat tasdiqlanadi → eskrou
   orqali kafolatlangan toʻlov.
3. **Huquqiy tayanch PQ-4742 "oʻzini oʻzi band qilish".** Bu ixtiyoriy qadam
   emas — `SelfEmploymentRegistration` MAJBURIY gate: maqom `VERIFIED`
   boʻlmaguncha fuqaro toʻlovli vazifa qabul qila olmaydi.
4. **MVP 4 ta pilot yoʻnalishga qaratiladi** (P1 autsorsing, P2 B2B bozor,
   P3 agro, P4 bandlik/ijtimoiy himoya), lekin maʼlumotlar modeli 8 ta sohaga
   kengayishga tayyor boʻladi.
5. **Pilot tor va aniq:** Oʻrtachirchiq tumani, 1 mahalladan boshlab, 3 oy,
   50–100 fuqaro, 2–3 toʻqimachilik/qadoqlash korxonasi.
6. **Byudjet talab qilinmaydi** — platforma korxonadan olinadigan komissiya
   hisobidan yashaydi, demak `CommissionPolicy` birinchi kundanoq modelda boʻladi.
7. **Foydalanuvchi — arzon Android telefonda, sekin internetda, raqamli
   savodxonligi past.** Bu kosmetik talab emas: u UI, bildirishnoma kanali
   (SMS fallback) va forma dizayniga bevosita taʼsir qiladi.
8. **Ishonch — mahsulotning oʻzagi, qoʻshimcha emas.** 6 qatlam (KYC, liveness,
   eskrou, reyting, PINFL boʻyicha qora roʻyxat, KYB) hammasi MVPda boʻlishi shart.
9. **Boshqarma dashboardi — "sotuv" moduli.** U registrdan chiqqanlar sonini
   koʻrsatadi, lekin shaxsiy maʼlumotni hech qachon koʻrsatmaydi (faqat agregat,
   k-anonimlik ≥ 5).
10. **Arxitektura boshidanoq koʻp-hududli.** Oʻrtachirchiq pilot — respublika
    miqyosidagi "ortiqcha ishchi kuchi hududi ↔ talab hududi" tizimining birinchi
    boʻlagi, shuning uchun har yozuvda hudud identifikatori va
    `LaborSupplyDemandIndex` oldindan koʻzda tutiladi.

---

## Hudud oʻzgarishi (2026-11-19)

Pilot hududi **Nurafshon shahridan Oʻrtachirchiq tumaniga** koʻchirildi
(tuman markazi — Toʻytepa). Bu hujjatdagi raqamlar va mantiq oʻzgarmadi,
faqat hudud nomi yangilandi.

Yangi hududning rasmiy koʻrsatkichlari BANDIM taqdimotida keltirilgan:
mehnat resurslari 81,4 ming, iqtisodiy faol aholi 67 ming, ishsizlik 4,9%.
Asosiy nishon — mehnat resurslarida bor, ammo iqtisodiy faol boʻlmagan
**14,4 ming** fuqaro. `docs/PROMPTS.md` — asl brif, unda eski hudud nomi
ataylab saqlangan.

---

## Men qabul qilgan taxminlar

Brifda ochiq qoldirilgan joylar. Ish toʻxtamasligi uchun quyidagicha qabul
qildim — kelishmasangiz ayting, oʻzgartiraman.

| # | Taxmin | Sabab |
|---|---|---|
| T1 | Valyuta — **UZS**, butun soʻmda (tiyinsiz), `Decimal(18,2)` | Piecework narxi soʻmda; Decimal float xatosidan himoya qiladi |
| T2 | MVPda **bitta til toʻliq** (uz-Latn), qolgan ikkitasi karkas sifatida | Tarjima fayllari tayyor boʻladi, lekin 3 tilni toʻldirish MVPni sekinlashtiradi |
| T3 | Auto-release muddati **5 kun**, `Setting` orqali sozlanadi | Brifda default 5 kun deyilgan |
| T4 | Qayta ishlash (rework) limiti **2 marta**, keyin avtomatik nizo | Brifda "maksimum 2 marta" |
| T5 | `TrustScore` boshlangʻich qiymati **50**, KYC tasdiqlangach +15 | Yangi foydalanuvchi bloklanmasligi, lekin katta ishga ham darrov kirmasligi uchun |
| T6 | k-anonimlik chegarasi **5** | Brifda "5 tadan kam yozuvli kesim yashiriladi" |
| T7 | MVPda push yoʻq, faqat **SMS + Telegram + IN_APP** | Push uchun mobil ilova kerak, u keyingi bosqichda |
| T8 | Bitta `User` bir nechta rolga ega boʻla oladi (`UserRole[]`) | Amalda korxona egasi ham ijrochi boʻlishi mumkin |

---

## Men aniq ajratgan chegara: eskrou va litsenziya

Brifdagi ogohlantirishni arxitekturaga quyidagicha kiritdim:

- Platforma **hech qachon** toʻgʻridan-toʻgʻri pul ushlab turmaydi degan
  taxminni qilmaymiz — buni `LedgerService` abstraksiyasi hal qiladi.
- MVPda: **virtual hamyon + `MockPaymentProvider`** (haqiqiy pul harakati yoʻq,
  demo rejim).
- Ishlab chiqarishda: `escrow_account` hisobi hamkor bank/PSPʼning real
  hisobiga bogʻlanadi, `RealPaymentProvider` ulanadi.
- Kodda bu chegara `packages/integrations/payment` da aniq ajratilgan; ledger
  mantigʻi provayderdan mustaqil va oʻzgarmaydi.

> Bu shuni anglatadiki, litsenziya masalasi hal boʻlgunga qadar ham platformani
> toʻliq qurib, sinovdan oʻtkazib boʻladi.
