import { hours, findUs } from "./visit.js";
/*
  Barber kit: shop name set like a sign, example services with a working booking flow
  (service, then day and time, then name and mobile, then confirmed; nothing is sent),
  opening hours card, find us and a sticky call and book bar.
*/
import { addStyles, applyData, wireCallNotes, formatMoney, ICON_PHONE } from "../kit-core.js";
import { wireBooking } from "./barber-flow.js";

const ACCENTS = [
  { key: "oxblood", label: "Oxblood", value: "#8B2433", ink: "#FFFFFF" },
  { key: "green", label: "Bottle green", value: "#1E5540", ink: "#FFFFFF" },
  { key: "navy", label: "Navy", value: "#22385C", ink: "#FFFFFF" },
  { key: "mustard", label: "Mustard", value: "#C8962A", ink: "#1E1C1A", text: "#6E4F10" },
];

const SERVICES = [
  { id: "skin-fade", name: "Skin fade", minutes: 35, price: 1800 },
  { id: "scissor-cut", name: "Scissor cut", minutes: 40, price: 2000 },
  { id: "fade-beard", name: "Fade and beard", minutes: 50, price: 2500 },
  { id: "beard-trim", name: "Beard trim and shape", minutes: 20, price: 1000 },
  { id: "hot-towel", name: "Hot towel shave", minutes: 30, price: 1800 },
  { id: "kids-cut", name: "Kids cut, under 12", minutes: 25, price: 1200 },
];


const price = (pence) => formatMoney(pence, { alwaysPence: false });

const POLE_SVG = `
<svg class="bb-pole-art" viewBox="0 0 100 400" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false">
  <defs><clipPath id="bb-glass"><rect x="27" y="77" width="46" height="234" rx="3"/></clipPath></defs>
  <circle cx="50" cy="20" r="9"/>
  <path d="M25 60c0-15 11-26 25-26s25 11 25 26z"/>
  <rect x="18" y="60" width="64" height="17" rx="4"/>
  <g clip-path="url(#bb-glass)">
    <g class="bb-pole-stripes" stroke="var(--accent)" stroke-width="13" stroke-linecap="butt">
      <path d="M-30 110L130 30M-30 154L130 74M-30 198L130 118M-30 242L130 162M-30 286L130 206M-30 330L130 250M-30 374L130 294M-30 418L130 338"/>
    </g>
    <g stroke-width="2" stroke-linecap="butt">
      <path d="M-30 128L130 48M-30 172L130 92M-30 216L130 136M-30 260L130 180M-30 304L130 224M-30 348L130 268M-30 392L130 312"/>
    </g>
    <path d="M35 86V302" stroke="#fff" stroke-width="4" opacity=".75"/>
  </g>
  <rect x="27" y="77" width="46" height="234" rx="3"/>
  <rect x="18" y="311" width="64" height="17" rx="4"/>
  <path d="M31 328h38l-11 24H42z"/>
  <circle cx="50" cy="362" r="8"/>
</svg>`;

function serviceRows(services) {
  return services.map(
    (service) => `
      <li class="bb-service">
        <div class="bb-service-text">
          <h3>${service.name}</h3>
          <p>${service.minutes} min</p>
        </div>
        <p class="bb-price">${price(service.price)}</p>
        <button type="button" class="bb-service-book" data-book="${service.id}" aria-label="Book ${service.name}">Book</button>
      </li>`,
  ).join("");
}

