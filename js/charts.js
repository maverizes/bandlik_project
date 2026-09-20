/* =============================================================================
   GRAFIK — sodda SVG chizmalar (tashqi kutubxonasiz)
   ============================================================================= */

const Grafik = {

  chiziq(tarix) {
    const W = 640, H = 240, P = { t: 16, r: 14, b: 34, l: 46 };
    const iw = W - P.l - P.r, ih = H - P.t - P.b;

    const seriyalar = [
      { kalit: 'royxat',        nom: "Ro'yxatdan o'tgan", rang: 'var(--asos)' },
      { kalit: 'maqom',         nom: 'Maqom olgan',       rang: 'var(--yashil)' },
      { kalit: 'registrChiqdi', nom: 'Registrdan chiqdi', rang: 'var(--sariq)' }
    ];

    const maks = Math.max(...tarix.flatMap(t => seriyalar.map(s => t[s.kalit])));
    const yuqori = Math.ceil(maks / 10) * 10 || 10;

    const x = i => P.l + (tarix.length === 1 ? iw / 2 : (i / (tarix.length - 1)) * iw);
    const y = v => P.t + ih - (v / yuqori) * ih;

    /* Gorizontal to'r va o'q belgilari */
    let tor = '';
    for (let i = 0; i <= 4; i++) {
      const qiymat = Math.round(yuqori * i / 4);
      const yy = y(qiymat);
      tor += `<line x1="${P.l}" y1="${yy}" x2="${W - P.r}" y2="${yy}"
                stroke="var(--chiziq-2)" stroke-width="1"/>
              <text x="${P.l - 8}" y="${yy + 4}" text-anchor="end"
                font-size="11" fill="var(--matn-3)">${qiymat}</text>`;
    }

    /* Oy nomlari */
    let oylar = tarix.map((t, i) =>
      `<text x="${x(i)}" y="${H - 12}" text-anchor="middle"
         font-size="11.5" fill="var(--matn-3)">${t.oy}</text>`).join('');

    /* Chiziqlar va nuqtalar */
    let chiziqlar = seriyalar.map(s => {
      const nuqtalar = tarix.map((t, i) => `${x(i)},${y(t[s.kalit])}`).join(' ');
      const doiralar = tarix.map((t, i) =>
        `<circle cx="${x(i)}" cy="${y(t[s.kalit])}" r="4"
           fill="var(--panel)" stroke="${s.rang}" stroke-width="2.5"/>`).join('');
      return `<polyline points="${nuqtalar}" fill="none" stroke="${s.rang}"
                stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${doiralar}`;
    }).join('');

    const legenda = seriyalar.map(s =>
      `<span style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--matn-2)">
         <span style="width:11px;height:3px;background:${s.rang};border-radius:2px"></span>${s.nom}</span>`
    ).join('');

    return `
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:10px">${legenda}</div>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Oylik dinamika grafigi">
        ${tor}${oylar}${chiziqlar}
      </svg>`;
  }
};
