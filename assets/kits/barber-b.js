import { renderIllustrated, call } from "./illustrated.js";
import { wireBooking } from "./barber-flow.js";
import { formatMoney } from "../kit-core.js";

const art = `<svg viewBox="0 0 340 205" class="barber-art" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="1.2" opacity=".65"><path d="M21 140C-2 60 78 9 154 12M24 143C4 63 80 14 152 16M189 188c70-4 124-45 127-100M190 192c72-4 128-49 130-104"/><path d="m47 46 2-7 2 7 6 2-6 2-2 7-2-7-6-2zm238 98 2-7 2 7 6 2-6 2-2 7-2-7-6-2z"/></g>
<g transform="rotate(27 165 105)" stroke="currentColor" stroke-width="2.4"><path d="M75 104q0-4 5-4h125q4 0 4 5v28q0 4-4 4l-2-22H80l-3 22q-4 0-4-5z"/><path d="M81 116v19 M84.6 116v19 M88.2 116v19 M91.8 116v19 M95.4 116v19 M99 116v19 M102.6 116v19 M106.2 116v19 M109.8 116v19 M113.4 116v19 M117 116v19 M120.6 116v19 M124.2 116v16 M127.8 116v16 M131.4 116v16 M135 116v16 M138.6 116v16 M142.2 116v16 M145.8 116v16 M149.4 116v16 M153 116v16 M156.6 116v16 M160.2 116v16 M163.8 116v16 M167.4 116v16 M171 116v16 M174.6 116v16 M178.2 116v16 M181.8 116v16 M185.4 116v16 M189 116v16 M192.6 116v16" stroke-width="1.65"/><path d="M87 108l3-2 M93.3 108l3-2 M99.6 108l3-2 M105.9 108l3-2 M112.2 108l3-2 M118.5 108l3-2 M124.8 108l3-2 M131.1 108l3-2 M137.4 108l3-2 M143.7 108l3-2 M150 108l3-2 M156.3 108l3-2 M162.6 108l3-2 M168.9 108l3-2 M175.2 108l3-2 M181.5 108l3-2" opacity=".7" stroke-width="1"/></g>
<g stroke="currentColor" stroke-linejoin="round"><path d="M171 102C202 73 254 38 293 22c-24 24-74 62-116 89l-9 1z" fill="var(--hero-bg)" stroke-width="2.5"/><path d="M177 106c33-27 69-51 104-75" stroke-width="1.2"/>
<path d="M164 104c39-10 96-21 139-20-29 11-88 22-132 25z" fill="var(--hero-bg)" stroke-width="2.5"/><path d="M178 106c35-8 66-15 109-19"/>
<path d="M170 104c-12 12-36 27-55 37-8 4-8 10-12 15-9 12-30 20-43 10-13-10-1-30 13-39 14-10 26-8 33-6 12 4 35-9 57-20z" fill="var(--hero-bg)" stroke-width="3"/>
<path d="M96 134c9 7-2 20-13 26-9 5-17 5-21-1-4-7 4-18 15-25 8-5 15-6 19 0z" stroke-width="2"/>
<path d="M170 109c-9 14-15 23-18 34-3 9-3 17-10 26-10 13-25 18-35 11-12-9-5-27 4-38 7-9 15-15 25-16 5-1 17-13 26-23z" fill="var(--hero-bg)" stroke-width="3"/>
<path d="M139 139c6 5 2 17-7 27-7 7-15 10-20 6-6-5-2-16 7-26 7-7 14-11 20-7z" stroke-width="2"/><path d="M107 178q-8 10-17 8l-5-4" stroke-width="3"/><circle cx="168" cy="106" r="5.2" fill="var(--hero-bg)" stroke-width="2"/><path d="m166 108 4-4"/></g></svg>`;

const defaultServices = [
  {"id": "cut-finish", "name": "Cut & finish", "minutes": 35, "price": 2400},
  {"id": "skin-fade", "name": "Skin fade", "minutes": 45, "price": 2800},
  {"id": "beard-trim", "name": "Beard trim", "minutes": 20, "price": 1400},
  {"id": "cut-beard", "name": "Cut & beard", "minutes": 55, "price": 3600},
];

export default {
  id: "barber",
  label: "Barber",
  accents: [
    { key: "brass", label: "Brass", value: "#e6c381", ink: "#262b25", text: "#262b25" },
    { key: "sage", label: "Sage", value: "#c3d1a5", ink: "#262b25", text: "#262b25" },
    { key: "linen", label: "Linen", value: "#e4d6b6", ink: "#262b25", text: "#262b25" }
  ],
  defaultTagline: "Cuts, fades & beard trims.",
  describe: (data) => data.town ? `Barbershop in ${data.town}` : "Barbershop",
  render(root, data) {
    const services = data.kind.services ?? defaultServices;
    const isBarber = data.kind.id === "barber";
    const rows = services.map((service) => `
      <li><button type="button" data-book="${service.id}" aria-label="Book ${service.name}">
        <span>${service.name}<small>${service.minutes} minutes</small></span><b>${formatMoney(service.price, { alwaysPence: false })}</b>
      </button></li>`).join("");
    renderIllustrated(root, data, this, {
      nav: 'Services', art,
      section:`<div class="section-head"><h2>${isBarber ? "The cut list" : "Grooming services"}</h2><p>Example prices</p></div><ul class="service-list">${rows}</ul>`,
      sticky:call + `<button type="button" class="kit-primary" data-book>${isBarber ? "Book a cut" : "Book a service"}</button>`
    });
    wireBooking(root, services);
  }
};
