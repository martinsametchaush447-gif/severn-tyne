// The counter objects use the inks of the awning or the kraft-paper label.
const products = {
  bakery: `<path fill="var(--crust)" d="M14 87c3-23 26-49 53-59 36-14 80-4 88 20 8 25-31 47-69 55-31 7-68 4-72-8Z"/>
    <path d="M18 88c20 15 70 8 104-8 13-6 22-13 28-20M44 54c1 11 6 17 16 21-5-9-4-19-3-26m15-11c-2 12 4 22 16 27-4-10-4-19-3-29m16-3c0 10 5 18 15 23-3-8-4-15-3-21"/>
    <path d="m30 83 4 1m30 8 5-1m38-9 4-2m19-25 3 1m-86 9 3 1"/>`,
  deli: `<path fill="var(--crust)" d="M20 76 118 29q25 6 37 23l-1 37-102 24-32-17z"/><path d="m20 76 32 15 103-39M52 91v22m7-26 82-30"/>
    <path d="M35 75q12-7 22-5m13-10 14-6m18-10 8-3"/><g fill="var(--paper)"><ellipse cx="71" cy="96" rx="4" ry="3"/><ellipse cx="98" cy="87" rx="6" ry="4"/><circle cx="134" cy="73" r="3"/></g>`,
  grocer: `<path fill="var(--crust)" d="M40 80c1-17 15-25 20-40 3-11 10-16 20-14 12 2 10 16 16 28 5 10 15 18 12 33-3 17-18 23-37 22-17 0-31-10-31-29Z"/>
    <path d="M76 27q4-13 13-19m-10 15Q66 24 61 11q15 0 18 12M45 83q2 13 12 17"/>
    <path fill="var(--paper)" d="M100 87c1-12 10-19 15-28 6-12 9-20 18-19 12 1 10 15 17 24 16 19 13 41-11 45-19 5-39-3-39-22Z"/><path d="m131 40 6-15m-4 14q12-15 25-12-7 13-25 12m-28 51q2 7 8 10"/>`,
};

export function counterArt(kind, parcel, fallback) {
  if (!products[kind]) return fallback;
  return `<svg viewBox="0 0 172 124" aria-hidden="true" stroke="${parcel ? "#65462d" : "var(--accent)"}" fill="none"
    stroke-width="${parcel ? 1.7 : 2.7}" stroke-linecap="round" stroke-linejoin="round"
    style="--crust:${parcel ? "#dcc197" : "#efcc81"};--paper:${parcel ? "#fff4da" : "#fff3c9"}">
    ${parcel ? '<path d="m10 88 112-58 42 48-110 40Z" fill="#eddabc" stroke-dasharray="4 3"/>' : ""}
    ${products[kind]}</svg>`;
}
