import { nextCollection, withinHours } from "./visit.js";
import { addStyles, h, openSheet, updateSheet, closeSheet, dateTimePicker, exampleFreeTimes, detailsForm, formatMoney, formatLongDate, announce, hashString } from "../kit-core.js";

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const LUNCH = { open: 12 * 60, close: 14 * 60, step: 30, busyShare: 0.3, seed: "lunch" };
const DINNER = { open: 17 * 60 + 30, close: 21 * 60, step: 30, busyShare: 0.4, seed: "dinner" };

const money = (pence) => formatMoney(pence);
const ICON_PLUS =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MINUS =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>';

const SHEET_CSS = `
.rs-step{display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:12px;background:var(--accent);color:var(--accent-ink)}
.rs-step button{display:grid;place-items:center;width:44px;height:44px;border:0;border-radius:10px;background:transparent;color:inherit;cursor:pointer;transition:transform 120ms var(--k-ease-out)}
.rs-step output{min-width:22px;text-align:center;font:700 17px/1 var(--k-font-text);font-variant-numeric:tabular-nums}
.rs-sheet-items{list-style:none;margin:0;padding:0}
.rs-sheet-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--k-line)}
.rs-sheet-item strong{font:700 18px/1.25 var(--k-font-display)}
.rs-sheet-item>span{grid-column:1;color:var(--k-ink-2);font-size:15px;font-variant-numeric:tabular-nums}
.rs-sheet-item .rs-step{grid-row:1/span 2;grid-column:2}
.rs-total{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 18px;font:700 22px/1 var(--k-font-display);font-variant-numeric:tabular-nums lining-nums}
.rs-subhead{margin:6px 0 12px!important;font:700 19px/1.2 var(--k-font-display)}
.rs-empty{text-align:center;padding:24px 0}
.rs-empty p{color:var(--k-ink-2);margin-bottom:16px!important}
.rs-party{border:0;margin:0 0 18px;padding:0}
.rs-party legend{padding:0;margin-bottom:8px;font-weight:600;font-size:15px}
.rs-party-row{display:flex;flex-wrap:wrap;gap:8px}
.rs-party-row label{position:relative}
.rs-party-row input{position:absolute;opacity:0;width:1px;height:1px}
.rs-party-row span{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1.5px solid var(--k-line-strong);background:var(--k-surface);font:700 17px/1 var(--k-font-text);cursor:pointer;-webkit-user-select:none;user-select:none;transition:background-color 140ms ease,border-color 140ms ease}
.rs-party-row input:checked+span{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.rs-party-row input:focus-visible+span{outline:3px solid var(--k-focus);outline-offset:2px}
.rs-foot-line{display:flex;align-items:center;gap:12px}
.rs-foot-line p{flex:1;min-width:0;font-weight:600;line-height:1.3}
.rs-foot-line p span{display:block;font-weight:400;font-size:14px;color:var(--k-ink-2)}
.rs-receipt-slot{position:relative;padding:22px 18px 26px;border-radius:16px;background:#EFE6D6}
.rs-receipt-slot::before{content:"";position:absolute;left:12px;right:12px;top:14px;height:9px;border-radius:9px;background:var(--k-ink)}
.rs-receipt{position:relative;margin:0 8px;padding:22px 20px 30px;background:#fff;color:#2A211B;box-shadow:0 10px 24px -14px rgba(42,33,27,.5);font-variant-numeric:tabular-nums lining-nums;-webkit-mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/16px 100%;mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/16px 100%;animation:rs-print 520ms var(--k-ease-out) both}
.rs-receipt-name{font:700 22px/1.15 var(--k-font-display);text-align:center;overflow-wrap:anywhere}
.rs-receipt-meta{text-align:center;font-size:14px;color:#64574C;margin-top:4px!important}
.rs-receipt ul{list-style:none;margin:16px 0 0;padding:12px 0 0;border-top:1.5px dashed rgba(42,33,27,.35)}
.rs-receipt li{display:flex;justify-content:space-between;gap:12px;padding:4px 0;font-size:15px}
.rs-receipt li span:first-child{min-width:0;overflow-wrap:anywhere}
.rs-receipt-total{display:flex;justify-content:space-between;margin-top:10px!important;padding-top:10px;border-top:1.5px dashed rgba(42,33,27,.35);font:700 19px/1 var(--k-font-display)}
.rs-receipt-who{margin-top:14px!important;font-size:15px;text-align:center;overflow-wrap:anywhere}
.rs-confirm-note{margin-top:16px!important;color:var(--k-ink-2);font-size:15px;text-align:center}
@keyframes rs-print{from{transform:translateY(-36px);clip-path:inset(36px 0 0 0)}to{transform:none;clip-path:inset(0 0 0 0)}}
.rs-receipt-actions{display:flex;gap:10px;justify-content:flex-end}
@media screen and (max-width:740px){html[data-kit=restaurant] .rs-print{display:none}}
@media print {
  html:has(.rs-receipt) body{padding:0;background:white}
  body:has(.rs-receipt) > :not(.k-sheet-layer){display:none!important}
  .k-sheet-layer:has(.rs-receipt),.k-sheet:has(.rs-receipt),.k-sheet-body:has(.rs-receipt){display:block;position:static;overflow:visible;max-height:none;box-shadow:none;padding:0}
  .k-sheet-layer:has(.rs-receipt) :is(.k-sheet-head,.k-sheet-foot,.k-sheet-scrim,.rs-confirm-note){display:none}
  .rs-receipt-slot::before{display:none}
  .rs-receipt-slot,.rs-receipt{background:white;box-shadow:none;mask:none;animation:none}
}
@media (prefers-reduced-motion:reduce){.rs-receipt{animation:none}}
`;

