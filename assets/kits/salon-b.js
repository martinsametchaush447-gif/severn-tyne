import salon from "./salon.js";

export default {
  ...salon, skin:"colour-study",
  accents:[
    {key:"mulberry",label:"Mulberry",value:"#7c2661",ink:"#ffffff"},
    {key:"ultramarine",label:"Ultramarine",value:"#383d85",ink:"#ffffff"},
    {key:"oxide",label:"Oxide",value:"#95402a",ink:"#ffffff"},
  ],
  art:`<svg viewBox="0 0 345 234" fill="none">
    <g stroke="#302633" stroke-width="2" stroke-linejoin="round">
      <path d="M54 194 67 24l58 4-13 173z" fill="#f5c494"/><path d="m57 151 7-91 55 5-7 91z" fill="#d88e6c"/>
      <path d="M62 192 130 18l58 24-68 174z" fill="#e6bad6"/><path d="m78 150 40-101 54 21-40 101z" fill="#c888b1"/>
      <path d="m71 194 137-160 49 41-138 159z" fill="#dc6873"/><path d="m101 163 93-108 45 38-92 108z" fill="#a9435b"/>
      <path d="m75 192 197-107 29 52-197 107z" fill="#e8b6b6"/><path d="m115 174 139-75 25 47-139 75z" fill="var(--accent)"/>
      <circle cx="101" cy="202" r="6" fill="#faf3e6"/><path d="m98 202 5-1"/>
    </g></svg>`,
  css:`
    .colour-study{--hero:#242124;--on-hero:#faf5ef;--paper:#f9f7ee;--ink:#272225;--line:#c6c1b8;
      --display:"Franklin Gothic Medium","Arial Narrow",Arial,sans-serif;--weight:750;--k-btn-radius:0}
    .colour-study .local-mast{border-color:#706771}.colour-study .local-mono{border:0;background:#f2d6df;color:#282028;font-size:18px;font-weight:700}
    .colour-study .local-hero-grid{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)}
    .colour-study .local-copy{grid-column:2;grid-row:1}.colour-study .local-art{grid-column:1;grid-row:1;background:#d9a3b2;overflow:hidden}
    .colour-study .local-trade{color:#edd8da}.colour-study .local-tag{font-family:"Courier New",monospace;font-size:16px}
    .colour-study .local-action{box-shadow:inset 0 0 0 1px #ffffff60}.colour-study .local-offer{display:grid;grid-template-columns:1fr 1.3fr;gap:32px}
    .colour-study .local-section-head{display:block}.colour-study .local-example{margin-top:10px}.colour-study .local-list>li{border-top:2px solid var(--ink);border-bottom:0}
    .colour-study .local-details{background:#e9dce0}
    @media(max-width:720px){.colour-study .local-hero-grid{grid-template-columns:minmax(0,1fr);padding-block:17px 29px;gap:18px}
     .colour-study .local-art{grid-area:auto;order:-1;justify-self:stretch;width:100%;height:110px;display:grid;place-items:center}
     .colour-study .local-art svg{height:135%;width:auto;transform:rotate(-9deg)}.colour-study .local-copy{grid-area:auto}
     .colour-study .local-offer{display:block}.colour-study .local-example{margin-top:5px}}
  `,
};
