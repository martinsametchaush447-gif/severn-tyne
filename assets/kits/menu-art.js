// Each menu cover uses a single ink stamp. The illustrated menus add a second object.
const motifs = {
  "italian": `<path fill="var(--vessel)" d="M26 72q10 37 74 38 61 0 76-38"/><ellipse cx="101" cy="72" rx="75" ry="19"/><path d="M48 72q5-15 28-15t35 8q12 8 25-1m-79 15q13-14 35-11t31 9q14 1 31-9M64 58q11-17 39-12l27 11m-40-9q-12-12-6-21m9 22q-8-16-4-23m7 22q-5-14-1-23M79 13l5 16 12-3-3-16m-7 2 3 14m3 1 10 18"/>`,
  "turkish": `<path fill="var(--vessel)" d="M31 73q6 29 39 29t40-29Z"/><ellipse cx="70" cy="73" rx="39" ry="11"/><path d="M44 72q11-11 31-6m-23 7q9-7 24-3m15-4 6-7m5 14 64-36m-64 48 73-40"/><path fill="var(--dish)" d="m110 54 11-10 13 5-3 11-16 4Zm24-14 11-8 12 4-3 11-13 4Zm-12 24 13-8 11 4-3 11-14 4Zm26-15 12-7 11 5-5 9-11 2Z"/>`,
  "coffee-shop": `<path fill="var(--dish)" d="M60 16h55l-10 40H72Z"/><path fill="var(--vessel)" d="M65 23h45m-36 5 5 20m7-20 2 20m12-20-4 20M65 57h48v6H65Zm8 8 1 12c-2 7-16 17-14 25q23 12 55 0c2-8-12-18-14-25l2-12Z"/><path d="M101 71h13q20 16-3 23m-45-2q22 6 44 0m-39 6q17 5 34 1m-40 11h54"/>`,
  "sandwich-bar": `<path fill="var(--dish)" d="m26 77 89-47 49 42-95 36Z"/><path fill="var(--vessel)" d="m29 68 87-45 49 41-96 37Z"/><path d="m30 69 7 7 10-3 9 8 11-3 8 8 86-31m-127 18 33 24 89-34M56 62l9-4m7-1 5-3m16-8 9-5m10 11 6-3m-30 15 6-3"/>`,
  cafe: `<ellipse cx="99" cy="106" rx="66" ry="10"/><path fill="var(--vessel)" d="M48 53h92c-2 30-16 48-43 48S52 83 48 53Z"/><path d="M140 59c27-10 32 21 7 26l-13 2"/><ellipse cx="94" cy="53" rx="46" ry="9" fill="var(--dish)"/><path d="M68 52q21-9 45-2c12 5-2 8-16 7m-24-4q12-6 26-3M73 35q-11-8-1-18m20 16q11-10 3-20"/>`,
  "bakery-cafe": `<path fill="var(--dish)" d="M25 88c1-19 12-34 28-42 6-13 19-18 31-17 9-8 25-7 32-2 15-2 30 5 36 15 19 8 27 31 25 47-12 2-21-8-27-15-18 5-30 6-43 3-18 5-34 2-43-4-12 11-24 17-39 15Z"/><path d="M56 46q-3 16 8 27m19-43q-11 19 0 46m32-48q-3 18 9 48m27-33q-6 12-1 30M30 84l16-14m117-8 9 20m-75-48 3 5m-21 8 2 7m47-11 4 7"/>`,
  takeaway: `<path fill="var(--vessel)" d="m40 61 72-25 53 18-70 27z"/><path fill="var(--dish)" d="m40 61 55 20 70-27-10 37-62 24-45-17z"/><path d="m95 81-2 34M46 68l49 19 65-25m-87-11 52 17m-31-26 52 17"/><path d="m66 78 14 5m-14 2 11 4"/>`,
  pizza: `<path fill="var(--dish)" d="M34 38q65-28 134 5L95 114Z"/><path fill="var(--vessel)" d="M31 38q66-33 140 2l-4 10Q96 20 38 47Z"/><circle cx="77" cy="58" r="9"/><circle cx="119" cy="57" r="8"/><circle cx="96" cy="83" r="7"/><path d="m63 49 3 2m40 12-5 4m-15 4-6-1m23 24 2-3m-15-47 6-1m29 29 5-3"/>`,
  "curry-house": `<path d="M47 71c-24-21-33 8-5 17l12 1m100-19c23-20 32 5 10 15l-13 3"/><path fill="var(--vessel)" d="M41 67q54-24 120 0c-11 36-31 45-60 45-29 0-50-9-60-45Z"/><ellipse cx="101" cy="67" rx="60" ry="15" fill="var(--dish)"/><path d="m66 65 9-6 10 3 2 7-12 2Zm40-4 9-6 11 5-2 8-13 2Zm23 8 7-4 8 4m-58-1q11-6 20 1m-5-5c-6-6-2-13 0-15 6 3 8 9 0 15m1-1q8-11 16-9-2 8-15 10M52 85q19 18 37 20m-8-65c-9-9 8-14 2-25m20 24c-7-10 8-14 4-23"/>`,
  kebab: `<g transform="rotate(-17 100 69)"><path d="M20 52h165l-7 3m-165 24h166l-7 3"/><g fill="var(--dish)"><path d="m43 46 14-5 11 9-3 12-16 3-10-10zm40-2 16-4 10 10-5 12-17-1-6-8zm42-1 15-3 12 10-6 12-16-1-7-9zM35 71l14-5 12 8-2 14-18 2-9-9zm42 0 14-6 14 10-4 14-19-1-7-8zm45-2 17-5 9 12-5 12-15 1-10-9z"/></g><g stroke-width="3.5"><path d="m70 43 6 17m36-18 5 17m-51 8 5 18m37-19 5 17"/></g><path d="m48 48 8 7m34-9 8 7m34-7 9 6m-99 19 8 7m34-9 8 8m34-9 8 8"/></g>`,
  chinese: `<path fill="var(--vessel)" d="M34 68c0 20 135 21 135-1v24c-2 30-131 29-135 1Z"/><ellipse cx="101" cy="68" rx="67" ry="18"/><g fill="var(--dish)"><path d="M46 65c0-13 14-32 27-33s27 16 30 30c-8 12-46 16-57 3Z"/><path d="M91 68c0-16 15-35 33-35 13 2 27 20 30 33-10 12-48 17-63 2Z"/></g><path d="M53 59q12-4 20-24 6 18 19 22m-30-1 10-18m28 21q16-13 23-23m-15 26q10-10 16-25m3 0q4 13 15 19M38 88q62 28 127-2m-110 7 4 8m16-5 4 8m17-7 4 8m15-9 4 8m16-12 4 8"/>`,
};

