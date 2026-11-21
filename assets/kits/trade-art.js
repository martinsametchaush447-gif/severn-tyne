const drawings = {
  cleaner: `<path fill="var(--tool)" d="M35 55h75l-9 46H46Z"/><path d="M44 57c0-55 55-55 55 0M39 62h68m-59 7 5 22m10-22 2 22"/><path fill="var(--tool)" d="m120 56 4-15h18l3 16 10 9v32h-40V70Z"/><path d="M126 41v-9h-11v-6h36v9h-13v6m-16-8-4 10m0 29h33v16h-33Z"/>`,
  decorator: `<path fill="var(--tool)" d="M38 28h88v24H38z"/><path d="M42 32v16m7-15v11m65-12v14m12-6h11v21l-47 9v10"/><path fill="var(--tool)" d="M83 79h13l-1 24q-5 8-11 0Z"/><path d="M28 24v32m6 4q30 2 41-2m29-1 19-2"/>`,
  landscaper: `<path fill="var(--tool)" d="M21 83 80 56l96 21-60 31Z"/><path d="m39 76 91 23m-73-33 91 23m-69-13 17-9m11 27 20-10m-68 8 19-10"/><path d="M74 53V26l8-7 8 7v27m4 1V28l8-7 8 7v30m4 1V31l8-7 8 7v32m4 2V35l8-7 8 7v33M72 39l81 13"/>`,
  plumber: `<path fill="var(--tool)" d="M40 32h30v26q0 13 13 13h21V59h28v17q0 25-26 25H78q-38 0-38-38Z"/><path d="M36 29h38v9H36zm64 25h36v10h-36zM46 49v16q0 27 34 29m-29-52h12m44 46h11"/><path d="M154 54c-1 9-12 16-12 25a11 11 0 0 0 22 0c0-9-9-16-10-25Z"/>`,
  electrician: `<g transform="rotate(-12 102 64)"><rect x="42" y="25" width="124" height="77" rx="6" fill="var(--tool)"/><rect x="49" y="31" width="109" height="64" rx="4"/><g fill="var(--mark)" stroke="none"><path d="M92 45h9v16h-9zM70 71h16v9H70zm37 0h16v9h-16z"/></g><circle cx="54" cy="63" r="2"/><circle cx="152" cy="63" r="2"/><rect x="128" y="39" width="17" height="20" rx="2"/><path d="m132 42-1 10h10"/></g>`,
  roofer: `<path fill="var(--tool)" d="m21 89 75-65 88 52-9 12-79-45-65 57Z"/><path d="m42 84 54-46 65 38-45 31Zm25-22 77 28m-58-46 72 32m-94 6 64 18m-26-58-13 12m30-2-13 12m-29-6L65 75m40-7L92 81m37-7-12 11m-34-4-14 11m35-4-13 11"/><path d="M132 45V25h16v31m-18-31h21v-6h-21z" fill="var(--tool)"/>`,
  gardener: `<path d="M62 104q35-29 50-77m-33 56q-30-2-31-33 25 4 31 33Zm14-19Q72 57 77 32q20 8 16 32Zm12-22q-14-22 10-32 5 20-10 32Zm-21 35q7-28 34-27-5 24-34 27Zm-13 18q12-25 38-21-8 22-38 21Z" fill="var(--tool)"/><path d="m125 92 28-37m-32 38 10 6 25-38-6-5Zm31-39c-3-16 14-30 26-31 4 17-5 30-21 36Z" fill="var(--tool)"/>`,
};

export function tradeArt(kind, print, fallback) {
  if (!drawings[kind]) return fallback;
  return `<svg data-art="${kind}-${print ? "b" : "a"}" viewBox="10 7 183 105" aria-hidden="true" fill="none" stroke="${print ? "#edc68e" : "#304e40"}" stroke-width="${print ? 3 : 1.7}"
    stroke-linecap="round" stroke-linejoin="round" style="--tool:${print ? "#414744" : "#ddcaa1"};--mark:${print ? "#edc68e" : "#304e40"}">
    ${drawings[kind]}</svg>`;
}
