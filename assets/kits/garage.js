import { workshopArt } from "./workshop-art.js";
import { wireServiceRequests } from "./garage-flow.js";
import { hours, findUs } from "./visit.js";
/*
  Garage kit: name and trade first, a labelled line drawing of a car, "What we fix" example
  services, common problems, how it works (call, diagnose and quote, fix), find us, hours,
  a sticky call bar.
*/
import { addStyles, applyData, wireCallNotes, ICON_PHONE } from "../kit-core.js";

const ACCENTS = [
  { key: "hivis", label: "Hi-vis orange", value: "#EE7232", ink: "#1B1E22", text: "#9A3E0E" },
  { key: "yellow", label: "Plate yellow", value: "#F0C43A", ink: "#1B1E22", text: "#7A5B00" },
  { key: "green", label: "Racing green", value: "#24543C", ink: "#FFFFFF" },
  { key: "blue", label: "Workshop blue", value: "#1F4F8F", ink: "#FFFFFF" },
];

const SERVICES = [
  { name: "Servicing", line: "Oil, filters and checks, booked around you." },
  { name: "Brakes", line: "Pads, discs and brake fluid." },
  { name: "Clutch and gearbox", line: "Slipping, grinding or a heavy pedal." },
  { name: "Diagnostics", line: "Warning lights read and explained." },
  { name: "Exhaust", line: "Blowing, rattling or failed emissions." },
  { name: "Batteries", line: "Tested and replaced." },
  { name: "Suspension", line: "Knocks, pulling and uneven tyre wear." },
  { name: "Air conditioning", line: "Regas and leak checks." },
];

const PROBLEMS = [
  "A warning light on the dashboard",
  "Squealing or grinding when you brake",
  "The car pulls to one side",
  "The clutch slips or bites high",
  "Smoke from the exhaust",
  "The battery keeps going flat",
];

const STEPS = [
  { title: "Call", line: "Tell us the make, the model and what the car is doing." },
  { title: "Diagnose and quote", line: "We find the fault and give you the price before any work starts." },
  { title: "Fix", line: "We fix it, then show you what we did." },
];


const CAR_SVG = `
<svg class="gg-car" viewBox="0 0 420 210" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-labelledby="gg-car-title" focusable="false">
  <title id="gg-car-title">Line drawing of a car with the engine, brakes, exhaust and suspension marked</title>
  <path class="gg-ground" d="M14 161H406" stroke-dasharray="2 7"/>
  <g class="gg-body" stroke-width="2.4">
    <path d="M36 140H70A30 30 0 0 1 130 140H288A30 30 0 0 1 348 140H384Q393 140 392 132L390 120Q385 108 362 104L282 95L240 64Q229 56 214 56L74 58Q60 59 54 68L34 97Q24 104 26 118L28 132Q29 140 36 140Z"/>
    <path d="M60 92L72 70Q76 64 84 64L160 63V92Z"/>
    <path d="M168 63L210 62Q222 62 230 69L258 92H168Z"/>
    <path d="M164 96V138M262 96L258 138"/>
    <path d="M136 106H150M186 106H200"/>
    <path d="M370 108L386 113L388 121L373 119Z"/>
    <path d="M28 104L40 100V113L28 115Z"/>
    <path d="M262 92L274 87L277 94"/>
  </g>
  <g class="gg-wheels" stroke-width="2.4">
    <circle cx="100" cy="140" r="23"/><circle cx="100" cy="140" r="9"/>
    <circle cx="318" cy="140" r="23"/><circle cx="318" cy="140" r="9"/>
  </g>
  <g class="gg-callouts" stroke-width="1.4">
    <path d="M336 99L352 34H384"/><circle class="gg-dot" cx="336" cy="99" r="4.5"/>
    <path d="M318 140L350 190H382"/><circle class="gg-dot" cx="318" cy="140" r="4.5"/>
    <path d="M34 143L22 190"/><circle class="gg-dot" cx="34" cy="143" r="4.5"/>
    <path d="M100 117L84 34H52"/><circle class="gg-dot" cx="100" cy="117" r="4.5"/>
  </g>
  <g class="gg-labels">
    <text x="354" y="29">Engine</text>
    <text x="352" y="205">Brakes</text>
    <text x="8" y="205">Exhaust</text>
    <text x="6" y="29">Suspension</text>
  </g>
</svg>`;

