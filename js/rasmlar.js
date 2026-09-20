/* =============================================================================
   RASMLAR — illyustratsiya va foto tizimi

   MUHIM QAROR: platforma auditoriyasi sekin internetli arzon telefonlarda.
   Shuning uchun barcha vizual element SVG — ular bir zumda chiziladi, tarmoq
   talab qilmaydi va hech qachon "singan rasm" ko'rinmaydi.

   Haqiqiy foto qo'shmoqchi bo'lsangiz: quyidagi FOTO obyektiga URL yozing.
   Foto yuklanmasa, avtomatik illyustratsiyaga qaytadi — sayt buzilmaydi.
   ============================================================================= */

const FOTO = {
  /* Misol: kasb: 'https://images.unsplash.com/photo-XXXX?w=600&q=70'
     Bo'sh qoldirilsa — gradient + ikonka ishlatiladi. */
  tikuvchilik: '',
  qadoqlash:   '',
  yorliq:      '',
  saralash:    '',
  kashta:      '',
  montaj:      ''
};

/* Kasb bo'yicha vizual uslub */
const KASB_USLUB = {
  k1: { kalit: 'tikuvchilik', ikon: '🧵', grad: 'linear-gradient(135deg,#db2777,#7c3aed)' },
  k2: { kalit: 'qadoqlash',   ikon: '📦', grad: 'linear-gradient(135deg,#f97316,#f43f5e)' },
  k3: { kalit: 'yorliq',      ikon: '🏷️', grad: 'linear-gradient(135deg,#2563eb,#06b6d4)' },
  k4: { kalit: 'saralash',    ikon: '⚖️', grad: 'linear-gradient(135deg,#059669,#65a30d)' },
  k5: { kalit: 'kashta',      ikon: '🪡', grad: 'linear-gradient(135deg,#e11d48,#f59e0b)' },
  k6: { kalit: 'montaj',      ikon: '🔧', grad: 'linear-gradient(135deg,#475569,#2563eb)' }
};

