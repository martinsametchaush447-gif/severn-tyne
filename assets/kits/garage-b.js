import { workshopArt } from "./workshop-art.js";
import { wireServiceRequests } from "./garage-flow.js";
import { renderIllustrated, call } from "./illustrated.js";

const art = `<svg viewBox="0 0 380 235" fill="none" stroke="currentColor" stroke-linejoin="round"><g opacity=".42" stroke-width="1"><path d="M31 39h318M30 196h319M61 20v196M324 20v195" stroke-dasharray="3 7"/><path d="M35 196 321 40M35 184v20m-10-9h22M324 29v21m-10-11h20"/></g><g transform="translate(196 115) rotate(61)" stroke-width="2.4" fill="var(--hero-bg)">
<path d="M-10-117q10-8 20 0v18l-4 6v10H-6v-10l-4-6z"/><path d="M-10-112q10 5 20 0m-19 8q9 5 18 0" stroke-width="1"/>
<path d="M-9-85h18v13h-18z"/><path d="M-14-75q14 5 28 0v68l-3 8h-22l-3-8z"/>
<path d="M-14 -71q14 4 28 0q7 2 1 7-15 5-30 0-5-4 1-7z"/><path d="M-14 -62q14 4 28 0q7 2 1 7-15 5-30 0-5-4 1-7z"/><path d="M-14 -53q14 4 28 0q7 2 1 7-15 5-30 0-5-4 1-7z"/><path d="M-14 -44q14 4 28 0q7 2 1 7-15 5-30 0-5-4 1-7z"/><path d="M-14 -35q14 4 28 0q7 2 1 7-15 5-30 0-5-4 1-7z"/><path d="M-14 -26q14 4 28 0q7 2 1 7-15 5-30 0-5-4 1-7z"/>
<path d="M-15-9q15 6 30 0v16q-15 7-30 0z"/><path d="M-21 4l12-4 19 1 12 5v18l-12 7-21-2-10-7z"/><path d="m-21 5 11 6 20 1 12-6m-12 6v18m-20-19v18"/><path d="M-17 26q17 8 34 0v7q-17 9-34 0z"/><path d="M-14 35q14 5 28-1v54l-7 5h-15l-6-6z"/>
<path d="m-14 40 28-6" stroke-width="2"/><path d="m-14 45 28-6" stroke-width="2"/><path d="m-14 50 28-6" stroke-width="2"/><path d="m-14 55 28-6" stroke-width="2"/><path d="m-14 60 28-6" stroke-width="2"/><path d="m-14 65 28-6" stroke-width="2"/><path d="m-14 70 28-6" stroke-width="2"/><path d="m-14 75 28-6" stroke-width="2"/><path d="m-14 80 28-6" stroke-width="2"/>
<path d="M-7 91v13h8V92m8-2v19h-12v4h18V88z"/><path d="M-5-67v43m-1 17v12m-9 10v11m20-11v11" stroke-width="1"/></g><g stroke-width="1.1"><path d="M69 163 48 153H26m254-90 21 18h42M104 187l-10 17H48"/><circle cx="69" cy="163" r="2"/><circle cx="280" cy="63" r="2"/></g></svg>`;


export default {
  id: "garage",
  label: "Garage",
  accents: [
    { key: "signal", label: "Signal", value: "#f1ae68", ink: "#25343a", text: "#25343a" },
    { key: "chalk", label: "Chalk", value: "#cdd9c4", ink: "#25343a", text: "#25343a" },
    { key: "steel", label: "Steel", value: "#b1d7e3", ink: "#25343a", text: "#25343a" }
  ],
  defaultTagline: "Servicing, diagnostics and repairs.",
  describe: (data) => data.town ? `Motor workshop in ${data.town}` : "Motor workshop",
  render(root, data) {
    const services = data.kind.jobs
      ? `<ul class="repair-list">${data.kind.jobs.map((name) => `<li>${name}</li>`).join("")}</ul>`
      : `<dl class="repair-list"><div><dt>Brakes</dt><dd>Pads, discs and braking faults.</dd></div>
      <div><dt>Servicing</dt><dd>Oil, filters and routine checks.</dd></div>
      <div><dt>Diagnostics</dt><dd>Warning lights and running problems.</dd></div>
      <div><dt>Suspension</dt><dd>Springs, dampers and worn joints.</dd></div></dl>`;
    const problems = data.kind.problems ?? ["A warning light on the dashboard", "A knock over bumps", "Brakes squealing", "A car that struggles to start"];
    renderIllustrated(root, data, this, {
      nav: 'Repairs', art: workshopArt(data.kind.id, true, art),
      section:`<div class="section-head"><h2>What we fix</h2><p>Example services</p></div>${services}`,
      content:`<section class="workshop"><div class="shop-wrap workshop-grid"><div><h2>Common problems</h2><ul>${problems.map((problem) => `<li>${problem}</li>`).join("")}</ul></div>
      <div><h2>How it works</h2><ol><li><strong>Call the workshop</strong><p>Tell us what you’ve noticed.</p></li><li><strong>Diagnosis and quote</strong><p>We check the fault and talk through the price.</p></li><li><strong>Agree the repair</strong><p>We carry out the work you approve.</p></li></ol></div></div></section>`,
      sticky:call + '<button class="kit-primary" type="button" data-service>Book a service</button>'
    });
    wireServiceRequests(root, data.kind.jobs ?? ["Brakes", "Servicing", "Diagnostics", "Suspension"]);
  }
};
