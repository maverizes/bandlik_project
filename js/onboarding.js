/* =============================================================================
   KIRISH OQIMI (onboarding)

   Tartib:  xush → rol tanlash → telefon → SMS kod → ism/korxona
            → (fuqaro) mahalla → (fuqaro) ko'nikma → tayyor

   Tamoyil: bitta ekranda bitta savol. Foydalanuvchi hech qachon
   "endi nima qilaman?" deb o'ylab qolmasligi kerak.
   ============================================================================= */

const Onboarding = (function () {

  let ma = {};          // yig'ilayotgan ma'lumot
  let qadam = 0;
  let root = null;
  let tugagachCB = null;

  /* Qadamlar ro'yxati rolga qarab o'zgaradi */
  function qadamlar() {
    const asos = ['xush', 'rol'];
    if (!ma.rol) return asos;
    const umumiy = ['telefon', 'kod'];
    return ma.rol === 'fuqaro'
      ? asos.concat(umumiy, ['ism', 'mahalla', 'konikma', 'tayyor'])
      : asos.concat(umumiy, ['korxona', 'tayyor']);
  }

  function hozir() { return qadamlar()[qadam]; }

  /* Progress nuqtalari.
     "xush" va "rol" qadamlarida ko'rsatilmaydi: rol tanlanmaguncha oqim
     uzunligi noma'lum, 1 ta nuqta ko'rsatib keyin 6 taga sakrash chalg'itadi. */
  function nuqtalar() {
    const e = hozir();
    if (e === 'xush' || e === 'rol') return '';
    const korinadigan = qadamlar().slice(2);
    const joriy = korinadigan.indexOf(e);
    return `<div class="ob-nuqtalar">${korinadigan.map((_, i) =>
      `<span class="ob-nuqta ${i < joriy ? 'tayyor' : i === joriy ? 'joriy' : ''}"></span>`).join('')}</div>`;
  }

  /* ------------------------------------------------------------- qadamlar */

  const EKRAN = {

    xush() {
      return `
        <div class="ob-qadam" style="text-align:center">
          <div class="ob-rasm">${Ill.xushKelibsiz(300)}</div>
          <h1 class="ob-sarlavha">Ishga yaqinroq bo'ling</h1>
          <p class="ob-izoh">
            HUNAR — mahallangizdagi korxonalar bilan sizni bog'laydigan platforma.
            Uyingizdan chiqmasdan ish toping, ishingiz uchun kafolatlangan haq oling.
          </p>
          <button class="tugma asos keng" data-ob="keyingi">Boshlash</button>
          <p class="ob-eslatma">Ro'yxatdan o'tish bepul · 2 daqiqa vaqt oladi</p>
        </div>`;
    },

    rol() {
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">Nima qilmoqchisiz?</h1>
          <p class="ob-izoh">Sizga mos ekranlarni ko'rsatishimiz uchun tanlang.</p>

          <div class="rol-kartalar">
            <button class="rol-karta" data-ob="rol" data-qiymat="fuqaro">
              <span class="rol-karta-rasm">${Ill.ishQidiruvchi()}</span>
              <span class="rol-karta-matn">
                <h3>Ish qidiryapman</h3>
                <p>Uyda yoki mahallada bajariladigan ish topaman va haq olaman</p>
              </span>
              <span class="strelka">→</span>
            </button>

            <button class="rol-karta iliq" data-ob="rol" data-qiymat="korxona">
              <span class="rol-karta-rasm">${Ill.ishBeruvchi()}</span>
              <span class="rol-karta-matn">
                <h3>Ishchi qidiryapman</h3>
                <p>Korxonam uchun ishni bo'laklarga bo'lib, bajaruvchi topaman</p>
              </span>
              <span class="strelka">→</span>
            </button>
          </div>

          <p class="ob-eslatma">Keyinroq buni o'zgartirishingiz mumkin</p>
        </div>`;
    },

    telefon() {
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">Telefon raqamingiz</h1>
          <p class="ob-izoh">Kirish uchun SMS kod yuboramiz. Raqamingiz boshqalarga ko'rinmaydi.</p>

          <div class="maydon">
            <div class="tel-kirit">
              <span class="tel-prefiks">🇺🇿 +998</span>
              <input class="kirit" id="ob-tel" type="tel" inputmode="numeric"
                     placeholder="90 123 45 67" maxlength="12" autocomplete="tel">
            </div>
            <div class="yordam">Masalan: 90 123 45 67</div>
          </div>

          <div class="ob-pastki">
            <button class="tugma asos keng" data-ob="keyingi" id="ob-tel-btn" disabled>Kod olish</button>
          </div>
        </div>`;
    },

    kod() {
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">SMS kodni kiriting</h1>
          <p class="ob-izoh">
            <b>+998 ${esc(ma.telefon || '')}</b> raqamiga 4 xonali kod yubordik.
          </p>

          <div class="demo-kod">
            Demo rejimi — kod avtomatik ko'rsatiladi
            <b>${ma.kod}</b>
          </div>

          <div class="otp-qator">
            ${[0,1,2,3].map(i => `<input class="otp-xona" data-otp="${i}" type="tel"
              inputmode="numeric" maxlength="1" aria-label="${i+1}-raqam">`).join('')}
          </div>

          <div class="ob-pastki">
            <button class="tugma asos keng" data-ob="keyingi" id="ob-kod-btn" disabled>Tasdiqlash</button>
            <button class="tugma shaffof keng" data-ob="avto" style="margin-top:8px">
              Kodni avtomatik to'ldirish
            </button>
          </div>
        </div>`;
    },

    ism() {
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">Ismingiz kim?</h1>
          <p class="ob-izoh">Korxonalar sizni shu ism bilan ko'radi.</p>

          <div class="maydon">
            <label for="ob-ism">Ism va familiya</label>
            <input class="kirit" id="ob-ism" placeholder="Masalan: Dilnoza Karimova"
                   autocomplete="name" value="${esc(ma.ism || '')}">
          </div>

          <div class="ob-pastki">
            <button class="tugma asos keng" data-ob="keyingi" id="ob-ism-btn" disabled>Davom etish</button>
          </div>
        </div>`;
    },

    mahalla() {
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">Qaysi mahalladasiz?</h1>
          <p class="ob-izoh">Sizga eng yaqin ishlarni ko'rsatamiz — yo'lga vaqt ketmasin.</p>

          <div class="royxat-tanlov">
            ${MAHALLALAR.map(m => `
              <button class="royxat-element ${ma.mahalla === m.id ? 'tanlangan' : ''}"
                      data-ob="mahalla" data-qiymat="${m.id}">
                <span class="re-belgi">✓</span>
                <span>${esc(m.nom)}</span>
              </button>`).join('')}
          </div>

          <div class="ob-pastki">
            <button class="tugma asos keng" data-ob="keyingi" id="ob-mah-btn"
              ${ma.mahalla ? '' : 'disabled'}>Davom etish</button>
          </div>
        </div>`;
    },

    konikma() {
      const tanlangan = ma.konikma || [];
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">Nima ish qila olasiz?</h1>
          <p class="ob-izoh">Bittadan ko'p tanlash mumkin. Bilmasangiz ham mayli — keyin qo'shasiz.</p>

          <div class="tanlov-setka">
            ${KONIKMALAR.map(k => {
              const u = KASB_USLUB[k.id];
              const bor = tanlangan.indexOf(k.id) !== -1;
              return `<button class="tanlov ${bor ? 'tanlangan' : ''}"
                        data-ob="konikma" data-qiymat="${k.id}">
                <span class="tanlov-ikon" style="background:${u.grad}">${u.ikon}</span>
                <span class="tanlov-nom">${esc(k.nom)}</span>
              </button>`;
            }).join('')}
          </div>

          <div class="ob-pastki">
            <button class="tugma asos keng" data-ob="keyingi">
              ${tanlangan.length ? 'Davom etish' : "Hozir o'tkazib yuborish"}
            </button>
          </div>
        </div>`;
    },

    korxona() {
      return `
        <div class="ob-qadam">
          <h1 class="ob-sarlavha">Korxona ma'lumoti</h1>
          <p class="ob-izoh">Bu ma'lumot Soliq qo'mitasi bazasidan tekshiriladi.</p>

          <div class="maydon">
            <label for="ob-knom">Korxona nomi</label>
            <input class="kirit" id="ob-knom" placeholder="Masalan: Nurafshon Teks"
                   value="${esc(ma.korxonaNom || '')}">
          </div>

          <div class="maydon">
            <label for="ob-stir">STIR (soliq raqami)</label>
            <input class="kirit" id="ob-stir" inputmode="numeric" placeholder="301 456 789"
                   maxlength="11" value="${esc(ma.stir || '')}">
          </div>

          <div class="ob-pastki">
            <button class="tugma iliq keng" data-ob="keyingi" id="ob-kor-btn" disabled>Davom etish</button>
          </div>
        </div>`;
    },

    tayyor() {
      const fuqaroMi = ma.rol === 'fuqaro';
      const konikmaNom = (ma.konikma || []).map(id =>
        (KONIKMALAR.find(k => k.id === id) || {}).nom).filter(Boolean).join(', ');

      return `
        <div class="ob-qadam ob-tayyor">
          <div class="ob-rasm">${Ill.muvaffaqiyat(150)}</div>
          <h1 class="ob-sarlavha">Tayyor!</h1>
          <p class="ob-izoh">
            ${fuqaroMi
              ? "Hisobingiz ochildi. Endi bitta qadam qoldi — rasmiy maqom olish."
              : "Korxona hisobi ochildi. Endi birinchi vazifangizni e'lon qiling."}
          </p>

          <div class="xulosa">
            <div class="xulosa-qator">
              <span class="x-yorliq">Telefon</span>
              <span class="x-qiymat">+998 ${esc(ma.telefon)}</span>
            </div>
            <div class="xulosa-qator">
              <span class="x-yorliq">${fuqaroMi ? 'Ism' : 'Korxona'}</span>
              <span class="x-qiymat">${esc(fuqaroMi ? ma.ism : ma.korxonaNom)}</span>
            </div>
            ${fuqaroMi ? `
              <div class="xulosa-qator">
                <span class="x-yorliq">Mahalla</span>
                <span class="x-qiymat">${esc((MAHALLALAR.find(m => m.id === ma.mahalla) || {}).nom || '—')}</span>
              </div>
              ${konikmaNom ? `<div class="xulosa-qator">
                <span class="x-yorliq">Ko'nikma</span>
                <span class="x-qiymat">${esc(konikmaNom)}</span>
              </div>` : ''}`
            : `<div class="xulosa-qator">
                <span class="x-yorliq">STIR</span>
                <span class="x-qiymat">${esc(ma.stir)}</span>
              </div>`}
          </div>

          <button class="tugma ${fuqaroMi ? 'asos' : 'iliq'} keng" data-ob="tugat">
            ${fuqaroMi ? 'Ishlarni ko\'rish' : "Vazifa e'lon qilish"}
          </button>
        </div>`;
    }
  };

  /* --------------------------------------------------------------- chizish */

  function chiz() {
    const ekran = hozir();
    root.innerHTML = `
      <div class="ob-ich">
        <div class="ob-yuqori">
          <button class="ob-orqaga" data-ob="orqaga" ${qadam === 0 ? 'hidden' : ''}
                  aria-label="Orqaga">←</button>
          ${nuqtalar()}
        </div>
        ${EKRAN[ekran]()}
      </div>`;

    /* Fokus va maxsus hodisalar */
    if (ekran === 'telefon') tayyorlaTelefon();
    if (ekran === 'kod')     tayyorlaKod();
    if (ekran === 'ism')     tayyorlaMatn('ob-ism', 'ob-ism-btn', v => v.trim().length >= 3);
    if (ekran === 'korxona') tayyorlaKorxona();
  }

  /* ------------------------------------------------------ maydon mantiqlari */

  function tayyorlaTelefon() {
    const inp = document.getElementById('ob-tel');
    const btn = document.getElementById('ob-tel-btn');
    inp.value = ma.telefon || '';
    const tekshir = () => {
      const raqam = inp.value.replace(/\D/g, '');
      btn.disabled = raqam.length !== 9;
    };
    inp.addEventListener('input', () => {
      let r = inp.value.replace(/\D/g, '').slice(0, 9);
      inp.value = r.replace(/(\d{2})(\d{3})?(\d{2})?(\d{2})?/,
        (_, a, b, c, d) => [a, b, c, d].filter(Boolean).join(' '));
      tekshir();
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled) keyingi(); });
    tekshir();
    setTimeout(() => inp.focus(), 260);
  }

  function tayyorlaKod() {
    const xonalar = [...document.querySelectorAll('.otp-xona')];
    const btn = document.getElementById('ob-kod-btn');

    const tekshir = () => {
      const kod = xonalar.map(x => x.value).join('');
      xonalar.forEach(x => x.classList.toggle('toldi', !!x.value));
      btn.disabled = kod.length !== 4;
    };

    xonalar.forEach((x, i) => {
      x.addEventListener('input', () => {
        x.value = x.value.replace(/\D/g, '').slice(0, 1);
        if (x.value && i < 3) xonalar[i + 1].focus();
        tekshir();
      });
      x.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !x.value && i > 0) xonalar[i - 1].focus();
        if (e.key === 'Enter' && !btn.disabled) keyingi();
      });
    });
    setTimeout(() => xonalar[0].focus(), 260);
  }

  function tayyorlaMatn(inputId, btnId, shart) {
    const inp = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const tekshir = () => { btn.disabled = !shart(inp.value); };
    inp.addEventListener('input', tekshir);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled) keyingi(); });
    tekshir();
    setTimeout(() => inp.focus(), 260);
  }

  function tayyorlaKorxona() {
    const nom = document.getElementById('ob-knom');
    const stir = document.getElementById('ob-stir');
    const btn = document.getElementById('ob-kor-btn');
    const tekshir = () => {
      btn.disabled = nom.value.trim().length < 2 || stir.value.replace(/\D/g, '').length < 9;
    };
    stir.addEventListener('input', () => {
      let r = stir.value.replace(/\D/g, '').slice(0, 9);
      stir.value = r.replace(/(\d{3})(\d{3})?(\d{3})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
      tekshir();
    });
    nom.addEventListener('input', tekshir);
    tekshir();
    setTimeout(() => nom.focus(), 260);
  }

  /* ------------------------------------------------------------- harakatlar */

  function keyingi() {
    const ekran = hozir();

    if (ekran === 'telefon') {
      ma.telefon = document.getElementById('ob-tel').value.trim();
      ma.kod = String(Math.floor(1000 + Math.random() * 9000));
    }
    if (ekran === 'kod') {
      const kiritilgan = [...document.querySelectorAll('.otp-xona')].map(x => x.value).join('');
      if (kiritilgan !== ma.kod) {
        App.toast('Kod noto\'g\'ri. Demo kodi: ' + ma.kod, 'xato');
        return;
      }
    }
    if (ekran === 'ism')     ma.ism = document.getElementById('ob-ism').value.trim();
    if (ekran === 'korxona') {
      ma.korxonaNom = document.getElementById('ob-knom').value.trim();
      ma.stir = document.getElementById('ob-stir').value.trim();
    }

    qadam++;
    chiz();
  }

  function orqaga() {
    if (qadam === 0) return;
    qadam--;
    chiz();
  }

  /* --------------------------------------------------------------- hodisa */

  function hodisa(e) {
    const t = e.target.closest('[data-ob]');
    if (!t || !root.contains(t)) return;
    const amal = t.dataset.ob;

    if (amal === 'keyingi') return keyingi();
    if (amal === 'orqaga')  return orqaga();

    if (amal === 'rol') {
      ma.rol = t.dataset.qiymat;
      qadam++;
      chiz();
      return;
    }

    if (amal === 'mahalla') {
      ma.mahalla = t.dataset.qiymat;
      chiz();
      return;
    }

    if (amal === 'konikma') {
      ma.konikma = ma.konikma || [];
      const i = ma.konikma.indexOf(t.dataset.qiymat);
      if (i === -1) ma.konikma.push(t.dataset.qiymat); else ma.konikma.splice(i, 1);
      chiz();
      return;
    }

    if (amal === 'avto') {
      const xonalar = [...document.querySelectorAll('.otp-xona')];
      ma.kod.split('').forEach((c, i) => { xonalar[i].value = c; xonalar[i].classList.add('toldi'); });
      document.getElementById('ob-kod-btn').disabled = false;
      return;
    }

    if (amal === 'tugat') return tugat();
  }

  function tugat() {
    Store.royxatdanOtish(ma);
    root.style.transition = 'opacity .32s ease';
    root.style.opacity = '0';
    setTimeout(() => {
      document.removeEventListener('click', hodisa);
      root.remove();
      root = null;
      if (tugagachCB) tugagachCB(ma);
    }, 320);
  }

  /* ----------------------------------------------------------------- API */

  return {
    boshla(tugagach) {
      ma = {}; qadam = 0; tugagachCB = tugagach;
      root = document.createElement('div');
      root.className = 'ob';
      document.body.appendChild(root);
      document.addEventListener('click', hodisa);
      chiz();
    },
    faolmi() { return !!root; }
  };
})();
