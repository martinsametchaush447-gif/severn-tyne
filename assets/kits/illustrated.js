import { hours, findUs } from "./visit.js";
import { addStyles, applyData, wireCallNotes } from "../kit-core.js";

const grain = new URL("../grain.svg", import.meta.url);
const grid = new URL("../grid.svg", import.meta.url);
const CSS = `
html[data-style=b]{
  --k-bg:#f3efdf;--k-sheet-bg:#fcf8ed;--k-surface:#fffcf3;--k-ink:#26332b;--k-ink-2:#505d50;
  --k-line:#c5c9b9;--k-line-strong:#899382;--k-focus:#254a34;--k-input-bg:#fffdf7;
  --k-font-text:"Segoe UI",Arial,sans-serif;--k-font-display:Georgia,serif;--k-sheet-title-font:600 22px/1.25 var(--k-font-display);
  --k-btn-radius:3px;--k-chip-radius:3px;--k-input-radius:3px;
}
.illustrated{--line:#bcb9a7;--serif:Georgia,"Times New Roman",serif;background:var(--paper) url(${grain});color:var(--ink);font:16px/normal "Segoe UI",Arial,sans-serif;overflow-wrap:anywhere}
.illustrated :is(h1,h2,h3,p,figure,fieldset){margin:0}
.illustrated a{color:inherit}
.illustrated :is(button,input){font:inherit;color:inherit}
.illustrated button{cursor:pointer}
.illustrated :focus-visible,.k-sheet :focus-visible{outline:3px solid currentColor;outline-offset:3px}
.k-sheet :is(p,dl,dd){margin:0}
.illustrated [hidden]{display:none!important}
.shop-wrap{width:min(1120px,calc(100% - 96px));margin-inline:auto}.shop-head{background:var(--hero-bg) url(${grain});color:var(--hero-fg)}.heading-row{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:74px;border-bottom:1px solid currentColor}
.identity{display:flex;align-items:center;min-width:0;gap:12px;font:20px/1.08 var(--serif)}.monogram{display:grid;place-items:center;border:1px solid currentColor;width:38px;height:38px;flex-shrink:0;font:italic 17px var(--serif)}
.heading-row a,.call,.text-button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;font-weight:600;font-size:15px}
.shop-hero{background:var(--hero-bg) url(${grain});color:var(--hero-fg)}.hero-layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:center;gap:5%;padding-block:62px}
.hero-type{grid-column:1;grid-row:1;min-width:0}.engraving{grid-column:2;grid-row:1;color:var(--accent)}
.engraving svg{display:block;width:100%;height:auto}.trade-line{font-size:14px;line-height:1.45}.shop-hero h1{font:400 clamp(58px,7.4vw,118px)/.99 var(--serif);letter-spacing:-.067em;margin:12px 0 18px}
.tag{font-size:20px;line-height:1.4}.shop-hero .trade-line,.shop-hero .tag{overflow-wrap:anywhere}
.offer{padding-block:56px;scroll-margin-top:calc(var(--strip-h) + 12px)}.shop-wrap h2{font:400 clamp(35px,4.4vw,62px)/1.07 var(--serif);letter-spacing:-.055em}
.section-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:24px}.section-head>p{font-size:14px}
ul,ol,dl{margin:0;padding:0}.shop-foot{padding:27px 0 100px;font:italic 20px var(--serif)}
.location,.hours,.table-section{border-top:1px solid var(--line)}.location-layout{padding-block:35px;display:flex;justify-content:space-between;align-items:baseline;gap:15px}.hours .location-layout>div{width:min(100%,32rem)}.location-layout h2{font-size:34px}
.sticky{position:fixed;bottom:0;left:0;right:0;padding:5px 0 max(5px,env(safe-area-inset-bottom));z-index:3;background:var(--hero-bg);color:var(--hero-fg);border-top:1px solid var(--line)}
.sticky-inner{display:flex;align-items:center;justify-content:flex-end;gap:28px}.kit-primary,.sheet-action{border:1px solid transparent;min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:20px;padding:10px 19px;background:var(--accent);color:var(--hero-bg);font-size:16px;font-weight:650;text-decoration:none;border-radius:1px}
.kit-primary:hover,.sheet-action:hover{filter:brightness(.93)}.call{text-underline-offset:4px}.sticky-label{font-weight:550}
.barber{--hero-bg:#262b25;--paper:#f3ecdc;--hero-fg:#faf2df;--ink:#2b3028}
.barber .monogram{border-radius:50%;color:var(--accent);box-shadow:inset 0 0 0 3px var(--hero-bg),inset 0 0 0 4px var(--accent)}
.barber .heading-row{border-color:#737668}.barber .hero-layout{position:relative;text-align:center;padding:70px 36px;margin-block:0;min-height:384px}
.barber .shop-hero{padding:20px 0 24px}.barber .hero-layout::before,.barber .hero-layout::after{content:'';pointer-events:none;position:absolute;border:1px solid var(--accent);opacity:.53;inset:0}
.barber .hero-layout::after{inset:5px;opacity:.26}.barber .trade-line{color:var(--accent);font-weight:600;font-size:12px}
.barber .tag{font:italic 22px/1.35 var(--serif);color:var(--accent)}.barber .shop-hero h1{font-family:"Palatino Linotype",Palatino,Georgia,serif}
.barber .section-head{border-bottom:3px double #807d6b;padding-bottom:16px;margin:0}.barber .section-head p{font-style:italic}.service-list{list-style:none}.service-list li{border-bottom:1px solid var(--line)}
.service-list button{width:100%;display:flex;align-items:center;gap:22px;text-align:left;padding:17px 2px;border:0;background:none}
.service-list button>span:first-child{flex:1;font:25px/1.2 var(--serif);letter-spacing:-.03em}.service-list small{display:block;font:14px/1.4 "Segoe UI",sans-serif;letter-spacing:0;color:#56604f;margin-top:4px}.service-list b{font:22px var(--serif)}.service-list button:hover{background:#dedccc56}.hours{background:#e7e4d4 url(${grain})}
.restaurant{--hero-bg:#faf0d9;--hero-fg:#4e3026;--paper:#fcf5e7;--ink:#342b23;--line:#c9b99e;--serif:"Book Antiqua",Palatino,Georgia,serif}
.restaurant .heading-row{border-bottom:3px double var(--accent)}.restaurant .shop-head{color:var(--accent)}.restaurant .monogram{border-radius:50% 50% 45% 45%;border:2px solid var(--accent);font-weight:700}.restaurant .identity{font-style:italic;font-weight:700}
.restaurant .shop-hero{border-bottom:8px double var(--accent)}.restaurant .hero-layout{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);padding:37px 0 46px}
.restaurant .shop-hero h1{color:var(--accent);font-size:clamp(62px,8.9vw,141px);font-style:italic;line-height:.95}.restaurant .trade-line{font:italic 22px var(--serif)}.restaurant .tag{font-size:19px}.restaurant .engraving{transform:rotate(-6deg)}
.restaurant .offer{max-width:920px}.restaurant .section-head{align-items:center}.menu-category{border-block:1px solid var(--accent);padding-block:9px;color:var(--accent);font:italic 24px var(--serif);margin-top:25px}
.menu-list{list-style:none}.menu-list li{display:flex;align-items:center;gap:15px;padding:13px 0;border-bottom:1px dotted var(--line)}.menu-list .dish-copy{flex:1;min-width:0}.menu-list h4{font:normal 23px/1.2 var(--serif);margin:0}.menu-list p{margin-top:4px;font-size:15px;line-height:1.4}.menu-list li>span{font-variant-numeric:tabular-nums;font-size:16px}.menu-list .rs-add{min-width:44px;min-height:44px;background:transparent;color:var(--accent);border:1px solid var(--accent);border-radius:50%;font-size:24px}.menu-list .rs-add:hover{background:var(--accent);color:var(--paper)}
.table-section{background:#f1e6ce url(${grain})}.text-button{color:var(--accent);border:0;background:none;text-decoration:underline;text-underline-offset:4px}.restaurant .sticky{background:var(--paper);color:var(--ink)}
.garage{--hero-bg:#25343a;--hero-fg:#f7f4e8;--paper:#f0f0e8;--ink:#243238;--line:#b3b8b0;--serif:"Franklin Gothic Medium","Arial Narrow",Arial,sans-serif}
.garage .identity{font-weight:700;font-family:Arial,sans-serif}.garage .monogram{transform:skew(-7deg);color:var(--accent);font:700 17px Arial,sans-serif;border-width:2px}
.garage .shop-hero{background:var(--hero-bg) url(${grid});border-bottom:7px solid var(--accent)}.garage .heading-row{border-color:#849295}.garage .hero-layout{min-height:380px}
.garage .trade-line{display:flex;flex-wrap:wrap;gap:.3em;align-items:center;font-weight:600;color:var(--accent)}.garage .trade-line::before{content:'';width:26px;height:3px;background:currentColor}
.garage .shop-hero h1{font:800 clamp(58px,6.8vw,100px)/.94 Arial,sans-serif;letter-spacing:-.085em}.garage .tag{font-size:17px}.garage .shop-wrap h2{font-weight:700}.repair-list{display:grid;grid-template-columns:1fr 1fr;gap:0 40px;list-style:none;padding:0}.repair-list :is(div,li){padding:17px 0;border-top:2px solid var(--ink)}.repair-list :is(dt,li){font-size:23px;font-weight:700}.repair-list dd{margin:5px 0 0;line-height:1.45}
.workshop{padding:48px 0;background:#dde2d9}.workshop-grid{display:grid;grid-template-columns:1fr 1fr;gap:7%}.workshop h2{font-size:33px}.workshop ul,.workshop ol{margin:20px 0 0;padding-left:21px}.workshop li{margin:12px 0;line-height:1.5}.workshop p{margin:3px 0}.garage .sticky-inner{justify-content:space-between}

@media(max-width:760px){.shop-wrap{width:calc(100% - 40px)}.heading-row{min-height:60px}.hero-layout{grid-template-columns:1fr;gap:12px}.engraving,.hero-type{grid-area:auto}
.barber .hero-layout{min-height:auto;padding:24px 15px 29px}.barber .engraving{width:min(220px,78%);margin:0 auto}.barber .shop-hero{padding:15px 0 20px}.barber .shop-hero h1{font-size:clamp(49px,12.5vw,77px);margin:10px 0}.barber .tag{font-size:19px}
.restaurant .hero-layout{display:flex;flex-direction:column-reverse;align-items:stretch;padding:25px 0 10px;gap:1px}.restaurant .engraving{width:min(255px,75%);align-self:flex-end}.restaurant .shop-hero h1{font-size:clamp(58px,15vw,83px);margin:8px 0 13px}.restaurant .trade-line{font-size:18px}
.garage .hero-layout{display:flex;flex-direction:column-reverse;align-items:stretch;gap:3px;padding:29px 0 7px;min-height:0}.garage .engraving{width:min(290px,94%);align-self:flex-end}.garage .shop-hero h1{font-size:clamp(48px,13vw,76px);margin:12px 0 14px}
.offer{padding-block:34px}.section-head{align-items:flex-start;flex-direction:column;gap:6px;margin-bottom:16px}.restaurant .section-head{align-items:flex-start}.location-layout{flex-direction:column;gap:8px;padding-block:25px}.shop-foot{padding-block:24px 90px}
.sticky-inner{justify-content:space-between;gap:10px}.repair-list,.workshop-grid{grid-template-columns:1fr}.workshop-grid{gap:24px}.workshop{padding-block:30px}.menu-list li{gap:9px}.menu-list h4{font-size:21px}.sticky-label{font-size:14px}
.identity{font-size:18px}.monogram{width:32px;height:32px}
}
@media(max-width:350px){.shop-wrap{width:calc(100% - 28px)}.identity{gap:7px}.heading-row{gap:8px}.kit-primary{padding-inline:12px}.sticky-label{max-width:44%}}
@media(min-width:761px){
  .restaurant .hero-layout{grid-template-columns:minmax(0,.87fr) minmax(0,1.13fr)}
  .restaurant .hero-type{grid-column:2;text-align:center}.restaurant .engraving{grid-column:1}
}
.garage .shop-hero h1{letter-spacing:-.06em}

.shop-foot small{display:block;margin-top:6px;font:13px/1.4 var(--k-font-text)}
.heading-row a{flex-shrink:0}
.identity>span:last-child{min-width:0}.identity [data-bind=name]{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.illustrated .kit-primary{color:var(--accent-ink)}
.restaurant .rs-add{display:inline-grid;place-items:center;padding:0;font-size:0;line-height:1}
.rs-add svg{display:block;width:16px;height:16px}
.illustrated .rs-step{gap:0}
.illustrated .rs-step output{min-width:16px}
.illustrated .rs-bar-order{gap:10px}
.illustrated .rs-bar-count{padding-right:8px;border-right:1px solid currentColor}
@media(max-width:520px){.menu-list li:has(.rs-step){flex-wrap:wrap}.menu-list li:has(.rs-step) .rs-qty{margin-left:auto}}
@media(prefers-reduced-motion:reduce){.bb-card,.rs-receipt{animation:none}}
`;