const template = (services, problems, kind) => `
<div class="gg">
  <header class="gg-head">
    <a class="gg-brand" href="#kit-main">
      <span class="gg-plate" aria-hidden="true"><span data-bind="initials"></span></span>
      <span class="gg-brand-name"><span data-bind="name"></span><small data-bind="kind-label"></small></span>
    </a>
    <nav class="gg-nav" aria-label="Sections"><a href="#gg-fix">What we fix</a><a href="#gg-how">How it works</a><a data-if="town" href="#gg-find">Find us</a></nav>
    <a class="k-btn k-btn-primary gg-head-call" href="#call" data-call="short">${ICON_PHONE}<span data-call-label>Call us</span></a>
  </header>

  <main id="kit-main" tabindex="-1">
    <section class="gg-hero" aria-labelledby="gg-name">
      <div class="gg-wrap gg-hero-in">
        <div class="gg-hero-copy">
          <h1 class="gg-name" id="gg-name" data-bind="name"></h1>
          <p class="gg-describe" data-bind="describe"></p>
          <p class="gg-tagline" data-bind="tagline"></p>
          <div class="gg-actions">
            <a class="k-btn k-btn-ghost" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
            <button class="k-btn k-btn-primary" type="button" data-service>Book a service</button>
          </div>
        </div>
        <div class="gg-drawing">${workshopArt(kind, false, CAR_SVG)}</div>
      </div>
    </section>

    <section class="gg-section gg-problems" aria-labelledby="gg-problems-title">
      <div class="gg-wrap gg-problems-in">
        <div>
          <h2 id="gg-problems-title">Common problems</h2>
          <p class="gg-problems-lead">Not sure what it is? Tell us what the car is doing.</p>
          <a class="k-btn k-btn-primary gg-problems-call" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
        </div>
        <ul class="gg-problem-list">${problems.map((problem) => `<li>${problem}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="gg-section gg-fix" id="gg-fix" aria-labelledby="gg-fix-title">
      <div class="gg-wrap">
        <div class="gg-section-head">
          <h2 id="gg-fix-title">What we fix</h2>
          <p class="gg-note">Example services</p>
        </div>
        <ul class="gg-services">
          ${services.map(({ name, line }) => `<li><h3>${name}</h3>${line ? `<p>${line}</p>` : ""}</li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="gg-section gg-how" id="gg-how" aria-labelledby="gg-how-title">
      <div class="gg-wrap">
        <h2 id="gg-how-title">How it works</h2>
        <ol class="gg-steps">
          ${STEPS.map((step, index) => `<li><span class="gg-step-num" aria-hidden="true">${index + 1}</span><h3>${step.title}</h3><p>${step.line}</p></li>`).join("")}
        </ol>
      </div>
    </section>

    <section class="gg-section gg-visit" id="gg-find" aria-label="Visit the workshop">
      <div class="gg-wrap gg-visit-grid">
        <div class="gg-find" data-if="town">
          ${findUs}
          <a class="k-btn k-btn-ghost" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
        </div>
        <div class="gg-hours">
          ${hours("garage", kind)}
        </div>
      </div>
    </section>
  </main>

  <footer class="gg-foot">
    <div class="gg-wrap gg-foot-in">
      <span class="gg-plate" aria-hidden="true"><span data-bind="initials"></span></span>
      <div>
        <p class="gg-foot-name" data-bind="name"></p>
        <p data-bind="describe"></p>
        <p class="gg-foot-small">Example website made by Severn &amp; Tyne. The services listed are examples.</p>
      </div>
    </div>
  </footer>

  <nav class="gg-bar" aria-label="Quick actions">
    <a class="k-btn k-btn-ghost" href="#call" data-call>${ICON_PHONE}<span data-call-label>Call us</span></a>
    <button class="k-btn k-btn-primary" type="button" data-service>Book a service</button>
  </nav>
</div>`;

const CSS = `
html[data-kit=garage]{
  --k-bg:#E9E8E4;--k-surface:#F6F5F2;--k-ink:#1B1E22;--k-ink-2:#4E535A;--k-dark:#1B1E22;
  --k-line:rgba(27,30,34,.14);--k-line-strong:rgba(27,30,34,.32);--k-focus:#1B1E22;--k-sheet-bg:#F6F5F2;
  --k-font-display:"DIN Alternate","Bahnschrift","D-DIN",Roboto,"Segoe UI",sans-serif;
  --k-font-text:"Helvetica Neue","Segoe UI Variable Text","Segoe UI",Roboto,Arial,sans-serif;
  --k-btn-radius:4px;--k-chip-radius:4px;--k-input-radius:4px;--k-sheet-radius:8px;
  --k-sheet-title-font:700 21px/1.2 var(--k-font-display);
  --grid:linear-gradient(rgba(27,30,34,.06) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(27,30,34,.06) 1px,transparent 1px) 0 0/24px 24px;
  background:#E9E8E4;
}
html[data-kit=garage] body{background:#E9E8E4}
.kit-root[data-kit=garage]{background:var(--k-bg);color:var(--k-ink);font:17px/1.55 var(--k-font-text);padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))}
.gg :is(h1,h2,h3,p,dl,dd,figure,ol,ul){margin:0}
.gg a:not(.k-btn){color:inherit}
.gg :focus-visible,html[data-kit=garage] .k-sheet :focus-visible{outline:3px solid var(--k-focus);outline-offset:3px}
.gg main:focus{outline:none}
.gg-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.gg-head{position:sticky;top:var(--strip-h,0px);z-index:40;display:flex;align-items:center;gap:12px;min-height:64px;padding:var(--kit-safe-top,0px) 14px 0 18px;background:var(--k-bg);border-bottom:2px solid var(--k-ink)}
.gg-brand{display:flex;align-items:center;gap:10px;min-width:0;min-height:44px;margin-right:auto;text-decoration:none}
.gg-brand-name>[data-bind=name]{display:block;overflow:hidden;text-overflow:ellipsis}
.gg-brand-name{font:700 19px/1.1 var(--k-font-display);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gg-plate{flex:none;display:grid;place-items:center;min-width:52px;height:30px;padding:0 8px;border-radius:4px;background:var(--accent);color:var(--accent-ink);border:1.5px solid var(--k-ink);font:700 18px/1 var(--k-font-display);letter-spacing:.06em;transition:background-color 220ms ease}
.gg-nav{display:none}
.gg-head-call{min-height:44px;padding:10px 14px}
.gg-hero{background:var(--k-bg);background:var(--grid),var(--k-bg);border-bottom:1px solid var(--k-line-strong)}
.gg-hero-in{display:grid;gap:28px;padding-top:36px;padding-bottom:36px}
.gg-name{font:700 60px/.98 var(--k-font-display);letter-spacing:-.02em;overflow-wrap:anywhere;text-wrap:balance;min-width:0}
.kit-root[data-kit=garage][data-name-length=m] .gg-name{font-size:50px}
.kit-root[data-kit=garage][data-name-length=l] .gg-name{font-size:40px}
.kit-root[data-kit=garage][data-name-length=xl] .gg-name{font-size:31px;line-height:1.05}
.gg-describe{display:inline-block;margin-top:16px;padding:4px 10px;background:var(--k-ink);color:var(--k-bg);font:700 17px/1.3 var(--k-font-display);letter-spacing:.01em}
.gg-tagline{margin-top:12px;color:var(--k-ink-2);max-width:34ch}
.gg-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.gg-actions .k-btn{min-height:52px}
.gg-drawing{color:var(--k-ink)}
.gg-car{display:block;width:100%;height:auto;max-width:640px;margin:0 auto}
.gg-body,.gg-wheels{stroke:var(--k-ink)}
.gg-wheels circle:nth-child(odd){fill:var(--k-surface)}
.gg-body path:first-child{fill:var(--k-surface)}
.gg-ground{stroke:var(--k-ink-2);stroke-width:1.6}
.gg-callouts{stroke:var(--k-ink)}
.gg-dot{fill:var(--accent);stroke:var(--k-ink);stroke-width:1.6;transition:fill 220ms ease}
.gg-labels text{fill:var(--k-ink);font:700 15px var(--k-font-display);stroke:none}
.gg-section{padding:52px 0}
.gg-section h2{font:700 36px/1.05 var(--k-font-display);letter-spacing:-.015em}
.gg-section-head{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;margin-bottom:18px}
.gg-note{font-size:15px;color:var(--k-ink-2)}
.gg-services{list-style:none;padding:0;display:grid;border-top:2px solid var(--k-ink)}
.gg-services li{position:relative;padding:16px 0 16px 26px;border-bottom:1px solid var(--k-line)}
.gg-services li::before{content:"";position:absolute;left:0;top:23px;width:12px;height:12px;background:var(--accent);border:1.5px solid var(--k-ink);transition:background-color 220ms ease}
.gg-services h3{font:700 20px/1.25 var(--k-font-display)}
.gg-services p{color:var(--k-ink-2);font-size:16px}
.gg-problems{background:var(--k-dark);color:var(--k-bg)}
.gg-problems-in{display:grid;gap:24px}
.gg-problems-lead{margin-top:10px!important;color:rgba(233,232,228,.78);max-width:30ch}
.gg-problems-call{margin-top:20px}
.gg-problem-list{list-style:none;padding:0;border-top:1px solid rgba(233,232,228,.2)}
.gg-problem-list li{display:flex;align-items:center;min-height:56px;padding:10px 0;border-bottom:1px solid rgba(233,232,228,.2);font-weight:600;font-size:17px}
.gg-problems :focus-visible{outline-color:var(--k-bg)}
.gg-steps{list-style:none;padding:0;margin-top:24px!important;display:grid;gap:0;position:relative}
.gg-steps li{position:relative;display:grid;grid-template-columns:52px minmax(0,1fr);align-content:start;column-gap:16px;padding-bottom:28px}
.gg-steps li:not(:last-child)::after{content:"";position:absolute;left:25px;top:52px;bottom:4px;border-left:3px dashed var(--k-ink-2)}
.gg-step-num{grid-row:1/span 2;display:grid;place-items:center;width:52px;height:52px;background:var(--accent);color:var(--accent-ink);border:2px solid var(--k-ink);font:700 24px/1 var(--k-font-display);transition:background-color 220ms ease}
.gg-steps h3{font:700 22px/1.2 var(--k-font-display);padding-top:4px}
.gg-steps p{color:var(--k-ink-2);max-width:36ch}
.gg-visit{background:var(--k-surface);border-top:1px solid var(--k-line-strong)}
.gg-visit-grid{display:grid;gap:20px}
.gg-find,.gg-hours{padding:24px;border:1.5px solid var(--k-ink);border-radius:4px;background:var(--k-bg)}
.gg-visit h2{font-size:30px}
.gg-address{margin-top:8px!important;color:var(--k-ink-2);font-size:18px}
.gg-find .k-btn{margin-top:18px}
.gg-hours .gg-note{margin-top:12px!important}
.gg-foot{padding:36px 0 28px;background:var(--k-dark);color:var(--k-bg)}
.gg-foot-in{display:flex;gap:14px;align-items:flex-start}
.gg-foot-name{font:700 22px/1.1 var(--k-font-display);overflow-wrap:anywhere}
.gg-foot p{font-size:15px}
.gg-foot-small{margin-top:12px!important;color:rgba(233,232,228,.75)}
.gg-foot .gg-plate{border-color:var(--k-bg)}
.gg-bar{position:fixed;z-index:45;left:0;right:0;bottom:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:10px max(14px,env(safe-area-inset-right,0px)) calc(10px + env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px));background:var(--k-bg);border-top:2px solid var(--k-ink)}
.gg-bar .k-btn{min-height:52px}
@media (hover:hover) and (pointer:fine){
  .gg-nav a:hover{text-decoration:underline;text-underline-offset:.25em}
  .k-btn-primary:hover{filter:brightness(1.06)}
  .k-btn-ghost:hover{background:var(--k-ink);color:var(--k-bg)}
}
@media (min-width:640px){
  .gg-services{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:40px}
  .gg-visit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (min-width:900px){
  .kit-root[data-kit=garage]{padding-bottom:0}
  .gg-bar{display:none}
  .gg-head{padding-left:max(28px,calc((100% - 1120px)/2 + 20px));padding-right:max(28px,calc((100% - 1120px)/2 + 20px));min-height:76px}
  .gg-nav{display:flex;gap:24px;margin-right:12px}
  .gg-nav a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;padding:0 4px;font-weight:600;text-decoration:none}
  .gg-head-call{padding:10px 20px}
  .gg-hero-in{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:center;gap:48px;min-height:min(600px,calc(100svh - 76px - var(--strip-h,0px)));padding-top:56px;padding-bottom:56px}
  .gg-name{font-size:96px}
  .kit-root[data-kit=garage][data-name-length=m] .gg-name{font-size:78px}
  .kit-root[data-kit=garage][data-name-length=l] .gg-name{font-size:60px}
  .kit-root[data-kit=garage][data-name-length=xl] .gg-name{font-size:46px}
  .gg-describe{font-size:19px}
  .gg-section{padding:84px 0}
  .gg-section h2{font-size:52px}
  .gg-services{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:32px}
  .gg-services li{padding:20px 0 22px 26px}
  .gg-problems-in{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:64px;align-items:start}
  .gg-steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-top:36px!important}
  .gg-steps li{grid-template-columns:minmax(0,1fr);row-gap:14px;padding-bottom:0}
  .gg-step-num{grid-row:auto}
  .gg-steps li:not(:last-child)::after{left:64px;right:-24px;top:25px;bottom:auto;border-left:0;border-top:3px dashed var(--k-ink-2)}
}
@media (prefers-reduced-motion:reduce){
  .gg-plate,.gg-dot,.gg-step-num,.gg-services li::before{transition:none}
}
`;

function render(root, data) {
  addStyles("garage", CSS);
  const services = data.kind.jobs?.map((name) => ({ name })) ?? SERVICES;
  root.innerHTML = template(services, data.kind.problems ?? PROBLEMS, data.kind.id);
  applyData(root, data, kit);
  wireCallNotes(root);
  wireServiceRequests(root, services.map(service => service.name));
}

const kit = {
  id: "garage",
  label: "Garage",
  accents: ACCENTS,
  defaultTagline: "Book a service or tell us what your car is doing.",
  describe: (data) => (data.town ? `Garage in ${data.town}` : "Garage and car repairs"),
  render,
};

export default kit;
