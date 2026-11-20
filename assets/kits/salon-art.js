const rose = `<path d="M134 72c-11 16-20 30-18 45m6-24c-17-1-29-9-34-23 19 0 31 7 34 23Zm-5 14c14-14 23-16 36-17-6 13-20 20-36 17Z" fill="#66765c"/>
  <path d="M137 77c-11 7-22 1-26-6-14-1-22-12-17-22-5-12 4-23 17-24 5-12 20-15 28-8 10-5 23 1 26 11 11 3 19 15 12 25 3 12-8 24-23 22-6 6-12 7-17 2Z" fill="#c87574"/>
  <path d="M105 37q10-10 24-8c10-11 26-4 28 3 10 7 6 19-2 24-5 12-24 17-36 8-12-1-18-15-14-27ZM125 39q10-13 22-2l-3 12-14 4-10-8Zm3-1 11 2 1 7m-28-20q-3 14 8 18m25 4q3 10 15 13m-30-10c-1 7 4 12 9 15m-43-18q4 10 14 12"/>`;
const swallow = `<path d="m32 84 48-13C66 57 51 41 37 15c24 8 46 20 70 40-2-16-1-31 4-45 13 19 20 36 21 52 12-1 21-9 32-9 9 0 14 4 17 9l15 4-14 4c-8 12-16 20-37 22-22 3-33-1-46-2l-52 22 23-19-41 5 26-12Z" fill="#323039"/>
  <path d="M49 25q26 16 44 39L66 49m-7-16 28 23m29-31q8 23 8 37m-5-24 1 22m-35 17 19 5" stroke="#f9e7cb"/>
  <path d="M114 79c23 2 35-5 50-18 5-4 11-1 14 2-6 18-22 24-43 23Z" fill="#ce6659"/><circle cx="171" cy="61" r="1.7" fill="#fff3d9"/>`;
const polish = `<g transform="rotate(-10 92 75)"><rect x="59" y="63" width="49" height="43" rx="10" fill="#c16a78"/><rect x="69" y="33" width="29" height="31" rx="3" fill="#603c49"/><path d="M66 80v16m10-57v17" stroke="#f5daca"/></g><g transform="rotate(12 136 70)"><rect x="120" y="62" width="35" height="36" rx="8" fill="#e4aea1"/><path d="M127 62V37h20v25ZM124 77v10"/></g>`;
const compact = `<g transform="rotate(-12 108 66)"><ellipse cx="111" cy="45" rx="42" ry="30" fill="#ebccc8"/><ellipse cx="111" cy="45" rx="35" ry="23" fill="#f8e8dd"/><path d="m91 51 28-19m-17 22 23-17"/><ellipse cx="110" cy="86" rx="50" ry="23" fill="#bc737e"/><ellipse cx="110" cy="82" rx="42" ry="16" fill="#d39c85"/><path d="M94 103h22"/></g>`;
const comb = `<g transform="rotate(-15 106 65)"><rect x="45" y="40" width="125" height="15" rx="6" fill="#b4566f"/><path d="M49 52v26m6-25v26m6-26v26m6-26v26m6-26v26m6-26v26m6-26v26m6-26v26m6-26v26m6-26v26m6-26v26m6-26v26m8-26v26m9-26v26m9-26v26m9-26v26m9-26v26" stroke-width="3"/></g><path d="M42 96c45-18 74 25 128-15m-123 21c44-15 71 23 125-15" stroke="#95445c"/>`;
const brow = `<path d="M51 63q41-44 95-12-38-13-90 17Z" fill="#70454b"/><path d="M63 82q31-24 65-5-20 20-49 12m7-16c-4 15 15 21 21 0m-6 8q-4 6-7-1m34-3 11-4m-22 11 11-2m-47 8-6 5"/>`;

export function salonArt(kind, study, fallback) {
  const drawing = study ? {tattoo:swallow, hair:comb, beauty:compact}[kind] : {tattoo:rose, nails:polish, beauty:brow}[kind];
  if (!drawing) return fallback;
  return `<svg data-art="${kind}-${study ? "b" : "a"}" viewBox="${kind === "tattoo" && !study ? "62 0 150 122" : "15 0 187 124"}" fill="none" stroke="#432b38" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
}
