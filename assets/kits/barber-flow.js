import { withinHours } from "./visit.js";
import { addStyles, h, openSheet, updateSheet, closeSheet, dateTimePicker, exampleFreeTimes, detailsForm, formatMoney, formatLongDate, announce } from "../kit-core.js";

const DIARY = { open: 9 * 60, close: 17 * 60 + 30, step: 30, busyShare: 0.38, seed: "barber" };
const price = (pence) => formatMoney(pence, { alwaysPence: false });

const SHEET_CSS = `
.bb-card .bb-mono{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--accent);color:var(--accent-ink);font:800 16px/1 var(--k-font-display);font-stretch:75%;letter-spacing:.02em;box-shadow:inset 0 0 0 2px var(--k-bg),inset 0 0 0 3.5px var(--accent);transition:background-color 220ms ease}
.bb-sheet-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.bb-pick{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center;width:100%;min-height:68px;padding:12px 16px;border:1.5px solid var(--k-line-strong);border-radius:8px;background:#fff;color:var(--k-ink);text-align:left;font:inherit;cursor:pointer;transition:border-color 140ms ease,transform 120ms var(--k-ease-out)}
.bb-pick:active{transform:scale(.98)}
.bb-pick strong{font-size:17px}
.bb-pick span{grid-column:1;font-size:15px;color:var(--k-ink-2)}
.bb-pick b{grid-row:1/3;grid-column:2;font:800 22px/1 var(--k-font-display);font-stretch:75%}
.bb-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;margin-bottom:18px;border-radius:8px;background:var(--k-bg)}
.bb-summary p{font-weight:600}
.bb-summary span{display:block;font-weight:400;font-size:15px;color:var(--k-ink-2)}
.bb-link{min-height:44px;padding:0 6px;border:0;background:none;color:var(--k-ink);font:600 15px/1 var(--k-font-text);text-decoration:underline;text-underline-offset:.2em;cursor:pointer}
.bb-note-line{margin:-6px 0 12px;font-size:14px;color:var(--k-ink-2)}
.bb-foot-line{display:flex;align-items:center;gap:12px}
.bb-foot-line p{flex:1;min-width:0;font-weight:600;line-height:1.3}
.bb-foot-line p span{display:block;font-weight:400;font-size:14px;color:var(--k-ink-2)}
.bb-card{position:relative;margin:6px 0 4px;padding:28px 22px 20px;background:#fff;border:1.5px solid var(--k-ink);border-radius:6px;box-shadow:0 16px 28px -18px rgba(30,28,26,.55);animation:bb-card-in 320ms var(--k-ease-out) both}
.bb-card::before{content:"";position:absolute;left:-1.5px;right:-1.5px;top:-1.5px;height:8px;border-radius:6px 6px 0 0;background:repeating-linear-gradient(-45deg,var(--accent) 0 7px,#fff 7px 12px)}
.bb-card-head{display:flex;align-items:center;gap:10px;padding-bottom:14px;margin-bottom:14px;border-bottom:1px dashed var(--k-line-strong)}
.bb-card-head p{font:800 22px/1 var(--k-font-display);font-stretch:75%;text-transform:uppercase;overflow-wrap:anywhere;min-width:0}
.bb-card dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px 16px;margin:0}
.bb-card dt{color:var(--k-ink-2);font-size:15px}
.bb-card dd{margin:0;font-weight:600;overflow-wrap:anywhere}
.bb-confirm-note{margin-top:16px;color:var(--k-ink-2);font-size:15px}
@keyframes bb-card-in{from{opacity:0;transform:translateY(14px) rotate(-1deg)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.bb-card{animation:none}}
`;

