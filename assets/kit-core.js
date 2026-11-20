/*
  Shared parts for every trade kit: reading and cleaning the URL data, the accent and
  monogram, binding the business details into a rendered kit, the bottom sheet, the date
  and time picker and the details form.

  Safety rule: kit templates never contain visitor data. Everything that comes from the URL
  or a form is written with textContent (applyData, h()), so a name like
  <img src=x onerror=alert(1)> shows as text.
*/

export const LIMITS = Object.freeze({ name: 60, town: 40, tagline: 90, phoneDigits: 15 });
export const SAMPLE_NAME = "Your Business";

const isInvisibleCharacter = (code) =>
  code <= 0x1f || (code >= 0x7f && code <= 0x9f) || (code >= 0x200b && code <= 0x200f) ||
  (code >= 0x2028 && code <= 0x202e) || (code >= 0x2066 && code <= 0x2069) || code === 0xfeff;
const INITIAL_STOP_WORDS = new Set(["the", "and", "&", "of", "a", "an", "+"]);

/* ---------- Data ---------- */

/** Trims, removes control characters, collapses spaces and cuts to `max` characters. */
export function cleanText(value, max) {
  const text = Array.from(String(value ?? ""))
    .filter((character) => !isInvisibleCharacter(character.codePointAt(0)))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(text).slice(0, max).join("").trim();
}

