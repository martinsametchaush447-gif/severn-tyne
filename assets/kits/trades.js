import { button, call, renderPage } from "./local-page.js";
import { wireQuotes, quoteCss } from "./quote-flow.js";

const process = `<section class="local-steps"><div class="local-wrap"><h2>How it works</h2>
  <ol><li>Choose the job</li><li>Describe the work</li><li>Add your contact details</li></ol>
  <h3>Areas covered</h3><p><span data-if="town">Based in <span data-bind="town"></span>. </span>Include your postcode area so we can check the journey.</p>
  </div></section>`;

export const tradeCss = quoteCss + `
  .local-steps{padding-block:32px;background:var(--hero);color:var(--on-hero)}
  .local-steps h3{margin:24px 0 6px}
  .local-steps h2{font-size:clamp(29px,3vw,44px);margin-bottom:15px}
  .local-steps ol{display:flex;gap:14px 30px;flex-wrap:wrap;counter-reset:steps}.local-steps li{counter-increment:steps}
  .local-steps li:before{content:counter(steps) ".";margin-right:.4em;font-weight:bold}
  .local-kit .quote-services{border-top:1px solid var(--line)}.quote-services .local-row{justify-content:space-between}
  .local-bar .local-action.local-call{gap:10px}.local-bar .quote-link{padding:0 4px;border:0;background:transparent;text-decoration:underline;text-underline-offset:4px;font-weight:650}
  @media(max-width:720px){.local-steps ol{display:grid;gap:9px}}
`;

const ruler = (length, wood) => `<rect x="-8" y="-9" width="${length + 16}" height="18" rx="6" fill="${wood}"/>
  <path d="${Array.from({length:Math.floor((length - 20) / 4)}, (_, index) =>
    `M${13 + index * 4} -8v${index % 5 === 0 ? 7 : index % 2 === 0 ? 5 : 3}`).join(" ")}" stroke-width=".9"/>
  <path d="M14 5h${length - 28}" stroke="#9b814e" stroke-width=".7"/>`;


export default {
  id:"trades",label:"Trades",skin:"field-notes",defaultTagline:"Tell us about the job.",
  describe:({kind,town}) => town ? `${kind.label} in ${town}` : kind.label,
  accents:[
    {key:"forest",label:"Forest",value:"#345549",ink:"#ffffff"},
    {key:"umber",label:"Umber",value:"#6d4835",ink:"#ffffff"},
    {key:"graphite",label:"Graphite",value:"#424c53",ink:"#ffffff"},
  ],
  art:`<svg viewBox="0 17 272 104" fill="none" stroke="#554932" stroke-linejoin="round">
    <g transform="translate(16 101) rotate(-26.4)">${ruler(137.4,"#c9974b")}</g>
    <g transform="translate(139 40) rotate(113.6)">${ruler(69.9,"#edd193")}</g>
    <g transform="translate(111 104) rotate(-25.7)">${ruler(154.3,"#dbb470")}</g>
    <g fill="#9b947a"><circle cx="139" cy="40" r="4.2"/><circle cx="111" cy="104" r="4.2"/></g>
    <path d="m137 41 4-2m-32 66 4-2" stroke-width="1.1"/></svg>`,
  css:tradeCss + `
    .field-notes{--hero:#e9eddd;--paper:#f9f9ee;--ink:#233c30;--line:#b5bfaa;--k-btn-radius:2px;--display:Georgia,serif}
    .field-notes .local-mono{border-radius:2px;background:var(--accent);color:#fff}.field-notes .local-mast{border-bottom:2px solid var(--ink)}
    .field-notes .local-hero{background-color:var(--hero);background-image:linear-gradient(#82927428 1px,transparent 1px),linear-gradient(90deg,#82927428 1px,transparent 1px);background-size:23px 23px;border-bottom:1px solid var(--line)}
    .field-notes .local-trade,.field-notes .local-example,.field-notes .local-steps li:before{font-family:"Courier New",monospace}
    .field-notes .local-copy{position:relative;z-index:1}.field-notes h1{font-weight:bold}
    .field-notes .local-art{align-self:end}.field-notes .local-list strong{font-size:clamp(20px,2vw,29px)}
    .field-notes .local-offer{display:grid;grid-template-columns:.8fr 1.2fr;gap:25px}.field-notes .local-section-head{display:block}.field-notes .local-example{margin-top:10px}
    @media(max-width:720px){.field-notes .local-hero-grid{display:block;position:relative;padding-block:32px 40px}
     .field-notes .local-copy .local-action{margin-top:33px}.field-notes .local-art{position:absolute;right:0;bottom:9px;width:46%}
     .field-notes .local-offer{display:block}.field-notes .local-example{margin-top:3px}}
  `,
  render(root,data) {
    const {jobs} = data.kind;
    const primary = button("Get a quote","data-quote");
    const rows = jobs.map(job => `<li><button type="button" class="local-row" data-quote="${job}" aria-label="Get a quote for ${job}">
      <strong>${job}</strong></button></li>`).join("");
    renderPage(root,data,this,{
      nav:"Services",heading:"Services",example:"Example jobs",rows:`<ul class="local-list quote-services">${rows}</ul>`,primary,
      sticky:call.replace('class="local-call"', 'class="local-action local-call"') + '<button class="local-call quote-link" type="button" data-quote>Get a quote</button>',
      details:process,
    });
    wireQuotes(root,jobs);
  },
};