function createBooking(root, services) {
  const serviceById = (id) => services.find((service) => service.id === id);
  const groom = root.kitData.kind.id === "dog-groomer";
  const consultation = root.kitData.kind.id === "tattoo";
  const withPrice = (text, service) => consultation || service.price == null ? text : `${text}, ${price(service.price)}`;
  const state = { serviceId: null, slot: null, customer: null };
  const business = () => root.kitData;

  function serviceStep() {
    const list = h(
      "ul",
      { class: "bb-sheet-list" },
      ...services.map((service) =>
        h(
          "li",
          {},
          h(
            "button",
            {
              type: "button",
              class: "bb-pick",
              onclick: () => {
                state.serviceId = service.id;
                state.slot = null;
                timeStep();
              },
            },
            h("strong", { text: service.name }),
            h("span", { text: `${service.minutes} min` }),
            !consultation && service.price != null && h("b", { text: price(service.price) }),
          ),
        ),
      ),
    );
    const body = h("div", {}, h("p", { class: "bb-note-line", text: consultation ? "Example consultations. Priced per piece: ask at your consultation." : "Example services and prices" }), list);
    return { title: consultation ? "Book a consultation" : "Choose a service", body, onBack: null };
  }

  function timeStep() {
    const service = serviceById(state.serviceId);
    const footText = h("p");
    const setFoot = ({ date, time }) => {
      state.slot = { date, time };
      footText.replaceChildren(
        time ? `${formatLongDate(date)}, ${time}` : "Pick a time",
        h("span", { text: withPrice(service.name, service) }),
      );
      continueButton.disabled = !time;
    };
    const continueButton = h("button", { type: "button", class: "k-btn k-btn-primary", onclick: () => state.slot?.time && detailsStep() }, "Continue");
    const picker = dateTimePicker({
      days: 14,
      value: state.slot,
      freeTimesFor: (date) => withinHours(exampleFreeTimes(date, DIARY), date, root.dataset.kit, root.dataset.kind),
      onChange: setFoot,
    });
    setFoot(picker.value());
    const body = h(
      "div",
      {},
      h(
        "div",
        { class: "bb-summary" },
        h("p", {}, service.name, h("span", { text: withPrice(`${service.minutes} min`, service) })),
        h("button", { type: "button", class: "bb-link", onclick: () => show(serviceStep()) }, "Change"),
      ),
      h("p", { class: "bb-note-line", text: "Example times. The first free one is picked for you." }),
      picker.node,
      h("div", { class: "k-sheet-foot" }, h("div", { class: "bb-foot-line" }, footText, continueButton)),
    );
    show({ title: "Pick a time", body, onBack: () => show(serviceStep()) });
  }

  function detailsStep() {
    const service = serviceById(state.serviceId);
    const { date, time } = state.slot;
    const form = detailsForm({
      submitLabel: consultation ? "Confirm consultation" : "Confirm booking",
      note: "Example only. Nothing is sent.",
      initial: state.customer ?? {}, nameLabel: groom ? "Owner name" : "Your name",
      onSubmit: (customer) => {
        state.customer = { ...Object.fromEntries(new FormData(form)), ...customer };
        confirmedStep();
      },
    });
    if (groom) {
      const dog = h("input", { class:"k-input", name:"dog", required:true, maxlength:40, pattern:".*\\S.*", value:state.customer?.dog ?? "" });
      const size = h("select", { class:"k-input", name:"size", required:true },
        h("option", { value:"" }, "Choose a size"), ...["Small", "Medium", "Large", "Giant"].map(label => h("option", {}, label)));
      size.value = state.customer?.size ?? "";
      form.querySelector(".k-sheet-foot").before(h("label", { class:"k-field" }, "Dog’s name", dog), h("label", { class:"k-field" }, "Breed size", size));
    }
    const body = h(
      "div",
      {},
      h("div", { class: "bb-summary" }, h("p", {}, `${formatLongDate(date)}, ${time}`, h("span", { text: withPrice(`${service.name}, ${service.minutes} min`, service) }))),
      form,
    );
    show({ title: "Your details", body, onBack: () => { state.customer = Object.fromEntries(new FormData(form)); timeStep(); } });
  }

  function confirmedStep() {
    const service = serviceById(state.serviceId);
    const { date, time } = state.slot;
    const shop = business();
    const row = (label, value) => [h("dt", { text: label }), h("dd", { text: value })];
    const card = h(
      "div",
      { class: "bb-card" },
      h(
        "div",
        { class: "bb-card-head" },
        h("span", { class: "bb-mono", "aria-hidden": "true" }, h("span", { text: root.querySelector('[data-bind="initials"]')?.textContent ?? "" })),
        h("p", { text: shop.name }),
      ),
      h("dl", {}, ...row(consultation ? "Consultation" : "Service", service.name), ...row("Day", formatLongDate(date)), ...row("Time", time), ...row(groom ? "Owner" : "Name", state.customer.name), ...(groom ? [...row("Dog", state.customer.dog), ...row("Breed size", state.customer.size)] : [])),
    );
    const body = h(
      "div",
      { class: "bb-confirmed" },
      card,
      h("p", { class: "bb-confirm-note", text: "This is an example booking. Nothing was sent to anyone." }),
      h("div", { class: "k-sheet-foot" }, h("button", { type: "button", class: "k-btn k-btn-primary k-btn-wide", onclick: () => closeSheet() }, "Done")),
    );
    show({ title: "Confirmed", body, onBack: null });
    announce(`Confirmed. ${service.name}, ${formatLongDate(date)} at ${time}. Example only, nothing was sent.`);
  }

  let isOpen = false;
  function show(step) {
    if (isOpen) updateSheet(step);
    else {
      openSheet({ ...step, onClose: () => (isOpen = false) });
      isOpen = true;
    }
  }

  return {
    open(serviceId) {
      state.customer = null;
      state.slot = null;
      if (serviceId && serviceById(serviceId)) {
        state.serviceId = serviceId;
        timeStep();
      } else {
        show(serviceStep());
      }
    },
  };
}

export function wireBooking(root, services) {
  addStyles("barber-flow", SHEET_CSS);
  const booking = createBooking(root, services);
  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-book]");
    if (!trigger) return;
    booking.open(trigger.dataset.book);
  });
}
