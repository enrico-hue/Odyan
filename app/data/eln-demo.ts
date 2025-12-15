// app/data/eln-demo.ts

export type CountryCode =
  | "UK"
  | "FR"
  | "IT"
  | "QA"
  | "SA"
  | "AE"
  | "ZA"
  | "MY";

export type Venue = {
  id: string;
  name: string;
  neighbourhood: string;
  city: string;
  country: CountryCode;
  concept: "Cafe" | "Restaurant" | "Kiosk" | "Flagship";
  seats: number;
  avgDailyCovers: number;
  estWeeklySales: number; // GBP or local equivalent, for demo
};

export type Supplier = {
  id: string;
  name: string;
  category: string;
  country: CountryCode;
  city: string;
  typicalProducts: string[];
};

export type Competitor = {
  id: string;
  name: string;
  type: "Cafe" | "Bakery" | "All-day diner" | "Brunch";
  neighbourhood: string;
  city: string;
  country: CountryCode;
  priceLevel: "Low" | "Mid" | "Premium";
};

export type MenuItem = {
  id: string;
  venueId: string;
  name: string;
  category: "Coffee" | "Cake" | "Brunch" | "Lunch" | "Cold drink";
  price: number;
  estWeeklyQty: number;
  estGPPercent: number;
};
export const venues: Venue[] = [
  {
    id: "eln-park-lane",
    name: "EL&N Park Lane",
    neighbourhood: "Mayfair",
    city: "London",
    country: "UK",
    concept: "Flagship",
    seats: 120,
    avgDailyCovers: 480,
    estWeeklySales: 165000,
  },
  {
    id: "eln-hans-crescent",
    name: "EL&N Hans Crescent",
    neighbourhood: "Knightsbridge",
    city: "London",
    country: "UK",
    concept: "Cafe",
    seats: 80,
    avgDailyCovers: 320,
    estWeeklySales: 105000,
  },
  {
    id: "eln-carnaby",
    name: "EL&N Carnaby Street",
    neighbourhood: "Soho",
    city: "London",
    country: "UK",
    concept: "Cafe",
    seats: 70,
    avgDailyCovers: 280,
    estWeeklySales: 90000,
  },
  {
    id: "eln-st-pancras",
    name: "EL&N St Pancras",
    neighbourhood: "Kings Cross",
    city: "London",
    country: "UK",
    concept: "Kiosk",
    seats: 40,
    avgDailyCovers: 210,
    estWeeklySales: 65000,
  },
  // International examples
  {
    id: "eln-doha-mall",
    name: "EL&N Doha Mall of Qatar",
    neighbourhood: "Mall of Qatar",
    city: "Doha",
    country: "QA",
    concept: "Cafe",
    seats: 110,
    avgDailyCovers: 430,
    estWeeklySales: 150000,
  },
  {
    id: "eln-riyadh",
    name: "EL&N Riyadh Front",
    neighbourhood: "Riyadh Front",
    city: "Riyadh",
    country: "SA",
    concept: "Cafe",
    seats: 130,
    avgDailyCovers: 500,
    estWeeklySales: 170000,
  },
  {
    id: "eln-dubai",
    name: "EL&N Dubai DIFC",
    neighbourhood: "DIFC",
    city: "Dubai",
    country: "AE",
    concept: "Cafe",
    seats: 100,
    avgDailyCovers: 400,
    estWeeklySales: 155000,
  },
  {
    id: "eln-paris",
    name: "EL&N Paris",
    neighbourhood: "Opéra",
    city: "Paris",
    country: "FR",
    concept: "Cafe",
    seats: 90,
    avgDailyCovers: 340,
    estWeeklySales: 120000,
  },
];
export const suppliers: Supplier[] = [
  {
    id: "brakes",
    name: "Brakes",
    category: "Full line foodservice",
    country: "UK",
    city: "London",
    typicalProducts: [
      "frozen chips",
      "ambient grocery",
      "frozen bakery",
      "cleaning products",
    ],
  },
  {
    id: "bidfood",
    name: "Bidfood UK",
    category: "Full line foodservice",
    country: "UK",
    city: "Slough",
    typicalProducts: [
      "fresh meat",
      "chilled dairy",
      "ambient grocery",
      "disposables",
    ],
  },
  {
    id: "mammafiore",
    name: "Mammafiore",
    category: "Italian speciality",
    country: "UK",
    city: "London",
    typicalProducts: [
      "cured meats",
      "Italian cheeses",
      "pasta",
      "sauces and antipasti",
    ],
  },
  {
    id: "bread-factory",
    name: "The Bread Factory",
    category: "Artisan bakery",
    country: "UK",
    city: "London",
    typicalProducts: [
      "sourdough loaves",
      "buns and burger rolls",
      "brunch breads",
      "pastries",
    ],
  },
  {
    id: "coffee-union",
    name: "Union Hand-Roasted Coffee",
    category: "Coffee roaster",
    country: "UK",
    city: "London",
    typicalProducts: ["espresso blend", "filter coffee", "cold brew beans"],
  },
  {
    id: "coffee-monmouth",
    name: "Monmouth Coffee Company",
    category: "Coffee roaster",
    country: "UK",
    city: "London",
    typicalProducts: ["specialty espresso", "single origin beans"],
  },
];
export const competitors: Competitor[] = [
  {
    id: "leto-soho",
    name: "L'ETO Soho",
    type: "Cafe",
    neighbourhood: "Soho",
    city: "London",
    country: "UK",
    priceLevel: "Premium",
  },
  {
    id: "leto-knightsbridge",
    name: "L'ETO Knightsbridge",
    type: "Cafe",
    neighbourhood: "Knightsbridge",
    city: "London",
    country: "UK",
    priceLevel: "Premium",
  },
  {
    id: "granger",
    name: "Granger & Co",
    type: "Brunch",
    neighbourhood: "Chelsea",
    city: "London",
    country: "UK",
    priceLevel: "Premium",
  },
  {
    id: "farm-girl",
    name: "Farm Girl",
    type: "Brunch",
    neighbourhood: "Notting Hill",
    city: "London",
    country: "UK",
    priceLevel: "Mid",
  },
  {
    id: "sunday-cafe",
    name: "Sunday in Brooklyn",
    type: "Brunch",
    neighbourhood: "Notting Hill",
    city: "London",
    country: "UK",
    priceLevel: "Premium",
  },
];
export const menuItems: MenuItem[] = [
  {
    id: "pink-latte",
    venueId: "eln-park-lane",
    name: "Spanish Latte",
    category: "Coffee",
    price: 6.5,
    estWeeklyQty: 900,
    estGPPercent: 78,
  },
  {
    id: "pink-cake",
    venueId: "eln-park-lane",
    name: "Raspberry Cheesecake",
    category: "Cake",
    price: 8.5,
    estWeeklyQty: 420,
    estGPPercent: 72,
  },
  {
    id: "avo-toast",
    venueId: "eln-hans-crescent",
    name: "Avo & Feta Toast",
    category: "Brunch",
    price: 14,
    estWeeklyQty: 260,
    estGPPercent: 68,
  },
  {
    id: "shakshuka",
    venueId: "eln-carnaby",
    name: "Green Shakshuka",
    category: "Brunch",
    price: 15,
    estWeeklyQty: 210,
    estGPPercent: 65,
  },
];