const Rasm = {

  /* Vazifa uchun bosh rasm: foto bo'lsa foto, bo'lmasa gradient + ikonka */
  kasb(konikmaIds, balandlik) {
    const u = KASB_USLUB[(konikmaIds || [])[0]] || KASB_USLUB.k2;
    const h = balandlik || 128;
    const url = FOTO[u.kalit];

    const zamin = `
      <div class="kasb-zamin" style="background:${u.grad};height:${h}px">
        ${Rasm.naqsh()}
        <span class="kasb-ikon">${u.ikon}</span>
      </div>`;

    if (!url) return zamin;
    return `
      <div class="kasb-zamin" style="background:${u.grad};height:${h}px">
        ${Rasm.naqsh()}
        <span class="kasb-ikon">${u.ikon}</span>
        <img src="${url}" alt="" loading="lazy" class="kasb-foto"
             onerror="this.remove()">
      </div>`;
  },

  /* Dekorativ naqsh — yuzani "tirik" qiladi */
  naqsh() {
    return `<svg class="kasb-naqsh" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
      <circle cx="30" cy="20" r="34" fill="rgba(255,255,255,.13)"/>
      <circle cx="172" cy="96" r="44" fill="rgba(255,255,255,.10)"/>
      <circle cx="110" cy="-10" r="26" fill="rgba(255,255,255,.08)"/>
    </svg>`;
  },

  /* Ism bo'yicha rangli avatar — tarmoq talab qilmaydi */
  avatar(nom, olcham) {
    const s = olcham || 42;
    const ranglar = [
      'linear-gradient(135deg,#2563eb,#7c3aed)', 'linear-gradient(135deg,#059669,#14b8a6)',
      'linear-gradient(135deg,#f97316,#f43f5e)', 'linear-gradient(135deg,#db2777,#8b5cf6)',
      'linear-gradient(135deg,#0891b2,#2563eb)', 'linear-gradient(135deg,#ca8a04,#f97316)'
    ];
    let yig = 0;
    for (let i = 0; i < (nom || '').length; i++) yig += nom.charCodeAt(i);
    const harflar = (nom || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return `<span class="avatar" style="width:${s}px;height:${s}px;font-size:${s * 0.38}px;
      background:${ranglar[yig % ranglar.length]}">${harflar}</span>`;
  }
};

/* =============================================================================
   ILLYUSTRATSIYALAR — sodda, iliq, tushunarli
   ============================================================================= */

const Ill = {

  /* Xush kelibsiz: odam + korxona qo'l berishmoqda */
  xushKelibsiz(w) {
    return `<svg viewBox="0 0 320 200" width="${w || 300}" role="img" aria-label="Bandlik platformasi">
      <defs>
        <linearGradient id="xk1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/>
        </linearGradient>
        <linearGradient id="xk2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#f43f5e"/>
        </linearGradient>
      </defs>

      <circle cx="160" cy="100" r="86" fill="#eff5ff"/>
      <circle cx="160" cy="100" r="62" fill="#dbe8fe" opacity=".7"/>

      <!-- chap: uydagi ijrochi -->
      <g>
        <rect x="26" y="96" width="74" height="60" rx="10" fill="#fff" stroke="#c7d7f5" stroke-width="2"/>
        <path d="M22 98 L63 68 L104 98 Z" fill="url(#xk1)"/>
        <rect x="46" y="120" width="16" height="36" rx="3" fill="#dbe8fe"/>
        <rect x="70" y="118" width="18" height="15" rx="3" fill="#dbe8fe"/>
        <circle cx="63" cy="88" r="7" fill="#fff" opacity=".9"/>
      </g>

      <!-- o'ng: korxona -->
      <g>
        <rect x="222" y="74" width="76" height="82" rx="10" fill="#fff" stroke="#c7d7f5" stroke-width="2"/>
        <rect x="222" y="74" width="76" height="17" rx="9" fill="url(#xk2)"/>
        <rect x="234" y="102" width="15" height="15" rx="3" fill="#ffe4d3"/>
        <rect x="256" y="102" width="15" height="15" rx="3" fill="#ffe4d3"/>
        <rect x="278" y="102" width="12" height="15" rx="3" fill="#ffe4d3"/>
        <rect x="234" y="126" width="15" height="15" rx="3" fill="#ffe4d3"/>
        <rect x="256" y="126" width="34" height="30" rx="4" fill="#fed7aa"/>
      </g>

      <!-- bog'lovchi yo'l + harakatlanuvchi nuqtalar -->
      <path d="M104 126 Q160 92 222 116" stroke="#2563eb" stroke-width="2.5"
            stroke-dasharray="7 7" fill="none" opacity=".55"/>
      <circle r="5" fill="#f97316">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M104 126 Q160 92 222 116"/>
      </circle>
      <circle r="4" fill="#2563eb">
        <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path="M222 116 Q160 92 104 126"/>
      </circle>

      <!-- tanga -->
      <g transform="translate(160 54)">
        <circle r="18" fill="#fff" stroke="#fbbf24" stroke-width="2.5"/>
        <text y="6" text-anchor="middle" font-size="18">💰</text>
      </g>
    </svg>`;
  },

  /* Ish qidiruvchi kartasi uchun */
  ishQidiruvchi(w) {
    return `<svg viewBox="0 0 200 150" width="${w || 170}" role="img" aria-label="Ish qidirish">
      <defs><linearGradient id="iq" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>
      <circle cx="100" cy="76" r="62" fill="#eff5ff"/>
      <!-- odam -->
      <circle cx="100" cy="52" r="21" fill="url(#iq)"/>
      <circle cx="93" cy="49" r="2.6" fill="#fff"/><circle cx="107" cy="49" r="2.6" fill="#fff"/>
      <path d="M92 59 Q100 65 108 59" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M64 124 Q64 84 100 84 Q136 84 136 124 Z" fill="url(#iq)"/>
      <!-- qo'ldagi telefon -->
      <rect x="126" y="92" width="24" height="36" rx="5" fill="#fff" stroke="#2563eb" stroke-width="2.2"
            transform="rotate(12 138 110)"/>
      <rect x="131" y="99" width="14" height="4" rx="2" fill="#dbe8fe" transform="rotate(12 138 110)"/>
      <rect x="131" y="107" width="14" height="4" rx="2" fill="#dbe8fe" transform="rotate(12 138 110)"/>
      <!-- qidiruv -->
      <g transform="translate(46 44)">
        <circle r="15" fill="none" stroke="#f97316" stroke-width="3.4"/>
        <line x1="11" y1="11" x2="22" y2="22" stroke="#f97316" stroke-width="3.4" stroke-linecap="round"/>
      </g>
    </svg>`;
  },

  /* Ishchi qidiruvchi (korxona) kartasi uchun */
  ishBeruvchi(w) {
    return `<svg viewBox="0 0 200 150" width="${w || 170}" role="img" aria-label="Ishchi qidirish">
      <defs><linearGradient id="ib" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#f43f5e"/></linearGradient></defs>
      <circle cx="100" cy="76" r="62" fill="#fff4ed"/>
      <!-- bino -->
      <rect x="58" y="52" width="84" height="76" rx="9" fill="#fff" stroke="#fed7aa" stroke-width="2.4"/>
      <rect x="58" y="52" width="84" height="19" rx="9" fill="url(#ib)"/>
      <rect x="70" y="82" width="16" height="16" rx="3.5" fill="#ffe4d3"/>
      <rect x="92" y="82" width="16" height="16" rx="3.5" fill="#ffe4d3"/>
      <rect x="114" y="82" width="16" height="16" rx="3.5" fill="#ffe4d3"/>
      <rect x="70" y="106" width="16" height="16" rx="3.5" fill="#ffe4d3"/>
      <rect x="92" y="106" width="38" height="22" rx="4" fill="#fed7aa"/>
      <!-- mo'ri -->
      <rect x="120" y="34" width="12" height="20" rx="3" fill="#fdba74"/>
      <circle cx="126" cy="26" r="6" fill="#fff" opacity=".85"><animate attributeName="cy" values="26;16;26" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".85;0;.85" dur="3s" repeatCount="indefinite"/></circle>
      <!-- qo'shish belgisi -->
      <g transform="translate(152 48)">
        <circle r="17" fill="#2563eb"/>
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
      </g>
      <!-- odamchalar -->
      <circle cx="42" cy="104" r="11" fill="#2563eb" opacity=".85"/>
      <path d="M28 128 Q28 112 42 112 Q56 112 56 128 Z" fill="#2563eb" opacity=".85"/>
    </svg>`;
  },

  /* Muvaffaqiyat */
  muvaffaqiyat(w) {
    return `<svg viewBox="0 0 160 140" width="${w || 150}" role="img" aria-label="Tayyor">
      <circle cx="80" cy="66" r="50" fill="#e7f8f1"/>
      <circle cx="80" cy="66" r="36" fill="#059669"/>
      <path d="M62 66 L74 79 L99 54" stroke="#fff" stroke-width="7"
            fill="none" stroke-linecap="round" stroke-linejoin="round">
        <animate attributeName="stroke-dasharray" from="0 60" to="60 0" dur=".5s" fill="freeze"/>
      </path>
      <circle cx="30" cy="34" r="5" fill="#f97316"><animate attributeName="cy" values="34;26;34" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx="132" cy="44" r="4" fill="#2563eb"><animate attributeName="cy" values="44;36;44" dur="2.4s" repeatCount="indefinite"/></circle>
      <circle cx="122" cy="106" r="5" fill="#db2777"><animate attributeName="cy" values="106;98;106" dur="2.8s" repeatCount="indefinite"/></circle>
      <circle cx="34" cy="98" r="4" fill="#059669"><animate attributeName="cy" values="98;90;98" dur="2.2s" repeatCount="indefinite"/></circle>
    </svg>`;
  },

  /* Hujjat / maqom */
  hujjat(w) {
    return `<svg viewBox="0 0 160 140" width="${w || 140}" role="img" aria-label="Hujjat">
      <circle cx="80" cy="70" r="54" fill="#fef6e7"/>
      <rect x="52" y="34" width="58" height="74" rx="8" fill="#fff" stroke="#f0c98a" stroke-width="2.4"/>
      <rect x="62" y="48" width="38" height="5" rx="2.5" fill="#fde3b4"/>
      <rect x="62" y="60" width="30" height="5" rx="2.5" fill="#fde3b4"/>
      <rect x="62" y="72" width="34" height="5" rx="2.5" fill="#fde3b4"/>
      <circle cx="104" cy="96" r="18" fill="#059669"/>
      <path d="M96 96 L102 103 L113 90" stroke="#fff" stroke-width="4" fill="none"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  },

  /* Bo'sh holat */
  bosh(w) {
    return `<svg viewBox="0 0 160 130" width="${w || 140}" role="img" aria-label="Bo'sh">
      <ellipse cx="80" cy="112" rx="46" ry="8" fill="#e3e9f2"/>
      <rect x="44" y="44" width="72" height="58" rx="9" fill="#fff" stroke="#dbe3ef" stroke-width="2.4"/>
      <path d="M44 62 L116 62" stroke="#dbe3ef" stroke-width="2.4"/>
      <circle cx="54" cy="53" r="3.4" fill="#e3e9f2"/>
      <circle cx="65" cy="53" r="3.4" fill="#e3e9f2"/>
      <rect x="58" y="74" width="44" height="5" rx="2.5" fill="#eef2f8"/>
      <rect x="58" y="86" width="30" height="5" rx="2.5" fill="#eef2f8"/>
      <g transform="translate(112 36)">
        <circle r="15" fill="none" stroke="#c3cede" stroke-width="3"/>
        <line x1="10" y1="10" x2="20" y2="20" stroke="#c3cede" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>`;
  },

  /* Hamyon / pul */
  hamyon(w) {
    return `<svg viewBox="0 0 160 130" width="${w || 130}" role="img" aria-label="Hamyon">
      <circle cx="80" cy="64" r="50" fill="#e7f8f1"/>
      <rect x="44" y="44" width="72" height="50" rx="10" fill="#059669"/>
      <rect x="44" y="44" width="72" height="13" rx="6" fill="#047857"/>
      <circle cx="102" cy="70" r="9" fill="#fff" opacity=".9"/>
      <circle cx="102" cy="70" r="4" fill="#059669"/>
      <g transform="translate(58 26)">
        <circle r="13" fill="#fbbf24"/>
        <text y="5" text-anchor="middle" font-size="13" fill="#78350f" font-weight="bold">$</text>
        <animateTransform attributeName="transform" type="translate"
          values="58 26; 58 18; 58 26" dur="2.6s" repeatCount="indefinite"/>
      </g>
    </svg>`;
  }
};
