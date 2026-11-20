import { hours, findUs } from "./visit.js";
/*
  Restaurant kit (also cafes and takeaways): a menu-cover hero, an example menu with a
  working basket ("Order for collection": add dishes, basket bar, order summary, receipt;
  nothing is sent), a book-a-table demo, hours, find us and a sticky bar.
*/
import { addStyles, applyData, wireCallNotes, formatMoney, ICON_PHONE } from "../kit-core.js";
import { wireDining } from "./restaurant-flow.js";

const ACCENTS = [
  { key: "tomato", label: "Tomato", value: "#A8352A", ink: "#FBF3E4" },
  { key: "basil", label: "Basil", value: "#3D5A2A", ink: "#FBF3E4" },
  { key: "harbour", label: "Harbour blue", value: "#1F4A63", ink: "#FBF3E4" },
  { key: "mustard", label: "Mustard", value: "#D9A43A", ink: "#2A211B", text: "#7A5414" },
];

const MENU = [
  {
    id: "starters",
    title: "Starters",
    items: [
      { id: "soup", name: "Soup of the day", description: "With warm bread and butter", price: 550 },
      { id: "flatbread", name: "Garlic flatbread", description: "Roasted garlic, herbs and sea salt", price: 450 },
      { id: "squid", name: "Crispy squid", description: "Lemon mayonnaise", price: 700 },
    ],
  },
  {
    id: "mains",
    title: "Mains",
    items: [
      { id: "fish", name: "Fish and chips", description: "Battered haddock, chips and mushy peas", price: 1350 },
      { id: "burger", name: "Chicken burger", description: "Buttermilk chicken, slaw and fries", price: 1250 },
      { id: "risotto", name: "Mushroom risotto", description: "Parmesan, thyme and rocket", price: 1150 },
      { id: "steak", name: "Steak frites", description: "Sirloin, garlic butter and fries", price: 1800 },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      { id: "chips", name: "Chips", description: "", price: 350 },
      { id: "salad", name: "House salad", description: "", price: 400 },
      { id: "rings", name: "Onion rings", description: "", price: 400 },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { id: "toffee", name: "Sticky toffee pudding", description: "Toffee sauce and vanilla ice cream", price: 600 },
      { id: "icecream", name: "Ice cream", description: "Three scoops", price: 450 },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    items: [
      { id: "soft", name: "Soft drinks", description: "", price: 250 },
      { id: "tea", name: "Pot of tea", description: "", price: 250 },
      { id: "flatwhite", name: "Flat white", description: "", price: 300 },
    ],
  },
];

const money = (pence) => formatMoney(pence);

const PLATE_SVG = `
<svg class="rs-plate" viewBox="0 0 240 160" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <circle cx="120" cy="80" r="62"/>
  <circle cx="120" cy="80" r="46"/>
  <path d="M93 62c6-8 16-13 27-13" opacity=".6"/>
  <path d="M30 26v24a8 8 0 0 0 16 0V26M38 26v28M38 58v78"/>
  <path d="M205 26c-9 12-11 34-6 54h7V26zM206 80v56"/>
</svg>`;

function menuItems(section) {
  return section.items
    .map(
      (item) => `
      <li class="rs-item">
        <div class="rs-item-line">
          <h4 class="rs-item-name">${item.name}</h4>
          <span class="rs-leader" aria-hidden="true"></span>
          <span class="rs-price">${money(item.price)}</span>
        </div>
        ${item.description ? `<p class="rs-desc">${item.description}</p>` : ""}
        <div class="rs-qty" data-item="${item.id}"></div>
      </li>`,
    )
    .join("");
}

const template = (menu, kind) => `
<div class="rs">
  <header class="rs-head">
    <a class="rs-brand" href="#kit-main">
      <span class="rs-mono" aria-hidden="true"><span data-bind="initials"></span></span>
      <span class="rs-brand-name"><span data-bind="name"></span><small data-bind="kind-label"></small></span>
    </a>
    <nav class="rs-nav" aria-label="Sections"><a href="#rs-menu">Menu</a><a href="#rs-visit">Visit</a></nav>
    <button type="button" class="k-btn k-btn-primary rs-head-book" data-table>Book a table</button>
  </header>

  <main id="kit-main" tabindex="-1">
    <section class="rs-hero" aria-labelledby="rs-name">
      <div class="rs-hero-in">
        <div class="rs-hero-copy">
          <h1 class="rs-name" id="rs-name" data-bind="name"></h1>
          <p class="rs-describe" data-bind="describe"></p>
          <p class="rs-tagline" data-bind="tagline"></p>
          <div class="rs-actions">
            <a class="k-btn rs-btn-cream" href="#rs-menu">Order for collection</a>
            <button type="button" class="k-btn rs-btn-line" data-table>Book a table</button>
          </div>
        </div>
        ${PLATE_SVG}
      </div>
    </section>

    <section class="rs-sittings"><div class="rs-wrap">${hours("restaurant", kind)}</div></section>
    <section class="rs-menu" id="rs-menu" aria-labelledby="rs-menu-title">
      <div class="rs-wrap">
        <div class="rs-menu-head">
          <h2 id="rs-menu-title">Menu</h2>
          <p class="rs-note">Example menu</p>
        </div>
        <nav class="rs-cats" aria-label="Menu sections">
          ${menu.map((section) => `<a href="#rs-${section.id}">${section.title}</a>`).join("")}
        </nav>
        <div class="rs-menu-grid">
          ${menu.map(
            (section) => `
            <section class="rs-cat" id="rs-${section.id}" aria-labelledby="rs-${section.id}-title">
              <h3 id="rs-${section.id}-title">${section.title}</h3>
              <ul class="rs-items">${menuItems(section)}</ul>
            </section>`,
          ).join("")}
        </div>
      </div>
    </section>

    <section class="rs-visit" id="rs-visit" aria-label="Book a table and find us">
      <div class="rs-wrap rs-visit-grid">
        <div class="rs-card rs-book">
          <h2>Book a table</h2>
          <p>Pick a day, a time and how many of you.</p>
          <button type="button" class="k-btn k-btn-primary" data-table>Book a table</button>
        </div>
        <div class="rs-card rs-find">
          ${findUs}
          <a class="k-btn k-btn-ghost" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
        </div>
      </div>
    </section>
  </main>

  <footer class="rs-foot">
    <div class="rs-wrap">
      <p class="rs-foot-name" data-bind="name"></p>
      <p data-bind="describe"></p>
      <p class="rs-foot-small">Example website made by Severn &amp; Tyne. The menu, prices and times are examples.</p>
    </div>
  </footer>

  <div class="rs-bar" data-empty="true">
    <a class="k-btn k-btn-ghost rs-bar-call" href="#call" data-call="short">${ICON_PHONE}<span data-call-label>Call us</span></a>
    <button type="button" class="k-btn k-btn-primary rs-bar-book" data-table>Book a table</button>
    <button type="button" class="k-btn k-btn-primary rs-bar-order" data-order hidden>
      <span class="rs-bar-count" aria-hidden="true">0</span>
      <span class="rs-bar-label">View order</span>
      <span class="rs-bar-total">£0.00</span>
    </button>
  </div>
</div>`;

const CSS = `
html[data-kit=restaurant]{
  --k-bg:#FAF5EC;--k-surface:#FFFDF8;--k-ink:#2A211B;--k-ink-2:#64574C;
  --k-line:rgba(42,33,27,.14);--k-line-strong:rgba(42,33,27,.32);--k-focus:#2A211B;--k-sheet-bg:#FFFDF8;--k-input-bg:#fff;
  --k-font-display:"Palatino","Palatino Linotype","Book Antiqua","Noto Serif",Georgia,serif;
  --k-font-text:"Gill Sans","Seravek","Segoe UI Variable Text","Segoe UI",Roboto,system-ui,sans-serif;
  --k-btn-radius:12px;--k-chip-radius:12px;--k-input-radius:10px;--k-sheet-radius:22px;
  --k-sheet-title-font:700 21px/1.2 var(--k-font-display);
  background:#FAF5EC;
}
html[data-kit=restaurant] body{background:#FAF5EC}
.kit-root[data-kit=restaurant]{background:var(--k-bg);color:var(--k-ink);font:17px/1.55 var(--k-font-text);padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))}
.rs :is(h1,h2,h3,h4,p,dl,dd,figure),html[data-kit=restaurant] .k-sheet :is(p,dl,dd,h3){margin:0}
.rs a:not(.k-btn){color:inherit}
.rs :focus-visible,html[data-kit=restaurant] .k-sheet :focus-visible{outline:3px solid var(--k-focus);outline-offset:3px}
.rs main:focus{outline:none}
.rs-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.rs-head{position:sticky;top:var(--strip-h,0px);z-index:40;display:flex;align-items:center;gap:12px;min-height:64px;padding:var(--kit-safe-top,0px) 14px 0 18px;background:var(--k-bg);border-bottom:1px solid var(--k-line)}
.rs-brand{display:flex;align-items:center;gap:10px;min-width:0;min-height:44px;margin-right:auto;text-decoration:none}
.rs-brand-name>[data-bind=name]{display:block;overflow:hidden;text-overflow:ellipsis}
.rs-brand-name{font:700 19px/1.15 var(--k-font-display);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rs-mono{flex:none;display:grid;place-items:center;width:42px;height:42px;border-radius:50%;border:1.5px solid var(--k-ink);box-shadow:inset 0 0 0 4px var(--k-bg),inset 0 0 0 5px var(--k-ink);font:700 15px/1 var(--k-font-display);letter-spacing:.04em}
.rs-nav{display:none}
.rs-head-book{min-height:44px;padding:10px 16px;font-size:15px}
.rs-hero{position:relative;background:var(--accent);color:var(--accent-ink);transition:background-color 240ms ease}
.rs-hero::after{content:"";position:absolute;left:0;right:0;bottom:-15px;height:16px;background:radial-gradient(circle at 15px 0,var(--accent) 14.5px,transparent 15px) 0 0/30px 16px repeat-x;z-index:1}
.rs-hero-in{display:grid;gap:8px;max-width:1120px;margin:0 auto;padding:36px 20px 48px}
.rs-name{font:700 62px/1 var(--k-font-display);letter-spacing:-.015em;overflow-wrap:anywhere;text-wrap:balance;min-width:0}
.kit-root[data-kit=restaurant][data-name-length=m] .rs-name{font-size:52px}
.kit-root[data-kit=restaurant][data-name-length=l] .rs-name{font-size:40px}
.kit-root[data-kit=restaurant][data-name-length=xl] .rs-name{font-size:31px;line-height:1.08}
.rs-describe{margin-top:16px;font-size:19px;font-weight:600}
.rs-tagline{margin-top:4px;opacity:.88;max-width:34ch}
.rs-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.rs-actions .k-btn{min-height:52px}
.rs-btn-cream{background:var(--accent-ink);color:var(--accent);border-color:var(--accent-ink)}
.rs-btn-line{background:transparent;color:var(--accent-ink);border-color:var(--accent-ink)}
.rs-plate{order:-1;width:150px;height:auto;justify-self:end;margin:-12px -6px -4px 0;opacity:.92}
.rs-menu{padding:56px 0 40px}
.rs-menu-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap}
.rs-menu-head h2,.rs-card h2{font:700 38px/1.05 var(--k-font-display);letter-spacing:-.01em}
.rs-note{font-size:15px;color:var(--k-ink-2)}
.rs-cats{position:sticky;top:calc(var(--strip-h,0px) + 64px + var(--kit-safe-top,0px));z-index:30;display:flex;gap:8px;overflow-x:auto;margin:18px -20px 6px;padding:10px 20px;background:var(--k-bg);scrollbar-width:none;border-bottom:1px solid var(--k-line)}
.rs-cats::-webkit-scrollbar{display:none}
.rs-cats a{flex:none;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1.5px solid var(--k-line-strong);border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;background:var(--k-surface);-webkit-user-select:none;user-select:none}
.rs-cat{padding-top:26px;scroll-margin-top:calc(var(--strip-h,0px) + 140px)}
.rs-cat h3{font:700 26px/1.2 var(--k-font-display);padding-bottom:8px;border-bottom:1.5px solid var(--k-ink)}
.rs-items{list-style:none;margin:0;padding:0}
.rs-item{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid var(--k-line)}
.rs-item-line{grid-column:1;display:flex;align-items:baseline;gap:8px;min-width:0}
.rs-item-name{font:700 19px/1.25 var(--k-font-display);min-width:0}
.rs-leader{flex:1;min-width:12px;border-bottom:1.5px dotted var(--k-line-strong);transform:translateY(-4px)}
.rs-price{font:700 18px/1 var(--k-font-display);font-variant-numeric:tabular-nums lining-nums}
.rs-desc{grid-column:1;margin-top:4px!important;font-size:15px;color:var(--k-ink-2)}
.rs-qty{grid-column:2;grid-row:1/span 2;display:flex;justify-content:flex-end}
.rs-add{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px 0 12px;border:1.5px solid var(--k-ink);border-radius:10px;background:transparent;color:var(--k-ink);font:600 15px/1 var(--k-font-text);cursor:pointer;-webkit-user-select:none;user-select:none;transition:transform 120ms var(--k-ease-out),background-color 160ms ease,color 160ms ease}
.rs-add:active,.rs-step button:active{transform:scale(.94)}
.rs-sittings{padding:20px 0;border-bottom:3px double var(--k-line-strong)}
.rs-sittings h2{font:600 22px/1.2 var(--k-font-display)}
@media(min-width:700px){.rs-sittings .rs-wrap{display:grid;grid-template-columns:1fr 2fr;align-items:center}.rs-sittings .visit-note{grid-column:1}.rs-sittings dl{grid-column:2;grid-row:1/3;justify-self:end}}
.rs-visit{padding:32px 0 56px;border-top:1px solid var(--k-line)}
.rs-visit-grid{display:grid;gap:16px}
.rs-card{padding:24px;border-radius:18px;background:var(--k-surface);border:1px solid var(--k-line)}
.rs-card h2{font-size:30px}
.rs-card>p{margin-top:8px!important;color:var(--k-ink-2)}
.rs-card .k-btn{margin-top:18px}
.rs-book{background:var(--accent);color:var(--accent-ink);border-color:transparent;transition:background-color 240ms ease}
.rs-book>p{color:inherit;opacity:.88}
.rs-book .k-btn-primary{background:var(--accent-ink);color:var(--accent);border-color:var(--accent-ink)}
.rs-hours .rs-note{margin-top:12px}
.rs-foot{padding:36px 0 28px;border-top:1.5px solid var(--k-ink)}
.rs-foot-name{font:700 24px/1.15 var(--k-font-display);overflow-wrap:anywhere}
.rs-foot p{font-size:15px}
.rs-foot-small{margin-top:12px!important;color:var(--k-ink-2)}
.rs-bar{position:fixed;z-index:45;left:0;right:0;bottom:0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;padding:10px max(14px,env(safe-area-inset-right,0px)) calc(10px + env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px));background:var(--k-bg);border-top:1px solid var(--k-line-strong)}
.rs-bar .k-btn{min-height:52px}
.rs-bar-order{justify-content:space-between;padding:0 18px 0 8px}
.rs-bar-order[hidden],.rs-bar-book[hidden]{display:none}
.rs-bar-count{display:grid;place-items:center;min-width:34px;height:34px;padding:0 8px;border-radius:9px;background:var(--accent-ink);color:var(--accent);font-weight:700;font-variant-numeric:tabular-nums}
.rs-bar-label{flex:1;text-align:left;padding-left:4px}
.rs-bar-total{font-variant-numeric:tabular-nums}
@media (hover:hover) and (pointer:fine){
  .rs-add:hover{background:var(--k-ink);color:var(--k-bg)}
  .rs-cats a:hover{border-color:var(--k-ink)}
  .rs-nav a:hover{text-decoration:underline;text-underline-offset:.25em}
  .k-btn-primary:hover{filter:brightness(1.07)}
}
@media (min-width:560px){
  .rs-hero-in{grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:52px 28px 60px}
  .rs-plate{order:0;width:220px;margin:0}
}
@media (min-width:900px){
  .kit-root[data-kit=restaurant]{padding-bottom:0}
  .rs-head{padding-left:max(28px,calc((100% - 1120px)/2 + 20px));padding-right:max(28px,calc((100% - 1120px)/2 + 20px));min-height:76px}
  .rs-nav{display:flex;gap:24px;margin-right:12px}
  .rs-nav a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;padding:0 4px;font-weight:600;text-decoration:none}
  .rs-head-book{padding:10px 22px}
  .rs-hero-in{min-height:min(560px,calc(100svh - 76px - var(--strip-h,0px)));padding:72px 20px 84px}
  .rs-name{font-size:104px}
  .kit-root[data-kit=restaurant][data-name-length=m] .rs-name{font-size:88px}
  .kit-root[data-kit=restaurant][data-name-length=l] .rs-name{font-size:66px}
  .kit-root[data-kit=restaurant][data-name-length=xl] .rs-name{font-size:50px}
  .rs-describe{font-size:22px}
  .rs-plate{width:340px}
  .rs-menu{padding:88px 0 64px}
  .rs-menu-head h2{font-size:56px}
  .rs-cats{top:calc(var(--strip-h,0px) + 76px)}
  .rs-menu-grid{columns:2;column-gap:56px}
  .rs-cat{break-inside:avoid}
  .rs-visit{padding:64px 0 88px}
  .rs-visit-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
  .rs-bar{left:auto;right:24px;bottom:24px;width:400px;grid-template-columns:minmax(0,1fr);border:1px solid var(--k-line-strong);border-radius:18px;box-shadow:0 18px 40px -20px rgba(42,33,27,.55);padding:10px}
  .rs-bar[data-empty=true]{display:none}
  .rs-bar-call,.rs-bar-book{display:none!important}
}
@media (prefers-reduced-motion:reduce){
  .rs-receipt{animation:none}
  .rs-add,.rs-step button,.rs-hero,.rs-book,.rs-party-row span{transition:none}
}
`;

/* ---------- Basket ---------- */

function render(root, data) {
  addStyles("restaurant", CSS);
  const menu = data.kind.menu ?? MENU;
  root.innerHTML = template(menu, data.kind.id);
  applyData(root, data, kit);
  wireCallNotes(root);
  wireDining(root, menu.flatMap((section) => section.items));
}

const kit = {
  id: "restaurant",
  label: "Restaurant or cafe",
  accents: ACCENTS,
  defaultTagline: "Order for collection or book a table.",
  describe: (data) => (data.town ? `Food and drink in ${data.town}` : "Food and drink"),
  render,
};

export default kit;
