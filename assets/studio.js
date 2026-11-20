/*
  The studio page: the demo maker in the hero (name, trade, town, optional phone and line),
  the live phone preview, the links it produces, and the CONFIG-driven blocks
  (prices, recent work, contact).
*/
import { KINDS, resolveKind } from "./kits/kinds.js";
import { CONFIG } from "./config.js";
import { TRADES, resolveTrade, tradeById, resolveStyle } from "./kits/index.js";
import { cleanText, cleanTown, cleanDigits, LIMITS, SAMPLE_NAME } from "./kit-core.js";
import {
  previewUrl,
  whatsAppHref,
  whatsAppNumber,
  sendDemoMessage,
  hasAnyContact,
  phoneHref,
  emailHref,
} from "./links.js";

const PREVIEW_DEBOUNCE_MS = 120;
const STATUS_DEBOUNCE_MS = 700;
const COPY_STATUS_MS = 4000;

const form = document.getElementById("maker");
const fields = {
  n: document.getElementById("f-name"),
  town: document.getElementById("f-town"),
  ph: document.getElementById("f-phone"),
  tag: document.getElementById("f-tag"),
};
const chipBox = document.getElementById("trade-chips");
const frame = document.getElementById("preview");
const swatchBox = document.getElementById("swatches");
const swatchRow = document.getElementById("swatch-row");
const statusLine = document.getElementById("preview-status");
const whatsAppButton = document.getElementById("send-wa");
const studioBase = new URL("./", location.href);

const state = { t: TRADES[0].id, k: KINDS[TRADES[0].id][0].id, n: "", town: "", ph: "", tag: "", a: "", s: "" };
let previewReady = false;
let previewTimer = 0;
let statusTimer = 0;

/* ---------- State ---------- */

function cleanState() {
  return {
    t: state.t,
    k: state.k,
    n: cleanText(state.n, LIMITS.name),
    town: cleanTown(state.town),
    ph: cleanDigits(state.ph),
    tag: cleanText(state.tag, LIMITS.tagline),
    a: state.a,
    s: resolveStyle(tradeById(state.t), state.s, cleanText(state.n, LIMITS.name)).id,
  };
}

const demoLink = () => previewUrl(cleanState(), studioBase);

function describeDemo(clean) {
  const trade = tradeById(clean.t).label.toLowerCase();
  const name = clean.n || SAMPLE_NAME;
  const kind = resolveKind(clean.t, clean.k);
  const business = `${name}${clean.town ? ` in ${clean.town}` : ""}`;
  if (kind.id !== clean.t) return `Showing ${business}, ${kind.label.toLowerCase()} website.`;
  return `Showing a ${trade} website for ${business}.`;
}

/* ---------- Trade chips, built from the registry so new kits appear by themselves ---------- */

function setChips(box, options, name, active) {
  box.replaceChildren(...options.map((option) => {
    const label = document.createElement("label");
    label.className = "chip";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = option.id;
    input.checked = option.id === active;
    const text = document.createElement("span");
    text.textContent = option.label;
    label.append(input, text);
    return label;
  }));
}

function renderKinds() {
  const kinds = KINDS[state.t];
  document.getElementById("kinds").hidden = kinds.length < 2;
  const row = document.getElementById("kind-chips");
  row.classList.toggle("many-kinds", kinds.length > 4);
  setChips(row, kinds, "k", state.k);
  row.scrollLeft = 0;
}

function renderStyles() {
  const box = document.getElementById("style-options");
  const active = cleanState().s;
  if (box.dataset.trade !== state.t) {
    setChips(box, tradeById(state.t).styles, "s", active);
    box.dataset.trade = state.t;
  } else {
    for (const input of box.querySelectorAll("input")) input.checked = input.value === active;
  }
}

/* ---------- Preview ---------- */

function postToPreview() {
  if (!previewReady || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ type: "severn:update", state: cleanState() }, location.origin);
}

function schedulePreview(immediately = false) {
  window.clearTimeout(previewTimer);
  if (immediately) postToPreview();
  else previewTimer = window.setTimeout(postToPreview, PREVIEW_DEBOUNCE_MS);
}

function scheduleStatus() {
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    statusLine.textContent = describeDemo(cleanState());
  }, STATUS_DEBOUNCE_MS);
}

