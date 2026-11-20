import { formatMoney } from "../kit-core.js";
import { wireDining } from "./restaurant-flow.js";
import { call, renderPage } from "./local-page.js";

export default {
  id:"shop",label:"Shop",skin:"awning",defaultTagline:"Choose something for collection.",
  describe:({kind,town}) => town ? `${kind.label} in ${town}` : kind.label,
  accents:[
    {key:"bottle",label:"Bottle green",value:"#275846",ink:"#ffffff"},
    {key:"cornflower",label:"Cornflower",value:"#35557e",ink:"#ffffff"},
    {key:"cherry",label:"Cherry",value:"#8b343e",ink:"#ffffff"},
  ],
  art:`<svg viewBox="12 32 173 151" fill="none" stroke="var(--accent)" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 57q9 28 56 31t56-31Z" fill="#f3d37e" stroke-width="3"/><path d="M21 54q59-10 117 0l-2 4q-59 9-113 0z" fill="#fff1bd" stroke-width="3"/>
    <path d="M73 88v12h13V88" stroke-width="3" fill="#f3d37e"/>
    <path d="m45 157 8-45q4-14 19-14h48q15 0 20 19l9 40Z" fill="var(--accent)" stroke-width="3"/>
    <circle cx="116" cy="121" r="41" fill="#fbf4d6" stroke-width="4"/><circle cx="116" cy="121" r="34" stroke-width="1"/>
    <g stroke-width="2"><path d="m86 122 4 0m-2-12 4 2m1-12 3 3m6-10 2 4m9-7v5m12-4-1 5m12 0-3 4m12 4-4 3m7 9-5 1"/></g>
    <path d="m99 104 20 14 2 6-7-1z" fill="#a64732" stroke="#a64732"/><circle cx="116" cy="121" r="3" fill="var(--accent)"/>
    <path d="M39 158h114v8H39z" fill="#f4c75f" stroke-width="3"/><path d="M22 172h153" stroke-width="2"/>
  </svg>`,
  css:`
    .awning{--hero:#fff5d6;--paper:#fffcef;--ink:#243e34;--line:#b9c0a2;--display:"Bookman Old Style",Georgia,serif;--weight:700}
    .awning .local-head{border-top:12px solid var(--accent)}.awning .local-mast{border-color:#b5b999}
    .awning .local-mono{border:2px solid currentColor;border-radius:50%;font-size:16px;font-weight:bold}
    .awning .local-hero{position:relative;padding-top:22px;border-bottom:3px solid var(--accent)}
    .awning .local-hero:before{content:"";position:absolute;inset:0 0 auto;height:18px;background:repeating-linear-gradient(90deg,var(--accent) 0 24px,#f6d68c 24px 48px);mask:radial-gradient(ellipse 12px 9px at 12px 9px,#000 98%,transparent) 0 100%/24px 100% repeat-x,linear-gradient(#000 0 0) top/100% 55% no-repeat}
    .awning .local-hero-grid{grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);padding-block:30px}.awning .local-art svg{width:110%}
    .awning h1,.awning .local-trade{color:var(--accent)}.awning .local-trade{font:italic 20px Georgia,serif}
    .awning .local-offer{max-width:940px}.awning .local-group{background:var(--accent);color:var(--accent-ink);font:600 18px/1.3 var(--display);padding:7px 12px;margin-top:20px}
    .awning .local-list>li{border-bottom-style:dotted}.awning .local-details{background:#f6edcd}
    @media(max-width:720px){.awning .local-hero-grid{position:relative;display:block;padding-block:27px 35px}
      .awning .local-art{position:absolute;right:0;bottom:9px;width:clamp(77px,25%,108px)}.awning .local-tag{max-width:70%}.awning .local-copy .local-action{max-width:calc(100% - 69px)}}
  `,
  render(root,data) {
    const {menu} = data.kind;
    const rows = menu.map(section => `<h3 class="local-group">${section.title}</h3><ul class="local-list">${section.items.map(item =>
      `<li class="local-product"><div><h4>${item.name}</h4><small>${item.description}</small></div><span class="local-price">${formatMoney(item.price)}</span>
      <div class="rs-qty" data-item="${item.id}"></div></li>`).join("")}</ul>`).join("");
    const primary = '<a class="local-action rs-bar-book" href="#offer">Order for collection</a>';
    const basket = '<button class="local-action rs-bar-order" type="button" data-order hidden><span class="rs-bar-count"></span>View order <span class="rs-bar-total"></span></button>';
    renderPage(root,data,this,{
      nav:"The counter",heading:"Today’s counter",example:"Example products and prices",rows,
      primary:primary.replace(" rs-bar-book",""),sticky:call + primary + basket,
    });
    wireDining(root, menu.flatMap(section => section.items));
  },
};
