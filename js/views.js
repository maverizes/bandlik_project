/* =============================================================================
   VIEWS — HTML generatsiya
   ============================================================================= */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function pul(n) {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0)).replace(/,/g,' ') + " so'm";
}
function pulQisqa(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace('.0','') + ' mln';
  if (n >= 1_000) return Math.round(n / 1_000) + ' ming';
  return String(Math.round(n || 0));
}
function belgi(holat) {
  const h = HOLAT_MATN[holat] || { matn: holat, rang: 'kul' };
  const rang = { kok:'kok', yashil:'yashil', sariq:'sariq', qizil:'qizil', kul:'kul' }[h.rang] || 'kul';
  return `<span class="belgi ${rang}">${esc(h.matn)}</span>`;
}
function bosh(sarlavha, matn) {
  return `<div class="bosh">${Ill.bosh(140)}<h3>${esc(sarlavha)}</h3><p>${esc(matn)}</p></div>`;
}
function konikmaNomlari(ids) {
  return (ids || []).map(id => (KONIKMALAR.find(k => k.id === id) || {}).nom).filter(Boolean);
}
function mahallaNomi(id) { return (MAHALLALAR.find(m => m.id === id) || {}).nom || '—'; }
function hubNomi(id) { return (HUBLAR.find(h => h.id === id) || {}).nom || '—'; }

/* Gorizontal bosqich ko'rsatkichi */
function bosqichlar(holat) {
  const kalitlar = ['ASSIGNED','IN_PROGRESS','UNDER_REVIEW','PAID'];
  const nomlar   = ['Olindi','Bajaryapman','Tekshiruvda',"To'landi"];
  let joriy = kalitlar.indexOf(holat);
  if (holat === 'REWORK' || holat === 'SUBMITTED') joriy = 1;
  if (holat === 'ACCEPTED') joriy = 3;
  if (holat === 'DISPUTED') joriy = 2;

  let html = '<div class="bosqich">';
  kalitlar.forEach((k, i) => {
    const sinf = i < joriy ? 'tayyor' : i === joriy ? 'joriy' : '';
    html += `<div class="bosqich-nuqta ${sinf}">
      <span class="bn">${i < joriy ? '✓' : i + 1}</span>
      <span class="bm">${nomlar[i]}</span></div>`;
    if (i < kalitlar.length - 1) html += `<div class="bosqich-chiziq ${i < joriy ? 'tayyor' : ''}"></div>`;
  });
  return html + '</div>';
}

/* =============================================================== FUQARO ==== */