function renderSwatches(accents, activeKey) {
  const existing = [...swatchRow.querySelectorAll("input")];
  if (existing.length === accents.length && existing.every((input, i) =>
      input.value === accents[i].key && input.getAttribute("aria-label") === accents[i].label &&
      input.nextElementSibling.style.getPropertyValue("--swatch") === accents[i].value)) {
    existing.forEach((input) => { input.checked = input.value === activeKey; });
    swatchBox.hidden = false;
    return;
  }
  swatchRow.replaceChildren(
    ...accents.map((accent) => {
      const label = document.createElement("label");
      label.className = "swatch";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "a";
      input.value = accent.key;
      input.checked = accent.key === activeKey;
      input.setAttribute("aria-label", accent.label);
      const dot = document.createElement("span");
      dot.style.setProperty("--swatch", accent.value);
      dot.title = accent.label;
      label.append(input, dot);
      return label;
    }),
  );
  swatchBox.hidden = false;
}

/* ---------- Links ---------- */

function updateLinks() {
  const clean = cleanState();
  const link = previewUrl(clean, studioBase);
  const message = sendDemoMessage(CONFIG, { name: clean.n || "my business", town: clean.town, link });
  form.classList.toggle("has-name", Boolean(clean.n));
  whatsAppButton.textContent = whatsAppNumber(CONFIG) ? "Send it to us on WhatsApp" : "Share on WhatsApp";
  whatsAppButton.href = whatsAppHref(CONFIG, message);
  const contact = document.querySelector("[data-contact-whatsapp]");
  if (contact && clean.n) contact.href = whatsAppHref(CONFIG, `Hi, I have a question about a website for ${clean.n}. My demo: ${link}`);
  else if (contact) contact.href = whatsAppHref(CONFIG, "Hi, I have a question about a website for my business.");
}

function refresh({ immediately = false } = {}) {
  renderStyles();
  updateLinks();
  schedulePreview(immediately);
  scheduleStatus();
}

/* ---------- Copy link ---------- */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    area.remove();
    return copied;
  }
}

function wireCopyButtons() {
  for (const button of document.querySelectorAll("[data-copy-link]")) {
    const status = document.getElementById(button.getAttribute("aria-describedby"));
    let timer = 0;
    button.addEventListener("click", async () => {
      const link = demoLink();
      const copied = await copyText(link);
      status.textContent = copied ? "Link copied" : `Copy this link: ${link}`;
      window.clearTimeout(timer);
      if (copied) timer = window.setTimeout(() => (status.textContent = ""), COPY_STATUS_MS);
    });
  }
}

/* ---------- CONFIG blocks ---------- */

/** "£99 a month" becomes a large "£99" and a smaller "a month", so the figure never breaks badly. */
function setPriceFigure(node, text) {
  const match = text.match(/^(from\s+)?([£$€]?\s?[\d.,]+)\s*(.*)$/i);
  const amount = match ? match[2] : text;
  const per = match ? match[3] : "";
  const from = document.createElement("span");
  from.className = "price-from";
  from.textContent = "from";
  const big = document.createElement("span");
  big.className = "price-amount";
  big.textContent = amount;
  node.replaceChildren(from, " ", big);
  if (per) {
    const small = document.createElement("span");
    small.className = "price-per";
    small.textContent = per;
    node.append(" ", small);
  }
}

function applyPricing() {
  const section = document.querySelector("[data-prices]");
  const navLink = document.querySelector("[data-prices-link]");
  const pricing = CONFIG.pricing ?? {};
  if (pricing.show === false) {
    section.remove();
    navLink?.remove();
    return;
  }
  const website = cleanText(pricing.websiteFrom, 24) || "£399";
  const care = cleanText(pricing.carePlanFrom, 32) || "£99 a month";
  const includes = cleanText(pricing.carePlanIncludes, 140) || "hosting, your phone number, updates and monthly content";
  setPriceFigure(section.querySelector("[data-price-website]"), website);
  setPriceFigure(section.querySelector("[data-price-care]"), care);
  section.querySelector("[data-price-includes]").textContent = `${includes.charAt(0).toUpperCase()}${includes.slice(1)}.`;
  section.querySelector("[data-price-sentence]").textContent = `Websites from ${website}. Care plan from ${care}: ${includes}.`;
}

