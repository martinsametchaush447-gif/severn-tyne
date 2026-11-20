/* Builds the shareable preview link and the WhatsApp, phone and email links from CONFIG.
   Shared by the studio page and the preview page so both say the same thing. */
import { cleanDigits } from "./kit-core.js";

const PARAM_ORDER = ["t", "k", "n", "town", "ph", "tag", "a", "s"];

/** URL params for a demo, leaving out empty fields so links stay short. */
export function demoParams(state) {
  const params = new URLSearchParams();
  for (const key of PARAM_ORDER) {
    const value = String(state[key] ?? "").trim();
    if (value) params.set(key, value);
  }
  return params;
}

/** Absolute link to the full preview. `studioBase` is the studio page's folder URL. */
export function previewUrl(state, studioBase) {
  const url = new URL("p/", studioBase);
  url.search = demoParams(state).toString();
  return url.href;
}

export function whatsAppNumber(config) {
  return cleanDigits(config.contact?.whatsapp, 15);
}

export function hasAnyContact(config) {
  return Boolean(whatsAppNumber(config) || phoneHref(config) || emailHref(config));
}

/** With a studio number the chat opens with Severn & Tyne; without, WhatsApp asks who to send it to. */
export function whatsAppHref(config, message) {
  const number = whatsAppNumber(config);
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function sendDemoMessage(config, { name, town, link }) {
  const business = town ? `${name} in ${town}` : name;
  if (whatsAppNumber(config)) return `Hi, I just made a demo website for ${business} on Severn & Tyne. Here it is: ${link}`;
  return `My demo website for ${business}, made by Severn & Tyne: ${link}`;
}

export function phoneHref(config) {
  const digits = cleanDigits(config.contact?.phone);
  if (digits.length < 7) return "";
  return /^0\d{9,10}$/.test(digits) ? `tel:+44${digits.slice(1)}` : `tel:+${digits.replace(/^\+/, "")}`;
}

export function emailHref(config, { subject = "", body = "" } = {}) {
  const email = String(config.contact?.email ?? "").trim();
  if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) return "";
  const query = new URLSearchParams();
  if (subject) query.set("subject", subject);
  if (body) query.set("body", body);
  const search = query.toString().replace(/\+/g, "%20");
  return `mailto:${email}${search ? `?${search}` : ""}`;
}

/** The preview strip's "Make it live": WhatsApp or the studio's contact block. */
export function makeLiveLink(config, { name, link }, studioBase) {
  const message = `Hi, I would like to make this website live for ${name}: ${link}`;
  if (whatsAppNumber(config)) return { href: whatsAppHref(config, message), external: true };
  return { href: new URL("#contact", studioBase).href, external: false };
}
