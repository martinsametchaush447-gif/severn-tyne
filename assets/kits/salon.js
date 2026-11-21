import { salonArt } from "./salon-art.js";
import { formatMoney } from "../kit-core.js";
import { wireBooking } from "./barber-flow.js";
import { button, call, renderPage } from "./local-page.js";

export default {
  id: "salon", label: "Salon", skin: "ribbon",
  defaultTagline: "Choose your next appointment.",
  describe: ({kind, town}) => town ? `${kind.label} in ${town}` : kind.label,
  accents: [
    {key:"damson", label:"Damson", value:"#6c2844", ink:"#ffffff"},
    {key:"clay", label:"Clay", value:"#884636", ink:"#ffffff"},
    {key:"fern", label:"Fern", value:"#3f5948", ink:"#ffffff"},
  ],
  art: `<svg viewBox="0 0 390 224" fill="none">
    <g transform="rotate(-8 200 110)" stroke-linecap="round">
      <path d="M-19 189C48 232 85 167 132 112S224 20 266 47c37 25-2 69-50 85s-79 12-84-10c-8-38 75-93 130-83s58 49 35 89-16 73 29 84c23 5 54 0 81-12" stroke="var(--accent)" stroke-width="30"/>
      <path d="M-19 184C48 227 85 162 132 107S224 15 266 42c37 25-2 69-50 85s-79 12-84-10c-8-38 75-93 130-83s58 49 35 89-16 73 29 84c23 5 54 0 81-12" stroke="#fff4e9" stroke-width="2" opacity=".75"/>
      <path d="M-19 195C48 238 85 173 132 118S224 26 266 53c37 25-2 69-50 85s-79 12-84-10c-8-38 75-93 130-83s58 49 35 89-16 73 29 84c23 5 54 0 81-12" stroke="#ecc7b9" stroke-width="3" opacity=".72"/>
      <path d="M130 113c-2-20 21-43 47-57" stroke="#462039" stroke-width="20" opacity=".32"/>
      <path d="M122 126c16-18 37-47 58-59" stroke="var(--accent)" stroke-width="22"/>
      <path d="M119 125c16-18 36-44 57-58" stroke="#fff4e9" stroke-width="1.5" opacity=".7"/>
    </g>
    <g transform="translate(113 105) rotate(18)" stroke-linejoin="round">
      <path d="M0 0C-13-2-15-14-4-17c12-3 65-1 102 6 9 2 10 9 2 11C70 4 25 5 0 0Z" fill="#d3ad71" stroke="#674d37" stroke-width="3"/>
      <path d="M0-10q46-3 88 6c-28 3-62 3-88 0Z" fill="#f3dba7" stroke="#8b693e" stroke-width="2"/>
      <circle cx="-3" cy="-8" r="3" fill="#684b33"/>
    </g></svg>`,
  css: `
    .ribbon{--hero:#f0dcd2;--paper:#fffaf3;--ink:#392c32;--line:#cfbdb4;--k-btn-radius:30px;--display:"Palatino Linotype",Georgia,serif}
    .ribbon .local-mast{border-color:#bea9a0}.ribbon .local-mono{border-radius:50%;font-style:italic;width:36px;height:36px}
    .ribbon .local-hero{overflow:hidden}.ribbon .local-art{overflow:hidden;border-radius:50% 48% 3% 3% / 70% 70% 3% 3%;background:#f6e9df}
    .ribbon .local-art svg{margin-block:5%}.ribbon .local-trade{font:italic 19px Georgia,serif}
    .ribbon .local-offer{max-width:930px}.ribbon .local-list{border-top:1px solid var(--line)}
    .ribbon .local-list b{font:21px var(--display)}.ribbon .local-details{background:#f5eae2}
    @media(max-width:720px){.ribbon .local-hero-grid{gap:15px}.ribbon .local-art{width:min(69%,272px);margin-top:-3px}.ribbon .local-art svg{margin:0}}
  `,
  render(root, data) {
    const {services} = data.kind;
    const tattoo = data.kind.id === "tattoo";
    const primary = button(data.kind.action ?? (tattoo ? "Book a consultation" : "Book an appointment"), "data-book");
    const rows = services.map(service => `<li><button type="button" class="local-row" data-book="${service.id}" aria-label="Book ${service.name}">
      <span><strong>${service.name}</strong><small>${service.minutes} minutes</small></span>
      ${tattoo ? "" : `<b>${formatMoney(service.price, {alwaysPence:false})}</b>`}
    </button></li>`).join("");
    renderPage(root, data, this, {
      art: salonArt(data.kind.id, this.skin === "colour-study", this.art),
      nav: tattoo ? "Consultations" : "Services", heading: data.kind.heading ?? (tattoo ? "Consultations" : "Appointments"),
      example: tattoo ? "Example consultations. Priced per piece: ask at your consultation." : "Example services and prices",
      rows: `<ul class="local-list">${rows}</ul>`, primary, sticky: call + primary,
    });
    wireBooking(root, services);
  },
};
