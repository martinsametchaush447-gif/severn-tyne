import { hours, findUs } from "./visit.js";
import { addStyles, applyData, wireCallNotes } from "../kit-core.js";

const css = `
html:is([data-kit=salon],[data-kit=shop],[data-kit=trades]){
 --k-bg:#f3f1eb;--k-sheet-bg:#fffefa;--k-surface:#fffefa;--k-ink:#242522;--k-ink-2:#50544d;
 --k-line:#cccac2;--k-line-strong:#898c82;--k-focus:#294d41;--k-font-text:"Segoe UI",Arial,sans-serif;
 --k-font-display:Georgia,serif;--k-btn-radius:5px;--k-chip-radius:5px;--k-input-radius:5px
}
.local-kit{--paper:#fffefa;--ink:#282823;--line:#cac9bf;--hero:var(--paper);--on-hero:var(--ink);
 --display:Georgia,serif;--weight:400;--inset:clamp(16px,5vw,76px);background:var(--paper);color:var(--ink);
 font:16px/1.45 var(--k-font-text);overflow-wrap:anywhere}
.local-kit :is(h1,h2,h3,h4,p,ul,ol){margin:0}
.local-kit ul,.local-kit ol{padding:0;list-style:none}
.local-kit :is(a,button){font:inherit;color:inherit}
.local-kit button{cursor:pointer}.local-kit [hidden]{display:none!important}
.local-kit :is(a,button):focus-visible,.quote-job:focus-visible{outline:3px solid currentColor;outline-offset:3px}
.local-kit :is(a,button):active,.quote-job:active{transform:translateY(1px)}
.local-wrap{width:min(calc(100% - 2 * var(--inset)),1120px);margin-inline:auto}
.local-head,.local-hero{background:var(--hero);color:var(--on-hero)}
.local-mast{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:62px;border-bottom:1px solid currentColor}
.local-lockup{display:flex;align-items:center;gap:9px;min-width:0;font-weight:600}
.local-business{min-width:0;line-height:1.15}.local-business [data-bind=name]{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.local-business small{display:block;margin-top:2px;font-weight:400}.local-mast>a{flex:none}
.local-mono{display:inline-grid;place-items:center;min-width:33px;height:33px;border:1px solid;font:21px/1 var(--display)}
.local-mast>a,.local-call{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;text-underline-offset:4px}
.local-hero-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:center;gap:clamp(16px,4vw,72px);padding-block:clamp(32px,4.5vw,72px)}
.local-copy,.local-art{min-width:0}.local-art svg{display:block;width:100%;height:auto}
.local-kit h1,.local-kit h2,.local-list strong,.local-list h4{font-family:var(--display);font-weight:var(--weight)}
.local-kit h1{font-size:clamp(52px,7.6vw,116px);letter-spacing:-.055em;line-height:.98;margin:.18em 0}
.local-tag{max-width:40ch;font-size:clamp(16px,1.4vw,21px);line-height:1.45}
.local-trade,.local-example,.local-list small{font-size:14px;line-height:1.4}
.local-kit .local-action{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:9px 15px;border:1px solid transparent;background:var(--accent);color:var(--accent-ink);font-weight:650;border-radius:var(--k-btn-radius);text-decoration:none;line-height:1.2}
.local-copy .local-action{margin-top:22px}
.local-offer{padding-block:clamp(32px,5vw,68px);scroll-margin-block-start:var(--strip-h)}
.local-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:24px}
.local-kit h2{font-size:clamp(34px,4.2vw,65px);line-height:1.08;letter-spacing:-.045em}
.local-example{max-width:36ch}.local-list>li{border-bottom:1px solid var(--line)}
.local-list button.local-row{border:0;background:transparent;width:100%;text-align:left}
.local-row,.local-product{display:flex;align-items:center;gap:16px;min-height:66px;padding:16px 0}
.local-list strong,.local-list h4{display:block;font-size:clamp(21px,2vw,32px);line-height:1.16;letter-spacing:-.025em}
.local-list small{display:block;margin-top:4px}
.local-row>span:first-child,.local-product>div:first-child{flex:1;min-width:0}
.local-price,.local-row b{font-variant-numeric:tabular-nums;white-space:nowrap}
.local-list .rs-add{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-width:48px;min-height:44px;padding:4px 10px;background:transparent;border:1px solid currentColor;border-radius:var(--k-btn-radius);font-size:14px;color:var(--accent-text)}
.local-list .rs-add svg{display:block;width:16px}.local-list .rs-step{color:var(--accent-ink)}
.local-details{border-top:1px solid var(--line)}.local-info{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding-block:32px}
.local-info h2{font-size:clamp(25px,2.4vw,36px);margin-bottom:6px}
.local-foot{border-top:1px solid var(--line);padding:22px 0 calc(90px + env(safe-area-inset-bottom));font-size:14px}
.local-bar{position:fixed;bottom:0;inset-inline:0;z-index:3;padding:6px 0 max(6px,env(safe-area-inset-bottom));background:var(--paper);color:var(--ink);border-top:1px solid var(--line)}
.local-bar .local-wrap{display:flex;justify-content:space-between;align-items:center;gap:9px}.local-bar .rs-bar-count{padding-right:7px;border-right:1px solid currentColor}
@media(hover:hover){.local-list .local-row:hover,.local-list .rs-add:hover{background:color-mix(in srgb,var(--accent) 9%,transparent)}.local-action:hover{filter:brightness(.92)}}
@media(max-width:720px){.local-mast{min-height:51px}.local-hero-grid{grid-template-columns:1fr;gap:5px;padding-block:24px}
 .local-art{justify-self:end;width:min(62%,250px)}.local-kit h1{font-size:clamp(45px,12vw,72px)}
 .local-section-head{display:grid;gap:6px;margin-bottom:18px}.local-info{grid-template-columns:1fr;gap:22px;padding-block:24px}
 .local-product{flex-wrap:wrap;gap:6px 12px}.local-product>div:first-child{min-width:44%}.local-product .rs-qty{margin-left:auto}}
@media(max-width:350px){.local-bar .local-action{font-size:14px}.local-mast{gap:7px}.local-lockup{gap:6px}}
`;