function safeHttpUrl(value) {
  if (!String(value ?? "").trim()) return "";
  try {
    const url = new URL(String(value ?? ""), location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function applyCaseStudies() {
  const items = Array.isArray(CONFIG.caseStudies) ? CONFIG.caseStudies : [];
  const usable = items.filter((item) => cleanText(item?.name, 80));
  if (!usable.length) return;
  const list = document.getElementById("work-list");
  list.replaceChildren(
    ...usable.map((item) => {
      const row = document.createElement("li");
      const name = document.createElement("p");
      name.className = "work-name";
      const url = safeHttpUrl(item.url);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = cleanText(item.name, 80);
        name.append(link);
      } else {
        name.textContent = cleanText(item.name, 80);
      }
      const place = document.createElement("p");
      place.className = "work-place";
      place.textContent = cleanText(item.place, 60);
      const line = document.createElement("p");
      line.className = "work-line";
      line.textContent = cleanText(item.line, 160);
      row.append(name);
      if (place.textContent) row.append(place);
      if (line.textContent) row.append(line);
      return row;
    }),
  );
  document.getElementById("work").hidden = false;
}

function contactButton(label, href, { external = false, primary = false } = {}) {
  const link = document.createElement("a");
  link.className = `btn ${primary ? "btn-primary" : "btn-secondary"}`;
  link.href = href;
  link.textContent = label;
  if (external) {
    link.target = "_blank";
    link.rel = "noopener";
  }
  return link;
}

async function applyExtras() {
  const section = document.querySelector(".extras");
  try {
    const response = await fetch("extras/manifest.json");
    if (!response.ok) return;
    const available = await response.json();
    await Promise.allSettled([...section.querySelectorAll("[data-extra]")].map(async row => {
      if (available?.[row.dataset.extra] !== true) return;
      const index = new URL("index.html", row.querySelector("a").href);
      const file = await fetch(index, { method: "HEAD" });
      row.hidden = !file.ok;
    }));
    section.hidden = !section.querySelector("[data-extra]:not([hidden])");
  } catch {
    // Extras stay hidden if the optional manifest is unavailable.
  }
}

function applyContact() {
  const person = document.getElementById("contact-person");
  person.textContent = [cleanText(CONFIG.person?.name, 60), cleanText(CONFIG.person?.line, 100)].filter(Boolean).join(" · ");
  person.hidden = !person.textContent;
  if (!hasAnyContact(CONFIG)) return;
  const ways = document.getElementById("contact-ways");
  ways.className = "contact-ways";
  const buttons = [];
  if (whatsAppNumber(CONFIG)) {
    const button = contactButton("Message us on WhatsApp", whatsAppHref(CONFIG, "Hi, I have a question about a website for my business."), { external: true, primary: true });
    button.dataset.contactWhatsapp = "";
    buttons.push(button);
  }
  const tel = phoneHref(CONFIG);
  if (tel) buttons.push(contactButton(`Call ${cleanText(CONFIG.contact.phone, 24)}`, tel, { primary: !buttons.length }));
  const mail = emailHref(CONFIG, { subject: "A website for my business" });
  if (mail) buttons.push(contactButton(`Email ${cleanText(CONFIG.contact.email, 80)}`, mail, { primary: !buttons.length }));
  ways.replaceChildren(...buttons);
  ways.hidden = false;
  document.getElementById("contact-soon").hidden = true;


}

/* ---------- Start ---------- */

function prefillFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.toString()) return;
  state.t = resolveTrade(params.get("t"));
  state.k = resolveKind(state.t, params.get("k")).id;
  state.s = params.get("s") ?? "";
  state.n = cleanText(params.get("n"), LIMITS.name);
  state.town = cleanTown(params.get("town"));
  state.ph = cleanDigits(params.get("ph"));
  state.tag = cleanText(params.get("tag"), LIMITS.tagline);
  state.a = cleanText(params.get("a"), 24).toLowerCase();
  fields.n.value = state.n;
  fields.town.value = state.town;
  fields.ph.value = state.ph;
  fields.tag.value = state.tag;
  if (state.ph || state.tag) document.getElementById("more").open = true;
}