const V_Fuqaro = {

  ishlar() {
    const st = Store.get();
    const men = Store.menFuqaro();
    if (men.selfEmployment !== 'VERIFIED') return V_Fuqaro.gate(men);

    const ochiq = st.vazifalar.filter(v => v.holat === 'PUBLISHED');
    const chek = cheklov(men.trust);

    const royxat = ochiq.map(v => ({
      v,
      m: moslikBali(v, men),
      arizaBergan: (v.arizalar || []).indexOf(men.id) !== -1,
      trustYetmas: v.minTrust && men.trust < v.minTrust
    })).sort((a, b) => b.m.ball - a.m.ball);

    const mos = royxat.filter(r => !r.trustYetmas);

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Salom, ${esc((men.nom || '').split(' ')[0])} 👋</h1>
        <p>Sizga mos ${mos.length} ta ish topildi. Eng mosi yuqorida.</p>
      </div>

      <div class="eslatma yaxshi" style="margin-bottom:20px">
        <span class="ikon">✓</span>
        <div>
          <h4>Siz ishlashga tayyorsiz</h4>
          <p>Ishonch balingiz <b>${men.trust}</b>. Bir vaqtda ${chek.maksVazifa} tagacha ish olishingiz mumkin.</p>
        </div>
      </div>

      ${royxat.length
        ? `<div class="setka setka-2 kirish-nav">${royxat.map(V_Fuqaro.vazifaKarta).join('')}</div>`
        : bosh('Hozircha ish yo\'q', 'Yangi ish chiqqanda sizga SMS orqali xabar beramiz.')}
    </div>`;
  },

  gate(men) {
    const kutmoqda = men.selfEmployment === 'PENDING';
    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Bitta qadam qoldi</h1>
        <p>Ishlashni boshlash uchun rasmiy maqom kerak.</p>
      </div>

      <div class="gate">
        <div class="g-rasm">${Ill.hujjat(140)}</div>
        <h2>${kutmoqda ? 'Arizangiz ko\'rib chiqilmoqda' : "\"O'zini o'zi band qilgan shaxs\" maqomi"}</h2>
        <p>Qonun bo'yicha to'lovli ish qabul qilish uchun shu maqom kerak (PQ-4742).
           Bepul va bir marta olinadi.</p>

        <div class="qadamlar">
          <div class="qadam tayyor"><span class="n">✓</span><span>Telefon tasdiqlandi</span></div>
          <div class="qadam ${kutmoqda ? 'tayyor' : 'joriy'}">
            <span class="n">${kutmoqda ? '✓' : '2'}</span><span>Ariza berish</span></div>
          <div class="qadam ${kutmoqda ? 'joriy' : ''}">
            <span class="n">3</span><span>Soliq organidan tasdiq</span></div>
        </div>

        ${kutmoqda
          ? `<button class="tugma yashil keng" data-amal="maqom-tasdiq">Tasdiqni olish (demo)</button>
             <p style="font-size:13px;color:var(--matn-3);margin-top:12px">
               Haqiqiy tizimda javob Soliq qo'mitasidan keladi</p>`
          : `<button class="tugma asos keng" data-amal="maqom-ariza">Ariza berish</button>`}
      </div>

      <div class="setka setka-3" style="margin-top:20px">
        ${[
          ['💰', 'Soliq yo\'q', "Bu maqomda daromadingizdan jismoniy shaxs daromad solig'i olinmaydi"],
          ['📋', 'Rasman band', "Ishsizlar ro'yxatidan chiqasiz, ijtimoiy maqomingiz o'zgaradi"],
          ['⭐', 'Mehnat tarixi', 'Bajargan ishlaringiz saqlanadi — kelajakda ishonch beradi']
        ].map(([i, s, m]) => `
          <div class="karta"><div class="karta-ich">
            <div style="font-size:26px;margin-bottom:8px">${i}</div>
            <h3 style="font-size:15.5px;margin-bottom:5px">${s}</h3>
            <p style="font-size:13.5px;color:var(--matn-2);line-height:1.5">${m}</p>
          </div></div>`).join('')}
      </div>
    </div>`;
  },

  vazifaKarta(r) {
    const v = r.v, m = r.m;
    const korxona = Store.korxona(v.korxona);
    const jami = v.jami || jamiSumma(v);

    return `
    <article class="vazifa">
      ${Rasm.kasb(v.konikma, 118)}
      <div class="vazifa-tana">
        <div class="vazifa-yuqori">
          <h3>${esc(v.nom)}</h3>
        </div>
        <p class="vazifa-tavsif">${esc(v.tavsif)}</p>

        <div class="pul-quti">
          <div>
            <div class="pul-summa">${pul(jami)}</div>
            <div class="pul-hisob">${pul(v.narx)} × ${v.miqdor} ${esc(v.birlik)}</div>
          </div>
          <div class="pul-muddat">
            <div class="pm-son">${v.muddatKun}</div>
            <div class="pm-mat">kun</div>
          </div>
        </div>

        <div class="moslik">
          <span>Sizga mosligi</span>
          <span class="moslik-chiziq"><i style="width:${m.ball}%"></i></span>
          <b>${m.ball}%</b>
        </div>

        <div class="vazifa-qator">
          <span>🏢 ${esc(korxona ? korxona.nom : '')}</span>
          <span>📍 ${esc(mahallaNomi(v.mahalla))}</span>
          <span>📦 Xomashyo: ${esc(v.xomashyo.toLowerCase())}</span>
        </div>

        ${r.trustYetmas
          ? `<button class="tugma keng" disabled>Ishonch bali ${v.minTrust} kerak</button>`
          : r.arizaBergan
            ? `<button class="tugma keng" disabled>✓ Ariza yuborilgan</button>`
            : `<button class="tugma asos keng" data-amal="ariza" data-id="${v.id}">Olaman</button>`}
      </div>
    </article>`;
  },

  meningIshlarim() {
    const st = Store.get();
    const men = Store.menFuqaro();
    const meniki = st.vazifalar.filter(v => v.ijrochi === men.id);

    if (!meniki.length) {
      return `<div class="kirish"><div class="sahifa-bosh"><h1>Mening ishlarim</h1></div>
        ${bosh('Hali ish olmagansiz', '"Ishlar" bo\'limiga o\'ting va o\'zingizga mos ishni tanlang.')}</div>`;
    }

    const faol = meniki.filter(v => v.holat !== 'PAID');
    const tugagan = meniki.filter(v => v.holat === 'PAID');

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Mening ishlarim</h1>
        <p>${faol.length} ta faol · ${tugagan.length} ta yakunlangan</p>
      </div>
      <div class="setka kirish-nav">
        ${faol.map(V_Fuqaro.ishKarta).join('')}
        ${tugagan.length ? `<div class="bolim-bosh"><h2>Yakunlangan</h2></div>` : ''}
        ${tugagan.map(V_Fuqaro.ishKarta).join('')}
      </div>
    </div>`;
  },

  ishKarta(v) {
    const korxona = Store.korxona(v.korxona);
    const jami = v.jami || jamiSumma(v);
    const e = v.eskrou || {};
    let amal = '';

    if (v.holat === 'ASSIGNED') {
      amal = `<button class="tugma asos keng" data-amal="boshla" data-id="${v.id}">Ishni boshlash</button>`;

    } else if (v.holat === 'IN_PROGRESS' || v.holat === 'REWORK') {
      const fotoBor = v.foto && v.foto.length;
      amal = `
        ${v.holat === 'REWORK' ? `
          <div class="eslatma xato" style="margin-bottom:14px">
            <span class="ikon">↻</span>
            <div><h4>Qayta ishlash so'ralgan (${v.qaytaIshlash}/2)</h4>
              <p>${esc(v.rejectSabab || '')}</p></div>
          </div>` : ''}
        ${v.fotoTalab ? `
          <button class="tugma ${fotoBor ? 'yashil' : ''} keng" data-amal="foto" data-id="${v.id}"
                  style="margin-bottom:10px">
            ${fotoBor ? `✓ ${v.foto.length} ta foto qo'shildi` : '📷 Ish fotosini qo\'shing'}
          </button>` : ''}
        <button class="tugma asos keng" data-amal="topshir" data-id="${v.id}"
                ${v.fotoTalab && !fotoBor ? 'disabled' : ''}>Ishni topshirish</button>
        ${v.fotoTalab && !fotoBor
          ? `<p style="font-size:13px;color:var(--matn-3);text-align:center;margin-top:8px">
               Topshirish uchun avval foto qo'shing</p>` : ''}`;

    } else if (v.holat === 'UNDER_REVIEW') {
      amal = `<div class="eslatma ogoh">
        <span class="ikon">⏳</span>
        <div><h4>Korxona tekshirmoqda</h4>
          <p>${AUTO_RELEASE_KUN} kun ichida javob bermasa, pul avtomatik sizga o'tadi.</p></div></div>`;

    } else if (v.holat === 'PAID') {
      amal = `<div class="eslatma yaxshi">
        <span class="ikon">✓</span>
        <div><h4>${pul(e.sof || 0)} hamyoningizga tushdi</h4>
          <p>Komissiya korxonadan olindi — sizdan hech narsa ushlab qolinmadi.</p></div></div>`;

    } else if (v.holat === 'DISPUTED') {
      amal = `<div class="eslatma xato">
        <span class="ikon">⚖️</span>
        <div><h4>Nizo ochilgan</h4><p>Moderator ko'rib chiqmoqda. Pul eskrouda saqlanmoqda.</p></div></div>`;
    }

    return `
    <article class="karta"><div class="karta-ich">
      <div class="vazifa-yuqori">
        <h3 style="font-size:16.5px">${esc(v.nom)}</h3>
        ${belgi(v.holat)}
      </div>
      <div class="vazifa-qator" style="margin-bottom:14px">
        <span>🏢 ${esc(korxona ? korxona.nom : '')}</span>
        <span>💰 ${pul(jami)}</span>
      </div>
      ${bosqichlar(v.holat)}
      ${amal}
    </div></article>`;
  },

  hamyon() {
    const st = Store.get();
    const men = Store.menFuqaro();
    const balans = Store.balans(men.id);
    const kutilayotgan = st.vazifalar
      .filter(v => v.ijrochi === men.id &&
        ['ASSIGNED','IN_PROGRESS','SUBMITTED','UNDER_REVIEW','REWORK'].indexOf(v.holat) !== -1)
      .reduce((s, v) => s + (v.jami || jamiSumma(v)), 0);

    const tarix = st.ledger.filter(t => t.yozuvlar.some(y => y.hisob === 'fuqaro:' + men.id));

    return `
    <div class="kirish">
      <div class="sahifa-bosh"><h1>Hamyon</h1></div>

      <div class="hamyon">
        <div class="h-yorliq">Yechib olish mumkin</div>
        <div class="h-summa">${pul(balans)}</div>
        <div class="hamyon-qator">
          <div><div class="b">Ishlab turgan pul</div><div class="q">${pulQisqa(kutilayotgan)}</div></div>
          <div><div class="b">Jami daromad</div><div class="q">${pulQisqa(men.daromad)}</div></div>
          <div><div class="b">Bajarilgan ish</div><div class="q">${men.bajargan}</div></div>
        </div>
      </div>

      <div style="margin-top:14px">
        <button class="tugma iliq keng" data-amal="pul-yech" ${balans <= 0 ? 'disabled' : ''}>
          💳 Kartaga chiqarish
        </button>
      </div>

      ${balans > 0 ? `
        <div class="eslatma ogoh" style="margin-top:14px">
          <span class="ikon">🔐</span>
          <div><h4>Xavfsizlik tekshiruvi</h4>
            <p>Pul chiqarishda yuz orqali tekshirish so'raladi — bu hisobingizni
               begona shaxs ishlatishidan himoya qiladi.</p></div>
        </div>` : ''}

      <div class="bolim-bosh"><h2>Harakatlar</h2></div>
      ${tarix.length
        ? tarix.slice().reverse().map(t => {
            const meniki = t.yozuvlar.find(y => y.hisob === 'fuqaro:' + men.id);
            return `<div class="ledger-yozuv">
              <div class="ledger-bosh">
                <span class="ledger-tur">TUSHUM</span>
                <span class="ledger-izoh">${esc(t.izoh)}</span>
              </div>
              <div class="ledger-qator">
                <span>Hamyoningizga</span><span class="d">+ ${pul(meniki.summa)}</span>
              </div>
            </div>`;
          }).join('')
        : `<div class="bosh">${Ill.hamyon(130)}
             <h3>Hali pul tushmagan</h3>
             <p>Birinchi ishni bajarib topshiring — pul shu yerda ko'rinadi.</p></div>`}
    </div>`;
  },

  profil() {
    const men = Store.menFuqaro();
    const t = trustHisobla(men);
    const chek = cheklov(men.trust);
    const tasdiq = men.selfEmployment === 'VERIFIED';

    return `
    <div class="kirish">
      <div class="karta" style="margin-bottom:16px"><div class="karta-ich"
        style="display:flex;align-items:center;gap:16px">
        ${Rasm.avatar(men.nom, 64)}
        <div style="flex:1;min-width:0">
          <h1 style="font-size:21px;margin-bottom:3px">${esc(men.nom)}</h1>
          <p style="color:var(--matn-2);font-size:14.5px">
            ${esc(mahallaNomi(men.mahalla))} mahallasi</p>
          <div style="margin-top:8px">
            ${tasdiq ? '<span class="belgi yashil">✓ Rasman band</span>'
                     : '<span class="belgi sariq">Maqom olinmagan</span>'}
          </div>
        </div>
      </div></div>

      <div class="setka setka-2">
        <div class="karta"><div class="karta-ich">
          <h3 style="font-size:16px;margin-bottom:14px">Ishonch bali</h3>
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
            <span style="font-size:40px;font-weight:840;color:var(--kok);letter-spacing:-.04em;line-height:1">${men.trust}</span>
            <span style="font-size:17px;color:var(--matn-3)">/ 100</span>
          </div>
          <p style="font-size:13.5px;color:var(--matn-3);margin-bottom:16px">${esc(chek.izoh)}</p>
          ${t.komponentlar.map(k => `
            <div class="ustun-qator" style="font-size:13px;margin-bottom:8px">
              <span class="ustun-nom" style="width:auto;flex:0 0 132px">${esc(k.nom)}</span>
              <span class="ustun-yolak" style="height:14px"><i style="width:${k.ball / k.maks * 100}%"></i></span>
              <span class="ustun-qiymat" style="width:44px;font-size:12.5px">${k.ball}/${k.maks}</span>
            </div>`).join('')}
        </div></div>

        <div class="karta"><div class="karta-ich">
          <h3 style="font-size:16px;margin-bottom:14px">Tekshiruvlar</h3>
          <div class="qadamlar" style="max-width:none;margin:0 0 16px">
            <div class="qadam tayyor"><span class="n">✓</span><span>Telefon tasdiqlangan</span></div>
            <div class="qadam ${tasdiq ? 'tayyor' : ''}">
              <span class="n">${tasdiq ? '✓' : '!'}</span><span>O'zini o'zi band qilgan shaxs</span></div>
            <div class="qadam ${tasdiq ? 'tayyor' : ''}">
              <span class="n">${tasdiq ? '✓' : '—'}</span><span>Shaxs tasdiqlangan (KYC)</span></div>
          </div>

          <h3 style="font-size:16px;margin-bottom:10px">Ko'nikmalarim</h3>
          <div style="display:flex;flex-wrap:wrap;gap:7px">
            ${konikmaNomlari(men.konikma).map(k =>
              `<span class="belgi kok">${esc(k)}</span>`).join('') || '<span class="belgi">Qo\'shilmagan</span>'}
          </div>

          ${men.registry && men.registry.length ? `
            <h3 style="font-size:16px;margin:16px 0 10px">Ijtimoiy registr</h3>
            <div style="display:flex;flex-wrap:wrap;gap:7px">
              ${men.registry.map(r => `<span class="belgi sariq">${
                r === 'temir' ? 'Temir daftar' : r === 'ayollar' ? 'Ayollar daftari' : 'Yoshlar daftari'
              }</span>`).join('')}
            </div>` : ''}
        </div></div>
      </div>
    </div>`;
  }
};

/* ============================================================== KORXONA ==== */

const V_Korxona = {

  vazifalar() {
    const st = Store.get();
    const k = Store.menKorxona();
    const meniki = st.vazifalar.filter(v => v.korxona === k.id);
    const kutayotgan = meniki.filter(v => v.holat === 'UNDER_REVIEW');
    const boshqa = meniki.filter(v => v.holat !== 'UNDER_REVIEW');

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>${esc(k.nom)}</h1>
        <p>STIR ${esc(k.stir)} · Hisobda <b>${pul(k.balans)}</b></p>
      </div>

      <div class="setka setka-4" style="margin-bottom:22px">
        <div class="stat"><div class="q">${meniki.filter(v => v.holat === 'PUBLISHED').length}</div>
          <div class="y">Ijrochi kutmoqda</div></div>
        <div class="stat"><div class="q">${meniki.filter(v => ['ASSIGNED','IN_PROGRESS','REWORK'].indexOf(v.holat) !== -1).length}</div>
          <div class="y">Bajarilmoqda</div></div>
        <div class="stat"><div class="q" style="color:var(--sariq)">${kutayotgan.length}</div>
          <div class="y">Sizdan javob kutmoqda</div></div>
        <div class="stat"><div class="q" style="color:var(--yashil)">${meniki.filter(v => v.holat === 'PAID').length}</div>
          <div class="y">Yakunlangan</div></div>
      </div>

      ${kutayotgan.length ? `
        <div class="eslatma ogoh" style="margin-bottom:16px">
          <span class="ikon">⏳</span>
          <div><h4>${kutayotgan.length} ta ish tekshiruvingizni kutmoqda</h4>
            <p>${AUTO_RELEASE_KUN} kun ichida javob bermasangiz, to'lov avtomatik ijrochiga o'tadi.</p></div>
        </div>` : ''}

      ${meniki.length
        ? `<div class="setka kirish-nav">${kutayotgan.concat(boshqa).map(V_Korxona.karta).join('')}</div>`
        : bosh('Hali vazifa yo\'q', "\"Yangi e'lon\" bo'limiga o'ting va birinchi vazifangizni e'lon qiling.")}
    </div>`;
  },

  karta(v) {
    const e = v.eskrou || {};
    const nomzodlar = (v.arizalar || []).map(id => Store.fuqaro(id)).filter(Boolean);
    const ijrochi = v.ijrochi ? Store.fuqaro(v.ijrochi) : null;
    const jami = v.jami || jamiSumma(v);

    return `
    <article class="karta"><div class="karta-ich">
      <div class="vazifa-yuqori">
        <h3 style="font-size:17px">${esc(v.nom)}</h3>${belgi(v.holat)}
      </div>

      <div class="vazifa-qator" style="margin-bottom:14px">
        <span>💰 ${pul(jami)}</span>
        <span>📦 ${v.miqdor} ${esc(v.birlik)}</span>
        <span>🔒 ${esc(ESKROU_MATN[e.holat] || '—')}</span>
      </div>

      ${ijrochi ? `
        <div class="nomzod" style="margin-bottom:14px">
          ${Rasm.avatar(ijrochi.nom, 40)}
          <div class="nomzod-matn">
            <div class="nomzod-nom">${esc(ijrochi.nom)}</div>
            <div class="nomzod-izoh">${esc(mahallaNomi(ijrochi.mahalla))} · ${ijrochi.bajargan} ish · ishonch ${ijrochi.trust}</div>
          </div>
        </div>` : ''}

      ${v.holat === 'PUBLISHED' ? (nomzodlar.length ? `
        <div style="font-size:14px;font-weight:700;margin-bottom:10px">
          ${nomzodlar.length} ta nomzod javob berdi
        </div>
        ${nomzodlar.map(f => {
          const m = moslikBali(v, f);
          return `<div class="nomzod">
            ${Rasm.avatar(f.nom, 40)}
            <div class="nomzod-matn">
              <div class="nomzod-nom">${esc(f.nom)}</div>
              <div class="nomzod-izoh">${esc(mahallaNomi(f.mahalla))} · ${f.bajargan} ish · moslik ${m.ball}%</div>
            </div>
            <button class="tugma asos mayda" data-amal="biriktir"
              data-id="${v.id}" data-fuqaro="${f.id}">Tanlash</button>
          </div>`;
        }).join('')}`
        : `<div class="eslatma"><span class="ikon">📢</span>
             <div><p>Vazifa mos fuqarolarga ko'rsatilmoqda. Javob kelishi bilan xabar beramiz.</p></div>
           </div>`) : ''}

      ${v.holat === 'UNDER_REVIEW' ? `
        <div style="font-size:14px;font-weight:700;margin-bottom:9px">Sifatni tekshiring</div>
        ${(v.sifat || []).map(s => `
          <label class="belgilash" style="margin-bottom:9px">
            <input type="checkbox" checked><span class="quti">✓</span>
            <span style="font-size:14.5px;color:var(--matn-2)">${esc(s)}</span>
          </label>`).join('')}
        ${v.fotoTalab ? `<p style="font-size:13.5px;color:var(--matn-3);margin:10px 0 14px">
          📷 Ijrochi ${((v.foto || []).length)} ta foto dalil yubordi</p>` : ''}
        <div class="tugma-qator">
          <button class="tugma yashil" data-amal="qabul" data-id="${v.id}">✓ Qabul qilish va to'lash</button>
          <button class="tugma" data-amal="qayta" data-id="${v.id}">↻ Tuzatishga</button>
          <button class="tugma qizil" data-amal="nizo" data-id="${v.id}">Rad etish</button>
        </div>` : ''}

      ${v.holat === 'PAID' ? `
        <div class="eslatma yaxshi">
          <span class="ikon">✓</span>
          <div><h4>Yakunlandi</h4>
            <p>Ijrochiga ${pul(e.sof || 0)} · Platforma komissiyasi ${pul(e.komissiyaOlingan || 0)}</p></div>
        </div>` : ''}
    </div></article>`;
  },

  yangi() {
    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Yangi vazifa</h1>
        <p>To'ldiring — tizim uni mos fuqarolarga ko'rsatadi.</p>
      </div>

      <div class="karta"><div class="karta-ich">
        <div class="maydon">
          <label for="f-nom">Ish nomi</label>
          <input class="kirit" id="f-nom" placeholder="Masalan: Futbolkaga yeng tikish">
          <div class="yordam">Qisqa va aniq yozing — fuqaro shuni birinchi ko'radi</div>
        </div>

        <div class="maydon">
          <label for="f-tavsif">Nima qilish kerak?</label>
          <textarea class="kirit" id="f-tavsif"
            placeholder="Xomashyo tayyor. Yeng qismini overlok bilan tikish kerak. Namuna beriladi."></textarea>
        </div>

        <div class="setka setka-3">
          <div class="maydon"><label for="f-narx">1 dona uchun (so'm)</label>
            <input class="kirit" id="f-narx" type="number" inputmode="numeric" value="2000" min="100" step="100"></div>
          <div class="maydon"><label for="f-miqdor">Nechta?</label>
            <input class="kirit" id="f-miqdor" type="number" inputmode="numeric" value="500" min="1"></div>
          <div class="maydon"><label for="f-muddat">Necha kunda?</label>
            <input class="kirit" id="f-muddat" type="number" inputmode="numeric" value="5" min="1"></div>
        </div>

        <div class="setka setka-2">
          <div class="maydon"><label for="f-konikma">Qanday ko'nikma kerak?</label>
            <select class="kirit" id="f-konikma">
              ${KONIKMALAR.map(k => `<option value="${k.id}">${esc(k.nom)}</option>`).join('')}
            </select></div>
          <div class="maydon"><label for="f-mahalla">Qaysi mahallada?</label>
            <select class="kirit" id="f-mahalla">
              ${MAHALLALAR.map(m => `<option value="${m.id}">${esc(m.nom)}</option>`).join('')}
            </select></div>
        </div>

        <div class="maydon">
          <label for="f-sifat">Sifat talablari</label>
          <textarea class="kirit" id="f-sifat"
            placeholder="Chok tekis va uzluksiz&#10;Ip rangi namunaga mos"></textarea>
          <div class="yordam">Har qatorga bitta talab. Nizo chiqqanda shu ro'yxat hakam bo'ladi.</div>
        </div>

        <div class="maydon">
          <label class="belgilash">
            <input type="checkbox" id="f-foto" checked><span class="quti">✓</span>
            <span>Ijrochi ish fotosini yuborishi shart</span>
          </label>
        </div>

        <div id="hisob-oyna"></div>

        <button class="tugma iliq keng" data-amal="vazifa-yarat" style="margin-top:16px">
          E'lon qilish
        </button>
        <p style="font-size:13px;color:var(--matn-3);text-align:center;margin-top:10px">
          Summa hisobingizdan yechilib, ish tugaguncha eskrouda saqlanadi
        </p>
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

    const ledger = st.ledger.filter(t =>
      t.yozuvlar.some(y => y.hisob === 'korxona:' + k.id || y.hisob === 'eskrou'));

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Hisob-kitob</h1>
        <p>Har bir so'm ikki yozuvli daftarda qayd etiladi — hech narsa yo'qolmaydi.</p>
      </div>

      <div class="setka setka-4" style="margin-bottom:22px">
        <div class="stat"><div class="q">${pulQisqa(k.balans)}</div><div class="y">Bo'sh hisob</div></div>
        <div class="stat"><div class="q" style="color:var(--sariq)">${pulQisqa(eskrouda)}</div>
          <div class="y">Eskrouda band</div></div>
        <div class="stat"><div class="q" style="color:var(--yashil)">${pulQisqa(jamiTolov)}</div>
          <div class="y">Ijrochilarga to'langan</div></div>
        <div class="stat"><div class="q">${pulQisqa(jamiKom)}</div>
          <div class="y">Platforma komissiyasi</div>
          <div class="k">${KOMISSIYA.foiz}% · eng kami ${pulQisqa(KOMISSIYA.minimal)}</div></div>
      </div>

      <div class="eslatma">
        <span class="ikon">💡</span>
        <div><h4>Nima uchun davlat byudjeti talab qilinmaydi</h4>
          <p>Platforma faqat shu komissiya hisobidan ishlaydi. Fuqarodan hech narsa ushlab qolinmaydi.</p></div>
      </div>

      <div class="bolim-bosh"><h2>Daftar</h2>
        <span class="izoh">Yozuvlar o'chirilmaydi</span></div>

      ${ledger.length
        ? ledger.slice().reverse().map(t => `
          <div class="ledger-yozuv">
            <div class="ledger-bosh">
              <span class="ledger-tur">${esc(t.tur)}</span>
              <span class="ledger-izoh">${esc(t.izoh)}</span>
            </div>
            ${t.yozuvlar.map(y => `<div class="ledger-qator">
              <span>${esc(V_Korxona.hisobNomi(y.hisob))}</span>
              <span class="${y.yonalish === 'DEBIT' ? 'd' : 'c'}">
                ${y.yonalish === 'DEBIT' ? '+' : '−'} ${pul(y.summa)}</span>
            </div>`).join('')}
          </div>`).join('')
        : bosh('Daftar bo\'sh', 'Birinchi vazifani e\'lon qilganingizda yozuvlar shu yerda paydo bo\'ladi.')}
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

    const tolangan = st.vazifalar.filter(v => v.holat === 'PAID');
    const jamiTolov = oxirgi.tolov + tolangan.reduce((s, v) => s + (v.eskrou ? v.eskrou.ozodQilingan : 0), 0);
    const elon = st.vazifalar.length;
    const nizolar = st.nizolar.length;
    const nizoUlush = elon ? Math.round(nizolar / elon * 100) : 0;

    const osish = (y, e) => {
      if (!e) return '';
      const f = Math.round((y - e) / e * 100);
      return `<div class="o ${f >= 0 ? 'yuqori' : 'past'}">${f >= 0 ? '▲' : '▼'} ${Math.abs(f)}%</div>`;
    };

    const mahallaChiqdi = MAHALLALAR.map(m => ({
      nom: m.nom,
      son: st.fuqarolar.filter(f => f.mahalla === m.id &&
        f.selfEmployment === 'VERIFIED' && f.registry && f.registry.length).length
    }));
    const maxChiqdi = Math.max(1, ...mahallaChiqdi.map(x => x.son));

    const registrlar = [
      { kod: 'temir',   nom: 'Temir daftar' },
      { kod: 'ayollar', nom: 'Ayollar daftari' },
      { kod: 'yoshlar', nom: 'Yoshlar daftari' }
    ].map(r => ({
      nom: r.nom,
      jami: st.fuqarolar.filter(f => f.registry && f.registry.indexOf(r.kod) !== -1).length,
      chiqdi: st.fuqarolar.filter(f => f.registry && f.registry.indexOf(r.kod) !== -1 &&
        f.selfEmployment === 'VERIFIED').length
    }));

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Bandlik monitoringi</h1>
        <p>Toshkent viloyati Kambag'allikni qisqartirish va bandlik boshqarmasi,
           Nurafshon shahar bo'limi · Sentabr 2026</p>
      </div>

      <div class="maxfiy" style="margin-bottom:18px">
        <span class="mi">🔒</span>
        <span>Bu panelda faqat umumlashtirilgan ma'lumot. Shaxsiy ma'lumot, telefon,
              hujjat va to'lov tafsiloti ko'rinmaydi. 5 tadan kam yozuvli kesim yashiriladi.</span>
      </div>

      <div class="setka setka-4 kirish-nav">
        <div class="stat"><div class="q">${oxirgi.royxat}</div>
          <div class="y">Ro'yxatdan o'tgan fuqaro</div>${osish(oxirgi.royxat, oldingi.royxat)}</div>
        <div class="stat"><div class="q" style="color:var(--yashil)">${oxirgi.maqom}</div>
          <div class="y">Rasmiy maqom olgan</div>
          <div class="k">${Math.round(oxirgi.maqom / oxirgi.royxat * 100)}% konversiya</div></div>
        <div class="stat"><div class="q" style="color:var(--kok)">${oxirgi.registrChiqdi}</div>
          <div class="y">Registrdan chiqqanlar</div>${osish(oxirgi.registrChiqdi, oldingi.registrChiqdi)}</div>
        <div class="stat"><div class="q">${pulQisqa(jamiTolov)}</div>
          <div class="y">Jami to'langan</div>${osish(oxirgi.tolov, oldingi.tolov)}</div>
      </div>

      <div class="setka setka-4" style="margin-top:13px">
        <div class="stat"><div class="q">${oxirgi.vazifa}</div><div class="y">E'lon qilingan vazifa</div></div>
        <div class="stat"><div class="q">${oxirgi.bajarilgan}</div><div class="y">Bajarilgan vazifa</div>
          <div class="k">Fill rate ${Math.round(oxirgi.bajarilgan / oxirgi.vazifa * 100)}%</div></div>
        <div class="stat"><div class="q">${pulQisqa(Math.round(oxirgi.tolov / oxirgi.maqom))}</div>
          <div class="y">O'rtacha oylik daromad</div><div class="k">bir ijrochiga</div></div>
        <div class="stat"><div class="q" style="color:${nizoUlush > 10 ? 'var(--qizil)' : 'var(--yashil)'}">${nizoUlush}%</div>
          <div class="y">Nizo ulushi</div><div class="k">${nizolar} ta nizo</div></div>
      </div>

      <div class="bolim-bosh"><h2>Oylik dinamika</h2></div>
      <div class="grafik">${Grafik.chiziq(TARIX)}</div>

      <div class="setka setka-2" style="margin-top:13px">
        <div class="grafik">
          <h3>Ijtimoiy registrdan chiqish</h3>
          ${registrlar.map(r => `
            <div class="ustun-qator">
              <span class="ustun-nom">${esc(r.nom)}</span>
              <span class="ustun-yolak"><i style="width:${r.jami ? r.chiqdi / r.jami * 100 : 0}%;background:var(--grad-yashil)"></i></span>
              <span class="ustun-qiymat">${r.chiqdi}/${r.jami}</span>
            </div>`).join('')}
          <p style="font-size:13px;color:var(--matn-3);margin-top:12px">
            Maqom olgan va rasman band hisoblangan fuqarolar ulushi</p>
        </div>

        <div class="grafik">
          <h3>Mahalla kesimida</h3>
          ${mahallaChiqdi.map(m => {
            const kor = kAnonim(m.son);
            return `<div class="ustun-qator">
              <span class="ustun-nom">${esc(m.nom)}</span>
              <span class="ustun-yolak"><i style="width:${kor === null ? 0 : m.son / maxChiqdi * 100}%"></i></span>
              <span class="ustun-qiymat">${kor === null
                ? '<span style="color:var(--matn-3)">&lt;5</span>' : kor}</span>
            </div>`;
          }).join('')}
          <p style="font-size:13px;color:var(--matn-3);margin-top:12px">
            &lt;5 — k-anonimlik qoidasi bo'yicha yashirilgan</p>
        </div>
      </div>

      <div class="bolim-bosh"><h2>Hisobot</h2></div>
      <div class="karta"><div class="karta-ich">
        <p style="font-size:15px;color:var(--matn-2);margin-bottom:16px">
          Oylik hisobot avtomatik shakllanadi va o'zgarmas nusxa sifatida saqlanadi.
          Har bir eksport audit jurnaliga yoziladi.</p>
        <div class="tugma-qator">
          <button class="tugma asos" data-amal="eksport-csv">⬇ CSV yuklab olish</button>
          <button class="tugma" data-amal="eksport-pdf">🖨 Chop etish</button>
        </div>
      </div></div>
    </div>`;
  },

  hisobot() {
    const jamiChiqdi = TARIX.reduce((s, t) => s + t.registrChiqdi, 0);
    const jamiTolov = TARIX.reduce((s, t) => s + t.tolov, 0);
    const ox = TARIX[TARIX.length - 1];

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Oylik hisobotlar</h1>
        <p>Har oy avtomatik shakllanadigan o'zgarmas nusxalar</p>
      </div>

      <div class="jadval-orab">
        <table>
          <thead><tr>
            <th>Davr</th><th class="raqam">Ro'yxat</th><th class="raqam">Maqom</th>
            <th class="raqam">Vazifa</th><th class="raqam">Bajarildi</th>
            <th class="raqam">To'lov</th><th class="raqam">Registrdan chiqdi</th><th class="raqam">Kuryer</th>
          </tr></thead>
          <tbody>
            ${TARIX.slice().reverse().map(t => `<tr>
              <td><b>${esc(t.oy)} 2026</b></td>
              <td class="raqam">${t.royxat}</td>
              <td class="raqam">${t.maqom}</td>
              <td class="raqam">${t.vazifa}</td>
              <td class="raqam">${t.bajarilgan}</td>
              <td class="raqam">${pulQisqa(t.tolov)}</td>
              <td class="raqam" style="color:var(--yashil);font-weight:700">${t.registrChiqdi}</td>
              <td class="raqam">${t.kuryer}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="eslatma yaxshi" style="margin-top:18px">
        <span class="ikon">📈</span>
        <div><h4>Pilot natijasi (3 oy)</h4>
          <p>${ox.royxat} fuqaro ro'yxatdan o'tdi, ${ox.maqom} nafari rasmiy maqom oldi,
             ${jamiChiqdi} nafari ijtimoiy registrdan chiqdi. Ularga jami ${pul(jamiTolov)}
             to'landi — davlat byudjetidan mablag' ajratilmagan holda.</p></div>
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

      ${ochiq.length
        ? ochiq.map(V_Moderator.nizoKarta).join('')
        : `<div class="bosh">${Ill.muvaffaqiyat(140)}
             <h3>Ochiq nizo yo'q</h3>
             <p>Barcha ishlar muammosiz yakunlanmoqda.</p></div>`}

      ${yopiq.length ? `
        <div class="bolim-bosh"><h2>Hal qilingan</h2></div>
        ${yopiq.map(n => {
          const v = Store.vazifa(n.vazifa);
          return `<div class="karta" style="margin-bottom:10px"><div class="karta-ich"
            style="display:flex;align-items:center;gap:12px">
            <h3 style="font-size:15.5px;flex:1">${esc(v ? v.nom : n.vazifa)}</h3>
            <span class="belgi yashil">${esc(n.qaror || 'Hal qilindi')}</span>
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
    <div class="karta" style="margin-bottom:16px"><div class="karta-ich">
      <div class="vazifa-yuqori">
        <h3 style="font-size:18px">${esc(v.nom)}</h3>
        <span class="belgi qizil">Ochiq nizo</span>
      </div>

      <div class="vazifa-qator" style="margin-bottom:16px">
        <span>👤 ${esc(ijrochi ? ijrochi.nom : '—')}</span>
        <span>🏢 ${esc(korxona ? korxona.nom : '—')}</span>
        <span>🔒 Eskrouda <b>${pul(summa)}</b></span>
      </div>

      <div class="eslatma xato" style="margin-bottom:18px">
        <span class="ikon">⚖️</span>
        <div><p>${esc(n.sabab)}</p></div>
      </div>

      ${(n.xabarlar || []).length ? `
        <div style="font-size:14px;font-weight:700;margin-bottom:11px">Tomonlar izohi</div>
        ${n.xabarlar.map(x => {
          const korxonaMi = x.kim.indexOf('c') === 0;
          const kim = korxonaMi ? Store.korxona(x.kim) : Store.fuqaro(x.kim);
          const nom = kim ? kim.nom : x.kim;
          return `<div class="xabar ${korxonaMi ? 'korxona' : ''}">
            ${Rasm.avatar(nom, 38)}
            <div class="xabar-ich">
              <div class="xabar-kim">${esc(nom)}</div>
              <div class="xabar-matn">${esc(x.matn)}</div>
              <div class="xabar-vaqt">${esc(x.vaqt)}</div>
            </div></div>`;
        }).join('')}` : ''}

      <div style="font-size:14px;font-weight:700;margin:20px 0 11px">Qaror</div>
      <div class="ulush-tanlov">
        <button class="ulush" data-amal="nizo-hal" data-id="${n.id}" data-ulush="100">
          <span><span class="u-nom">Ijrochi foydasiga</span>
            <span class="u-izoh">Ish to'liq qabul qilinadi</span></span>
          <span class="u-summa">${pulQisqa(summa)}<small>ijrochiga</small></span>
        </button>
        <button class="ulush" data-amal="nizo-hal" data-id="${n.id}" data-ulush="50">
          <span><span class="u-nom">Bo'lib berish (50/50)</span>
            <span class="u-izoh">Ikkala tomon qisman haq</span></span>
          <span class="u-summa">${pulQisqa(summa / 2)}<small>har biriga</small></span>
        </button>
        <button class="ulush" data-amal="nizo-hal" data-id="${n.id}" data-ulush="0">
          <span><span class="u-nom">Korxona foydasiga</span>
            <span class="u-izoh">Pul korxonaga qaytariladi</span></span>
          <span class="u-summa">${pulQisqa(summa)}<small>korxonaga</small></span>
        </button>
      </div>
    </div></div>`;
  },

  logistika() {
    const st = Store.get();
    const faol = st.vazifalar.filter(v =>
      ['ASSIGNED','IN_PROGRESS','UNDER_REVIEW'].indexOf(v.holat) !== -1);

    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Logistika</h1>
        <p>Uch pog'onali tarmoq — bir hududdagi barcha yuklar bitta marshrutga birlashtiriladi</p>
      </div>

      <div class="karta" style="margin-bottom:18px"><div class="karta-ich">
        <div class="pogona">
          <div class="pogona-nuqta"><div class="pi">🏭</div><div class="t">Viloyat</div>
            <div class="n">Toshkent viloyat omborxonasi</div></div>
          <span class="pogona-strelka">→</span>
          <div class="pogona-nuqta"><div class="pi">🏬</div><div class="t">Shahar</div>
            <div class="n">Nurafshon punkti</div></div>
          <span class="pogona-strelka">→</span>
          <div class="pogona-nuqta"><div class="pi">🏠</div><div class="t">Mahalla</div>
            <div class="n">FYG binosi</div></div>
        </div>
        <p style="font-size:13.5px;color:var(--matn-3);margin-top:14px;text-align:center">
          Alohida bino qurish shart emas — mavjud mahalla binolaridan foydalaniladi</p>
      </div></div>

      <div class="bolim-bosh"><h2>Kuryerlar</h2>
        <span class="izoh">Kuryerlik — qo'shimcha bandlik manbai</span></div>
      <div class="setka setka-3" style="margin-bottom:18px">
        ${KURYERLAR.map(k => `
          <div class="karta"><div class="karta-ich" style="display:flex;align-items:center;gap:12px">
            ${Rasm.avatar(k.nom, 44)}
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:15px">${esc(k.nom)}</div>
              <div style="font-size:13px;color:var(--matn-2)">${esc(k.transport)} · ${k.sigim} kg</div>
              <div style="margin-top:6px"><span class="belgi yashil">Rasman band</span></div>
            </div>
          </div></div>`).join('')}
        <div class="karta" style="border-style:dashed"><div class="karta-ich" style="text-align:center">
          <div style="font-size:26px;margin-bottom:6px">➕</div>
          <div style="font-weight:650;font-size:14.5px;color:var(--matn-2)">Yangi kuryer</div>
          <div style="font-size:12.5px;color:var(--matn-3);margin-top:3px">
            Mahalliy fuqaro ro'yxatdan o'tishi mumkin</div>
        </div></div>
      </div>

      <div class="bolim-bosh"><h2>Faol yuklar</h2></div>
      ${faol.length
        ? `<div class="jadval-orab"><table>
            <thead><tr><th>Vazifa</th><th>Olib ketish</th><th>Mahalla</th><th>Holat</th></tr></thead>
            <tbody>${faol.map(v => `<tr>
              <td style="white-space:normal;max-width:240px">${esc(v.nom)}</td>
              <td>${esc(hubNomi(v.pickup))}</td>
              <td>${esc(mahallaNomi(v.mahalla))}</td>
              <td>${belgi(v.holat)}</td>
            </tr>`).join('')}</tbody></table></div>`
        : bosh('Faol yuk yo\'q', 'Ish biriktirilganda yuklar shu yerda ko\'rinadi.')}
    </div>`;
  },

  audit() {
    const st = Store.get();
    return `
    <div class="kirish">
      <div class="sahifa-bosh">
        <h1>Audit jurnali</h1>
        <p>Har bir holat o'zgarishi qayd etiladi. Yozuvlar o'chirilmaydi.</p>
      </div>

      ${st.audit.length
        ? `<div class="jadval-orab"><table>
            <thead><tr><th>Vaqt</th><th>Kim</th><th>Amal</th><th>Obyekt</th><th>O'zgarish</th></tr></thead>
            <tbody>${st.audit.slice(0, 60).map(a => `<tr>
              <td style="color:var(--matn-3);font-size:13px">${esc(a.vaqt)}</td>
              <td><span class="belgi">${esc(a.kim)}</span></td>
              <td><b>${esc(a.amal)}</b></td>
              <td style="white-space:normal;max-width:240px">${esc(a.obyekt)}</td>
              <td style="font-family:var(--mono);font-size:13px">${esc(a.eski)} → ${esc(a.yangi)}</td>
            </tr>`).join('')}</tbody></table></div>`
        : bosh('Jurnal bo\'sh', 'Biror amal bajaring — u shu yerda qayd etiladi.')}
    </div>`;
  }
};