const sides = {
  "italian": '<path d="m143 101 27-9m-18 10q10-19 24-15-5 13-24 15Z"/>',
  "turkish": '<path d="M149 92q15 18 32-1l-15-9Zm5-1 12-7m-6 12 6-12"/>',
  "coffee-shop": '<path d="M147 94c-13-12-25 2-15 12s28-2 15-12Zm-17 10 14-9"/>',
  "sandwich-bar": '<path d="m128 108 28-13 21 6-29 15Zm11-1 17-8"/>',
  cafe: '<path d="m5 96 37-17m-1 0c11-9 18-6 14-2-3 3-10 5-14 2Z"/>',
  "bakery-cafe": '<path d="M146 89h24c-2 15-8 19-13 19s-10-7-11-19Zm23 2q13-4 9 4l-9 3m-27 12h34"/>',
  takeaway: '<path d="m151 95 21 12 17-7-22-12zm5 0 12 7m-8-9 12 7"/>',
  pizza: '<path d="M138 103q-3-14 15-18c1 12-5 17-15 18Zm0 0q11-10 23-3-12 10-23 3Z"/>',
  "curry-house": '<path d="M130 106q14-20 40-23m-16 9c-7-10 0-18 11-18 1 9-3 15-11 18Zm-11 8c10 3 20-1 22-7-10-4-17-1-22 7Z"/>',
  kebab: '<path d="M129 102q20 14 42-8l-8-15Zm5-2q16 10 32-8m-7-9-6 14m6-13 3 10"/>',
  chinese: '<path d="m141 108 41-46m-36 48 40-46"/>',
};

export function menuArt(kind, style, fallback) {
  if (!motifs[kind]) return fallback;
  const cover = style === "a";
  const ink = cover ? "currentColor" : "var(--accent)";
  const paper = cover ? "var(--accent)" : "#fff4dc";
  const food = cover ? "var(--accent)" : "#ead1a0";
  return `<svg class="${cover ? "rs-plate" : ""}" data-art="${kind}-${style}" viewBox="0 0 200 132" aria-hidden="true"
    fill="none" stroke="${ink}" stroke-width="${cover ? 2.3 : 1.7}" stroke-linecap="round" stroke-linejoin="round"
    style="--vessel:${paper};--dish:${food}">
    <g transform="${cover ? "translate(0 -2)" : "rotate(-6 100 68)"}">${motifs[kind]}</g>
    ${cover ? "" : sides[kind]}</svg>`;
}
