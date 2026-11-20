/*
  The full personalised preview (p/index.html). Reads t, k, s, n, town, ph, a, tag from the URL,
  loads only the kit it needs and renders it. With ?embed=1 it runs inside the studio's
  phone: no strip, and the studio sends new details with postMessage as the visitor types.
*/
import { resolveKind } from "./kits/kinds.js";
import { CONFIG } from "./config.js";
import { resolveTrade, tradeById, resolveStyle, loadKit } from "./kits/index.js";
import { cleanText, readParams, normalise, applyData, prefersReducedMotion, isSheetOpen, closeSheet } from "./kit-core.js";
import { demoParams, previewUrl, makeLiveLink } from "./links.js";

const SWAP_OUT_MS = 110;
let root = document.getElementById("kit");
const isEmbed = document.documentElement.classList.contains("is-embed");
const studioBase = new URL("../", location.href);

let shownStyle = null;
let latestRequest = 0;

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

/** The clean state used for links: what the visitor typed, after the kit's limits. */
function linkState(tradeId, data) {
  return {
    t: tradeId,
    k: data.kind.id,
    n: data.isSample ? "" : data.name,
    town: data.town,
    ph: data.phoneDigits,
    tag: data.tagline,
    a: data.accentKey,
    s: root.dataset.style,
  };
}

function updateStrip(tradeId, data) {
  if (isEmbed) return;
  for (const node of document.querySelectorAll("[data-strip-name]")) node.textContent = data.name;
  document.getElementById("strip").setAttribute("aria-label", `Preview made for ${data.name} by Severn & Tyne`);

  const state = linkState(tradeId, data);
  const edit = document.getElementById("strip-edit");
  const params = demoParams(state).toString();
  edit.href = new URL(params ? `?${params}#maker` : "#maker", studioBase).href;

  const live = document.getElementById("strip-live");
  const target = makeLiveLink(CONFIG, { name: data.name, link: previewUrl(state, studioBase) }, studioBase);
  const price = cleanText(CONFIG.pricing?.websiteFrom, 24).replace(/^from\s+/i, "");
  live.textContent = CONFIG.pricing?.show && price ? `Make it live, from ${price}` : "Make it live";
  live.href = target.href;
  if (target.external) {
    live.target = "_blank";
    live.rel = "noopener";
  } else {
    live.removeAttribute("target");
    live.removeAttribute("rel");
  }
}

/** Inside the studio's phone the kit is a picture you can also touch with a mouse; keyboard
    users stay on the studio form, which describes the preview in a live region. */
function keepOutOfTabOrder() {
  for (const node of root.querySelectorAll("a[href], button, input, [tabindex]")) node.tabIndex = -1;
}

function tellStudio(tradeId, kit) {
  if (!isEmbed) return;
  const accents = kit.accents.map(({ key, label, value }) => ({ key, label, value }));
  window.parent.postMessage({ type: "severn:kit", trade: tradeId, style: root.dataset.style, accents, accent: root.dataset.accent }, location.origin);
}

function mountKit(kit, style, data) {
  if (isSheetOpen()) closeSheet();
  // Fresh mounts release the old kit's handlers when the same trade is selected again.
  const mount = document.createElement("div");
  mount.id = "kit";
  mount.className = "kit-root";
  mount.dataset.state = "ready";
  root.replaceWith(mount);
  root = mount;
  for (const sheet of document.querySelectorAll("style[data-kit-style]:not([data-kit-style=base])")) sheet.remove();
  root.dataset.kind = data.kind.id;
  root.dataset.style = document.documentElement.dataset.style = style.id;
  root.dataset.kit = document.documentElement.dataset.kit = kit.id;
  kit.render(root, data);
  if (isEmbed) keepOutOfTabOrder();
  shownStyle = style;
  window.scrollTo(0, 0);
}

async function show(raw) {
  const request = ++latestRequest;
  const tradeId = resolveTrade(raw.t);
  const data = normalise(raw);
  data.kind = resolveKind(tradeId, raw.k);
  const style = resolveStyle(tradeById(tradeId), raw.s, data.name);
  const kit = await loadKit(style);
  if (request !== latestRequest) return;

  if (style === shownStyle && root.dataset.kind === data.kind.id) {
    root.dataset.state = "ready";
    applyData(root, data, kit);
  } else if (shownStyle && isEmbed && !prefersReducedMotion() && document.startViewTransition) {
    const transition = document.startViewTransition(() => {
      if (request === latestRequest) mountKit(kit, style, data);
    });
    await transition.updateCallbackDone;
  } else {
    const fade = shownStyle && !prefersReducedMotion();
    if (fade) {
      root.dataset.state = "swapping";
      await wait(SWAP_OUT_MS);
      if (request !== latestRequest) return;
    }
    mountKit(kit, style, data);
    if (fade) root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 });
  }
  if (request === latestRequest) {
    updateStrip(tradeId, data);
    tellStudio(tradeId, kit);
  }
}

function showError(error) {
  root.dataset.state = "ready";
  root.replaceChildren();
  const message = document.createElement("p");
  message.className = "st-noscript";
  message.textContent = "This preview could not load. Reload the page to try again.";
  root.append(message);
  console.error(error);
}

if (isEmbed) {
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.origin !== location.origin) return;
    if (event.data?.type === "severn:update") show(event.data.state ?? {}).catch(showError);
  });
}

show(readParams(location.search))
  .catch(showError)
  .finally(() => {
    if (isEmbed) window.parent.postMessage({ type: "severn:ready" }, location.origin);
  });
