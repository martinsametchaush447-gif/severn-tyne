import { announce, cleanText, closeSheet, detailsForm, h, openSheet, updateSheet } from "../kit-core.js";

export function wireQuotes(root, jobs) {
  root.addEventListener("click", event => {
    const trigger = event.target.closest("[data-quote]");
    if (!trigger) return;
    const draft = {job:"", description:"", postcode:"", customer:{}};

    function jobTypes() {
      const buttons = jobs.map(job => h("button", {
        type:"button", class:"quote-job", text:job, onclick:() => {
          draft.job = job;
          updateSheet(jobDetails());
        },
      }));
      return {title:"Get a quote", body:h("div", {},
        h("p", {class:"quote-note", text:"Example request. What sort of job is it?"}),
        h("div", {class:"quote-jobs"}, ...buttons)), onBack:null};
    }

    function jobDetails() {
      const description = h("textarea", {class:"k-input", name:"description", id:"quote-description",
        required:true, maxlength:350, rows:3, oninput:() => {
          description.setCustomValidity("");
          draft.description = description.value;
        }});
      description.value = draft.description;
      const postcode = h("input", {class:"k-input", name:"postcode", id:"quote-postcode",
        required:true, maxlength:9, value:draft.postcode, placeholder:"e.g. NE1", autocapitalize:"characters",
        "aria-describedby":"quote-area-hint", oninput:() => {
          postcode.setCustomValidity("");
          draft.postcode = postcode.value;
        }});
      const submit = event => {
        event.preventDefault();
        draft.description = cleanText(description.value, 350);
        if (!draft.description) {
          description.setCustomValidity("Add a short description of the job.");
          description.reportValidity();
          return;
        }
        // Keep only the outward part when someone supplies their full postcode.
        const area = postcode.value.toUpperCase().trim().match(/^([A-Z]{1,2}(?:\d[A-Z\d]?)?)(?:\s*\d[A-Z]{2})?$/);
        if (!area) {
          postcode.setCustomValidity("Enter a postcode area, such as NE1.");
          postcode.reportValidity();
          return;
        }
        draft.postcode = area[1];
        updateSheet(contactDetails());
      };
      const form = h("form", {class:"k-form", onsubmit:submit},
        h("p", {class:"quote-type", text:draft.job}),
        h("div", {class:"k-field"}, h("label",{for:description.id,text:"Short description"}), description),
        h("div", {class:"k-field"}, h("label",{for:postcode.id,text:"Postcode area"}), postcode,
          h("small",{id:"quote-area-hint",text:"Just the first part is enough."})),
        h("div", {class:"k-sheet-foot"}, h("button", {type:"submit",class:"k-btn k-btn-primary k-btn-wide",text:"Continue"})));
      return {title:"About the job", body:form, onBack:() => updateSheet(jobTypes())};
    }

    function contactDetails() {
      const form = detailsForm({
        initial:draft.customer, submitLabel:"Prepare request", note:"Example only. Nothing is sent.",
        onSubmit:customer => {
          const body = h("div", {},
            h("p", {class:"quote-note",text:"Example request. Nothing was sent."}),
            h("dl",{class:"quote-summary"},
              h("dt",{text:"Job"}),h("dd",{text:draft.job}),
              h("dt",{text:"Details"}),h("dd",{text:draft.description}),
              h("dt",{text:"Area"}),h("dd",{text:draft.postcode}),
              h("dt",{text:"Contact"}),h("dd",{text:`${customer.name}, ${customer.mobile}`})),
            h("div",{class:"k-sheet-foot"},h("button",{type:"button",class:"k-btn k-btn-primary k-btn-wide",
              text:"Done",onclick:() => closeSheet()})));
          updateSheet({title:"Request ready",body});
          announce("Example request ready. Nothing was sent.");
        },
      });
      return {title:"Your details",body:form,onBack:() => {
        draft.customer = {name:form.elements.name.value, mobile:form.elements.mobile.value};
        updateSheet(jobDetails());
      }};
    }

    if (jobs.includes(trigger.dataset.quote)) {
      draft.job = trigger.dataset.quote;
      openSheet(jobDetails());
    } else openSheet(jobTypes());
  });
}

export const quoteCss = `
.quote-note,.quote-type{margin:0 0 15px}.quote-type{font-weight:650}
.quote-jobs{display:flex;flex-wrap:wrap;gap:8px;padding-bottom:20px}
.quote-job{min-height:46px;padding:8px 14px;border:1px solid var(--k-line-strong);border-radius:var(--k-chip-radius);background:var(--k-surface);color:var(--k-ink);font:600 16px/1.25 var(--k-font-text);text-align:start;cursor:pointer}
.quote-job:hover{border-color:var(--accent)}.quote-summary{margin:0;display:grid;grid-template-columns:auto 1fr;gap:9px 16px}.quote-summary dt{color:var(--k-ink-2)}.quote-summary dd{margin:0;overflow-wrap:anywhere}
#quote-description{resize:vertical}
`;
