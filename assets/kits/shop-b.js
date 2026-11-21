import shop from "./shop.js";

export default {
  ...shop,skin:"parcel",
  accents:[
    {key:"dispatch",label:"Postal blue",value:"#294768",ink:"#ffffff"},
    {key:"moss",label:"Moss",value:"#465e37",ink:"#ffffff"},
    {key:"brick",label:"Brick",value:"#873c32",ink:"#ffffff"},
  ],
  art:`<svg viewBox="0 0 310 196" fill="none" stroke="#60462d" stroke-linejoin="round">
    <path d="m32 88 139-63 109 44-143 76z" fill="#dcb985" stroke-width="2"/><path d="m32 88 105 57v32L35 119z" fill="#b88b59" stroke-width="2"/>
    <path d="m137 145 143-76-4 33-139 75z" fill="#c69c68" stroke-width="2"/><path d="m137 173 36-32 48-8 55-30" stroke-width="1.3"/>
    <g stroke="#eee1b9" stroke-width="4"><path d="m74 70 101 55-3 32m47-113-142 70 2 30"/><path d="M146 95c-15-5-31-28-21-29 12-2 17 14 21 29Zm0 0c6-7 14-27 24-22 8 5-9 19-24 22Zm0 0-15 17m15-17 27 5"/></g>
    <path d="m160 103 44-23 22 9 2 13-47 23z" fill="#fff3d6"/><circle cx="216" cy="94" r="2" stroke-width="2"/>
    <path d="m175 101 21-11m-16 15 20-10m-15 14 8-4" stroke="var(--accent)" stroke-width="2"/>
    <path d="M32 152 89 184m60-2 62-32" opacity=".48"/>
  </svg>`,
  css:`
    .parcel{--hero:#e4ccab;--paper:#f5ead6;--ink:#262b2d;--line:#b6a78d;--k-btn-radius:0;
     --display:"Franklin Gothic Medium","Arial Narrow",Arial,sans-serif;--weight:750}
    .parcel .local-mast{border-bottom:1px dashed var(--ink)}.parcel .local-mono{background:var(--accent);color:var(--accent-ink);border:0;font-weight:700}
    .parcel .local-trade{font-family:"Courier New",monospace}
    #kit .parcel :is(.local-group,.local-example,.local-price,.visit-note,.local-foot){font-family:var(--k-font-text);font-variant-numeric:tabular-nums}
    .parcel .local-hero{padding-block:clamp(14px,2vw,30px);border-bottom:1px dashed var(--ink)}
    .parcel .local-hero-grid{position:relative;background:#fff9e9;border:1px solid var(--ink);box-shadow:4px 4px 0 #2d373a;
      column-gap:20px;padding:clamp(22px,4vw,58px);grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
    .parcel .local-art{background:repeating-linear-gradient(-48deg,transparent 0 5px,#66594313 5px 6px);border-left:1px dashed var(--ink)}
    .parcel .local-section-head{border-bottom:3px solid var(--ink);padding-bottom:15px}.parcel .local-group{margin:24px 0 3px;font-size:18px;color:var(--accent-text)}
    .parcel .local-list>li{border-block-end:1px dashed #9c907c}.parcel .local-info{border-inline-start:5px solid var(--accent);padding-inline-start:22px}
    @media(max-width:720px){.parcel .local-hero-grid{display:block;padding:18px 18px 22px}.parcel .local-art{width:116px;height:73px;float:right;position:absolute;bottom:12px;right:7px;border:0;background:none}
     .parcel .local-copy .local-action{max-width:calc(100% - 90px)}.parcel .local-copy h1{font-size:clamp(39px,11vw,60px)}}
    @media(max-width:720px){
      [data-kind=clothing] .parcel{--piece-art:min(23vw,96px)}
      [data-kind=clothing] .parcel .local-art{width:var(--piece-art)}
      [data-kind=clothing] .parcel .local-copy .local-action{max-width:calc(100% - var(--piece-art))}}
    @media(max-width:359px){.parcel .local-art{width:81px;bottom:7px}.parcel .local-copy .local-action{max-width:calc(100% - 56px)}}
  `,
};