function createBasket(root, menu) {
  const itemsById = new Map(menu.map((item) => [item.id, item]));
  const quantities = new Map();
  const count = () => [...quantities.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = () => [...quantities].reduce((sum, [id, quantity]) => sum + itemsById.get(id).price * quantity, 0);
  const lines = () => [...quantities].filter(([, quantity]) => quantity > 0).map(([id, quantity]) => ({ item: itemsById.get(id), quantity }));

  function setQuantity(id, quantity) {
    const next = Math.max(0, Math.min(20, quantity));
    if (next === 0) quantities.delete(id);
    else quantities.set(id, next);
    refresh();
  }

  function stepper(id, { onChange } = {}) {
    const item = itemsById.get(id);
    const quantity = quantities.get(id) ?? 0;
    return h(
      "div",
      { class: "rs-step" },
      h("button", { type: "button", "aria-label": `Remove one ${item.name}`, html: ICON_MINUS, onclick: () => { setQuantity(id, quantity - 1); onChange?.(); announce(`${item.name}: ${quantities.get(id) ?? 0}. Order total ${money(total())}.`); } }),
      h("output", { "aria-label": `${quantity} ${item.name} in your order`, text: String(quantity) }),
      h("button", { type: "button", "aria-label": `Add one more ${item.name}`, html: ICON_PLUS, onclick: () => { setQuantity(id, quantity + 1); onChange?.(); announce(`${item.name}: ${quantities.get(id)}. Order total ${money(total())}.`); } }),
    );
  }

  function renderControl(slot) {
    const id = slot.dataset.item;
    const item = itemsById.get(id);
    const quantity = quantities.get(id) ?? 0;
    const hadFocus = slot.contains(document.activeElement) ? document.activeElement.getAttribute("aria-label") : null;
    if (quantity === 0) {
      slot.replaceChildren(
        h(
          "button",
          {
            type: "button",
            class: "rs-add",
            "aria-label": `Add ${item.name}, ${money(item.price)}`,
            onclick: () => {
              setQuantity(id, 1);
              announce(`Added ${item.name}. ${count()} in your order, ${money(total())}.`);
            },
          },
          h("span", { html: ICON_PLUS }),
          "Add",
        ),
      );
    } else {
      slot.replaceChildren(stepper(id));
    }
    if (hadFocus) {
      const target = [...slot.querySelectorAll("button")].find((button) => button.getAttribute("aria-label") === hadFocus) ?? slot.querySelector("button");
      target?.focus();
    }
  }

  function refresh() {
    for (const slot of root.querySelectorAll(".rs-qty")) renderControl(slot);
    const items = count();
    const bar = root.querySelector(".rs-bar");
    const orderButton = root.querySelector(".rs-bar-order");
    bar.dataset.empty = String(items === 0);
    orderButton.hidden = items === 0;
    root.querySelector(".rs-bar-book").hidden = items > 0;
    orderButton.querySelector(".rs-bar-count").textContent = String(items);
    orderButton.querySelector(".rs-bar-total").textContent = money(total());
    orderButton.setAttribute("aria-label", `View order, ${items} ${items === 1 ? "item" : "items"}, ${money(total())}`);
  }

  function clear() {
    quantities.clear();
    refresh();
  }

  return { count, total, lines, stepper, refresh, clear };
}

function createOrderFlow(root, basket) {
  const isShop = root.dataset.kit === "shop";
  let customer = null;

  function summaryBody() {
    if (!basket.count()) {
      return h(
        "div",
        { class: "rs-empty" },
        h("p", { text: isShop ? "Your basket is empty. Add something from the counter." : "Your order is empty. Add dishes from the menu." }),
        h("button", { type: "button", class: "k-btn k-btn-primary", onclick: () => closeSheet() }, isShop ? "Back to the counter" : "Back to the menu"),
      );
    }
    const redraw = () => updateSheet({ title: "Your order", body: summaryBody(), onBack: null });
    const list = h(
      "ul",
      { class: "rs-sheet-items" },
      ...basket.lines().map(({ item, quantity }) =>
        h("li", { class: "rs-sheet-item" }, h("strong", { text: item.name }), h("span", { text: `${quantity} x ${money(item.price)} = ${money(item.price * quantity)}` }), basket.stepper(item.id, { onChange: redraw })),
      ),
    );
    const form = detailsForm({
      submitLabel: `Place example order, ${money(basket.total())}`,
      note: "Example only. Nothing is sent.",
      initial: customer ?? {},
      onSubmit: (details) => {
        customer = details;
        receipt();
      },
    });
    form.addEventListener("input", () => {
      customer = { name: form.elements.name.value, mobile: form.elements.mobile.value };
    });
    return h("div", {}, list, h("p", { class: "rs-total" }, h("span", { text: "Total" }), h("span", { class: "rs-total-value", text: money(basket.total()) })), h("h3", { class: "rs-subhead", text: "Collection details" }), form);
  }

  function receipt() {
    const shop = root.kitData;
    const lines = basket.lines();
    const total = basket.total();
    const {ready: collection, day} = nextCollection(root.dataset.kit, shop.kind.id);
    const clock = collection.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const reference = String(1000 + (hashString(`${Date.now()}`) % 9000));
    const body = h(
      "div",
      {},
      h(
        "div",
        { class: "rs-receipt-slot" },
        h(
          "div",
          { class: "rs-receipt" },
          h("p", { class: "rs-receipt-name", text: shop.name }),
          h("p", { class: "rs-receipt-meta", text: `Collection order ${reference}, example` }),
          h("ul", {}, ...lines.map(({ item, quantity }) => h("li", {}, h("span", { text: `${quantity} x ${item.name}` }), h("span", { text: money(item.price * quantity) })))),
          h("p", { class: "rs-receipt-total" }, h("span", { text: "Total" }), h("span", { class: "rs-receipt-total-value", text: money(total) })),
          h("p", { class: "rs-collection-time" }, "Collect", day, " at ", h("time", { datetime: collection.toISOString(), text: clock })),
          h("p", { class: "rs-receipt-who", text: `For ${customer.name}` }),
        ),
      ),
      h("p", { class: "rs-confirm-note", text: "This is an example order. Nothing was sent." }),
      h("div", { class: "k-sheet-foot rs-receipt-actions" },
        h("button", { type: "button", class: "k-btn k-btn-ghost rs-print", onclick: () => window.print() }, "Print receipt"),
        h("button", { type: "button", class: "k-btn k-btn-primary", onclick: () => closeSheet() }, "Done"),
      ),
    );
    updateSheet({ title: "Order placed", body, onBack: null });
    basket.clear();
    announce(`Order placed, ${money(total)}. Example only, nothing was sent.`);
  }

  return {
    open() {
      openSheet({ title: "Your order", body: summaryBody(), onBack: null });
    },
  };
}

function createTableFlow(root) {
  const state = { party: 2, slot: null, customer: null };
  let isOpen = false;

  function show(step) {
    if (isOpen) updateSheet(step);
    else {
      openSheet({ ...step, onClose: () => (isOpen = false) });
      isOpen = true;
    }
  }

  function chooseStep() {
    const footText = h("p");
    const continueButton = h("button", { type: "button", class: "k-btn k-btn-primary", onclick: () => state.slot?.time && detailsStep() }, "Continue");
    const updateFoot = () => {
      const { date, time } = state.slot ?? {};
      footText.replaceChildren(time ? `${formatLongDate(date)}, ${time}` : "Pick a time", h("span", { text: `Table for ${state.party}` }));
      continueButton.disabled = !time;
    };
    const party = h(
      "fieldset",
      { class: "rs-party" },
      h("legend", { text: "How many people?" }),
      h(
        "div",
        { class: "rs-party-row" },
        ...PARTY_SIZES.map((size) => {
          const input = h("input", {
            type: "radio",
            name: "rs-party",
            value: String(size),
            checked: size === state.party,
            "aria-label": `${size} ${size === 1 ? "person" : "people"}`,
            onchange: () => {
              state.party = size;
              updateFoot();
            },
          });
          return h("label", {}, input, h("span", { "aria-hidden": "true", text: String(size) }));
        }),
      ),
    );
    const picker = dateTimePicker({
      days: 14,
      value: state.slot,
      freeTimesFor: (date) => withinHours([...exampleFreeTimes(date, LUNCH), ...exampleFreeTimes(date, DINNER)], date, "restaurant", root.dataset.kind),
      onChange: (slot) => {
        state.slot = slot;
        updateFoot();
      },
    });
    state.slot = picker.value();
    updateFoot();
    const body = h("div", {}, h("p", { class: "rs-note", style: "margin:-4px 0 14px", text: "Example times. The first free one is picked for you." }), party, picker.node, h("div", { class: "k-sheet-foot" }, h("div", { class: "rs-foot-line" }, footText, continueButton)));
    show({ title: "Book a table", body, onBack: null });
  }

  function detailsStep() {
    const { date, time } = state.slot;
    const form = detailsForm({
      submitLabel: "Book this table",
      note: "Example only. Nothing is sent.",
      initial: state.customer ?? {},
      onSubmit: (customer) => {
        state.customer = customer;
        confirmedStep();
      },
    });
    const body = h("div", {}, h("p", { class: "rs-subhead", text: `Table for ${state.party}, ${formatLongDate(date)} at ${time}` }), form);
    show({ title: "Your details", body, onBack: chooseStep });
  }

  function confirmedStep() {
    const shop = root.kitData;
    const { date, time } = state.slot;
    const body = h(
      "div",
      {},
      h(
        "div",
        { class: "rs-receipt-slot" },
        h(
          "div",
          { class: "rs-receipt" },
          h("p", { class: "rs-receipt-name", text: shop.name }),
          h("p", { class: "rs-receipt-meta", text: "Table booking, example" }),
          h(
            "ul",
            {},
            h("li", {}, h("span", { text: "Day" }), h("span", { text: formatLongDate(date) })),
            h("li", {}, h("span", { text: "Time" }), h("span", { text: time })),
            h("li", {}, h("span", { text: "Table for" }), h("span", { text: String(state.party) })),
          ),
          h("p", { class: "rs-receipt-who", text: `Booked by ${state.customer.name}` }),
        ),
      ),
      h("p", { class: "rs-confirm-note", text: "This is an example booking. Nothing was sent." }),
      h("div", { class: "k-sheet-foot" }, h("button", { type: "button", class: "k-btn k-btn-primary k-btn-wide", onclick: () => closeSheet() }, "Done")),
    );
    show({ title: "Table booked", body, onBack: null });
    announce(`Table booked for ${state.party}, ${formatLongDate(date)} at ${time}. Example only.`);
  }

  return {
    open() {
      state.slot = null;
      chooseStep();
    },
  };
}

export function wireDining(root, menu) {
  addStyles("restaurant-flow", SHEET_CSS);
  const basket = createBasket(root, menu);
  basket.refresh();
  const order = createOrderFlow(root, basket);
  const table = createTableFlow(root);
  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-order]")) order.open();
    else if (event.target.closest("[data-table]")) table.open();
  });
}
