import { renderIllustrated, call } from "./illustrated.js";
import { menuArt } from "./menu-art.js";
import { wireDining } from "./restaurant-flow.js";
import { formatMoney } from "../kit-core.js";

const art = `<svg viewBox="0 0 360 245" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
<g stroke-width="2"><path d="M78 55c39-30 70-17 100 7s62 28 86 19M80 61c34-27 63-18 95 6s63 30 90 20"/><path d="M168 56q-1-22 10-36l5 1q-10 21-7 38M181 50q21-35 49-33-12 20-42 29M187 45l30-21M101 46Q84 17 56 19q6 20 43 29M90 41 66 25"/>
<path fill="var(--hero-bg)" d="M153 79c-19-18-44-14-50 1-18-3-35 12-33 32-6 16 1 39 18 54 12 15 33 22 48 15 23 5 47-16 56-41 12-30 7-57-10-65-11-6-21-2-29 4z"/>
<path d="M150 77q-13-17-7-33l4 1q-3 18 10 29l22-9-12 15 18 7-24-3q5 14-2 24l-5-21-18 11 10-15-25-5 25-2z"/>
<path d="M145 87c-28 10-35 43-27 65m42-63q19 25-3 68m-54-67q-27 17-16 48m45 35q10 0 16-8"/>
<path fill="var(--hero-bg)" d="M248 111c-23-17-50-12-59 6-22 4-36 27-29 52 5 21 23 43 40 45 16 12 37 12 53 3 22 0 42-20 48-44 8-28-2-52-19-59-12-7-23-8-34-3z"/>
<path d="M244 110q9-20 12-33l5 3-8 29 24-5-16 12 23 11-30-6 4 26-11-23-18 13 9-17-27-6 27 1-9-19z"/>
<path d="M234 127q-29 26-16 66m38-62q17 35-1 64m-55-67q-22 15-14 41m38 45q13 5 24-4"/>
<path d="M177 54q19-7 24-18m-5 30q20-17 34-14-10 14-28 16"/></g>
<g stroke-width=".9" opacity=".83"><path d="M105 113q-2 25 12 38"/><path d="M108 112q-2 25 12 37"/><path d="M111 112q-2 25 12 36"/><path d="M114 111q-2 25 12 36"/><path d="M117 110q-2 25 12 35"/><path d="M120 108q-2 25 12 35"/><path d="M123 107q-2 25 12 34"/><path d="M126 105q-2 25 12 33"/><path d="M129 103q-2 25 12 33"/><path d="M132 101q-2 25 12 32"/><path d="M135 99q-2 25 12 32"/><path d="M138 97q-2 25 12 31"/><path d="M141 95q-2 25 12 30"/><path d="M144 93q-2 25 12 30"/><path d="M147 92q-2 25 12 29"/><path d="M150 91q-2 25 12 29"/><path d="M153 90q-2 25 12 28"/><path d="M156 89q-2 25 12 27"/><path d="M264 152q2 16-10 31 M266 153q2 16-10 31 M268 154q2 16-10 31 M270 155q2 16-10 31 M272 156q2 16-10 31 M274 157q2 16-10 31 M276 158q2 16-10 31 M278 159q2 16-10 31 M280 160q2 16-10 31 M282 161q2 16-10 31 M284 162q2 16-10 31 M286 163q2 16-10 31"/><path d="M172 146q1 16 13 26 M174 147q1 16 13 26 M176 148q1 16 13 26 M178 149q1 16 13 26 M180 150q1 16 13 26 M182 151q1 16 13 26 M184 152q1 16 13 26 M186 153q1 16 13 26 M188 154q1 16 13 26 M190 155q1 16 13 26 M192 156q1 16 13 26 M194 157q1 16 13 26"/></g></svg>`;

const defaultMenu = [
  { title: "Small plates", items: [
    { id: "tomato-bruschetta", name: "Tomato bruschetta", description: "Toasted sourdough, basil and olive oil", price: 650 },
    { id: "marinated-olives", name: "Marinated olives", description: "Lemon zest and garden herbs", price: 450 },
  ] },
  { title: "From the kitchen", items: [
    { id: "roast-pepper-rigatoni", name: "Roast pepper rigatoni", description: "Sweet peppers, tomatoes and basil", price: 1350 },
    { id: "mushroom-risotto", name: "Mushroom risotto", description: "Arborio rice and roasted mushrooms", price: 1450 },
  ] },
  { title: "Something sweet", items: [
    { id: "lemon-posset", name: "Lemon posset", description: "Lemon cream and shortbread", price: 600 },
  ] },
];
export default {
  id: "restaurant",
  label: "Restaurant or cafe",
  accents: [
    { key: "tomato", label: "Tomato", value: "#993623", ink: "#fff8e8", text: "#993623" },
    { key: "olive", label: "Olive", value: "#495a30", ink: "#fff8e8", text: "#495a30" },
    { key: "cocoa", label: "Cocoa", value: "#7b442f", ink: "#fff8e8", text: "#7b442f" }
  ],
  defaultTagline: "At the table or to take home.",
  describe: (data) => data.town ? `Restaurant in ${data.town}` : "Restaurant",
  render(root, data) {
    const menu = data.kind.menu ?? defaultMenu;
    const list = menu.map(({ title, items }) => {
      const dishes = items.map((dish) => `
        <li><div class="dish-copy"><h4>${dish.name}</h4>${dish.description ? `<p>${dish.description}</p>` : ""}</div>
          <span>${formatMoney(dish.price)}</span><div class="rs-qty" data-item="${dish.id}"></div></li>`).join("");
      return `<h3 class="menu-category">${title}</h3><ul class="menu-list">${dishes}</ul>`;
    }).join("");
    renderIllustrated(root, data, this, {
      nav: 'Menu', art: menuArt(data.kind.id, "b", art),
      section:'<div class="section-head"><h2>On the menu</h2><p>Example menu</p></div>' + list,
      content:data.kind.collectionOnly ? "" : '<section class="table-section"><div class="shop-wrap location-layout"><h2>A table for you</h2><button type="button" class="text-button" data-table>Book a table</button></div></section>',
      barClass: 'rs-bar',
      sticky:call + '<a class="kit-primary rs-bar-book" href="#offer">Order for collection</a><button type="button" class="kit-primary rs-bar-order" data-order hidden><span class="rs-bar-count"></span>View order <span class="rs-bar-total"></span></button>'
    });
    wireDining(root, menu.flatMap((section) => section.items));
  }
};
