import { h, openSheet, updateSheet, closeSheet, dateTimePicker, exampleFreeTimes, detailsForm, formatLongDate, cleanText } from "../kit-core.js";
import { withinHours } from "./visit.js";

const diary = { open: 8 * 60, close: 17 * 60, step: 30, seed: "workshop" };

export function wireServiceRequests(root, jobs) {
  const mobile = root.dataset.kind === "mobile-mechanic";
  root.addEventListener("click", event => {
    if (!event.target.closest("[data-service]")) return;
    let job, slot;
    let customer = {};
    const submit = (label, action) => h("button", { type: "button", class: "k-btn k-btn-primary", onclick: action }, label);

    function chooseJob() {
      const choices = jobs.map(name => submit(name, () => {
        job = name;
        slot = null;
        chooseTime();
      }));
      openSheet({ title: mobile ? "Request a visit" : "Book a service", body: h("div", {}, h("p", {}, "Choose the job type for this example request."),
        h("div", { class: "service-choices" }, ...choices)) });
    }

    function chooseTime() {
      const picker = dateTimePicker({
        value: slot,
        freeTimesFor: date => withinHours(exampleFreeTimes(date, diary), date, "garage", root.dataset.kind),
        onChange: value => { slot = value; },
      });
      slot = picker.value();
      updateSheet({ title: "Pick a day and time", onBack: chooseJob,
        body: h("div", {}, h("p", { class: "service-summary" }, job), picker.node,
          h("div", { class: "k-sheet-foot" }, submit("Continue", enterDetails))) });
    }

    function enterDetails() {
      const plate = h("input", { name: "plate", class: "k-input", maxlength: 12, autocapitalize: "characters", value: customer.plate ?? "" });
      if (mobile) { plate.required = true; plate.pattern = ".*[A-Za-z0-9].*"; }
      const area = mobile && h("input", { name:"area", class:"k-input", required:true, maxlength:4,
        pattern:"[A-Za-z]{1,2}[0-9][A-Za-z0-9]?", placeholder:"e.g. NE1", autocapitalize:"characters", value:customer.area ?? "" });
      const when = `${formatLongDate(slot.date)} at ${slot.time}`;
      const form = detailsForm({
        initial: customer, submitLabel: "Prepare request", note: "Example only. Nothing is sent.",
        onSubmit: details => {
          const registration = cleanText(plate.value, 12).toUpperCase();
          const row = (label, value) => [h("dt", {}, label), h("dd", {}, value)];
          const summary = h("dl", { class: "service-request" }, ...row("Job", job), ...row("Requested slot", when),
            ...row("Name", details.name), ...row("Mobile", details.mobile), ...(registration ? row("Registration", registration) : []), ...(mobile ? row("Postcode area", area.value.toUpperCase()) : []));
          updateSheet({ title: "Request ready", body: h("div", {}, h("p", {}, root.kitData.name), summary,
            h("p", {}, "Example request. Nothing was sent or booked."), h("div", { class: "k-sheet-foot" }, submit("Done", () => closeSheet()))) });
        },
      });
      form.querySelector(".k-sheet-foot").before(h("label", { class: "k-field" }, mobile ? "Registration plate" : "Registration plate (optional)", plate));
      if (mobile) form.querySelector(".k-sheet-foot").before(h("label", {class:"k-field"}, "Postcode area", area));
      updateSheet({ title: "Your details", body: h("div", {}, h("p", { class: "service-summary" }, `${job} · ${when}`), form),
        onBack: () => { customer = Object.fromEntries(new FormData(form)); chooseTime(); } });
    }

    chooseJob();
  });
}
