/* =============================================================================
   VIEWS — HTML generatsiya
   ============================================================================= */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function pul(n) {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0)).replace(/,/g, ' ') + " so'm";
}
function qisqaPul(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0','') + ' mln';
  if (n >= 1_000) return Math.round(n / 1_000) + ' ming';
  return String(n);
}
function belgi(holat) {
  const h = HOLAT_MATN[holat] || { matn: holat, rang: 'kul' };
  return `<span class="belgi ${h.rang}">${esc(h.matn)}</span>`;
}
function bosh(belgicha, matn) {
  return `<div class="bosh"><div class="belgicha">${belgicha}</div><p>${esc(matn)}</p></div>`;
}
function konikmaNomlari(ids) {
  return (ids || []).map(id => (KONIKMALAR.find(k => k.id === id) || {}).nom).filter(Boolean);
}
function mahallaNomi(id) { return (MAHALLALAR.find(m => m.id === id) || {}).nom || '—'; }
function hubNomi(id) { return (HUBLAR.find(h => h.id === id) || {}).nom || '—'; }
function bosh_harf(nom) { return (nom || '?').trim().charAt(0).toUpperCase(); }

/* =============================================================== FUQARO ==== */

const V_Fuqaro = {

  ishlar() {
    const st = Store.get();
    const men = Store.menFuqaro();

    if (men.selfEmployment !== 'VERIFIED') return V_Fuqaro.gate(men);

    const ochiq = st.vazifalar.filter(v => v.holat === 'PUBLISHED');
    const chek = cheklov(men.trust);

    const royxat = ochiq.map(v => {
      const m = moslikBali(v, men);
      const arizaBergan = v.arizalar.indexOf(men.id) !== -1;
      const trustYetmas = v.minTrust && men.trust < v.minTrust;
      return { v, m, arizaBergan, trustYetmas };
    }).sort((a, b) => b.m.ball - a.m.ball);

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Mavjud ishlar</h1>
        <p>Sizning ko'nikmangiz va mahallangizga qarab saralangan.</p>
      </div>

      <div class="eslatma yaxshi" style="margin-bottom:18px">
        <h4>✓ Siz ishlashga tayyorsiz</h4>
        <p>"O'zini o'zi band qilgan shaxs" maqomi faol. Ishonch bali: <b>${men.trust}</b> —
           ${esc(chek.izoh)}. Bir vaqtda ${chek.maksVazifa} tagacha vazifa olishingiz mumkin.</p>
      </div>

      ${royxat.length ? `<div class="setka setka-2">${royxat.map(r => V_Fuqaro.vazifaKarta(r)).join('')}</div>`
                      : bosh('📭', 'Hozircha sizga mos ish yo\'q. Keyinroq qayta tekshiring.')}
    </div>`;
  },

  gate(men) {
    const qadam = men.selfEmployment === 'PENDING' ? 2 : 1;
    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Mavjud ishlar</h1>
        <p>Ishlashni boshlash uchun bitta qadam qoldi.</p>
      </div>

      <div class="gate">
        <div class="belgicha">${men.selfEmployment === 'PENDING' ? '⏳' : '📋'}</div>
        <h3>${men.selfEmployment === 'PENDING' ? 'Arizangiz ko\'rib chiqilmoqda' : "Avval maqom olishingiz kerak"}</h3>
        <p>Qonun bo'yicha to'lovli ish qabul qilish uchun siz
           <b>"o'zini o'zi band qilgan shaxs"</b> maqomiga ega bo'lishingiz shart
           (PQ-4742). Bu bepul va bir marta qilinadi.</p>

        <div class="qadamlar">
          <div class="qadam tayyor"><span class="n">✓</span><span>Telefon raqam tasdiqlandi</span></div>
          <div class="qadam ${qadam >= 2 ? 'tayyor' : 'joriy'}"><span class="n">${qadam >= 2 ? '✓' : '2'}</span><span>Shaxsni tasdiqlash va ariza berish</span></div>
          <div class="qadam ${qadam >= 2 ? 'joriy' : ''}"><span class="n">3</span><span>Soliq organidan maqom olish</span></div>
        </div>

        ${men.selfEmployment === 'NOT_STARTED'
          ? `<button class="tugma asos" data-amal="maqom-ariza">Ariza berish →</button>`
          : `<button class="tugma yashil" data-amal="maqom-tasdiq">Maqomni tasdiqlash (demo) →</button>
             <div style="margin-top:10px;font-size:12.5px;color:var(--matn-3)">
               Haqiqiy tizimda bu javob Soliq qo'mitasi bazasidan keladi</div>`}
      </div>

      <div class="eslatma" style="margin-top:18px">
        <h4>ℹ️ Maqom nima beradi</h4>
        <p>Daromaddan jismoniy shaxs daromad solig'i olinmaydi · Siz rasman "band"
           hisoblanasiz va ishsizlar ro'yxatidan chiqasiz · Raqamli mehnat tarixingiz
           shakllanadi.</p>
      </div>
    </div>`;
  },

  vazifaKarta(r) {
    const v = r.v, m = r.m;
    const korxona = Store.korxona(v.korxona);
    return `
    <article class="vazifa">
      <div class="vazifa-yuqori">
        <h3>${esc(v.nom)}</h3>
        ${belgi(v.holat)}
      </div>
      <p class="vazifa-tavsif">${esc(v.tavsif)}</p>

      <div class="vazifa-pul">
        <div>
          <div class="vazifa-summa">${pul(v.jami || jamiSumma(v))}</div>
          <div class="vazifa-hisob">${pul(v.narx)} × ${v.miqdor} ${esc(v.birlik)}</div>
        </div>
        <div class="vazifa-muddat">${v.muddatKun} kun</div>
      </div>

      <div class="moslik">
        <span>Moslik</span>
        <span class="moslik-chiziq"><i style="width:${m.ball}%"></i></span>
        <b>${m.ball}%</b>
      </div>

      <div class="vazifa-qator">
        <span>🏢 ${esc(korxona ? korxona.nom : '')}</span>
        <span>📍 ${esc(mahallaNomi(v.mahalla))}</span>
        <span>🧰 ${esc(konikmaNomlari(v.konikma).join(', '))}</span>
        <span>📦 ${esc(v.xomashyo)}</span>
      </div>

      ${r.trustYetmas
        ? `<div class="eslatma xato" style="padding:10px 12px"><p>Kerakli ishonch bali: ${v.minTrust}. Sizda: ${Store.menFuqaro().trust}</p></div>`
        : r.arizaBergan
          ? `<button class="tugma keng" disabled>✓ Ariza berilgan — javob kutilmoqda</button>`
          : `<button class="tugma asos keng" data-amal="ariza" data-id="${v.id}">Olaman</button>`}
    </article>`;
  },

  meningIshlarim() {
    const st = Store.get();
    const men = Store.menFuqaro();
    const meniki = st.vazifalar.filter(v => v.ijrochi === men.id);

    if (!meniki.length) return `<div class="kirish"><div class="sahifa-bosh"><h1>Mening ishlarim</h1></div>
      ${bosh('📋', "Hali ish olmagansiz. \"Ishlar\" bo'limidan boshlang.")}</div>`;

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Mening ishlarim</h1>
        <p>${meniki.length} ta ish — holati bo'yicha</p></div>
      <div class="setka">${meniki.map(v => V_Fuqaro.ishKarta(v)).join('')}</div>
    </div>`;
  },

  ishKarta(v) {
    const korxona = Store.korxona(v.korxona);
    let amal = '';

    if (v.holat === 'ASSIGNED') {
      amal = `<button class="tugma asos keng" data-amal="boshla" data-id="${v.id}">Ishni boshlash</button>`;
    } else if (v.holat === 'IN_PROGRESS' || v.holat === 'REWORK') {
      amal = `
        ${v.holat === 'REWORK' ? `<div class="eslatma xato" style="margin-bottom:10px;padding:10px 12px">
           <h4>Qayta ishlash so'ralgan (${v.qaytaIshlash}/2)</h4>
           <p>${esc(v.rejectSabab || '')}</p></div>` : ''}
        <div class="maydon">
          <label>Foto dalil ${v.fotoTalab ? '(majburiy)' : '(ixtiyoriy)'}</label>
          <button class="tugma keng" data-amal="foto" data-id="${v.id}">
            📷 ${(v.foto && v.foto.length) ? v.foto.length + ' ta foto qo\'shildi' : 'Foto qo\'shish'}
          </button>
        </div>
        <button class="tugma asos keng" data-amal="topshir" data-id="${v.id}">Ishni topshirish</button>`;
    } else if (v.holat === 'UNDER_REVIEW') {
      amal = `<div class="eslatma ogoh" style="padding:10px 12px"><p>Korxona tekshirmoqda.
        ${AUTO_RELEASE_KUN} kun ichida javob bermasa — pul avtomatik sizga o'tadi.</p></div>`;
    } else if (v.holat === 'PAID') {
      const e = v.eskrou || {};
      amal = `<div class="eslatma yaxshi" style="padding:10px 12px">
        <h4>✓ To'lov amalga oshdi</h4>
        <p>Hamyoningizga <b>${pul(e.sof || 0)}</b> tushdi
        (komissiya ${pul(e.komissiyaOlingan || 0)} korxonadan olindi).</p></div>`;
    } else if (v.holat === 'DISPUTED') {
      amal = `<div class="eslatma xato" style="padding:10px 12px"><p>Nizo ochilgan — moderator ko'rib chiqmoqda.</p></div>`;
    }

    return `
    <article class="karta"><div class="karta-ich">
      <div class="vazifa-yuqori"><h3>${esc(v.nom)}</h3>${belgi(v.holat)}</div>
      <div class="vazifa-pul">
        <div><div class="vazifa-summa">${pul(v.jami || jamiSumma(v))}</div>
        <div class="vazifa-hisob">${esc(korxona ? korxona.nom : '')}</div></div>
      </div>
      ${V_Fuqaro.bosqichChiziq(v.holat)}
      ${amal}
    </div></article>`;
  },

  bosqichChiziq(holat) {
    const bosqichlar = ['ASSIGNED','IN_PROGRESS','UNDER_REVIEW','PAID'];
    const nomlar = ['Olindi','Bajarilmoqda','Tekshiruvda',"To'landi"];
    let joriy = bosqichlar.indexOf(holat);
    if (holat === 'REWORK' || holat === 'SUBMITTED') joriy = 1;
    if (holat === 'ACCEPTED') joriy = 3;
    if (holat === 'DISPUTED') joriy = 2;

    return `<div class="qadamlar" style="max-width:none;margin-bottom:14px">
      ${bosqichlar.map((b, i) => `
        <div class="qadam ${i < joriy ? 'tayyor' : i === joriy ? 'joriy' : ''}">
          <span class="n">${i < joriy ? '✓' : i + 1}</span><span>${nomlar[i]}</span>
        </div>`).join('')}
    </div>`;
  },

  hamyon() {
    const men = Store.menFuqaro();
    const st = Store.get();
    const balans = Store.balans(men.id);
    const kutilayotgan = st.vazifalar
      .filter(v => v.ijrochi === men.id && ['IN_PROGRESS','UNDER_REVIEW','SUBMITTED','ASSIGNED','REWORK'].indexOf(v.holat) !== -1)
      .reduce((s, v) => s + (v.jami || jamiSumma(v)), 0);

    const tarix = st.ledger.filter(t =>
      t.yozuvlar.some(y => y.hisob === 'fuqaro:' + men.id));

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Hamyon</h1></div>

      <div class="hamyon">
        <div class="yorliq">Mavjud balans</div>
        <div class="summa">${pul(balans)}</div>
        <div class="hamyon-qator">
          <div><div class="b">Eskrouda kutilmoqda</div><div class="q">${pul(kutilayotgan)}</div></div>
          <div><div class="b">Jami daromad</div><div class="q">${pul(men.daromad)}</div></div>
          <div><div class="b">Bajarilgan ish</div><div class="q">${men.bajargan}</div></div>
        </div>
      </div>

      <div class="tugma-qator" style="margin-top:14px">
        <button class="tugma asos" data-amal="pul-yech" ${balans <= 0 ? 'disabled' : ''}>Pul yechish</button>
      </div>

      ${balans > 0 ? `<div class="eslatma ogoh" style="margin-top:14px">
        <h4>🔐 Pul yechishda qo'shimcha tekshiruv</h4>
        <p>Birinchi pul yechishda yuz orqali jonli tekshirish (liveness) talab qilinadi —
           bu hisobingizni boshqa shaxs ishlatishidan himoya qiladi.</p></div>` : ''}

      <div class="bolim-bosh"><h2>Harakatlar tarixi</h2></div>
      ${tarix.length ? tarix.slice().reverse().map(t => {
        const meniki = t.yozuvlar.find(y => y.hisob === 'fuqaro:' + men.id);
        return `<div class="ledger-yozuv">
          <div class="ledger-bosh">
            <span class="ledger-tur">${esc(t.tur)}</span>
            <span class="ledger-izoh">${esc(t.izoh)}</span>
          </div>
          <div class="ledger-qator"><span>Hamyoningiz</span>
            <span class="d">+ ${pul(meniki.summa)}</span></div>
        </div>`;
      }).join('') : bosh('💳', 'Hali harakat yo\'q')}
    </div>`;
  },

  profil() {
    const men = Store.menFuqaro();
    const t = trustHisobla(men);
    const chek = cheklov(men.trust);

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>${esc(men.nom)}</h1>
        <p>${esc(mahallaNomi(men.mahalla))} mahallasi · ${men.yosh} yosh</p></div>

      <div class="setka setka-2">
        <div class="karta"><div class="karta-ich">
          <h3 style="font-size:15px;margin-bottom:12px">Maqom va tekshiruv</h3>
          <div class="qadamlar" style="max-width:none;margin:0">
            <div class="qadam tayyor"><span class="n">✓</span><span>Telefon tasdiqlangan</span></div>
            <div class="qadam ${men.selfEmployment === 'VERIFIED' ? 'tayyor' : ''}">
              <span class="n">${men.selfEmployment === 'VERIFIED' ? '✓' : '!'}</span>
              <span>O'zini o'zi band qilgan shaxs</span></div>
            <div class="qadam ${men.selfEmployment === 'VERIFIED' ? 'tayyor' : ''}">
              <span class="n">${men.selfEmployment === 'VERIFIED' ? '✓' : '—'}</span>
              <span>Shaxs tasdiqlangan (KYC)</span></div>
          </div>
          ${men.registry && men.registry.length ? `<div style="margin-top:12px">
            <div style="font-size:12.5px;color:var(--matn-3);margin-bottom:5px">Ijtimoiy registr</div>
            ${men.registry.map(r => `<span class="belgi sariq" style="margin-right:5px">${
              r === 'temir' ? 'Temir daftar' : r === 'ayollar' ? 'Ayollar daftari' : 'Yoshlar daftari'}</span>`).join('')}
          </div>` : ''}
        </div></div>

        <div class="karta"><div class="karta-ich">
          <h3 style="font-size:15px;margin-bottom:4px">Ishonch bali</h3>
          <div style="font-size:34px;font-weight:760;color:var(--asos);line-height:1.1">${men.trust}<span style="font-size:17px;color:var(--matn-3)">/100</span></div>
          <div style="font-size:12.5px;color:var(--matn-3);margin-bottom:12px">${esc(chek.izoh)}</div>
          ${t.komponentlar.map(k => `
            <div class="ustun-qator" style="font-size:12.5px;margin-bottom:6px">
              <span class="ustun-nom" style="width:130px;flex:0 0 130px">${esc(k.nom)}</span>
              <span class="ustun-yolak" style="height:14px"><i style="width:${k.ball / k.maks * 100}%"></i></span>
              <span class="ustun-qiymat" style="width:42px">${k.ball}/${k.maks}</span>
            </div>`).join('')}
        </div></div>
      </div>

      <div class="bolim-bosh"><h2>Ko'nikmalar</h2></div>
      <div class="karta"><div class="karta-ich">
        ${konikmaNomlari(men.konikma).map(k => `<span class="belgi kok" style="margin:0 6px 6px 0">${esc(k)}</span>`).join('')}
      </div></div>
    </div>`;
  }
};

