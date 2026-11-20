// Authored examples only. Prices are in pence and appointment lengths in minutes.
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function appointments(rows) {
  return rows.map(([name, minutes, price]) => ({ id: slug(name), name, minutes, price }));
}

function category(title, rows) {
  return { id: slug(title), title, items: rows.map(([name, description, price]) =>
    ({ id: slug(name), name, description, price })) };
}

export const KINDS = {
  barber: [
    { id: "barber", label: "Barber" },
    { id: "mens-grooming", label: "Men’s grooming", tagline: "Pick a beard shape, a shave or a tidy-up.",
      services: appointments([["Beard sculpt", 30, 2000], ["Hot towel razor shave", 40, 2600], ["Neckline tidy", 15, 1200], ["Beard and moustache shape", 40, 2800]]) },
  ],
  salon: [
    { id: "hair", label: "Hair salon", tagline: "Choose a cut, a colour or a finish.",
      services: appointments([["Cut and blow-dry", 60, 4200], ["Root colour", 75, 5500], ["Fringe trim", 15, 900], ["Blow-dry and style", 40, 3000]]) },
    { id: "nails", label: "Nail salon", tagline: "From a file and polish to a fresh set.",
      services: appointments([["File and polish", 30, 1800], ["Gel manicure", 45, 2900], ["Builder gel infill", 60, 3400], ["Gel removal", 20, 1200]]) },
    { id: "beauty", label: "Beauty salon", tagline: "Make time for brows, lashes or a facial.",
      services: appointments([["Brow shape", 20, 1400], ["Lash tint", 30, 1800], ["Express facial", 40, 3200], ["Brow shape and tint", 35, 2400]]) },
    { id: "tattoo", label: "Tattoo studio", tagline: "Talk through your design, size and placement.",
      services: appointments([["New design consultation", 30], ["Cover-up consultation", 40], ["Sleeve planning", 45]]) },
  ],
  restaurant: [
    { id: "restaurant", label: "Restaurant" },
    { id: "cafe", label: "Café", tagline: "Coffee, breakfast and a bite for lunch.", menu: [
      category("Breakfast", [["Eggs on toast", "On buttered sourdough", 650], ["Breakfast roll", "Egg and mushrooms", 525]]),
      category("Lunch", [["Cheddar toastie", "With onion chutney", 625], ["Tomato soup", "With a bread roll", 500]]),
      category("Coffee", [["Cappuccino", "Espresso and steamed milk", 320], ["Long black", "A double shot over hot water", 280]]),
    ] },
    { id: "takeaway", label: "Takeaway", tagline: "Pick a main and a side for collection.", menu: [
      category("From the grill", [["Chicken wrap", "With crunchy slaw", 750], ["Grilled halloumi wrap", "With peppers and yoghurt", 725]]),
      category("On the side", [["Seasoned fries", "With paprika salt", 350], ["Garlic dip", "A small pot", 100]]),
    ] },
    { id: "pizza", label: "Pizzeria", tagline: "Choose your pizza and a side for collection.", menu: [
      category("Pizzas", [["Margherita", "Tomato, mozzarella and basil", 950], ["Pepperoni", "Tomato, mozzarella and pepperoni", 1150], ["Funghi", "Mushrooms and garlic", 1050]]),
      category("For the table", [["Dough balls", "With garlic butter", 400], ["Rocket salad", "With lemon dressing", 375]]),
    ] },
    { id: "bakery-cafe", label: "Bakery café", tagline: "A morning bun, a sandwich and a cup of coffee.", menu: [
      category("From the oven", [["Morning bun", "Cinnamon and brown sugar", 325], ["Almond croissant", "Flaked almonds and frangipane", 375]]),
      category("Lunch and coffee", [["Focaccia sandwich", "Roast peppers and pesto", 675], ["Caffè latte", "Espresso with steamed milk", 330]]),
    ] },
  ],
  shop: [
    { id: "butcher", label: "Butcher", tagline: "Choose your cuts for collection.", menu: [
      category("Cuts", [["Rump steaks", "Pack of two", 1200], ["Lamb chops", "Pack of four", 950]]),
      category("For the pan", [["Pork sausages", "Pack of six", 475], ["Beef mince", "500 g pack", 550]]),
    ] },
    { id: "bakery", label: "Bakery", tagline: "Set aside a loaf and something sweet.", menu: [
      category("Loaves", [["Country sourdough", "One large loaf", 450], ["Wholemeal tin", "One sliced loaf", 320]]),
      category("Buns and pastries", [["Cinnamon swirl", "One bun", 275], ["Butter croissant", "One pastry", 235]]),
    ] },
    { id: "deli", label: "Deli", tagline: "Put together a selection from the deli counter.", menu: [
      category("Cheese and charcuterie", [["Manchego wedge", "150 g portion", 490], ["Sliced chorizo", "100 g portion", 375]]),
      category("Counter pots", [["Marinated olives", "200 g pot", 325], ["Roasted peppers", "200 g pot", 295]]),
    ] },
    { id: "grocer", label: "Greengrocer", tagline: "Pick your fruit and veg for collection.", menu: [
      category("Vegetables", [["Carrot bunch", "One bunch", 160], ["New potatoes", "1 kg bag", 240]]),
      category("Fruit", [["Eating apples", "Bag of six", 225], ["Conference pears", "Bag of four", 195]]),
    ] },
  ],
  garage: [
    { id: "garage", label: "Garage" },
    { id: "tyres", label: "Tyre workshop", tagline: "Tyre fitting, wheel balancing and puncture checks.",
      jobs: ["Tyre fitting", "Puncture inspection", "Wheel balancing", "Tracking check"],
      problems: ["A tyre slowly loses pressure", "The tread wears on one side", "The steering wheel vibrates at speed"] },
    { id: "body-shop", label: "Body shop", tagline: "Talk to the workshop about scratches, dents and paintwork.",
      jobs: ["Dent assessment", "Bumper repair", "Paint matching", "Panel repair"],
      problems: ["A dent in a door", "A scuffed bumper", "Paint scratched down to the primer"] },
  ],
  trades: [
    { id: "plumber", label: "Plumber", tagline: "Describe the leak, repair or fitting you have in mind.",
      jobs: ["Leaking pipe", "Tap repair", "Radiator fitting", "Bathroom plumbing"] },
    { id: "electrician", label: "Electrician", tagline: "Tell us which sockets, lights or circuits need attention.",
      jobs: ["Socket replacement", "Lighting installation", "Fault finding", "Outdoor power"] },
    { id: "builder", label: "Builder", tagline: "Tell us about the building work you are planning.",
      jobs: ["Brickwork", "Garden wall", "Internal alterations", "Repointing"] },
    { id: "roofer", label: "Roofer", tagline: "Describe the roof or gutter work you need.",
      jobs: ["Slipped tile", "Flat roof repair", "Gutter replacement", "Flashing repair"] },
    { id: "gardener", label: "Gardener", tagline: "Tell us what needs doing in your garden.",
      jobs: ["Hedge trimming", "Lawn care", "Planting", "Garden clearance"] },
  ],
};

export function resolveKind(trade, key) {
  const kinds = KINDS[trade];
  return kinds.find((kind) => kind.id === key) ?? kinds[0];
}
