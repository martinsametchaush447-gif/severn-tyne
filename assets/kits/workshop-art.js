const van = `<path fill="var(--part)" d="M28 36h106l12 12 12 17 26 9v22H28Z"/><path d="M130 42h7l18 23h-25Zm-11-6v54m10-16h9m32 3h11M38 44h70v39H38Z"/><path fill="var(--part)" d="M55 74 76 53c-3-10 5-15 12-14l-5 9 5 4 9-5c1 10-5 16-14 14L62 81Z"/><g fill="var(--part)"><circle cx="59" cy="94" r="13"/><circle cx="155" cy="94" r="13"/><circle cx="59" cy="94" r="5"/><circle cx="155" cy="94" r="5"/></g>`;
const wheel = `<g transform="rotate(-13 115 63)"><ellipse cx="118" cy="66" rx="52" ry="52" fill="var(--part)"/><ellipse cx="106" cy="63" rx="50" ry="52" fill="var(--part)"/><ellipse cx="106" cy="63" rx="34" ry="36"/><ellipse cx="106" cy="63" rx="26" ry="28"/><ellipse cx="106" cy="63" rx="9" ry="10"/>
  <path d="m101 53-9-13m20 13 12-10m-7 21 13 4m-22 7-2 14m-10-21-13 6M142 28l11 5m-6 2 11 6m-7 1 11 7m-8 1 11 6m-10 3 11 6m-11 3 11 6m-14 3 11 5m-14 2 10 5m-16 2 11 5m-18 1 11 4m-17 2 9 3"/></g>`;
const panel = `<path fill="var(--part)" d="m37 83 25-47q4-7 14-8l70-2q8 0 13 10l14 36-10 33-109 2q-16-3-17-24Z"/><path d="m59 62 14-26 68-2q6 0 9 6l9 20Zm-15 9 118-4m-6 10h-17m-76 22 91-2"/><path d="m83 76 13 4-9 4 16 3m-26-6 9 2" stroke-width="1.3"/>`;

export function workshopArt(kind, blueprint, fallback) {
  const part = {"mobile-mechanic":van, tyres:wheel, "body-shop":panel}[kind];
  if (!part) return fallback;
  return `<svg data-art="${kind}-${blueprint ? "b" : "a"}" class="${blueprint ? "" : "gg-car"}" viewBox="0 0 220 128" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" style="--part:${blueprint ? "var(--hero-bg)" : "var(--k-bg)"}">
    ${blueprint ? '<path d="M19 17h181M20 116h181M37 8v114M177 7v113" opacity=".5" stroke-dasharray="2 4"/>' : ""}
    ${part}
    <path d="M94 89 61 111H17m119-64 36-26h31" stroke-width="1"/><g fill="currentColor" stroke="none"><circle cx="94" cy="89" r="2"/><circle cx="136" cy="47" r="2"/></g></svg>`;
}
