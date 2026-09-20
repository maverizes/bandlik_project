/* =============================================================================
   APP — kirish oqimi darvozasi, router, rollar, amallar
   ============================================================================= */

const App = (function () {
  'use strict';

  /* Rol → bo'limlar. Ikonka mobil pastki navigatsiya uchun. */
  const ROLLAR = {
    fuqaro: { nom: 'Fuqaro', belgicha: '👤', tablar: [
      ['ishlar',         'Ishlar',         '🔍'],
      ['meningIshlarim', 'Mening ishlarim','📋'],
      ['hamyon',         'Hamyon',         '💳'],
      ['profil',         'Profil',         '👤']
    ]},
    korxona: { nom: 'Korxona', belgicha: '🏢', tablar: [
      ['vazifalar',  'Vazifalar',   '📦'],
      ['yangi',      "Yangi e'lon", '➕'],
      ['hisobKitob', 'Hisob-kitob', '💰']
    ]},
    boshqarma: { nom: 'Boshqarma', belgicha: '📊', tablar: [
      ['dashboard', 'Monitoring', '📊'],
      ['hisobot',   'Hisobotlar', '📄']
    ]},
    moderator: { nom: 'Moderator', belgicha: '⚖️', tablar: [
      ['nizolar',   'Nizolar',   '⚖️'],
      ['logistika', 'Logistika', '🚚'],
      ['audit',     'Audit',     '📜']
    ]}
  };

  const KORINISHLAR = {
    fuqaro: V_Fuqaro, korxona: V_Korxona,
    boshqarma: V_Boshqarma, moderator: V_Moderator
  };

  let joriyTab = null;
  const el = id => document.getElementById(id);

  /* ---------------------------------------------------------------- toast */

  let toastTimer;
  function toast(matn, tur) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    const ikon = tur === 'xato' ? '⚠️' : tur === 'yaxshi' ? '✓' : '';
    t.innerHTML = (ikon ? `<span>${ikon}</span>` : '') + `<span>${esc(matn)}</span>`;
    t.className = 'toast' + (tur ? ' ' + tur : '');
    requestAnimationFrame(() => t.classList.add('kor'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('kor'), 2800);
  }

  /* -------------------------------------------------------------- chizish */

  function rollarChiz() {
    const st = Store.get();
    el('rol-tanlov').innerHTML = Object.keys(ROLLAR).map(k =>
      `<button class="rol-btn ${st.rol === k ? 'faol' : ''}" data-rol="${k}"
               title="${ROLLAR[k].nom} ko'rinishi">
         <span>${ROLLAR[k].belgicha}</span><span>${ROLLAR[k].nom}</span>
       </button>`).join('');
  }

  function tablarChiz() {
    const st = Store.get();
    const r = ROLLAR[st.rol];
    if (!joriyTab || !r.tablar.some(t => t[0] === joriyTab)) joriyTab = r.tablar[0][0];

    el('tablar').innerHTML = r.tablar.map(([kalit, nom]) => {
      const son = tabSoni(st.rol, kalit);
      return `<button class="tab ${joriyTab === kalit ? 'faol' : ''}" data-tab="${kalit}">
        ${nom}${son ? `<span class="son">${son}</span>` : ''}</button>`;
    }).join('');

    el('past-nav').innerHTML = r.tablar.map(([kalit, nom, ikon]) => {
      const son = tabSoni(st.rol, kalit);
      return `<button class="${joriyTab === kalit ? 'faol' : ''}" data-tab="${kalit}">
        <span class="pn-ikon">${ikon}</span>
        <span>${nom.split(' ')[0]}</span>
        ${son ? `<span class="pn-son">${son}</span>` : ''}</button>`;
    }).join('');
  }

  function tabSoni(rol, tab) {
    const st = Store.get();
    if (rol === 'korxona' && tab === 'vazifalar')
      return st.vazifalar.filter(v => v.korxona === st.menKorxona && v.holat === 'UNDER_REVIEW').length;
    if (rol === 'moderator' && tab === 'nizolar')
      return st.nizolar.filter(n => n.holat === 'OCHIQ').length;
    if (rol === 'fuqaro' && tab === 'meningIshlarim') {
      const men = Store.menFuqaro();
      return st.vazifalar.filter(v => v.ijrochi === men.id &&
        ['ASSIGNED','IN_PROGRESS','REWORK'].indexOf(v.holat) !== -1).length;
    }
    return 0;
  }

  function chiz() {
    const st = Store.get();
    rollarChiz();
    tablarChiz();
    const korinish = KORINISHLAR[st.rol];
    el('asos').innerHTML = korinish[joriyTab] ? korinish[joriyTab]() : '';
    window.scrollTo(0, 0);
    if (st.rol === 'korxona' && joriyTab === 'yangi') hisobYangila();
  }

  /* ------------------------------------------------------ e'lon hisoblagich */

  function hisobYangila() {
    const oyna = el('hisob-oyna');
    if (!oyna) return;
    const narx = +(el('f-narx').value || 0);
    const miqdor = +(el('f-miqdor').value || 0);
    const jami = narx * miqdor;
    const kom = jami > 0 ? komissiyaHisobla(jami) : 0;
    const k = Store.menKorxona();
    const yetarli = k.balans >= jami;

    oyna.innerHTML = `
      <div class="hisob-oyna">
        <div class="ho-qator">
          <span>Ijrochilarga jami</span>
          <b>${pul(jami)}</b>
        </div>
        <div class="ho-qator kichik">
          <span>Platforma komissiyasi (${KOMISSIYA.foiz}%)</span>
          <span>${pul(kom)}</span>
        </div>
        <div class="ho-qator jami">
          <span>Hisobingizdan bloklanadi</span>
          <b>${pul(jami)}</b>
        </div>
      </div>
      ${!yetarli
        ? `<div class="eslatma xato" style="margin-top:12px">
             <span class="ikon">⚠️</span>
             <div><h4>Mablag' yetarli emas</h4>
               <p>Hisobingizda ${pul(k.balans)} bor. Miqdorni kamaytiring.</p></div></div>`
        : ''}`;
  }

  /* -------------------------------------------------------------- amallar */

  const AMALLAR = {
    'maqom-ariza'() { Store.maqomArizaBer(); toast('Ariza yuborildi'); chiz(); },

    'maqom-tasdiq'() {
      Store.maqomTasdiqla();
      toast('Maqom berildi — endi ish olishingiz mumkin', 'yaxshi');
      chiz();
    },

    'ariza'(t) {
      const r = Store.arizaBer(t.dataset.id);
      toast(r.ok ? 'Ariza yuborildi — korxona javobini kuting' : r.xato, r.ok ? 'yaxshi' : 'xato');
      chiz();
    },

    'biriktir'(t) {
      const r = Store.biriktir(t.dataset.id, t.dataset.fuqaro);
      toast(r.ok ? 'Ijrochi biriktirildi' : r.xato, r.ok ? 'yaxshi' : 'xato');
      chiz();
    },

    'boshla'(t) {
      const r = Store.boshla(t.dataset.id);
      toast(r.ok ? 'Ish boshlandi' : r.xato, r.ok ? null : 'xato');
      chiz();
    },

    'foto'(t) {
      const v = Store.vazifa(t.dataset.id);
      v.foto = (v.foto && v.foto.length) ? [] : ['dalil-1.jpg', 'dalil-2.jpg'];
      Store.saqla();
      toast(v.foto.length ? '2 ta foto qo\'shildi' : 'Fotolar olib tashlandi');
      chiz();
    },

    'topshir'(t) {
      const v = Store.vazifa(t.dataset.id);
      const r = Store.topshir(t.dataset.id, v.foto || []);
      toast(r.ok ? 'Ish topshirildi — korxona tekshiradi' : r.xato, r.ok ? 'yaxshi' : 'xato');
      chiz();
    },

    'qabul'(t) {
      const r = Store.sifatQabul(t.dataset.id);
      if (r.ok) toast(`To'landi: ${pul(r.natija.ijrochiga)} ijrochiga`, 'yaxshi');
      else toast(r.xato, 'xato');
      chiz();
    },

    'qayta'(t) {
      const sabab = prompt('Nima to\'g\'rilanishi kerak?', 'Sifat mezoniga to\'liq mos emas');
      if (sabab === null) return;
      const r = Store.qaytaIshlash(t.dataset.id, sabab);
      toast(r.ok ? 'Qayta ishlashga qaytarildi' : r.xato, r.ok ? null : 'xato');
      chiz();
    },

    'nizo'(t) {
      const sabab = prompt('Rad etish sababi:', 'Sifat talabga javob bermaydi');
      if (sabab === null) return;
      const r = Store.nizoOch(t.dataset.id, sabab);
      toast(r.ok ? 'Nizo ochildi — moderator ko\'rib chiqadi' : r.xato, r.ok ? null : 'xato');
      chiz();
    },

    'nizo-hal'(t) {
      const r = Store.nizoHal(t.dataset.id, +t.dataset.ulush);
      toast(`Qaror qabul qilindi — ijrochiga ${pul(r.natija.ijrochiga)}`, 'yaxshi');
      chiz();
    },

    'pul-yech'() {
      const men = Store.menFuqaro();
      const b = Store.balans(men.id);
      toast('Yuz orqali tekshirish (demo: o\'tkazib yuborildi)');
      Store.balansQosh(men.id, -b);
      Store.saqla();
      setTimeout(() => { toast(`${pul(b)} kartangizga yuborildi`, 'yaxshi'); chiz(); }, 1000);
    },

    'vazifa-yarat'() {
      const nom = el('f-nom').value.trim();
      if (!nom) { toast('Vazifa nomini kiriting', 'xato'); el('f-nom').focus(); return; }
      const sifat = el('f-sifat').value.split('\n').map(s => s.trim()).filter(Boolean);

      const r = Store.vazifaYarat({
        nom,
        tavsif: el('f-tavsif').value.trim() || '—',
        narx: +el('f-narx').value,
        miqdor: +el('f-miqdor').value,
        muddatKun: +el('f-muddat').value,
        birlik: 'dona',
        konikma: [el('f-konikma').value],
        mahalla: el('f-mahalla').value,
        xomashyo: 'Korxonadan',
        pickup: 'h3',
        sifat: sifat.length ? sifat : ['Sifat talabga mos'],
        fotoTalab: el('f-foto').checked,
        minTrust: 0
      });

      if (!r.ok) { toast(r.xato, 'xato'); return; }
      toast("E'lon qilindi va pul eskrouga bloklandi", 'yaxshi');
      joriyTab = 'vazifalar';
      chiz();
    },

    'eksport-csv'() {
      const q = [['Davr','Royxatdan otgan','Maqom olgan','Vazifa','Bajarilgan','Tolov','Registrdan chiqdi','Kuryer']];
      TARIX.forEach(t => q.push([t.oy + ' 2026', t.royxat, t.maqom, t.vazifa, t.bajarilgan, t.tolov, t.registrChiqdi, t.kuryer]));
      const blob = new Blob(['﻿' + q.map(r => r.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'nurafshon-bandlik-hisobot.csv';
      a.click();
      URL.revokeObjectURL(a.href);
      Store.audit('HISOBOT_EKSPORT', 'Oylik hisobot CSV', '-', 'yuklandi');
      Store.saqla();
      toast('Hisobot yuklab olindi', 'yaxshi');
    },

    'eksport-pdf'() { window.print(); },

    'tab'(t) { joriyTab = t.dataset.tab; chiz(); },

    'tozala'() {
      if (!confirm('Demo boshidan boshlansinmi? Kirish oqimi ham qaytadan ko\'rsatiladi.')) return;
      Store.tozala();
      joriyTab = null;
      boshla();
    }
  };

  /* --------------------------------------------------------------- hodisa */

  document.addEventListener('click', function (e) {
    if (Onboarding.faolmi()) return;

    const rol = e.target.closest('[data-rol]');
    if (rol) { Store.rolOzgartir(rol.dataset.rol); joriyTab = null; chiz(); return; }

    const tab = e.target.closest('[data-tab]');
    if (tab) { joriyTab = tab.dataset.tab; chiz(); return; }

    const amal = e.target.closest('[data-amal]');
    if (amal && AMALLAR[amal.dataset.amal]) { AMALLAR[amal.dataset.amal](amal); return; }
  });

  document.addEventListener('input', function (e) {
    if (['f-narx','f-miqdor'].indexOf(e.target.id) !== -1) hisobYangila();
  });

  /* ---------------------------------------------------------- ishga tushirish */

  function boshla() {
    const st = Store.get();
    if (!st.onboardingTugadi) {
      document.body.classList.add('ob-ochiq');
      Onboarding.boshla(function (ma) {
        document.body.classList.remove('ob-ochiq');
        joriyTab = ma.rol === 'korxona' ? 'yangi' : 'ishlar';
        chiz();
        setTimeout(() => toast('Xush kelibsiz!', 'yaxshi'), 400);
      });
    } else {
      chiz();
    }
  }

  return { boshla, chiz, toast };
})();

document.getElementById('tozala-btn').addEventListener('click', function () {
  if (!confirm('Demo boshidan boshlansinmi? Kirish oqimi ham qaytadan ko\'rsatiladi.')) return;
  Store.tozala();
  App.boshla();
});

App.boshla();