const template = (services, bookLabel, kind) => `
<div class="bb">
  <header class="bb-head">
    <a class="bb-brand" href="#kit-main">
      <span class="bb-mono" aria-hidden="true"><span data-bind="initials"></span></span>
      <span class="bb-brand-name"><span data-bind="name"></span><small data-bind="kind-label"></small></span>
    </a>
    <nav class="bb-nav" aria-label="Sections">
      <a href="#bb-services">Services</a><a href="#bb-hours">Hours</a><a href="#bb-find">Find us</a>
    </nav>
    <button type="button" class="k-btn k-btn-primary bb-head-book" data-book>Book</button>
  </header>

  <main id="kit-main" tabindex="-1">
    <section class="bb-hero" aria-labelledby="bb-name">
      <div class="bb-hero-copy">
        <h1 class="bb-name" id="bb-name" data-bind="name"></h1>
        <p class="bb-describe" data-bind="describe"></p>
        <p class="bb-tagline" data-bind="tagline"></p>
        <div class="bb-actions">
          <button type="button" class="k-btn k-btn-primary" data-book>${bookLabel}</button>
          <a class="k-btn k-btn-ghost" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
        </div>
      </div>
      <div class="bb-hero-visual">
        <div class="bb-pole">${POLE_SVG}</div>
      </div>
    </section>
    <div class="bb-stripe" aria-hidden="true"></div>

    <section class="bb-section bb-services" id="bb-services" aria-labelledby="bb-services-title">
      <div class="bb-wrap bb-services-grid">
        <div class="bb-section-head">
          <h2 id="bb-services-title">Services</h2>
          <p class="bb-tag">Example prices</p>
        </div>
        <div>
          <ul class="bb-service-list">${serviceRows(services)}</ul>
        </div>
      </div>
    </section>

    <section class="bb-section bb-info" id="bb-hours" aria-label="Opening hours and where to find us">
      <div class="bb-wrap bb-info-grid">
        <div class="bb-sign">
          ${hours("barber", kind)}
        </div>
        <div class="bb-find" id="bb-find">
            ${findUs}
            <div class="bb-actions">
              <button type="button" class="k-btn k-btn-primary" data-book>${bookLabel}</button>
              <a class="k-btn k-btn-ghost" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
            </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bb-foot">
    <div class="bb-wrap bb-foot-in">
      <span class="bb-mono" aria-hidden="true"><span data-bind="initials"></span></span>
      <div>
        <p class="bb-foot-name" data-bind="name"></p>
        <p data-bind="describe"></p>
        <p class="bb-foot-small">Example website made by Severn &amp; Tyne. Services, prices and times are examples.</p>
      </div>
    </div>
  </footer>

  <nav class="bb-bar" aria-label="Quick actions">
    <a class="k-btn k-btn-ghost" href="#call" data-call="short">${ICON_PHONE}<span data-call-label>Call us</span></a>
    <button type="button" class="k-btn k-btn-primary" data-book>${bookLabel}</button>
  </nav>
</div>`;