export function cleanTown(value) {
  const letters = Array.from(cleanText(value, LIMITS.town + 1));
  if (letters.length <= LIMITS.town) return letters.join("");
  // A long call-list area can end with a neighbourhood note in brackets.
  return letters.slice(0, LIMITS.town).join("").trimEnd().replace(/\s+\([^()]*$/, "");
}

export function cleanDigits(value, max = LIMITS.phoneDigits) {
  return String(value ?? "").replace(/\D/g, "").slice(0, max);
}

/** Reads the preview URL scheme: t, k, s, n, town, ph, a, tag. */
export function readParams(search) {
  const params = new URLSearchParams(search);
  return {
    t: params.get("t") ?? "",
    k: params.get("k") ?? "",
    s: params.get("s") ?? "",
    n: params.get("n") ?? "",
    town: params.get("town") ?? "",
    ph: params.get("ph") ?? "",
    a: params.get("a") ?? "",
    tag: params.get("tag") ?? "",
  };
}

/** Turns raw params into the clean data object every kit receives. */
export function normalise(raw) {
  const name = cleanText(raw.n, LIMITS.name);
  const phoneDigits = cleanDigits(raw.ph);
  const hasPhone = phoneDigits.length >= 7;
  return {
    name: name || SAMPLE_NAME,
    isSample: !name,
    town: cleanTown(raw.town),
    tagline: cleanText(raw.tag, LIMITS.tagline),
    phoneDigits: hasPhone ? phoneDigits : "",
    phoneDisplay: hasPhone ? formatUkPhone(phoneDigits) : "",
    telHref: hasPhone ? telHref(phoneDigits) : "",
    accentKey: cleanText(raw.a, 24).toLowerCase(),
  };
}

export function formatUkPhone(digits) {
  let local = digits;
  if (local.startsWith("44") && local.length === 12) local = `0${local.slice(2)}`;
  if (!/^0\d{10}$/.test(local)) return digits;
  if (local.startsWith("02")) return `${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`;
  if (/^01(\d1|1\d)/.test(local)) return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
  return `${local.slice(0, 5)} ${local.slice(5)}`;
}

export function telHref(digits) {
  if (/^0\d{9,10}$/.test(digits)) return `tel:+44${digits.slice(1)}`;
  if (digits.startsWith("44")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

/** FNV-1a: a small stable hash so the same name always gets the same accent. */
export function hashString(text) {
  let hash = 0x811c9dc5;
  for (const character of text) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function pickAccent(accents, data) {
  const chosen = accents.find((accent) => accent.key === data.accentKey);
  if (chosen) return chosen;
  if (data.isSample) return accents[0];
  return accents[hashString(data.name.toLowerCase()) % accents.length];
}

export function initialsFrom(name) {
  const words = name
    .split(/\s+/)
    .filter((word) => word && !INITIAL_STOP_WORDS.has(word.toLowerCase()) && /[\p{L}\p{N}]/u.test(word));
  const letters = words
    .slice(0, 2)
    .map((word) => (word.match(/[\p{L}\p{N}]/u) ?? [""])[0])
    .join("");
  return (letters || "Y").toLocaleUpperCase("en-GB");
}

export function nameLengthBucket(name) {
  const length = Array.from(name).length;
  if (length <= 10) return "s";
  if (length <= 18) return "m";
  if (length <= 30) return "l";
  return "xl";
}

export function formatMoney(pence, { alwaysPence = true } = {}) {
  const pounds = pence / 100;
  if (!alwaysPence && pence % 100 === 0) return `£${pounds}`;
  return `£${pounds.toFixed(2)}`;
}

/* ---------- DOM helpers ---------- */

/**
 * Builds an element. Text children and the `text` prop are always set as text.
 * The `html` prop is for the kit's own static markup (icons) and never for visitor data.
 */
export function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

let announcer = null;
/** Speaks a short status line to screen readers without moving focus. */
export function announce(message) {
  if (!announcer) {
    announcer = h("div", { class: "k-sr", role: "status", "aria-live": "polite" });
    document.body.append(announcer);
  }
  announcer.textContent = "";
  window.setTimeout(() => {
    announcer.textContent = message;
  }, 40);
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Binding data into a kit ---------- */

function describeKind(data, kit) {
  if (!data.kind || data.kind.id === kit.id) return kit.describe(data);
  return data.town ? `${data.kind.label} in ${data.town}` : data.kind.label;
}

function bindingText(key, data, kit) {
  switch (key) {
    case "name":
      return data.name;
    case "initials":
      return initialsFrom(data.name);
    case "town":
      return data.town;
    case "in-town":
      return data.town ? `in ${data.town}` : "";
    case "tagline":
      return data.tagline || data.kind?.tagline || kit.defaultTagline;
    case "kind-label":
      return data.kind?.label ?? kit.label;
    case "describe":
      return describeKind(data, kit);
    case "phone":
      return data.phoneDisplay;
    default:
      return "";
  }
}

function conditionHolds(condition, data) {
  const negate = condition.startsWith("!");
  const key = negate ? condition.slice(1) : condition;
  const value = { town: data.town, phone: data.phoneDigits, tagline: data.tagline }[key];
  return negate ? !value : Boolean(value);
}

function setUpCallButton(node, data) {
  const label = node.querySelector("[data-call-label]") ?? node;
  const isShort = node.dataset.call === "short";
  if (data.telHref) {
    node.setAttribute("href", data.telHref);
    node.dataset.callMode = "tel";
    node.removeAttribute("aria-haspopup");
    label.textContent = isShort ? "Call" : `Call ${data.phoneDisplay}`;
    return;
  }
  node.setAttribute("href", "#call");
  node.dataset.callMode = "note";
  node.setAttribute("aria-haspopup", "dialog");
  label.textContent = "Call us";
}

/**
 * Writes the business details into every [data-bind], [data-if] and [data-call] element
 * under root, sets the accent colours and the page title. Safe to call on every keystroke.
 */
export function applyData(root, data, kit) {
  const accent = pickAccent(kit.accents, data);
  // Set on <html> so the sheet, which lives outside the kit root, gets the same accent.
  const themeHost = document.documentElement;
  themeHost.style.setProperty("--accent", accent.value);
  themeHost.style.setProperty("--accent-ink", accent.ink);
  themeHost.style.setProperty("--accent-text", accent.text ?? accent.value);
  root.kitData = data;
  root.dataset.accent = accent.key;
  root.dataset.nameLength = nameLengthBucket(data.name);
  root.dataset.sample = data.isSample ? "true" : "false";

  for (const node of root.querySelectorAll("[data-bind]")) {
    const text = bindingText(node.dataset.bind, data, kit);
    if (node.textContent === text) continue;
    // Balance can still leave a single last word in a three-word business name.
    const ending = node.matches("h1, [data-bind=tagline]") && text.match(/^(.+\s)(\S+\s+\S+)$/u);
    if (ending) node.replaceChildren(ending[1], h("span", { class: "hero-ending", text: ending[2] }));
    else node.textContent = text;
  }
  for (const node of root.querySelectorAll("[data-if]")) {
    node.hidden = !conditionHolds(node.dataset.if, data);
  }
  for (const node of root.querySelectorAll("[data-call]")) {
    setUpCallButton(node, data);
  }
  document.title = `${data.name} | ${describeKind(data, kit)}`;
  return accent;
}

/** Wires the "Call us" note for kits shown without a phone number. Call once per render. */
export function wireCallNotes(root) {
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-call]");
    if (!button || button.dataset.callMode !== "note") return;
    event.preventDefault();
    const body = h(
      "div",
      { class: "k-note" },
      h("p", { text: "When your site goes live, this button rings your phone." }),
      h("p", { class: "k-muted", text: "Send us the number you want customers to call and it shows here." }),
      h("div", { class: "k-sheet-foot" }, h("button", { type: "button", class: "k-btn k-btn-primary", onclick: () => closeSheet() }, "OK")),
    );
    openSheet({ title: "Your number goes here", body, size: "small" });
  });
}

/* ---------- Bottom sheet ---------- */

const ICON_BACK =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const SHEET_EXIT_MS = 200;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const sheetState = {
  layer: null,
  panel: null,
  title: null,
  body: null,
  opener: null,
  onBack: null,
  onClose: null,
  hideTimer: 0,
  usesHistory: false,
};

/** Embedded previews must not add entries to the parent page's history. */
const historyAllowed = () => window.top === window.self;

function buildSheet() {
  const back = h("button", { type: "button", class: "k-sheet-icon", "aria-label": "Back", html: ICON_BACK });
  const close = h("button", { type: "button", class: "k-sheet-icon", "aria-label": "Close", html: ICON_CLOSE });
  const title = h("h2", { class: "k-sheet-title", id: "k-sheet-title", tabindex: "-1" });
  const body = h("div", { class: "k-sheet-body" });
  const panel = h(
    "section",
    { class: "k-sheet", role: "dialog", "aria-modal": "true", "aria-labelledby": "k-sheet-title" },
    h("header", { class: "k-sheet-head" }, back, title, close),
    body,
  );
  const scrim = h("div", { class: "k-sheet-scrim" });
  const layer = h("div", { class: "k-sheet-layer", hidden: true }, scrim, panel);

  back.addEventListener("click", () => (sheetState.onBack ? sheetState.onBack() : closeSheet()));
  close.addEventListener("click", () => closeSheet());
  scrim.addEventListener("click", () => closeSheet());
  layer.addEventListener("keydown", trapKeys);
  window.addEventListener("popstate", () => {
    if (sheetState.layer && !sheetState.layer.hidden && sheetState.usesHistory) {
      sheetState.usesHistory = false;
      closeSheet({ fromHistory: true });
    }
  });

  document.body.append(layer);
  Object.assign(sheetState, { layer, panel, title, body });
}

function trapKeys(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeSheet();
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [...sheetState.panel.querySelectorAll(FOCUSABLE)].filter((node) => node.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setBackgroundInert(isInert) {
  for (const node of document.body.children) {
    if (node === sheetState.layer || node === announcer) continue;
    node.inert = isInert;
  }
  document.documentElement.classList.toggle("k-sheet-open", isInert);
}

/** Opens the sheet. `onBack` handles the back arrow; without it the arrow closes the sheet. */
export function openSheet({ title, body, onBack = null, onClose = null, size = "" }) {
  if (!sheetState.layer) buildSheet();
  window.clearTimeout(sheetState.hideTimer);
  const wasOpen = !sheetState.layer.hidden && sheetState.layer.classList.contains("is-open");
  if (!wasOpen) sheetState.opener = document.activeElement;
  sheetState.onClose = onClose;
  sheetState.panel.dataset.size = size;
  updateSheet({ title, body, onBack });

  if (wasOpen) return;
  sheetState.layer.hidden = false;
  sheetState.title.focus({ preventScroll: true });
  setBackgroundInert(true);
  if (historyAllowed()) {
    history.pushState({ kitSheet: true }, "");
    sheetState.usesHistory = true;
  }
  void sheetState.panel.offsetHeight;
  sheetState.layer.classList.add("is-open");
}

/** Replaces the sheet's title and content, keeping it open (used for multi-step flows). */
export function updateSheet({ title, body, onBack = null }) {
  sheetState.onBack = onBack;
  sheetState.title.textContent = title;
  sheetState.body.replaceChildren(body);
  sheetState.body.scrollTop = 0;
  sheetState.title.focus({ preventScroll: true });
}

export function closeSheet({ fromHistory = false } = {}) {
  const { layer } = sheetState;
  if (!layer || layer.hidden || !layer.classList.contains("is-open")) return;
  layer.classList.remove("is-open");
  setBackgroundInert(false);
  if (!fromHistory && sheetState.usesHistory) {
    sheetState.usesHistory = false;
    history.back();
  }
  const delay = prefersReducedMotion() ? 0 : SHEET_EXIT_MS;
  sheetState.hideTimer = window.setTimeout(() => {
    layer.hidden = true;
    sheetState.body.replaceChildren();
  }, delay);
  const { opener, onClose } = sheetState;
  if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  if (onClose) onClose();
}

export function isSheetOpen() {
  return Boolean(sheetState.layer && !sheetState.layer.hidden && sheetState.layer.classList.contains("is-open"));
}

/* ---------- Example diary ---------- */

const pad = (number) => String(number).padStart(2, "0");
export const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const minutesToTime = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

/**
 * Example free times for one day: every `step` minutes between open and close, with a
 * repeatable share marked busy. Times already past (plus lead time) are left out today.
 */
export function exampleFreeTimes(date, { open, close, step = 30, busyShare = 0.35, seed = "", leadMinutes = 30, now = new Date() }) {
  const isToday = dateKey(date) === dateKey(now);
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + leadMinutes : 0;
  const times = [];
  for (let minutes = open; minutes <= close; minutes += step) {
    if (minutes < earliest) continue;
    const isBusy = hashString(`${seed}|${dateKey(date)}|${minutes}`) % 100 < busyShare * 100;
    if (!isBusy) times.push(minutesToTime(minutes));
  }
  return times;
}

const weekdayShort = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const monthShort = new Intl.DateTimeFormat("en-GB", { month: "short" });
const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" });
export const formatLongDate = (date) => longDate.format(date);

function nextDays(count, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Array.from({ length: count }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
}

function timeGroup(time) {
  const hour = Number(time.slice(0, 2));
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

let pickerCount = 0;

/**
 * A date strip and time chips on one screen. The first free time is chosen for you.
 * `freeTimesFor(date)` returns "HH:MM" strings. Calls onChange({ date, time }).
 */
export function dateTimePicker({ days = 14, freeTimesFor, value = null, onChange }) {
  pickerCount += 1;
  const id = `k-dt-${pickerCount}`;
  const dates = nextDays(days);
  const timesByKey = new Map(dates.map((date) => [dateKey(date), freeTimesFor(date)]));
  const firstOpen = dates.find((date) => timesByKey.get(dateKey(date)).length) ?? dates[0];

  let selectedDate = value?.date ?? firstOpen;
  let selectedTime = value?.time ?? timesByKey.get(dateKey(selectedDate))[0] ?? null;

  const strip = h("div", { class: "k-dates", role: "group", "aria-label": "Day" });
  const timesBox = h("div", { class: "k-times" });

  function emit() {
    onChange?.({ date: selectedDate, time: selectedTime });
  }

  function renderDates() {
    let previousMonth = -1;
    strip.replaceChildren(
      ...dates.map((date) => {
        const key = dateKey(date);
        const free = timesByKey.get(key).length;
        const showMonth = date.getMonth() !== previousMonth;
        previousMonth = date.getMonth();
        const isSelected = key === dateKey(selectedDate);
        return h(
          "button",
          {
            type: "button",
            class: "k-date",
            "aria-pressed": String(isSelected),
            "aria-label": `${formatLongDate(date)}${free ? "" : ", fully booked"}`,
            disabled: !free,
            onclick: () => {
              selectedDate = date;
              selectedTime = timesByKey.get(key)[0] ?? null;
              renderDates();
              renderTimes();
              emit();
            },
          },
          h("span", { class: "k-date-day", text: weekdayShort.format(date) }),
          h("span", { class: "k-date-num", text: String(date.getDate()) }),
          h("span", { class: "k-date-month", text: showMonth ? monthShort.format(date) : "" }),
        );
      }),
    );
  }

  function renderTimes() {
    const times = timesByKey.get(dateKey(selectedDate));
    if (!times.length) {
      timesBox.replaceChildren(h("p", { class: "k-muted", text: "No times left on this day. Pick another day." }));
      return;
    }
    const groups = new Map();
    for (const time of times) {
      const group = timeGroup(time);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(time);
    }
    timesBox.replaceChildren(
      ...[...groups].map(([group, groupTimes]) =>
        h(
          "fieldset",
          { class: "k-time-group" },
          h("legend", { text: group }),
          h(
            "div",
            { class: "k-time-row" },
            ...groupTimes.map((time) => {
              const input = h("input", {
                type: "radio",
                name: `${id}-time`,
                value: time,
                class: "k-time-input",
                id: `${id}-${time.replace(":", "")}`,
                checked: time === selectedTime,
                onchange: () => {
                  selectedTime = time;
                  emit();
                },
              });
              return h("label", { class: "k-time", for: input.id }, input, h("span", { text: time }));
            }),
          ),
        ),
      ),
    );
  }

  renderDates();
  renderTimes();
  const node = h("div", { class: "k-picker" }, strip, timesBox);
  requestAnimationFrame(() => strip.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" }));
  return { node, value: () => ({ date: selectedDate, time: selectedTime }) };
}

/* ---------- Name and mobile form ---------- */

let formCount = 0;

export function detailsForm({ submitLabel, note, initial = {}, onSubmit }) {
  formCount += 1;
  const id = `k-form-${formCount}`;
  const field = (key, label, attributes) => {
    const error = h("p", { class: "k-field-error", id: `${id}-${key}-error`, hidden: true });
    const input = h("input", { id: `${id}-${key}`, name: key, class: "k-input", "aria-describedby": error.id, ...attributes });
    return { input, error, wrap: h("div", { class: "k-field" }, h("label", { for: input.id, text: label }), input, error) };
  };
  const name = field("name", "Your name", { autocomplete: "name", maxlength: "40", value: initial.name ?? "", enterkeyhint: "next" });
  const mobile = field("mobile", "Mobile number", {
    type: "tel",
    inputmode: "tel",
    autocomplete: "tel",
    maxlength: "20",
    value: initial.mobile ?? "",
    enterkeyhint: "done",
  });

  const showError = (fieldParts, message) => {
    fieldParts.error.textContent = message;
    fieldParts.error.hidden = !message;
    fieldParts.input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const form = h(
    "form",
    {
      class: "k-form",
      novalidate: true,
      onsubmit: (event) => {
        event.preventDefault();
        const nameValue = cleanText(name.input.value, 40);
        const mobileDigits = cleanDigits(mobile.input.value, 15);
        const nameMessage = nameValue ? "" : "Enter your name.";
        const mobileMessage = mobileDigits.length >= 10 && mobileDigits.length <= 13 ? "" : "Enter a mobile number, like 07700 900123.";
        showError(name, nameMessage);
        showError(mobile, mobileMessage);
        if (nameMessage) return name.input.focus();
        if (mobileMessage) return mobile.input.focus();
        onSubmit({ name: nameValue, mobile: formatUkPhone(mobileDigits) });
      },
    },
    name.wrap,
    mobile.wrap,
    h("div", { class: "k-sheet-foot" }, h("button", { type: "submit", class: "k-btn k-btn-primary k-btn-wide", text: submitLabel }), note ? h("p", { class: "k-foot-note", text: note }) : null),
  );
  return form;
}

/* ---------- Shared styles for sheets, pickers, forms ---------- */

const BASE_CSS = `
.k-sr{position:absolute!important;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.k-muted{color:var(--k-ink-2)}
html.k-sheet-open{overflow:hidden}
.k-sheet-layer{position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center}
.k-sheet-layer[hidden]{display:none}
.k-sheet-scrim{position:absolute;inset:0;background:rgba(12,12,12,.48);opacity:0;transition:opacity 200ms var(--k-ease-out)}
.k-sheet{position:relative;display:flex;flex-direction:column;width:100%;max-height:min(92dvh,880px);background:var(--k-sheet-bg,var(--k-surface));color:var(--k-ink);border-radius:var(--k-sheet-radius,20px) var(--k-sheet-radius,20px) 0 0;box-shadow:0 -12px 40px -16px rgba(0,0,0,.35);transform:translateY(100%);transition:transform 200ms var(--k-ease-out);padding-bottom:env(safe-area-inset-bottom,0px);font-family:var(--k-font-text)}
.k-sheet-layer.is-open .k-sheet-scrim{opacity:1;transition-duration:260ms}
.k-sheet-layer.is-open .k-sheet{transform:none;transition:transform 280ms var(--k-ease-sheet)}
.k-sheet-head{display:grid;grid-template-columns:48px 1fr 48px;align-items:center;gap:4px;padding:8px 8px 4px;border-bottom:1px solid var(--k-line)}
.k-sheet-title{margin:0;text-align:center;font:var(--k-sheet-title-font,700 18px/1.25 var(--k-font-text));outline:none;overflow-wrap:anywhere}
.k-sheet-icon{display:grid;place-items:center;width:44px;height:44px;border:0;border-radius:12px;background:transparent;color:inherit;cursor:pointer}
.k-sheet-body{overflow-y:auto;overscroll-behavior:contain;padding:20px 20px 0;-webkit-overflow-scrolling:touch}
.k-sheet-foot{position:sticky;bottom:0;margin:20px -20px 0;padding:12px 20px calc(16px + env(safe-area-inset-bottom,0px));background:var(--k-sheet-bg,var(--k-surface));border-top:1px solid var(--k-line)}
.k-foot-note{margin:10px 0 0;font-size:14px;color:var(--k-ink-2);text-align:center}
.k-note p{margin:0 0 10px;font-size:17px;line-height:1.5}
@media (min-width:720px){
  .k-sheet-layer{align-items:center;padding:24px}
  .k-sheet{width:min(520px,100%);border-radius:var(--k-sheet-radius,20px);max-height:min(86vh,820px);opacity:0;transform:translateY(16px) scale(.98);transition:transform 180ms var(--k-ease-out),opacity 180ms var(--k-ease-out)}
  .k-sheet[data-size=small]{width:min(420px,100%)}
  .k-sheet-layer.is-open .k-sheet{opacity:1;transform:none;transition:transform 260ms var(--k-ease-out),opacity 200ms var(--k-ease-out)}
  .k-sheet-foot{border-radius:0 0 var(--k-sheet-radius,20px) var(--k-sheet-radius,20px)}
}
.k-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 20px;border-radius:var(--k-btn-radius,10px);border:1.5px solid transparent;font:600 16px/1.2 var(--k-font-ui,var(--k-font-text));text-decoration:none;cursor:pointer;-webkit-user-select:none;user-select:none;touch-action:manipulation;transition:transform 120ms var(--k-ease-out),background-color 160ms ease,color 160ms ease,border-color 160ms ease}
.k-btn:active{transform:scale(.97)}
.k-btn-primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.k-btn-ghost{background:transparent;color:var(--k-ink);border-color:currentColor}
.k-btn-wide{width:100%}
.k-btn svg{flex:none}
.k-picker{display:grid;gap:18px}
.k-times{display:grid;gap:16px}
.k-dates{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x proximity;overscroll-behavior-x:contain;padding:2px 2px 8px;margin:0 -20px;padding-inline:20px;scrollbar-width:none}
.k-dates::-webkit-scrollbar{display:none}
.k-date{flex:0 0 58px;display:grid;justify-items:center;gap:2px;min-height:76px;padding:8px 0;border:1.5px solid var(--k-line-strong,var(--k-line));border-radius:var(--k-chip-radius,12px);background:var(--k-surface);color:var(--k-ink);scroll-snap-align:start;cursor:pointer;font-family:var(--k-font-ui,var(--k-font-text));-webkit-user-select:none;user-select:none;touch-action:manipulation;transition:background-color 140ms ease,border-color 140ms ease,transform 120ms var(--k-ease-out)}
.k-date:active{transform:scale(.96)}
.k-date[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.k-date:disabled{opacity:.42;cursor:not-allowed}
.k-date-day{font-size:13px}
.k-date-num{font-size:21px;font-weight:700;line-height:1.1}
.k-date-month{font-size:12px;min-height:15px}
.k-time-group{border:0;margin:0;padding:0}
.k-time-group legend{padding:0;margin-bottom:8px;font-size:14px;font-weight:600;color:var(--k-ink-2)}
.k-time-row{display:flex;flex-wrap:wrap;gap:8px}
.k-time{position:relative;display:inline-flex}
.k-time-input{position:absolute;opacity:0;width:1px;height:1px}
.k-time span{display:inline-flex;align-items:center;justify-content:center;min-width:76px;min-height:44px;padding:0 12px;border:1.5px solid var(--k-line-strong,var(--k-line));border-radius:var(--k-chip-radius,12px);background:var(--k-surface);font:600 16px/1 var(--k-font-ui,var(--k-font-text));font-variant-numeric:tabular-nums;cursor:pointer;-webkit-user-select:none;user-select:none;transition:background-color 140ms ease,border-color 140ms ease}
.k-time-input:checked+span{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.k-time-input:focus-visible+span{outline:3px solid var(--k-focus,var(--k-ink));outline-offset:2px}
.k-form{display:grid;gap:16px}
.k-field{display:grid;gap:6px}
.k-field label{font-weight:600;font-size:15px}
.k-input{width:100%;min-height:52px;padding:12px 14px;border:1.5px solid var(--k-line-strong,var(--k-line));border-radius:var(--k-input-radius,10px);background:var(--k-input-bg,#fff);color:var(--k-ink);font:16px/1.3 var(--k-font-text)}
.k-input:focus{outline:3px solid var(--k-focus,var(--k-ink));outline-offset:1px}
.k-input[aria-invalid=true]{border-color:var(--k-error,#b3261e)}
.k-field-error{margin:0;color:var(--k-error,#b3261e);font-size:14px;font-weight:600}
@media (prefers-reduced-motion:reduce){
  .k-sheet,.k-sheet-scrim,.k-btn,.k-date,.k-time span{transition:none!important}
}
`;

let baseStylesAdded = false;
export function addStyles(id, css) {
  if (!baseStylesAdded) {
    document.head.append(h("style", { "data-kit-style": "base", text: BASE_CSS }));
    baseStylesAdded = true;
  }
  if (document.head.querySelector(`style[data-kit-style="${id}"]`)) return;
  document.head.append(h("style", { "data-kit-style": id, text: css }));
}


export const ICON_PHONE =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 3.5h-2a1.5 1.5 0 0 0-1.5 1.6 17 17 0 0 0 15.8 15.8 1.5 1.5 0 0 0 1.6-1.5v-2a1.5 1.5 0 0 0-1.1-1.4l-3-.9a1.5 1.5 0 0 0-1.5.4l-1.2 1.2a12 12 0 0 1-5-5l1.2-1.2a1.5 1.5 0 0 0 .4-1.5l-.9-3a1.5 1.5 0 0 0-1.4-1.1z"/></svg>';