// iOS can shrink the visual viewport for the keyboard while keeping the CSS viewport tall.
function fitNameField() {
  const compact = document.activeElement === fields.n && matchMedia("(max-width: 740px)").matches &&
    (window.visualViewport?.height ?? innerHeight) < 520;
  if (compact === document.body.classList.contains("typing")) return;
  document.body.classList.toggle("typing", compact);
  if (compact) form.scrollIntoView({ block: "start" });
}

function start() {
  const sizePreview = () => form.style.setProperty("--mobile-scale", String(window.innerWidth * 0.64 / 375));
  sizePreview();
  window.addEventListener("resize", sizePreview);
  prefillFromUrl();
  setChips(chipBox, TRADES, "t", state.t);
  renderKinds();

  renderStyles();
  const initialPreview = new URL(demoLink());
  initialPreview.searchParams.set("embed", "1");
  frame.src = initialPreview.href;
  const choices = document.getElementById("styles");
  let revealStyleControls = false;
  function chooseStyle(event) {
    const input = event.target;
    if (input.name !== "s" || input.value === state.s) return;
    const changed = cleanState().s !== input.value;
    state.s = input.value;
    if (changed) {
      revealStyleControls = true;
      state.a = "";
      swatchBox.hidden = true;
      refresh({ immediately: true });
    }
  }
  const theme = document.querySelector(".maker-theme");
  function keepThemeInView() {
    if (!matchMedia("(max-width: 740px)").matches || document.activeElement === fields.n) return;
    const preview = document.querySelector(".maker-phone").getBoundingClientRect();
    const bottom = theme.getBoundingClientRect().bottom;
    const available = innerHeight - (form.classList.contains("has-name") ? 56 : 8);
    if (bottom - preview.top <= available && (preview.top < 0 || bottom > available)) {
      window.scrollBy(0, preview.top - 4);
    }
  }
  window.addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    const message = event.data ?? {};
    if (message.type === "severn:ready") {
      previewReady = true;
      postToPreview();
    } else if (message.type === "severn:kit" && message.trade === state.t && message.style === cleanState().s) {
      renderSwatches(message.accents ?? [], message.accent);
      if (revealStyleControls) {
        revealStyleControls = false;
        keepThemeInView();
      }
    }
  });
  theme.addEventListener("focusin", keepThemeInView);
  theme.addEventListener("click", () => requestAnimationFrame(keepThemeInView));
  choices.addEventListener("change", chooseStyle);
  // Clicking the current automatic choice pins it for subsequent name edits.
  choices.addEventListener("click", chooseStyle);

  for (const [key, input] of Object.entries(fields)) {
    input.addEventListener("input", () => {
      const oldStyle = cleanState().s;
      state[key] = input.value;
      if (oldStyle !== cleanState().s) {
        state.a = "";
        swatchBox.hidden = true;
      }
      refresh();
    });
  }
  function revealPreview() {
    if (!matchMedia("(max-width: 740px)").matches || document.activeElement === fields.n) return;
    const preview = document.querySelector(".maker-phone");
    const bottom = (window.visualViewport?.height ?? innerHeight) - parseFloat(getComputedStyle(preview).scrollMarginBottom || "0");
    if (preview.getBoundingClientRect().bottom > bottom + 1) {
      preview.scrollIntoView({block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    }
  }
  form.addEventListener("click", event => {
    if (event.target.matches("#trade-chips input, #kind-chips input")) requestAnimationFrame(revealPreview);
  });
  chipBox.addEventListener("change", (event) => {
    if (event.target.name !== "t") return;
    state.t = resolveTrade(event.target.value);
    state.k = KINDS[state.t][0].id;
    renderKinds();
    state.a = "";
    swatchBox.hidden = true;
    refresh({ immediately: true });
  });
  document.getElementById("kind-chips").addEventListener("change", (event) => {
    if (event.target.name !== "k") return;
    state.k = resolveKind(state.t, event.target.value).id;
    refresh({ immediately: true });
  });
  swatchRow.addEventListener("change", (event) => {
    if (event.target.name !== "a") return;
    state.a = event.target.value;
    refresh({ immediately: true });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    location.href = demoLink();
  });

  window.visualViewport?.addEventListener("resize", fitNameField);
  fields.n.addEventListener("focus", fitNameField);
  fields.n.addEventListener("blur", () => document.body.classList.remove("typing"));
  wireCopyButtons();
  applyPricing();
  applyCaseStudies();
  applyExtras();
  applyContact();
  updateLinks();
}

start();