export const call = '<a class="call" data-call href="#call"><span data-call-label>Call us</span></a>';

export function renderIllustrated(root, data, kit, { nav, art, section, content, sticky, barClass = "" }) {
  addStyles("illustrated", CSS);
  root.innerHTML = `
    <div class="illustrated ${kit.id}">
      <header class="shop-head"><div class="shop-wrap heading-row">
        <div class="identity"><span class="monogram" aria-hidden="true" data-bind="initials"></span><span><span data-bind="name"></span><small data-bind="kind-label"></small></span></div>
        <a href="#offer">${nav}</a>
      </div></header>
      <main id="kit-main" tabindex="-1">
        <section class="shop-hero"><div class="shop-wrap hero-layout">
          <div class="engraving" aria-hidden="true">${art}</div>
          <div class="hero-type"><p class="trade-line" data-bind="describe"></p><h1 data-bind="name"></h1><p class="tag" data-bind="tagline"></p></div>
        </div></section>
        <section class="offer shop-wrap" id="offer" tabindex="-1">${section}</section>
        ${content ?? ""}
        <section class="hours"><div class="shop-wrap location-layout"><div>${hours(kit.id, data.kind.id)}</div></div></section>
        <section class="location" data-if="town"><div class="shop-wrap location-layout"><div>${data.kind.id === "mobile-mechanic" ? '<h2>Visit area <span data-bind="in-town"></span></h2>' : findUs}</div></div></section>
      </main>
      <footer class="shop-foot shop-wrap"><span data-bind="name"></span><small>Example website by Severn &amp; Tyne</small></footer>
      <div class="sticky ${barClass}"><div class="shop-wrap sticky-inner">${sticky}</div></div>
    </div>`;
  applyData(root, data, kit);
  wireCallNotes(root);
}