export const call = '<a class="local-call" data-call="short" href="#call"><span data-call-label>Call us</span></a>';

export function button(label, attribute) {
  return `<button type="button" class="local-action" ${attribute}>${label}</button>`;
}

export function renderPage(root, data, kit, {nav, heading, example, rows, primary, sticky, details, art = kit.art}) {
  addStyles("local-pages", css);
  addStyles(kit.skin, kit.css);
  root.innerHTML = `
    <div class="local-kit ${kit.skin}">
      <header class="local-head"><div class="local-wrap local-mast">
        <div class="local-lockup"><span aria-hidden="true" class="local-mono" data-bind="initials"></span><span class="local-business"><span data-bind="name"></span><small data-bind="kind-label"></small></span></div>
        <a href="#offer">${nav}</a>
      </div></header>
      <main id="kit-main" tabindex="-1">
        <section class="local-hero"><div class="local-wrap local-hero-grid">
          <div class="local-copy"><p class="local-trade" data-bind="describe"></p><h1 data-bind="name"></h1>
            <p class="local-tag" data-bind="tagline"></p>${primary}</div>
          <div class="local-art" aria-hidden="true">${art}</div>
        </div></section>
        <section id="offer" class="local-wrap local-offer" tabindex="-1">
          <div class="local-section-head"><h2>${heading}</h2><p class="local-example">${example}</p></div>${rows}
        </section>
        ${details ?? ""}
        <section class="local-details"><div class="local-wrap local-info">
          <div>${hours(kit.id, data.kind.id)}</div><div data-if="town">${findUs}</div>
        </div></section>
      </main>
      <footer class="local-foot"><div class="local-wrap"><span data-bind="name"></span><br>Example website by Severn &amp; Tyne</div></footer>
      <div class="sticky local-bar ${kit.id === "shop" ? "rs-bar" : ""}"><div class="local-wrap">${sticky}</div></div>
    </div>`;
  applyData(root, data, kit);
  wireCallNotes(root);
}
