/* =============================================================================
   STORE — holat, localStorage, amallar
   ============================================================================= */

const Store = (function () {
  const KEY = 'hunar-demo-v1';
  let s = null;

  function boshlangich() {
    const vazifalar = VAZIFALAR.map(v => {
      const nusxa = Object.assign({}, v);
      nusxa.jami = jamiSumma(v);
      nusxa.qaytaIshlash = 0;
      nusxa.arizalar = [];
      nusxa.foto = [];
      nusxa.tarix = [];

      if (v.holat !== 'DRAFT') nusxa.eskrou = Eskrou.yarat(v);
      return nusxa;
    });

    const st = {
      rol: 'fuqaro',
      menFuqaro: 'w1',          // Dilnoza — maqomi hali yo'q (gate demosi)
      menKorxona: 'c1',
      vazifalar,
      fuqarolar: FUQAROLAR.map(f => Object.assign({}, f)),
      korxonalar: KORXONALAR.map(c => Object.assign({}, c)),
      nizolar: NIZOLAR.map(n => Object.assign({}, n)),
      ledger: [],
      komissiyaJami: 0,
      hamyon: {},               // fuqaro id -> balans
      audit: [],
      mavzu: null
    };

    seedEskrou(st);
    return st;
  }

  /* Seed vazifalari uchun eskrouni HAQIQATAN moliyalashtiramiz:
     korxona hisobidan pul yechiladi va ledgerga yozuv tushadi.
     Aks holda daftar boshidan nomutanosib bo'lib qoladi. */
  function seedEskrou(st) {
    st.vazifalar.forEach(v => {
      if (!v.eskrou) return;
      const kirim = Eskrou.pulKirit(st, v);
      if (!kirim.ok) { v.eskrou.holat = 'PENDING'; return; }
      // PAID holatidagilar uchun pulni darrov ozod qilamiz
      if (v.holat === 'PAID' && v.ijrochi) {
        const n = Eskrou.ozodQil(st, v, 100);
        st.hamyon[v.ijrochi] = (st.hamyon[v.ijrochi] || 0) + n.ijrochiga;
      }
    });
  }

  function yukla() {
    if (s) return s;
    try {
      const xom = localStorage.getItem(KEY);
      s = xom ? JSON.parse(xom) : boshlangich();
    } catch (e) {
      s = boshlangich();
    }
    return s;
  }

  function saqla() {
    if (!s) return;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* xotira bloklangan */ }
  }

  function audit(amal, obyekt, eski, yangi) {
    yukla().audit.unshift({
      amal, obyekt, eski, yangi,
      kim: holat().rol,
      vaqt: new Date().toLocaleString('uz-UZ')
    });
  }

  function holat() { return yukla(); }

  return {
    get: holat,
    saqla,
    audit,

    rolOzgartir(rol) { yukla().rol = rol; saqla(); },
    mavzuOzgartir(m) { yukla().mavzu = m; saqla(); },

    menFuqaro() { const st = yukla(); return st.fuqarolar.find(f => f.id === st.menFuqaro); },
    menKorxona() { const st = yukla(); return st.korxonalar.find(c => c.id === st.menKorxona); },

    fuqaro(id) { return yukla().fuqarolar.find(f => f.id === id); },
    korxona(id) { return yukla().korxonalar.find(c => c.id === id); },
    vazifa(id) { return yukla().vazifalar.find(v => v.id === id); },

    balans(fuqaroId) { return yukla().hamyon[fuqaroId] || 0; },
    balansQosh(fuqaroId, summa) {
      const st = yukla();
      st.hamyon[fuqaroId] = (st.hamyon[fuqaroId] || 0) + summa;
    },

    /* --- Maqom olish (PQ-4742 gate) --- */
    maqomArizaBer() {
      const f = this.menFuqaro();
      f.selfEmployment = 'PENDING';
      audit('MAQOM_ARIZA', f.nom, 'NOT_STARTED', 'PENDING');
      saqla();
    },
    maqomTasdiqla() {
      const f = this.menFuqaro();
      f.selfEmployment = 'VERIFIED';
      f.trust = Math.min(100, f.trust + 15);
      audit('MAQOM_TASDIQ', f.nom, 'PENDING', 'VERIFIED');
      saqla();
    },

    /* --- Vazifa amallari --- */
    arizaBer(vazifaId) {
      const v = this.vazifa(vazifaId);
      const f = this.menFuqaro();
      if (f.selfEmployment !== 'VERIFIED') {
        return { ok: false, xato: "Avval \"o'zini o'zi band qilgan shaxs\" maqomini oling" };
      }
      if (v.minTrust && f.trust < v.minTrust) {
        return { ok: false, xato: `Bu vazifa uchun kamida ${v.minTrust} ishonch bali kerak (sizda ${f.trust})` };
      }
      if (v.arizalar.indexOf(f.id) !== -1) return { ok: false, xato: 'Siz allaqachon ariza bergansiz' };
      v.arizalar.push(f.id);
      audit('ARIZA', v.nom, '-', f.nom);
      saqla();
      return { ok: true };
    },

    biriktir(vazifaId, fuqaroId) {
      const v = this.vazifa(vazifaId);
      const f = this.fuqaro(fuqaroId);
      const r = otish(v, 'ASSIGNED', 'korxona', { ijrochi: f });
      if (!r.ok) return r;
      v.ijrochi = fuqaroId;
      audit('BIRIKTIRISH', v.nom, r.eski, r.yangi);
      saqla();
      return r;
    },

    boshla(vazifaId) {
      const v = this.vazifa(vazifaId);
      const r = otish(v, 'IN_PROGRESS', 'fuqaro');
      if (r.ok) { audit('BOSHLANDI', v.nom, r.eski, r.yangi); saqla(); }
      return r;
    },

    topshir(vazifaId, foto) {
      const v = this.vazifa(vazifaId);
      const r = otish(v, 'SUBMITTED', 'fuqaro', { foto });
      if (!r.ok) return r;
      v.foto = foto;
      v.topshirilgan = true;
      otish(v, 'UNDER_REVIEW', 'tizim');
      audit('TOPSHIRILDI', v.nom, r.eski, 'UNDER_REVIEW');
      saqla();
      return { ok: true };
    },

    sifatQabul(vazifaId) {
      const st = yukla();
      const v = this.vazifa(vazifaId);
      const r = otish(v, 'ACCEPTED', 'korxona');
      if (!r.ok) return r;

      const natija = Eskrou.ozodQil(st, v, 100);
      otish(v, 'PAID', 'tizim');

      this.balansQosh(v.ijrochi, natija.ijrochiga);
      const f = this.fuqaro(v.ijrochi);
      if (f) { f.bajargan += 1; f.daromad += natija.ijrochiga; f.trust = Math.min(100, f.trust + 2); }

      audit('SIFAT_QABUL', v.nom, 'UNDER_REVIEW', 'PAID');
      saqla();
      return { ok: true, natija };
    },

    qaytaIshlash(vazifaId, sabab) {
      const v = this.vazifa(vazifaId);
      const r = otish(v, 'REWORK', 'korxona');
      if (!r.ok) return r;
      v.qaytaIshlash = (v.qaytaIshlash || 0) + 1;
      v.rejectSabab = sabab;
      audit('QAYTA_ISHLASH', v.nom, r.eski, r.yangi);
      saqla();
      return r;
    },

    nizoOch(vazifaId, sabab) {
      const st = yukla();
      const v = this.vazifa(vazifaId);
      const r = otish(v, 'DISPUTED', st.rol === 'korxona' ? 'korxona' : 'fuqaro');
      if (!r.ok) return r;
      st.nizolar.push({
        id: 'd' + (st.nizolar.length + 1), vazifa: vazifaId,
        ochgan: st.rol === 'korxona' ? v.korxona : v.ijrochi,
        holat: 'OCHIQ', sabab, xabarlar: []
      });
      audit('NIZO_OCHILDI', v.nom, r.eski, r.yangi);
      saqla();
      return r;
    },

    nizoHal(nizoId, ulushFoiz) {
      const st = yukla();
      const n = st.nizolar.find(x => x.id === nizoId);
      const v = this.vazifa(n.vazifa);

      if (!v.eskrou) v.eskrou = Eskrou.yarat(v);
      if (v.eskrou.holat === 'PENDING') v.eskrou.holat = 'HELD';

      const natija = Eskrou.ozodQil(st, v, ulushFoiz);
      v.holat = 'PAID';
      if (natija.ijrochiga > 0) this.balansQosh(v.ijrochi, natija.ijrochiga);

      n.holat = 'HAL_QILINDI';
      n.qaror = ulushFoiz === 100 ? 'Ijrochi foydasiga'
              : ulushFoiz === 0   ? 'Korxona foydasiga'
              : `Bo'lib berildi (ijrochiga ${ulushFoiz}%)`;
      audit('NIZO_QARORI', v.nom, 'DISPUTED', n.qaror);
      saqla();
      return { ok: true, natija };
    },

    vazifaYarat(malumot) {
      const st = yukla();
      const v = Object.assign({
        id: 't' + (st.vazifalar.length + 1),
        korxona: st.menKorxona,
        holat: 'DRAFT',
        arizalar: [], foto: [], qaytaIshlash: 0
      }, malumot);
      v.jami = jamiSumma(v);
      v.eskrou = Eskrou.yarat(v);

      const pul = Eskrou.pulKirit(st, v);
      if (!pul.ok) return pul;

      const r = otish(v, 'PUBLISHED', 'korxona');
      if (!r.ok) return r;

      st.vazifalar.unshift(v);
      audit('VAZIFA_ELON', v.nom, 'DRAFT', 'PUBLISHED');
      saqla();
      return { ok: true, vazifa: v };
    },

    tozala() {
      try { localStorage.removeItem(KEY); } catch (e) {}
      s = null;
    }
  };
})();
