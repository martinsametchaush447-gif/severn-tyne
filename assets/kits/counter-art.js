// The counter objects use the inks of the awning or the kraft-paper label.
const products = {
  "florist": `<path fill="var(--crust)" d="M40 48 68 105 90 112 127 49 87 67Z"/><path d="m68 105 38-77m-25 71L59 38m26 44 4-48m-22 55 34 5m-31-11 33 5"/><g fill="var(--paper)"><g transform="translate(55 32)"><path d="M0-5c-10-19-18-1-8 4-19 0-10 14-1 9-1 17 13 13 12 2 15 8 17-6 5-9C19-9 6-16 0-5Z"/><circle r="3"/></g><g transform="translate(89 26)"><path d="M0-5c-10-19-18-1-8 4-19 0-10 14-1 9-1 17 13 13 12 2 15 8 17-6 5-9C19-9 6-16 0-5Z"/><circle r="3"/></g><g transform="translate(111 35)"><path d="M0-5c-10-19-18-1-8 4-19 0-10 14-1 9-1 17 13 13 12 2 15 8 17-6 5-9C19-9 6-16 0-5Z"/><circle r="3"/></g></g>`,
  "fishmonger": `<path fill="var(--crust)" d="M19 64c24-31 68-37 104-8l32-18-6 23 7 25-34-14c-32 25-75 24-103-8Z"/><path d="M51 44q15 19-1 39m21-39 12-15 18 15M70 81l14 13 8-14m-24-28q9 5 0 11m13-15q9 5 0 11m12-5q9 5 0 11m-23 1q7 4 0 10m15-11q8 5 0 11m40-17 19-10m-18 16 19 9M23 68l13-3"/><circle cx="37" cy="56" r="3" fill="currentColor"/>`,
  "gift-shop": `<path fill="var(--crust)" d="m33 54 51-19 55 19-55 22Zm3 5 48 18 52-17v37l-52 18-48-18Z"/><path d="M34 53v9l50 19 55-21v-7M62 44l52 18v42m-52-1V67l45-23m-23 35v35"/><path fill="var(--paper)" d="M84 39C54 40 43 24 52 20c12-7 28 4 32 19 2-21 24-33 31-23 7 11-11 23-31 23Zm0 0-12 15m12-14 14 11"/>`,
  "clothing": `<path fill="var(--crust)" d="M64 34 45 42 23 69l18 13 13-13-4 38q32 9 66 0l-5-39 15 13 18-14-24-26-19-7-17 8Z"/><path d="m64 34 12 21 8-12 10 12 9-21M85 48v60M43 78l-13-12m98 9 10-8M57 98q26 5 51 0M94 60h15v13l-7 3-8-4Z"/><path d="M84 35v-9c0-5 9-4 9-12 0-9-12-9-14-2m3 15-28 12m32-12 26 12"/><g fill="currentColor"><circle cx="81" cy="66" r="1.5"/><circle cx="81" cy="81" r="1.5"/><circle cx="81" cy="95" r="1.5"/></g>`,
  "sweet-shop": `<path fill="var(--paper)" d="M48 33h66v11q12 6 12 20v35q0 9-10 10H48q-11 0-11-11V63q0-13 11-19Z"/><path fill="var(--crust)" d="M44 24h74v13H44z"/><path d="M50 27v7m8-7v7m8-7v7m8-7v7m8-7v7m8-7v7m8-7v7m8-7v7M44 57q38-6 76 0"/><g fill="var(--crust)"><g transform="translate(56 76) rotate(-16)"><ellipse rx="10" ry="7"/><path d="m-9-3-6-4v12l6-3m18-5 6-4v12l-6-3m-13-7 4 11"/></g><g transform="translate(83 67) rotate(-16)"><ellipse rx="10" ry="7"/><path d="m-9-3-6-4v12l6-3m18-5 6-4v12l-6-3m-13-7 4 11"/></g><g transform="translate(105 80) rotate(-16)"><ellipse rx="10" ry="7"/><path d="m-9-3-6-4v12l6-3m18-5 6-4v12l-6-3m-13-7 4 11"/></g><g transform="translate(74 92) rotate(-16)"><ellipse rx="10" ry="7"/><path d="m-9-3-6-4v12l6-3m18-5 6-4v12l-6-3m-13-7 4 11"/></g><g transform="translate(99 97) rotate(-16)"><ellipse rx="10" ry="7"/><path d="m-9-3-6-4v12l6-3m18-5 6-4v12l-6-3m-13-7 4 11"/></g></g>`,
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
  return `<svg data-art="${kind}-${parcel ? "b" : "a"}" viewBox="0 0 172 124" aria-hidden="true" stroke="${parcel ? "#65462d" : "var(--accent)"}" fill="none"
    stroke-width="${parcel ? 1.7 : 2.7}" stroke-linecap="round" stroke-linejoin="round"
    style="--crust:${parcel ? "#dcc197" : "#efcc81"};--paper:${parcel ? "#fff4da" : "#fff3c9"}">
    ${parcel ? '<path d="m10 88 112-58 42 48-110 40Z" fill="#eddabc" stroke-dasharray="4 3"/>' : ""}
    ${products[kind]}</svg>`;
}
