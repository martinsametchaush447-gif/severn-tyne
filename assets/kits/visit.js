const schedules = {
  barber: ["09:00–18:00", "09:00–16:00", "Closed"],
  salon: ["09:00–18:00", "09:00–17:00", "Closed"],
  restaurant: ["12:00–22:00", "12:00–22:30", "12:00–20:00"],
  cafe: ["08:00–16:00", "09:00–16:00", "09:00–15:00"],
  takeaway: ["16:00–22:00", "15:00–23:00", "16:00–21:00"],
  shop: ["08:30–17:30", "08:30–16:00", "Closed"],
  garage: ["08:00–17:30", "08:30–12:30", "Closed"],
  trades: ["08:00–17:00", "09:00–12:00", "Closed"],
};

function schedule(trade, kind) {
  if (kind === "bakery-cafe") return schedules.cafe;
  if (["pizza", "kebab", "curry-house", "chinese"].includes(kind)) return schedules.takeaway;
  return schedules[kind] ?? schedules[trade];
}

function dailyHours(date, trade, kind) {
  const day = date.getDay();
  const range = schedule(trade, kind)[day === 0 ? 2 : day === 6 ? 1 : 0];
  return range === "Closed" ? [] : range.split("–");
}

export function withinHours(slots, date, trade, kind) {
  const [open, close] = dailyHours(date, trade, kind);
  return open ? slots.filter(time => time >= open && time < close) : [];
}

export function nextCollection(trade, kind, orderedAt = new Date()) {
  const date = new Date(orderedAt);
  const fiveMinutes = 5 * 60_000;
  for (let ahead = 0; ahead <= 7; ahead++, date.setDate(date.getDate() + 1)) {
    const [open, close] = dailyHours(date, trade, kind);
    if (!open) continue;
    const opening = date.setHours(...open.split(":").map(Number), 0, 0);
    const closing = date.setHours(...close.split(":").map(Number), 0, 0);
    const start = Math.max(orderedAt.getTime(), opening);
    const ready = new Date(Math.ceil((start + 25 * 60_000) / fiveMinutes) * fiveMinutes);
    if (ready >= closing) continue;
    const day = ahead === 0 ? "" : ahead === 1 ? " tomorrow" : " " + date.toLocaleDateString("en-GB", {weekday:"long"});
    return {ready, day};
  }
  throw new Error("Example hours have no collection window this week");
}

export function hours(trade, kind) {
  const days = ["Monday–Friday", "Saturday", "Sunday"];
  const rows = schedule(trade, kind).map((range, index) =>
    `<div><dt>${days[index]}</dt><dd>${range}</dd></div>`).join("");
  return `<h2>Opening hours</h2><small class="visit-note">Example hours</small><dl class="example-hours">${rows}</dl>`;
}

export const findUs = '<h2>Find us <span data-bind="in-town"></span></h2>';
