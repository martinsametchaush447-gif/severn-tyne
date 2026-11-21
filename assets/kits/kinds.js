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
    { id: "dog-groomer", label: "Dog groomer", action: "Book a groom", heading: "Grooming appointments", tagline: "Choose a wash, coat tidy or full groom for your dog.",
      services: appointments([["Bath and brush", 45, 2800], ["Full coat groom", 90, 5200], ["Paw and face tidy", 30, 1900]]) },
    { id: "alterations", label: "Tailoring & alterations", action: "Book a fitting", heading: "Fittings and prices", tagline: "Bring the garment and the shoes you plan to wear with it.",
      services: appointments([["Trouser hem fitting", 20, 1600], ["Skirt waist adjustment", 30, 2400], ["Sleeve shortening fitting", 30, 2600]]) },
  ],
  restaurant: [
    { id: "restaurant", label: "Restaurant" },
    { id: "cafe", label: "Café", tagline: "Coffee, breakfast and a bite for lunch.", menu: [
      category("Breakfast", [["Eggs on toast", "On buttered sourdough", 650], ["Breakfast roll", "Egg and mushrooms", 525]]),
      category("Lunch", [["Cheddar toastie", "With onion chutney", 625], ["Tomato soup", "With a bread roll", 500]]),
      category("Coffee", [["Cappuccino", "Espresso and steamed milk", 320], ["Long black", "A double shot over hot water", 280]]),
    ] },
    { id: "takeaway", collectionOnly: true, label: "Takeaway", tagline: "Pick a main and a side for collection.", menu: [
      category("Lunch boxes", [["Chicken lunch box", "Chicken, rice and mixed leaves", 750], ["Vegetable lunch box", "Roasted vegetables and rice", 680]]),
      category("Extras", [["Side salad", "Leaves and cucumber", 250], ["Apple juice", "330 ml bottle", 190]]),
    ] },
    { id: "pizza", label: "Pizzeria", tagline: "Choose your pizza and a side for collection.", menu: [
      category("Pizzas", [["Margherita", "Tomato, mozzarella and basil", 950], ["Pepperoni", "Tomato, mozzarella and pepperoni", 1150], ["Funghi", "Mushrooms and garlic", 1050]]),
      category("For the table", [["Dough balls", "With garlic butter", 400], ["Rocket salad", "With lemon dressing", 375]]),
    ] },
    { id: "bakery-cafe", label: "Bakery café", tagline: "A morning bun, a sandwich and a cup of coffee.", menu: [
      category("From the oven", [["Morning bun", "Cinnamon and brown sugar", 325], ["Almond croissant", "Flaked almonds and frangipane", 375]]),
      category("Lunch and coffee", [["Focaccia sandwich", "Roast peppers and pesto", 675], ["Caffè latte", "Espresso with steamed milk", 330]]),
    ] },
    { id: "curry-house", label: "Curry house", tagline: "Choose a curry, then add rice or bread.", menu: [
      category("Curries", [["Chicken bhuna", "Onions, tomatoes and toasted spices", 975], ["Chana masala", "Chickpeas in a spiced tomato sauce", 825], ["King prawn jalfrezi", "Peppers and green chillies", 1295]]),
      category("Rice and bread", [["Pilau rice", "Basmati with cardamom", 325], ["Garlic naan", "Topped with garlic and coriander", 350]]),
    ] },
    { id: "kebab", collectionOnly: true, label: "Kebab & grill", tagline: "Pick a skewer, a flatbread and your sauce.", menu: [
      category("From the grill", [["Chicken shish", "Chargrilled pieces, flatbread and salad", 895], ["Lamb kofta", "Minced lamb skewers with sumac onions", 950]]),
      category("On the side", [["Grilled peppers", "Sweet peppers with lemon", 295], ["Hummus and pitta", "Chickpeas, tahini and warm bread", 395]]),
    ] },
    { id: "chinese", label: "Chinese kitchen", tagline: "Steamed bao, pleated dumplings and noodles.", menu: [
      category("From the steamer", [["Pork and chive dumplings", "Six dumplings with black vinegar", 650], ["Mushroom bao", "Two steamed buns with shiitake filling", 590]]),
      category("From the wok", [["Beef chow mein", "Egg noodles with beef and beansprouts", 890], ["Egg fried rice", "With spring onions", 390]]),
    ] },
    { id: "italian", label: "Italian restaurant", tagline: "Start with antipasti, then choose a plate of pasta.", menu: [
      category("Antipasti", [["Marinated artichokes", "Lemon, parsley and olive oil", 575], ["Crostini ai funghi", "Toasted bread with garlic mushrooms", 650]]),
      category("Pasta", [["Pappardelle al ragù", "Wide ribbons with slow-cooked beef", 1550], ["Lemon ricotta ravioli", "Brown butter and sage", 1475]]),
    ] },
    { id: "turkish", label: "Turkish restaurant", tagline: "Mezze for the table and plates from the charcoal grill.", menu: [
      category("Cold mezze", [["Haydari", "Thick yoghurt with dill and garlic", 475], ["Acılı ezme", "Finely chopped tomato, pepper and chilli", 495]]),
      category("Charcoal grill", [["Adana kebap", "Hand-shaped minced lamb with bulgur", 1595], ["Tavuk şiş", "Marinated chicken, grilled tomato and flatbread", 1495]]),
    ] },
    { id: "coffee-shop", label: "Coffee shop", collectionOnly: true, tagline: "Choose your coffee and a bake to take along.", menu: [
      category("Coffee bar", [["Flat white", "Double espresso with silky milk", 350], ["Batch brew", "A cup of the filter coffee of the day", 310], ["Iced oat latte", "Espresso over ice with oat drink", 410]]),
      category("Bakes", [["Cardamom knot", "A twisted bun with crushed cardamom", 340]]),
    ] },
    { id: "sandwich-bar", label: "Sandwich bar", collectionOnly: true, tagline: "Pick a filling and collect your lunch.", menu: [
      category("Filled rolls", [["Roast beef roll", "Horseradish and watercress", 690], ["Egg and cress", "Soft granary roll with egg mayo", 490]]),
      category("Toasted sandwiches", [["Cheddar melt", "Red onion relish on sourdough", 595], ["Roast veg ciabatta", "Courgette, peppers and basil", 625]]),
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
    { id: "florist", label: "Florist", tagline: "Choose a bouquet for the occasion.", menu: [
      category("Birthdays", [["Apricot posy", "Spray roses and soft peach stems", 2800], ["Bright birthday bunch", "Yellow blooms in a paper wrap", 3200]]),
      category("Thanks and thinking of you", [["Garden hand-tie", "Mixed stems with scented foliage", 3600], ["White and green bouquet", "Pale flowers with eucalyptus", 3400]]),
    ] },
    { id: "fishmonger", label: "Fishmonger", heading: "Today’s catch", tagline: "Choose fish by the portion or the weight.", menu: [
      category("Fillets", [["Haddock fillet", "One 180 g portion", 475], ["Salmon fillet", "One 200 g portion", 620]]),
      category("Shellfish", [["Mussels", "1 kg net", 695], ["Peeled prawns", "250 g tub", 650]]),
    ] },
    { id: "gift-shop", label: "Gift shop", heading: "Gifts to collect", tagline: "Set aside a small gift and a card to go with it.", menu: [
      category("For the home", [["Stoneware bud vase", "Speckled glaze", 1800], ["Beeswax tapers", "Pair of dipped candles", 950]]),
      category("Paper goods", [["Botanical card", "Blank inside with envelope", 325], ["Pocket sketchbook", "Unlined recycled paper", 650]]),
    ] },
    { id: "clothing", label: "Clothing boutique", heading: "Try on in store", tagline: "Choose a few pieces for the fitting room.", menu: [
      category("Separates", [["Linen overshirt", "Oatmeal · medium"], ["Pleated trousers", "Ink blue · size 12"]]),
      category("Knitwear", [["Ribbed cardigan", "Moss green · small"], ["Fisherman jumper", "Ecru · large"]]),
    ] },
    { id: "sweet-shop", label: "Sweet shop", heading: "The sweet counter", tagline: "Choose a paper bag of pick and mix or a box to share.", menu: [
      category("From the jars", [["Rhubarb and custards", "150 g paper bag", 210], ["Sherbet lemons", "150 g paper bag", 210]]),
      category("To share", [["Vanilla fudge", "250 g box", 495], ["Liquorice twists", "Six twists", 185]]),
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
    { id: "mobile-mechanic", label: "Mobile mechanic", tagline: "We come to you. Choose a job and request a visit.",
      jobs: ["Battery replacement", "Starting fault check", "Oil and filter change", "Warning light check"],
      problems: ["The car will not start on the drive", "A battery warning light", "A service is due"] },
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
    { id: "cleaner", label: "Cleaner", tagline: "Choose a regular house clean or an end-of-tenancy visit.",
      jobs: ["Domestic clean", "Deep clean", "End-of-tenancy clean"],
      questions: [["Bedrooms", ["Studio", "1", "2", "3", "4", "5 or more"]], ["How often", ["Once", "Weekly", "Fortnightly", "Monthly"]]] },
    { id: "decorator", label: "Painter & decorator", tagline: "Tell us which rooms or outside surfaces need decorating.",
      jobs: ["Painting", "Wallpaper hanging", "Woodwork preparation"],
      questions: [["Rooms or areas", null], ["Inside or outside", ["Inside", "Outside", "Both"]]] },
    { id: "landscaper", label: "Landscaper", tagline: "Plan a new patio, fence or lawn.",
      jobs: ["Patio laying", "Fence installation", "Turfing", "Garden steps"] },
  ],
  clinic: [
    { id: "physio", label: "Physiotherapy", action: "Book an appointment", heading: "Physiotherapy appointments", tagline: "Choose an initial appointment or a follow-up.",
      services: appointments([["Initial physiotherapy appointment", 45, 5500], ["Follow-up appointment", 30, 4000]]) },
    { id: "gym-pt", label: "Personal training", action: "Book a session", heading: "Training sessions", tagline: "Choose an introduction to the gym or a one-to-one session.",
      services: appointments([["Gym introduction", 30, 2000], ["One-to-one training", 60, 4200], ["Technique session", 45, 3200]]) },
  ],
};

export function resolveKind(trade, key) {
  const kinds = KINDS[trade];
  return kinds.find((kind) => kind.id === key) ?? kinds[0];
}