/* ============================================================== KORXONA ==== */

const V_Korxona = {

  vazifalar() {
    const st = Store.get();
    const k = Store.menKorxona();
    const meniki = st.vazifalar.filter(v => v.korxona === k.id);

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>${esc(k.nom)}</h1>
        <p>STIR ${esc(k.stir)} · ${esc(k.soha)} · Hisob: <b>${pul(k.balans)}</b></p></div>

      <div class="setka setka-4" style="margin-bottom:20px">
        <div class="stat"><div class="q">${meniki.filter(v => v.holat === 'PUBLISHED').length}</div><div class="y">E'lon qilingan</div></div>
        <div class="stat"><div class="q">${meniki.filter(v => ['ASSIGNED','IN_PROGRESS','REWORK'].indexOf(v.holat) !== -1).length}</div><div class="y">Bajarilmoqda</div></div>
        <div class="stat"><div class="q" style="color:var(--sariq)">${meniki.filter(v => v.holat === 'UNDER_REVIEW').length}</div><div class="y">Tekshiruv kutmoqda</div></div>
        <div class="stat"><div class="q" style="color:var(--yashil)">${meniki.filter(v => v.holat === 'PAID').length}</div><div class="y">Yakunlangan</div></div>
      </div>

      ${meniki.length ? `<div class="setka">${meniki.map(v => V_Korxona.karta(v)).join('')}</div>`
                      : bosh('📋', "Hali vazifa e'lon qilmagansiz")}
    </div>`;
  },

  karta(v) {
    const e = v.eskrou || {};
    const nomzodlar = (v.arizalar || []).map(id => Store.fuqaro(id)).filter(Boolean);
    const ijrochi = v.ijrochi ? Store.fuqaro(v.ijrochi) : null;

    return `
    <article class="karta"><div class="karta-ich">
      <div class="vazifa-yuqori"><h3>${esc(v.nom)}</h3>${belgi(v.holat)}</div>

      <div class="vazifa-pul">
        <div><div class="vazifa-summa">${pul(v.jami || jamiSumma(v))}</div>
          <div class="vazifa-hisob">${pul(v.narx)} × ${v.miqdor} ${esc(v.birlik)}</div></div>
        <div class="vazifa-muddat">${e.holat ? ESKROU_MATN[e.holat] : ''}</div>
      </div>

      ${ijrochi ? `<div class="vazifa-qator"><span>👤 Ijrochi: <b>${esc(ijrochi.nom)}</b></span>
        <span>⭐ Ishonch: ${ijrochi.trust}</span><span>📍 ${esc(mahallaNomi(ijrochi.mahalla))}</span></div>` : ''}

      ${v.holat === 'PUBLISHED' ? (nomzodlar.length ? `
        <div style="margin-top:6px">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px">Nomzodlar (${nomzodlar.length})</div>
          ${nomzodlar.map(f => {
            const m = moslikBali(v, f);
            return `<div class="ulush" style="margin-bottom:7px">
              <span class="xabar-avatar">${bosh_harf(f.nom)}</span>
              <span><span class="u-nom">${esc(f.nom)}</span>
                <span class="u-izoh">${esc(mahallaNomi(f.mahalla))} · ${f.bajargan} ish · ishonch ${f.trust} · moslik ${m.ball}%</span></span>
              <button class="tugma asos mayda" style="margin-left:auto"
                data-amal="biriktir" data-id="${v.id}" data-fuqaro="${f.id}">Biriktirish</button>
            </div>`;
          }).join('')}
        </div>` : `<div class="eslatma" style="padding:10px 12px"><p>Hali ariza yo'q — fuqarolarga ko'rsatilmoqda.</p></div>`) : ''}

      ${v.holat === 'UNDER_REVIEW' ? `
        <div class="eslatma ogoh" style="margin-bottom:10px;padding:10px 12px">
          <h4>Sifatni tekshiring</h4>
          <p>${v.fotoTalab ? ((v.foto && v.foto.length) || 0) + ' ta foto dalil yuborilgan. ' : ''}
             ${AUTO_RELEASE_KUN} kun ichida javob bermasangiz — to'lov avtomatik ijrochiga o'tadi.</p>
        </div>
        <div style="font-size:13px;font-weight:600;margin-bottom:6px">Sifat mezonlari</div>
        <div style="margin-bottom:12px">${(v.sifat || []).map(s =>
          `<div style="font-size:13.5px;color:var(--matn-2);padding:3px 0">☑ ${esc(s)}</div>`).join('')}</div>
        <div class="tugma-qator">
          <button class="tugma yashil" data-amal="qabul" data-id="${v.id}">✓ Qabul qilish va to'lash</button>
          <button class="tugma" data-amal="qayta" data-id="${v.id}">↻ Qayta ishlashga</button>
          <button class="tugma qizil" data-amal="nizo" data-id="${v.id}">Rad etish</button>
        </div>` : ''}

      ${v.holat === 'PAID' ? `<div class="eslatma yaxshi" style="padding:10px 12px">
        <h4>✓ Yakunlandi</h4>
        <p>Ijrochiga ${pul(e.sof || 0)} · Platforma komissiyasi ${pul(e.komissiyaOlingan || 0)}</p></div>` : ''}
    </div></article>`;
  },

  yangi() {
    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Yangi vazifa e'lon qilish</h1>
        <p>To'ldiring — tizim uni mos fuqarolarga ko'rsatadi.</p></div>

      <div class="karta"><div class="karta-ich">
        <div class="maydon">
          <label>Vazifa nomi</label>
          <input class="kirit" id="f-nom" placeholder="Masalan: Bolalar futbolkasi — yeng tikish">
        </div>
        <div class="maydon">
          <label>Tavsif — ijrochi nima qilishi kerak</label>
          <textarea class="kirit" id="f-tavsif" placeholder="Xomashyo, namuna va talablarni yozing"></textarea>
        </div>

        <div class="setka setka-3">
          <div class="maydon"><label>Bir birlik narxi (so'm)</label>
            <input class="kirit" id="f-narx" type="number" value="2000" min="100" step="100"></div>
          <div class="maydon"><label>Miqdor</label>
            <input class="kirit" id="f-miqdor" type="number" value="500" min="1"></div>
          <div class="maydon"><label>Muddat (kun)</label>
            <input class="kirit" id="f-muddat" type="number" value="5" min="1"></div>
        </div>

        <div class="setka setka-2">
          <div class="maydon"><label>Kerakli ko'nikma</label>
            <select class="kirit" id="f-konikma">
              ${KONIKMALAR.map(k => `<option value="${k.id}">${esc(k.nom)}</option>`).join('')}
            </select></div>
          <div class="maydon"><label>Mahalla</label>
            <select class="kirit" id="f-mahalla">
              ${MAHALLALAR.map(m => `<option value="${m.id}">${esc(m.nom)}</option>`).join('')}
            </select></div>
        </div>

        <div class="maydon">
          <label>Sifat mezonlari (har qatorga bittadan)</label>
          <textarea class="kirit" id="f-sifat" placeholder="Chok tekis va uzluksiz&#10;Ip rangi namunaga mos"></textarea>
        </div>

        <div class="maydon">
          <label><input type="checkbox" id="f-foto" checked style="width:auto;min-height:auto;margin-right:7px">
            Foto dalil majburiy</label>
        </div>

        <div id="hisob-oyna"></div>

        <button class="tugma asos keng" data-amal="vazifa-yarat" style="margin-top:10px">
          Eskrouga pul kiritib, e'lon qilish
        </button>
        <div class="yordam" style="margin-top:8px;text-align:center">
          Summa hisobingizdan yechilib, ish tugaguncha eskrouda saqlanadi
        </div>
      </div></div>
    </div>`;
  },

  hisobKitob() {
    const st = Store.get();
    const k = Store.menKorxona();
    const meniki = st.vazifalar.filter(v => v.korxona === k.id);
    const tolangan = meniki.filter(v => v.holat === 'PAID');

    const jamiTolov = tolangan.reduce((s, v) => s + (v.eskrou ? v.eskrou.ozodQilingan : 0), 0);
    const jamiKom = tolangan.reduce((s, v) => s + (v.eskrou ? (v.eskrou.komissiyaOlingan || 0) : 0), 0);
    const eskrouda = meniki.filter(v => v.eskrou && v.eskrou.holat === 'HELD')
                           .reduce((s, v) => s + v.eskrou.summa, 0);

    const ledger = st.ledger.filter(t => t.yozuvlar.some(y => y.hisob === 'korxona:' + k.id || y.hisob === 'eskrou'));

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Hisob-kitob</h1>
        <p>Barcha pul harakati ikki yozuvli (double-entry) daftarda qayd etiladi.</p></div>

      <div class="setka setka-4" style="margin-bottom:20px">
        <div class="stat"><div class="q">${pul(k.balans)}</div><div class="y">Mavjud hisob</div></div>
        <div class="stat"><div class="q" style="color:var(--sariq)">${pul(eskrouda)}</div><div class="y">Eskrouda band</div></div>
        <div class="stat"><div class="q" style="color:var(--yashil)">${pul(jamiTolov)}</div><div class="y">Ijrochilarga to'langan</div></div>
        <div class="stat"><div class="q">${pul(jamiKom)}</div><div class="y">Platforma komissiyasi</div>
          <div class="k">${KOMISSIYA.foiz}% · min ${qisqaPul(KOMISSIYA.minimal)}</div></div>
      </div>

      <div class="eslatma">
        <h4>💡 Nima uchun byudjet talab qilinmaydi</h4>
        <p>Platforma faqat shu komissiya hisobidan ishlaydi — davlat byudjetidan
           mablag' ajratish shart emas.</p>
      </div>

      <div class="bolim-bosh"><h2>Buxgalteriya daftari</h2>
        <span class="izoh">Yozuvlar o'chirilmaydi — faqat qarama-qarshi yozuv qo'shiladi</span></div>

      ${ledger.length ? ledger.slice().reverse().map(t => `
        <div class="ledger-yozuv">
          <div class="ledger-bosh"><span class="ledger-tur">${esc(t.tur)}</span>
            <span class="ledger-izoh">${esc(t.izoh)}</span></div>
          ${t.yozuvlar.map(y => `<div class="ledger-qator">
            <span>${esc(V_Korxona.hisobNomi(y.hisob))}</span>
            <span class="${y.yonalish === 'DEBIT' ? 'd' : 'c'}">
              ${y.yonalish === 'DEBIT' ? '+' : '−'} ${pul(y.summa)}</span>
          </div>`).join('')}
        </div>`).join('') : bosh('📒', 'Hali yozuv yo\'q')}
    </div>`;
  },

  hisobNomi(h) {
    if (h === 'eskrou') return 'Eskrou hisobi';
    if (h === 'platforma_komissiya') return 'Platforma komissiyasi';
    if (h.indexOf('korxona:') === 0) { const c = Store.korxona(h.split(':')[1]); return c ? c.nom : h; }
    if (h.indexOf('fuqaro:') === 0)  { const f = Store.fuqaro(h.split(':')[1]);  return f ? f.nom : h; }
    return h;
  }
};

/* ============================================================ BOSHQARMA ==== */

const V_Boshqarma = {

  dashboard() {
    const st = Store.get();
    const oxirgi = TARIX[TARIX.length - 1];
    const oldingi = TARIX[TARIX.length - 2];

    const maqomli = st.fuqarolar.filter(f => f.selfEmployment === 'VERIFIED').length;
    const jamiFuqaro = st.fuqarolar.length;
    const tolangan = st.vazifalar.filter(v => v.holat === 'PAID');
    const jamiTolov = oxirgi.tolov + tolangan.reduce((s, v) => s + (v.eskrou ? v.eskrou.ozodQilingan : 0), 0);
    const elon = st.vazifalar.length;
    const bajarilgan = tolangan.length;
    const fillRate = elon ? Math.round(bajarilgan / elon * 100) : 0;
    const nizolar = st.nizolar.length;
    const nizoUlush = elon ? Math.round(nizolar / elon * 100) : 0;

    function osish(yangi, eski) {
      if (!eski) return '';
      const f = Math.round((yangi - eski) / eski * 100);
      return `<div class="o ${f >= 0 ? 'yuqori' : 'past'}">${f >= 0 ? '▲' : '▼'} ${Math.abs(f)}% oldingi oyga nisbatan</div>`;
    }

    /* Registrdan chiqqanlar — mahalla kesimida, k-anonimlik bilan */
    const mahallaChiqdi = MAHALLALAR.map(m => {
      const son = st.fuqarolar.filter(f =>
        f.mahalla === m.id && f.selfEmployment === 'VERIFIED' && f.registry && f.registry.length).length;
      return { nom: m.nom, son };
    });
    const maxChiqdi = Math.max(1, ...mahallaChiqdi.map(x => x.son));

    /* Registr turlari */
    const registrlar = [
      { kod: 'temir',   nom: 'Temir daftar' },
      { kod: 'ayollar', nom: 'Ayollar daftari' },
      { kod: 'yoshlar', nom: 'Yoshlar daftari' }
    ].map(r => ({
      nom: r.nom,
      jami: st.fuqarolar.filter(f => f.registry && f.registry.indexOf(r.kod) !== -1).length,
      chiqdi: st.fuqarolar.filter(f => f.registry && f.registry.indexOf(r.kod) !== -1 && f.selfEmployment === 'VERIFIED').length
    }));

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Bandlik monitoringi</h1>
        <p>Toshkent viloyati Kambag'allikni qisqartirish va bandlik boshqarmasi,
           Nurafshon shahar bo'limi · Sentabr 2026</p>
      </div>

      <div class="maxfiy" style="margin-bottom:16px">
        🔒 Bu panelda faqat umumlashtirilgan ma'lumot ko'rsatiladi. Shaxsiy ma'lumot,
        telefon, hujjat va to'lov tafsilotlari ko'rinmaydi. 5 tadan kam yozuvli kesim yashiriladi.
      </div>

      <div class="setka setka-4">
        <div class="stat"><div class="q">${oxirgi.royxat}</div><div class="y">Ro'yxatdan o'tgan fuqaro</div>${osish(oxirgi.royxat, oldingi.royxat)}</div>
        <div class="stat"><div class="q" style="color:var(--yashil)">${oxirgi.maqom}</div>
          <div class="y">"O'zini o'zi band qilgan"</div>
          <div class="k">${Math.round(oxirgi.maqom / oxirgi.royxat * 100)}% konversiya</div></div>
        <div class="stat"><div class="q" style="color:var(--asos)">${oxirgi.registrChiqdi}</div>
          <div class="y">Registrdan chiqqanlar</div>${osish(oxirgi.registrChiqdi, oldingi.registrChiqdi)}</div>
        <div class="stat"><div class="q">${pul(jamiTolov).replace(" so'm",'')}</div>
          <div class="y">Jami to'langan (so'm)</div>${osish(oxirgi.tolov, oldingi.tolov)}</div>
      </div>

      <div class="setka setka-4" style="margin-top:12px">
        <div class="stat"><div class="q">${oxirgi.vazifa}</div><div class="y">E'lon qilingan vazifa</div></div>
        <div class="stat"><div class="q">${oxirgi.bajarilgan}</div><div class="y">Bajarilgan vazifa</div>
          <div class="k">Fill rate ${Math.round(oxirgi.bajarilgan / oxirgi.vazifa * 100)}%</div></div>
        <div class="stat"><div class="q">${pul(Math.round(oxirgi.tolov / oxirgi.maqom)).replace(" so'm",'')}</div>
          <div class="y">O'rtacha oylik daromad</div><div class="k">bir ijrochiga, so'm</div></div>
        <div class="stat"><div class="q" style="color:${nizoUlush > 10 ? 'var(--qizil)' : 'var(--yashil)'}">${nizoUlush}%</div>
          <div class="y">Nizo ulushi</div><div class="k">${nizolar} ta nizo</div></div>
      </div>

      <div class="bolim-bosh"><h2>Oylik dinamika</h2></div>
      <div class="grafik">
        ${Grafik.chiziq(TARIX)}
      </div>

      <div class="setka setka-2" style="margin-top:12px">
        <div class="grafik">
          <h3>Ijtimoiy registrdan chiqish</h3>
          ${registrlar.map(r => `
            <div class="ustun-qator">
              <span class="ustun-nom">${esc(r.nom)}</span>
              <span class="ustun-yolak"><i style="width:${r.jami ? r.chiqdi / r.jami * 100 : 0}%;background:var(--yashil)"></i></span>
              <span class="ustun-qiymat">${r.chiqdi}/${r.jami}</span>
            </div>`).join('')}
          <div style="font-size:12.5px;color:var(--matn-3);margin-top:10px">
            Maqom olgan va rasman band hisoblangan fuqarolar ulushi
          </div>
        </div>

        <div class="grafik">
          <h3>Mahalla kesimida</h3>
          ${mahallaChiqdi.map(m => {
            const kor = kAnonim(m.son);
            return `<div class="ustun-qator">
              <span class="ustun-nom">${esc(m.nom)}</span>
              <span class="ustun-yolak"><i style="width:${kor === null ? 0 : m.son / maxChiqdi * 100}%"></i></span>
              <span class="ustun-qiymat">${kor === null ? '<span style="color:var(--matn-3)">&lt;5</span>' : kor}</span>
            </div>`;
          }).join('')}
          <div style="font-size:12.5px;color:var(--matn-3);margin-top:10px">
            &lt;5 — k-anonimlik qoidasi bo'yicha yashirilgan
          </div>
        </div>
      </div>

      <div class="bolim-bosh"><h2>Hisobot</h2></div>
      <div class="karta"><div class="karta-ich">
        <p style="font-size:14px;color:var(--matn-2);margin:0 0 14px">
          Oylik hisobot avtomatik shakllanadi va o'zgarmas nusxa sifatida saqlanadi.
          Har bir eksport audit jurnaliga yoziladi.</p>
        <div class="tugma-qator">
          <button class="tugma asos" data-amal="eksport-csv">⬇ CSV yuklab olish</button>
          <button class="tugma" data-amal="eksport-pdf">🖨 Chop etish / PDF</button>
        </div>
      </div></div>
    </div>`;
  },

  hisobot() {
    const st = Store.get();
    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Oylik hisobotlar</h1>
        <p>Har oy avtomatik shakllanadigan o'zgarmas nusxalar</p></div>

      <div class="jadval-orab">
        <table>
          <thead><tr>
            <th>Davr</th><th class="raqam">Ro'yxatdan o'tgan</th><th class="raqam">Maqom olgan</th>
            <th class="raqam">Vazifa</th><th class="raqam">Bajarilgan</th>
            <th class="raqam">To'lov</th><th class="raqam">Registrdan chiqdi</th><th class="raqam">Kuryer</th>
          </tr></thead>
          <tbody>
            ${TARIX.slice().reverse().map(t => `<tr>
              <td><b>${esc(t.oy)} 2026</b></td>
              <td class="raqam">${t.royxat}</td>
              <td class="raqam">${t.maqom}</td>
              <td class="raqam">${t.vazifa}</td>
              <td class="raqam">${t.bajarilgan}</td>
              <td class="raqam">${pul(t.tolov).replace(" so'm",'')}</td>
              <td class="raqam" style="color:var(--yashil);font-weight:640">${t.registrChiqdi}</td>
              <td class="raqam">${t.kuryer}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="eslatma" style="margin-top:16px">
        <h4>ℹ️ Pilot natijasi (3 oy)</h4>
        <p>Jami ${TARIX[TARIX.length-1].royxat} fuqaro ro'yxatdan o'tdi,
           ${TARIX[TARIX.length-1].maqom} tasi rasmiy maqom oldi va
           ${TARIX.reduce((s,t)=>s+t.registrChiqdi,0)} nafari ijtimoiy registrdan chiqdi.
           Ularga jami ${pul(TARIX.reduce((s,t)=>s+t.tolov,0))} to'landi —
           davlat byudjetidan mablag' ajratilmagan holda.</p>
      </div>
    </div>`;
  }
};

/* ============================================================ MODERATOR ==== */

const V_Moderator = {

  nizolar() {
    const st = Store.get();
    const ochiq = st.nizolar.filter(n => n.holat === 'OCHIQ');
    const yopiq = st.nizolar.filter(n => n.holat !== 'OCHIQ');

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Nizolar</h1>
        <p>${ochiq.length} ta ochiq · ${yopiq.length} ta hal qilingan</p></div>

      ${ochiq.length ? ochiq.map(n => V_Moderator.nizoKarta(n)).join('')
                     : bosh('✅', 'Ochiq nizo yo\'q')}

      ${yopiq.length ? `<div class="bolim-bosh"><h2>Hal qilingan</h2></div>
        ${yopiq.map(n => {
          const v = Store.vazifa(n.vazifa);
          return `<div class="karta" style="margin-bottom:9px"><div class="karta-ich">
            <div class="vazifa-yuqori"><h3 style="font-size:15px">${esc(v ? v.nom : n.vazifa)}</h3>
              <span class="belgi yashil">${esc(n.qaror || 'Hal qilindi')}</span></div>
          </div></div>`;
        }).join('')}` : ''}
    </div>`;
  },

  nizoKarta(n) {
    const v = Store.vazifa(n.vazifa);
    if (!v) return '';
    const summa = v.jami || jamiSumma(v);
    const ijrochi = v.ijrochi ? Store.fuqaro(v.ijrochi) : null;
    const korxona = Store.korxona(v.korxona);

    return `
    <div class="karta" style="margin-bottom:14px"><div class="karta-ich">
      <div class="vazifa-yuqori"><h3>${esc(v.nom)}</h3><span class="belgi qizil">Ochiq nizo</span></div>

      <div class="vazifa-qator">
        <span>👤 ${esc(ijrochi ? ijrochi.nom : '—')}</span>
        <span>🏢 ${esc(korxona ? korxona.nom : '—')}</span>
        <span>💰 Eskrouda: <b>${pul(summa)}</b></span>
      </div>

      <div class="eslatma xato" style="margin-bottom:14px;padding:11px 13px">
        <p>${esc(n.sabab)}</p>
      </div>

      ${(n.xabarlar || []).length ? `
        <div style="font-size:13px;font-weight:600;margin-bottom:9px">Yozishmalar</div>
        ${n.xabarlar.map(x => {
          const korxonaMi = x.kim.indexOf('c') === 0;
          const kim = korxonaMi ? Store.korxona(x.kim) : Store.fuqaro(x.kim);
          return `<div class="xabar ${korxonaMi ? 'korxona' : ''}">
            <span class="xabar-avatar">${bosh_harf(kim ? kim.nom : '?')}</span>
            <div class="xabar-ich">
              <div class="xabar-kim">${esc(kim ? kim.nom : x.kim)}</div>
              <div class="xabar-matn">${esc(x.matn)}</div>
              <div class="xabar-vaqt">${esc(x.vaqt)}</div>
            </div></div>`;
        }).join('')}` : ''}

      <div style="font-size:13px;font-weight:600;margin:16px 0 9px">Qaror qabul qiling</div>
      <div class="ulush-tanlov">
        <button class="ulush" data-amal="nizo-hal" data-id="${n.id}" data-ulush="100">
          <span><span class="u-nom">Ijrochi foydasiga</span>
            <span class="u-izoh">Ish to'liq qabul qilinadi</span></span>
          <span class="u-summa">${pul(summa)}<br><span style="font-size:11px;color:var(--matn-3)">ijrochiga</span></span>
        </button>
        <button class="ulush" data-amal="nizo-hal" data-id="${n.id}" data-ulush="50">
          <span><span class="u-nom">Bo'lib berish (50/50)</span>
            <span class="u-izoh">Ikkala tomon qisman haq</span></span>
          <span class="u-summa">${pul(summa/2)}<br><span style="font-size:11px;color:var(--matn-3)">har biriga</span></span>
        </button>
        <button class="ulush" data-amal="nizo-hal" data-id="${n.id}" data-ulush="0">
          <span><span class="u-nom">Korxona foydasiga</span>
            <span class="u-izoh">Pul korxonaga qaytariladi</span></span>
          <span class="u-summa">${pul(summa)}<br><span style="font-size:11px;color:var(--matn-3)">korxonaga</span></span>
        </button>
      </div>
    </div></div>`;
  },

  audit() {
    const st = Store.get();
    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Audit jurnali</h1>
        <p>Har bir holat o'zgarishi qayd etiladi. Yozuvlar o'chirilmaydi.</p></div>

      ${st.audit.length ? `<div class="jadval-orab"><table>
        <thead><tr><th>Vaqt</th><th>Kim</th><th>Amal</th><th>Obyekt</th><th>O'zgarish</th></tr></thead>
        <tbody>${st.audit.slice(0, 60).map(a => `<tr>
          <td style="color:var(--matn-3);font-size:12.5px">${esc(a.vaqt)}</td>
          <td><span class="belgi">${esc(a.kim)}</span></td>
          <td><b>${esc(a.amal)}</b></td>
          <td style="white-space:normal;max-width:240px">${esc(a.obyekt)}</td>
          <td style="font-family:var(--mono);font-size:12.5px">${esc(a.eski)} → ${esc(a.yangi)}</td>
        </tr>`).join('')}</tbody></table></div>`
        : bosh('📜', 'Hali yozuv yo\'q — biror amal bajaring')}
    </div>`;
  },

  logistika() {
    const st = Store.get();
    const faol = st.vazifalar.filter(v => ['ASSIGNED','IN_PROGRESS','UNDER_REVIEW'].indexOf(v.holat) !== -1);
    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Logistika</h1>
        <p>Uch pog'onali tarmoq — bir hududdagi barcha buyurtmalar bitta marshrutga birlashtiriladi</p></div>

      <div class="karta" style="margin-bottom:16px"><div class="karta-ich">
        <div class="pogona">
          <div class="pogona-nuqta faol"><div class="t">Viloyat</div><div class="n">Toshkent viloyat omborxonasi</div></div>
          <span class="pogona-strelka">→</span>
          <div class="pogona-nuqta faol"><div class="t">Tuman/shahar</div><div class="n">Nurafshon shahar punkti</div></div>
          <span class="pogona-strelka">→</span>
          <div class="pogona-nuqta faol"><div class="t">Mahalla</div><div class="n">FYG binosi (mavjud bino)</div></div>
        </div>
        <div style="font-size:13px;color:var(--matn-3);margin-top:12px;text-align:center">
          Alohida bino qurish talab qilinmaydi — mavjud mahalla binolaridan foydalaniladi
        </div>
      </div></div>

      <div class="setka setka-3" style="margin-bottom:16px">
        ${KURYERLAR.map(k => `<div class="stat">
          <div style="font-size:15px;font-weight:650">${esc(k.nom)}</div>
          <div class="y">${esc(k.transport)} · ${k.sigim} kg</div>
          <div class="k">📍 ${esc(mahallaNomi(k.mahalla))} · ishonch ${k.trust}</div>
          <div style="margin-top:8px"><span class="belgi yashil">O'zini o'zi band qilgan</span></div>
        </div>`).join('')}
        <div class="stat" style="border-style:dashed">
          <div style="font-size:15px;font-weight:650;color:var(--matn-3)">+ Yangi kuryer</div>
          <div class="y">Mahalliy fuqaro ro'yxatdan o'tishi mumkin</div>
          <div class="k">Kuryerlik — qo'shimcha bandlik manbai</div>
        </div>
      </div>

      <div class="bolim-bosh"><h2>Faol yuklar</h2></div>
      ${faol.length ? `<div class="jadval-orab"><table>
        <thead><tr><th>Vazifa</th><th>Yo'nalish</th><th>Mahalla</th><th>Holat</th></tr></thead>
        <tbody>${faol.map(v => `<tr>
          <td style="white-space:normal;max-width:220px">${esc(v.nom)}</td>
          <td>${esc(hubNomi(v.pickup))}</td>
          <td>${esc(mahallaNomi(v.mahalla))}</td>
          <td>${belgi(v.holat)}</td>
        </tr>`).join('')}</tbody></table></div>` : bosh('🚚', 'Faol yuk yo\'q')}
    </div>`;
  }
};