const CSS = `
html[data-kit=barber]{
  --k-bg:#F3F1ED;--k-surface:#FFFFFF;--k-ink:#1E1C1A;--k-ink-2:#57534D;
  --k-line:rgba(30,28,26,.12);--k-line-strong:rgba(30,28,26,.3);--k-focus:#1E1C1A;--k-sheet-bg:#FFFFFF;
  --k-font-display:"Avenir Next Condensed","Bahnschrift","Roboto Condensed","Arial Narrow",sans-serif;
  --k-font-text:"Avenir Next","Segoe UI Variable Text","Segoe UI",Roboto,system-ui,sans-serif;
  --k-btn-radius:6px;--k-chip-radius:8px;--k-input-radius:6px;--k-sheet-radius:14px;
  --k-sheet-title-font:800 23px/1.1 var(--k-font-display);
  --tile:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cpath d='M0 .5H56M0 28.5H56M.5 0V28M28.5 28V56' stroke='%231E1C1A' stroke-opacity='.075' fill='none'/%3E%3C/svg%3E");
  background:#F3F1ED;
}
html[data-kit=barber] body{background:#F3F1ED}
html[data-kit=barber] .k-sheet-title{font-stretch:75%;text-transform:uppercase}
.kit-root[data-kit=barber]{
  background:var(--k-bg);color:var(--k-ink);font:17px/1.55 var(--k-font-text);
  padding-bottom:calc(84px + env(safe-area-inset-bottom,0px));
}
.bb :is(h1,h2,h3,p,dl,dd,figure),html[data-kit=barber] .k-sheet :is(p,dl,dd){margin:0}
.bb a:not(.k-btn){color:inherit}
.bb :focus-visible,html[data-kit=barber] .k-sheet :focus-visible{outline:3px solid var(--k-focus);outline-offset:3px}
.bb main:focus{outline:none}
.bb-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.bb-head{position:sticky;top:var(--strip-h,0px);z-index:40;display:flex;align-items:center;gap:12px;min-height:64px;padding:var(--kit-safe-top,0px) 16px 0 20px;background:var(--k-bg);border-bottom:1px solid var(--k-line)}
.bb-brand{display:flex;align-items:center;gap:10px;min-width:0;min-height:44px;margin-right:auto;text-decoration:none}
.bb-brand-name>[data-bind=name]{display:block;overflow:hidden;text-overflow:ellipsis}
.bb-brand-name{font:800 19px/1.05 var(--k-font-display);font-stretch:75%;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bb-mono{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--accent);color:var(--accent-ink);font:800 16px/1 var(--k-font-display);font-stretch:75%;letter-spacing:.02em;box-shadow:inset 0 0 0 2px var(--k-bg),inset 0 0 0 3.5px var(--accent);transition:background-color 220ms ease}
.bb-nav{display:none}
.bb-head-book{min-height:44px;padding:10px 16px}
.bb-hero{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 78px;gap:12px;align-items:end;padding:36px 20px 32px;background:var(--k-bg) var(--tile);border-bottom:1px solid var(--k-line)}
.bb-name{font:800 84px/.88 var(--k-font-display);font-stretch:75%;text-transform:uppercase;letter-spacing:-.005em;overflow-wrap:anywhere;text-wrap:balance;min-width:0}
.kit-root[data-kit=barber][data-name-length=m] .bb-name{font-size:66px}
.kit-root[data-kit=barber][data-name-length=l] .bb-name{font-size:50px}
.kit-root[data-kit=barber][data-name-length=xl] .bb-name{font-size:38px;line-height:.95}
.bb-describe{margin-top:18px;font-size:19px;font-weight:600}
.bb-tagline{margin-top:6px;color:var(--k-ink-2);max-width:36ch}
.bb-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.bb-actions .k-btn{min-height:52px}
.bb-hero-visual{align-self:stretch;display:flex;align-items:flex-end;gap:20px}
.bb-pole{flex:1;align-self:stretch;display:flex;align-items:flex-end;justify-content:center;color:var(--k-ink)}
.bb-pole-art{width:100%;height:auto;max-height:300px}
.bb-pole-stripes{transition:stroke 220ms ease}
.bb-stripe{height:10px;background:repeating-linear-gradient(-45deg,var(--accent) 0 9px,var(--k-bg) 9px 15px,var(--k-ink) 15px 17px,var(--k-bg) 17px 23px);transition:background 220ms ease}
.bb-section{padding:48px 0}
.bb-section h2{font:800 40px/.95 var(--k-font-display);font-stretch:75%;text-transform:uppercase}
.bb-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}
.bb-info{padding-bottom:56px}
.bb-tag{font-size:14px;color:var(--k-ink-2)}
.bb-service-list{list-style:none;margin:0;padding:0;border-top:2px solid var(--k-ink)}
.bb-service{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:14px;min-height:72px;padding:10px 0;border-bottom:1px solid var(--k-line)}
.bb-service h3{font-size:18px;font-weight:650;line-height:1.25}
.bb-service-text p{font-size:15px;color:var(--k-ink-2)}
.bb-price{font:800 24px/1 var(--k-font-display);font-stretch:75%;font-variant-numeric:tabular-nums}
.bb-service-book{min-height:44px;min-width:64px;padding:0 14px;border:1.5px solid var(--k-ink);border-radius:6px;background:transparent;color:var(--k-ink);font:600 15px/1 var(--k-font-text);cursor:pointer;-webkit-user-select:none;user-select:none;transition:transform 120ms var(--k-ease-out),background-color 160ms ease,color 160ms ease}
.bb-service-book:active{transform:scale(.96)}
.bb-info{padding-top:8px}
.bb-info-grid{display:grid;gap:20px}
.bb-sign{padding:26px 24px 22px;background:var(--k-ink);color:var(--k-bg);border-radius:10px;box-shadow:0 18px 30px -22px rgba(30,28,26,.8)}
.bb-sign h2{color:var(--k-bg)}
.bb-find{padding:24px;border-radius:10px;background:var(--k-surface);border:1px solid var(--k-line-strong)}
.bb-find h2{font-size:34px}
.bb-address{margin-top:10px;font-size:18px;color:var(--k-ink-2)}
.bb-find .bb-actions{margin-top:18px}
.bb-foot{padding:36px 0 28px;border-top:2px solid var(--k-ink)}
.bb-foot-in{display:flex;gap:14px;align-items:flex-start}
.bb-foot-name{font:800 24px/1 var(--k-font-display);font-stretch:75%;text-transform:uppercase;overflow-wrap:anywhere}
.bb-foot p{font-size:15px}
.bb-foot-small{margin-top:12px!important;color:var(--k-ink-2)}
.bb-bar{position:fixed;z-index:45;left:0;right:0;bottom:0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;padding:10px max(14px,env(safe-area-inset-right,0px)) calc(10px + env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px));background:var(--k-bg);border-top:1px solid var(--k-line-strong)}
.bb-bar .k-btn{min-height:52px}
@media (hover:hover) and (pointer:fine){
  .bb-service-book:hover{background:var(--k-ink);color:var(--k-bg)}
  .bb-pick:hover{border-color:var(--k-ink)}
  .bb-nav a:hover{text-decoration:underline;text-underline-offset:.25em}
  .k-btn-primary:hover{filter:brightness(1.08)}
}
@media (min-width:560px){
  .bb-hero{grid-template-columns:minmax(0,1fr) 120px;padding:48px 28px 40px}
}
@media (min-width:900px){
  .kit-root[data-kit=barber]{padding-bottom:0}
  .bb-bar{display:none}
  .bb-head{padding-left:max(28px,calc((100% - 1120px)/2 + 20px));padding-right:max(28px,calc((100% - 1120px)/2 + 20px));min-height:76px}
  .bb-nav{display:flex;gap:24px;margin-right:12px}
  .bb-nav a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;padding:0 4px;font-weight:600;text-decoration:none}
  .bb-head-book{padding:10px 22px}
  .bb-hero{grid-template-columns:minmax(0,1fr) minmax(105px,.22fr);gap:56px;min-height:min(660px,calc(100svh - 76px - var(--strip-h,0px)));align-items:center;padding:64px max(28px,calc((100% - 1120px)/2 + 20px))}
  .bb-hero-visual{align-items:center;justify-content:center}
  .bb-pole{flex:0 0 92px}
  .bb-name{font-size:132px}
  .kit-root[data-kit=barber][data-name-length=m] .bb-name{font-size:112px}
  .kit-root[data-kit=barber][data-name-length=l] .bb-name{font-size:86px}
  .kit-root[data-kit=barber][data-name-length=xl] .bb-name{font-size:62px}
  .bb-describe{font-size:22px;margin-top:24px}
  .bb-pole-art{max-height:420px}
  .bb-section{padding:80px 0}
  .bb-section h2{font-size:56px}
  .bb-services-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:56px;align-items:start}
  .bb-services .bb-section-head{display:block;position:sticky;top:calc(var(--strip-h,0px) + 110px)}
  .bb-services .bb-tag{margin-top:12px;font-size:15px}
  .bb-find{padding:30px 32px}
  .bb-info{padding-top:0}
  .bb-info-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:32px;align-items:start}
  .bb-sign{padding:34px 36px 30px}
}
@media (prefers-reduced-motion:reduce){
  .bb-card{animation:none}
  .bb-service-book,.bb-pick,.bb-mono,.bb-stripe{transition:none}
}
`;

/* ---------- Booking flow ---------- */

function render(root, data) {
  addStyles("barber", CSS);
  const services = data.kind.services ?? SERVICES;
  root.innerHTML = template(services, data.kind.id === "barber" ? "Book a cut" : "Book a service", data.kind.id);
  applyData(root, data, kit);
  wireCallNotes(root);
  wireBooking(root, services);
}

const kit = {
  id: "barber",
  label: "Barber",
  accents: ACCENTS,
  defaultTagline: "Book your next cut online.",
  describe: (data) => (data.town ? `Barbers in ${data.town}` : "Barbers"),
  render,
};

export default kit;
