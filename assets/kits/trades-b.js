import trades, { tradeCss } from "./trades.js";

export default {
  ...trades,skin:"block-print",
  accents:[
    {key:"terracotta",label:"Terracotta",value:"#96492e",ink:"#ffffff"},
    {key:"marine",label:"Marine",value:"#305f71",ink:"#ffffff"},
    {key:"aubergine",label:"Aubergine",value:"#6e4356",ink:"#ffffff"},
  ],
  art:`<svg viewBox="0 0 350 200" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <defs><pattern id="print-hatch" width="7" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
      <path d="M1 0v7" stroke="#efc48b" stroke-width="1.5"/></pattern></defs>
    <path d="M25 175 56 160l28-3V99l67-52 62 48v36l30-19 36 15v22l28 13 22 15z" fill="#efc48b"/>
    <path d="m65 106 85-72 71 54-7 11-64-48-77 66zm103-59V22h16v37" fill="#efc48b"/>
    <path d="m86 101 65-50 58 44v62l-123 7z" fill="#efc48b"/>
    <path d="m152 61 43 34v59l-43 4z" fill="url(#print-hatch)"/>
    <path d="m105 120 1-24 21-13v31zm35 43V117l23-5v48zm43-40v-17l13 4v15zm-82 26 26-4v16l-26 3z" fill="#253337"/>
    <g stroke="#253337" stroke-width="2"><path d="m103 130 26-4m-25 9 25-5m-15-32v17m-12-6 21-10m95 44 19-12m-18 18 21-13m-17 19 19-14"/></g>
    <path d="M18 181q77-19 157-15t157 15M28 187q106-17 190-10m12 0 69 9" stroke="#efc48b" stroke-width="2"/>
    <g stroke="#efc48b" stroke-width="2"><path d="M244 151v-31c0-12-7-17-11-21m11 27 11-15M68 165v-33l-10-10m10 17 11-13"/>
      <path d="m37 166 5-12 4 4 5-11m208 13 3-10 4 5 6-11m10 19 4-12 3 5m-159-89 14-12m56 19 8 6"/></g>
    <g fill="#efc48b"><path d="M241 116c-12-2-19-13-17-25 11 3 18 12 17 25m5 6c0-15 10-24 22-26-1 12-9 23-22 26M65 132c-9-1-14-8-15-15 9 0 16 6 15 15m7-2c0-9 4-17 12-20 1 8-5 16-12 20"/></g>
  </svg>`,
  css:tradeCss + `
    .block-print{--hero:#253337;--on-hero:#fff1db;--ink:#273235;--paper:#f6e8d1;--line:#b9ad97;
      --display:"Franklin Gothic Medium","Arial Narrow",Arial,sans-serif;--weight:750;--k-btn-radius:1px}
    .block-print .local-head{background:var(--paper);color:var(--ink)}.block-print .local-mast{border:0}
    .block-print .local-mono{color:var(--accent);border-width:2px;font-size:16px;font-weight:750}
    .block-print .local-hero{border-bottom:7px solid var(--accent)}
    .block-print .local-hero-grid{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}
    .block-print .local-art{grid-column:1;grid-row:1;border:1px solid #efc48b88;outline:1px solid #efc48b45;outline-offset:-5px}
    .block-print .local-copy{grid-column:2;grid-row:1}.block-print .local-trade{color:#f2c788}
    .block-print .local-action{box-shadow:inset 0 0 0 1px #fff7}
    .block-print .quote-services{display:grid;grid-template-columns:1fr 1fr;gap:0 36px;border-top:0}
    .block-print .quote-services li{border-top:2px solid var(--ink);border-bottom:0}.block-print .local-steps{background:var(--accent);color:var(--accent-ink)}
    @media(max-width:720px){.block-print .local-hero-grid{grid-template-columns:1fr;padding-block:18px 28px;gap:16px}
     .block-print .local-art{grid-area:auto;order:-1;justify-self:start;width:100%;height:118px}
     .block-print .local-art svg{height:100%;width:100%}.block-print .local-copy{grid-area:auto}.block-print .quote-services{grid-template-columns:1fr}}
  `,
};
