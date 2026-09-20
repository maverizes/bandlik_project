/* =============================================================================
   APP — router, rollar, amallar
   ============================================================================= */

(function () {
  'use strict';

  const ROLLAR = {
    fuqaro:    { nom: 'Fuqaro',    belgicha: '👤',
      tablar: [['ishlar','Ishlar'], ['meningIshlarim','Mening ishlarim'], ['hamyon','Hamyon'], ['profil','Profil']] },
    korxona:   { nom: 'Korxona',   belgicha: '🏢',
      tablar: [['vazifalar','Vazifalar'], ['yangi',"Yangi e'lon"], ['hisobKitob','Hisob-kitob']] },
    boshqarma: { nom: 'Boshqarma', belgicha: '📊',
      tablar: [['dashboard','Monitoring'], ['hisobot','Hisobotlar']] },
    moderator: { nom: 'Moderator', belgicha: '⚖️',
      tablar: [['nizolar','Nizolar'], ['logistika','Logistika'], ['audit','Audit']] }
  };

  const KORINISHLAR = {
    fuqaro: V_Fuqaro, korxona: V_Korxona,
    boshqarma: V_Boshqarma, moderator: V_Moderator
  };

  let joriyTab = null;

  const el = id => document.getElementById(id);

  /* -------------------------------------------------------------- mavzu */

  function mavzuQoy(m) {
    document.documentElement.setAttribute('data-mavzu', m);
    const b = el('mavzu-btn');
    if (b) b.textContent = m === 'dark' ? '☀️' : '🌙';
  }

  /* -------------------------------------------------------------- toast */

  let toastTimer;
  function toast(matn, xato) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = matn;
    t.classList.toggle('xato', !!xato);
    requestAnimationFrame(() => t.classList.add('kor'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('kor'), 2600);
  }

  /* ------------------------------------------------------------- chizish */

  function rollarChiz() {
    const st = Store.get();
    el('rol-tanlov').innerHTML = Object.keys(ROLLAR).map(k =>
      `<button class="rol-btn ${st.rol === k ? 'faol' : ''}" data-rol="${k}">
         <span>${ROLLAR[k].belgicha}</span><span>${ROLLAR[k].nom}</span></button>`).join('');
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
  }

  function tabSoni(rol, tab) {
    const st = Store.get();
    if (rol === 'korxona' && tab === 'vazifalar') {
      return st.vazifalar.filter(v => v.korxona === st.menKorxona && v.holat === 'UNDER_REVIEW').length;
    }
    if (rol === 'moderator' && tab === 'nizolar') {
      return st.nizolar.filter(n => n.holat === 'OCHIQ').length;
    }
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
      <div class="vazifa-pul" style="margin-bottom:0">
        <div>
          <div class="vazifa-summa">${pul(jami)}</div>
          <div class="vazifa-hisob">${pul(narx)} × ${miqdor} — eskrouga bloklanadi</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:12.5px;color:var(--matn-3)">Platforma komissiyasi</div>
          <div style="font-weight:680">${pul(kom)}</div>
        </div>
      </div>
      ${!yetarli ? `<div class="eslatma xato" style="margin-top:10px;padding:10px 12px">
        <p>Hisobingizda mablag' yetarli emas (mavjud: ${pul(k.balans)})</p></div>` : ''}`;
  }

  /* ------------------------------------------------------------- amallar */

  const AMALLAR = {
    'maqom-ariza'() {
      Store.maqomArizaBer();
      toast('Ariza yuborildi — tekshirilmoqda');
      chiz();
    },
    'maqom-tasdiq'() {
      Store.maqomTasdiqla();
      toast("✓ Maqom berildi — endi ish olishingiz mumkin");
      chiz();
    },
    'ariza'(t) {
      const r = Store.arizaBer(t.dataset.id);
      toast(r.ok ? 'Ariza yuborildi' : r.xato, !r.ok);
      chiz();
    },
    'biriktir'(t) {
      const r = Store.biriktir(t.dataset.id, t.dataset.fuqaro);
      toast(r.ok ? 'Ijrochi biriktirildi' : r.xato, !r.ok);
      chiz();
    },
    'boshla'(t) {
      const r = Store.boshla(t.dataset.id);
      toast(r.ok ? 'Ish boshlandi' : r.xato, !r.ok);
      chiz();
    },
    'foto'(t) {
      const v = Store.vazifa(t.dataset.id);
      v.foto = (v.foto && v.foto.length) ? v.foto : ['dalil-1.jpg', 'dalil-2.jpg'];
      Store.saqla();
      toast('2 ta foto qo\'shildi (demo)');
      chiz();
    },
    'topshir'(t) {
      const v = Store.vazifa(t.dataset.id);
      const r = Store.topshir(t.dataset.id, v.foto || []);
      toast(r.ok ? 'Ish topshirildi — korxona tekshiradi' : r.xato, !r.ok);
      chiz();
    },
    'qabul'(t) {
      const r = Store.sifatQabul(t.dataset.id);
      if (r.ok) toast(`To'lov amalga oshdi: ${pul(r.natija.ijrochiga)} ijrochiga`);
      else toast(r.xato, true);
      chiz();
    },
    'qayta'(t) {
      const sabab = prompt('Qayta ishlash sababi:', 'Sifat mezoniga to\'liq mos emas');
      if (sabab === null) return;
      const r = Store.qaytaIshlash(t.dataset.id, sabab);
      toast(r.ok ? 'Qayta ishlashga qaytarildi' : r.xato, !r.ok);
      chiz();
    },
    'nizo'(t) {
      const sabab = prompt('Rad etish sababi:', 'Sifat talabga javob bermaydi');
      if (sabab === null) return;
      const r = Store.nizoOch(t.dataset.id, sabab);
      toast(r.ok ? 'Nizo ochildi — moderator ko\'rib chiqadi' : r.xato, !r.ok);
      chiz();
    },
    'nizo-hal'(t) {
      const r = Store.nizoHal(t.dataset.id, +t.dataset.ulush);
      toast(`Qaror qabul qilindi — ijrochiga ${pul(r.natija.ijrochiga)}`);
      chiz();
    },
    'pul-yech'() {
      toast('Yuz orqali tekshirish talab qilinadi (demo: o\'tkazib yuborildi)');
      const men = Store.menFuqaro();
      const b = Store.balans(men.id);
      Store.balansQosh(men.id, -b);
      Store.saqla();
      setTimeout(() => { toast(`${pul(b)} kartangizga yuborildi`); chiz(); }, 900);
    },
    'vazifa-yarat'() {
      const nom = el('f-nom').value.trim();
      if (!nom) return toast('Vazifa nomini kiriting', true);
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

      if (!r.ok) return toast(r.xato, true);
      toast("Vazifa e'lon qilindi va eskrouga pul bloklandi");
      joriyTab = 'vazifalar';
      chiz();
    },
    'eksport-csv'() {
      const qatorlar = [['Davr','Royxatdan otgan','Maqom olgan','Vazifa','Bajarilgan','Tolov','Registrdan chiqdi','Kuryer']];
      TARIX.forEach(t => qatorlar.push([t.oy + ' 2026', t.royxat, t.maqom, t.vazifa, t.bajarilgan, t.tolov, t.registrChiqdi, t.kuryer]));
      const csv = '﻿' + qatorlar.map(q => q.join(';')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'nurafshon-bandlik-hisobot.csv';
      a.click();
      URL.revokeObjectURL(a.href);
      Store.audit('HISOBOT_EKSPORT', 'Oylik hisobot CSV', '-', 'yuklandi');
      Store.saqla();
      toast('Hisobot yuklab olindi');
    },
    'eksport-pdf'() { window.print(); },
    'tozala'() {
      if (!confirm('Demo ma\'lumotlari boshlang\'ich holatga qaytarilsinmi?')) return;
      Store.tozala();
      joriyTab = null;
      chiz();
      toast('Demo qayta boshlandi');
    }
  };

  /* --------------------------------------------------------------- hodisa */

  document.addEventListener('click', function (e) {
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

  const st = Store.get();
  mavzuQoy(st.mavzu || (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  el('mavzu-btn').addEventListener('click', function () {
    const yangi = document.documentElement.getAttribute('data-mavzu') === 'dark' ? 'light' : 'dark';
    mavzuQoy(yangi);
    Store.mavzuOzgartir(yangi);
  });

  el('tozala-btn').addEventListener('click', () => AMALLAR['tozala']());

  chiz();
})();
