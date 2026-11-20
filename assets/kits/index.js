import { hashString, SAMPLE_NAME } from "../kit-core.js";

/*
  The trade registry. To add a trade, write a kit module in this folder (see README.md)
  and add one entry here. The studio's trade chips and the preview page both read this list,
  and a kit's code is only downloaded when someone picks that trade.
*/
export const TRADES = [
  { id: "barber", label: "Barber", aliases: ["barbers", "barbershop"], styles: [{ id: "a", label: "Barber pole", module: "./barber.js" }, { id: "b", label: "Engraved", module: "./barber-b.js" }] },
  { id: "salon", label: "Salon", aliases: [], styles: [{ id: "a", label: "Ribbon", module: "./salon.js" }, { id: "b", label: "Colour study", module: "./salon-b.js" }] },
  {
    id: "restaurant",
    label: "Restaurant or cafe",
    aliases: ["cafe", "café", "takeaway", "restaurants"],
    styles: [{ id: "a", label: "Menu cover", module: "./restaurant.js" }, { id: "b", label: "Illustrated", module: "./restaurant-b.js" }],
  },
  { id: "shop", label: "Shop", aliases: [], styles: [{ id: "a", label: "Market awning", module: "./shop.js" }, { id: "b", label: "Parcel label", module: "./shop-b.js" }] },
  { id: "garage", label: "Garage", aliases: ["mechanic", "car-repairs"], styles: [{ id: "a", label: "Workshop", module: "./garage.js" }, { id: "b", label: "Blueprint", module: "./garage-b.js" }] },
  { id: "trades", label: "Trades", aliases: [], styles: [{ id: "a", label: "Field notes", module: "./trades.js" }, { id: "b", label: "Block print", module: "./trades-b.js" }] },
];

export const DEFAULT_TRADE = TRADES[0].id;

/** Returns a registered trade id for any input, falling back to the default trade. */
export function resolveTrade(raw) {
  const wanted = String(raw ?? "").trim().toLowerCase();
  const match = TRADES.find((trade) => trade.id === wanted || trade.aliases.includes(wanted));
  return match ? match.id : DEFAULT_TRADE;
}

export function tradeById(id) {
  return TRADES.find((trade) => trade.id === id) ?? TRADES[0];
}

/** Use different hash bits from the accent so the two choices vary independently. */
export function resolveStyle(trade, key, name) {
  const options = trade.styles;
  return options.find((style) => style.id === key) ??
    options[(hashString((name || SAMPLE_NAME).toLowerCase()) >>> 8) % options.length];
}

export async function loadKit(style) {
  const module = await import(style.module);
  return module.default;
}
