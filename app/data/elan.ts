export type ElanVenue = {
  id: string;
  shortName: string;
  city: string;
  countryCode: string;
  lat: number;
  lng: number;
};

export type ElanCompetitorType =
  | "brunch_cafe"
  | "coffee_chain"
  | "dessert_cafe"
  | "restaurant"
  | "hotel_cafe"
  | "bakery";

export type ElanCompetitorStrength =
  | "brunch"
  | "coffee"
  | "desserts"
  | "decor"
  | "location"
  | "loyalty"
  | "food";

export type ElanCompetitor = {
  id: string;
  venueId: string;
  name: string;
  type: ElanCompetitorType;
  priceLevel: "£" | "££" | "£££";
  mainChannel: "dine_in" | "delivery" | "mixed";
  strength: ElanCompetitorStrength;
  lat: number;
  lng: number;
};

export type ElanMenuCategory = {
  id: string;
  name: string;
  group: "brunch" | "dessert" | "drinks";
};

export type ElanMenuItem = {
  id: string;
  venueId: string;
  categoryId: string;
  name: string;
  price: number;
  gpBand: "high" | "medium" | "low";
  popularity: "hero" | "strong" | "support";
  allergens: string[];
  isDeliveryFriendly: boolean;
};

export type ElanReputationSnapshotSource =
  | "google"
  | "tripadvisor"
  | "deliveroo"
  | "ubereats"
  | "justeat";

export type ElanReputationSnapshot = {
  id: string;
  venueId: string;
  source: ElanReputationSnapshotSource;
  rating: number;
  reviewsLast30d: number;
  sentimentScore: number;
  categoryFocus: "service" | "food" | "decor" | "delivery";
  note: string;
};

export type ElanDeliveryStatPlatform = "deliveroo" | "ubereats" | "justeat";

export type ElanDeliveryStat = {
  id: string;
  venueId: string;
  platform: ElanDeliveryStatPlatform;
  last30dOrders: number;
  avgPrepMinutes: number;
  avgRating: number;
  enabled: boolean;
};

/* VENUES */

export const elanVenues: ElanVenue[] = [
  {
    id: "elan-market-place",
    shortName: "Market Place London",
    city: "London",
    countryCode: "UK",
    lat: 51.5152,
    lng: -0.1416
  },
  {
    id: "elan-oxford-circus",
    shortName: "Oxford Circus (W1)",
    city: "London",
    countryCode: "UK",
    lat: 51.5159,
    lng: -0.1411
  },
  {
    id: "elan-knightsbridge",
    shortName: "Knightsbridge",
    city: "London",
    countryCode: "UK",
    lat: 51.5014,
    lng: -0.1598
  },
  {
    id: "elan-selfridges",
    shortName: "Selfridges",
    city: "London",
    countryCode: "UK",
    lat: 51.5144,
    lng: -0.1531
  }
];

/* COMPETITORS – simplified sample set */

export const elanCompetitors: ElanCompetitor[] = [
  {
    id: "comp-pret-oxford",
    venueId: "elan-oxford-circus",
    name: "Pret A Manger Oxford Circus",
    type: "coffee_chain",
    priceLevel: "£",
    mainChannel: "mixed",
    strength: "coffee",
    lat: 51.5154,
    lng: -0.1404
  },
  {
    id: "comp-gails-oxford",
    venueId: "elan-oxford-circus",
    name: "GAIL's Bakery Oxford Circus",
    type: "bakery",
    priceLevel: "££",
    mainChannel: "mixed",
    strength: "desserts",
    lat: 51.5161,
    lng: -0.1399
  },
  {
    id: "comp-starbucks-oxford",
    venueId: "elan-oxford-circus",
    name: "Starbucks Oxford Circus",
    type: "coffee_chain",
    priceLevel: "£",
    mainChannel: "mixed",
    strength: "loyalty",
    lat: 51.5163,
    lng: -0.1422
  },
  {
    id: "comp-pink-brunch",
    venueId: "elan-market-place",
    name: "Pink Avenue Brunch",
    type: "brunch_cafe",
    priceLevel: "££",
    mainChannel: "dine_in",
    strength: "brunch",
    lat: 51.516,
    lng: -0.1405
  },
  {
    id: "comp-central-roast",
    venueId: "elan-market-place",
    name: "Central Roast & Bakehouse",
    type: "restaurant",
    priceLevel: "££",
    mainChannel: "dine_in",
    strength: "food",
    lat: 51.5165,
    lng: -0.1421
  },
  {
    id: "comp-dessert-lab",
    venueId: "elan-market-place",
    name: "Knightsbridge Dessert Lab",
    type: "dessert_cafe",
    priceLevel: "£££",
    mainChannel: "mixed",
    strength: "desserts",
    lat: 51.5009,
    lng: -0.1604
  }
];

/* MENU CATEGORIES */

export const elanMenuCategories: ElanMenuCategory[] = [
  { id: "cat_breakfast", name: "Breakfast", group: "brunch" },
  { id: "cat_brunch_classics", name: "Brunch classics", group: "brunch" },
  { id: "cat_cakes", name: "Cakes", group: "dessert" },
  { id: "cat_pastry", name: "Pastry", group: "dessert" },
  { id: "cat_coffee", name: "Coffee", group: "drinks" },
  { id: "cat_house_drinks", name: "House drinks", group: "drinks" },
  { id: "cat_hot_chocolate", name: "Hot chocolate", group: "drinks" }
];

/* MENU ITEMS – small but realistic sample */

export const elanMenuItems: ElanMenuItem[] = [
  {
    id: "item-french-toast",
    venueId: "elan-oxford-circus",
    categoryId: "cat_brunch_classics",
    name: "Brioche French Toast",
    price: 14.5,
    gpBand: "medium",
    popularity: "hero",
    allergens: ["gluten", "milk", "egg"],
    isDeliveryFriendly: false
  },
  {
    id: "item-avocado-toast",
    venueId: "elan-oxford-circus",
    categoryId: "cat_brunch_classics",
    name: "Avocado Toast",
    price: 13,
    gpBand: "high",
    popularity: "strong",
    allergens: ["gluten"],
    isDeliveryFriendly: true
  },
  {
    id: "item-pistachio-cake",
    venueId: "elan-oxford-circus",
    categoryId: "cat_cakes",
    name: "Pistachio & Rose Cake",
    price: 8.5,
    gpBand: "high",
    popularity: "hero",
    allergens: ["gluten", "nuts", "milk", "egg"],
    isDeliveryFriendly: true
  },
  {
    id: "item-berry-cheesecake",
    venueId: "elan-market-place",
    categoryId: "cat_cakes",
    name: "Baked Berry Cheesecake",
    price: 8.2,
    gpBand: "medium",
    popularity: "strong",
    allergens: ["gluten", "milk", "egg"],
    isDeliveryFriendly: true
  },
  {
    id: "item-flat-white",
    venueId: "elan-market-place",
    categoryId: "cat_coffee",
    name: "Flat White",
    price: 4.2,
    gpBand: "high",
    popularity: "hero",
    allergens: ["milk"],
    isDeliveryFriendly: true
  },
  {
    id: "item-iced-latte",
    venueId: "elan-market-place",
    categoryId: "cat_coffee",
    name: "Iced Latte",
    price: 4.8,
    gpBand: "high",
    popularity: "strong",
    allergens: ["milk"],
    isDeliveryFriendly: true
  }
];

/* REPUTATION SNAPSHOTS */

export const elanReputationSnapshots: ElanReputationSnapshot[] = [
  {
    id: "rep-oxford-google",
    venueId: "elan-oxford-circus",
    source: "google",
    rating: 4.5,
    reviewsLast30d: 120,
    sentimentScore: 79,
    categoryFocus: "service",
    note: "Guests highlight friendly staff and Instagrammable decor."
  },
  {
    id: "rep-oxford-deliveroo",
    venueId: "elan-oxford-circus",
    source: "deliveroo",
    rating: 4.3,
    reviewsLast30d: 64,
    sentimentScore: 73,
    categoryFocus: "delivery",
    note: "Some comments on packaging and travel time for hot dishes."
  },
  {
    id: "rep-market-google",
    venueId: "elan-market-place",
    source: "google",
    rating: 4.6,
    reviewsLast30d: 87,
    sentimentScore: 82,
    categoryFocus: "food",
    note: "Strong feedback on cakes and brunch plates."
  }
];

/* DELIVERY STATS */

export const elanDeliveryStats: ElanDeliveryStat[] = [
  {
    id: "deliv-oxford-deliveroo",
    venueId: "elan-oxford-circus",
    platform: "deliveroo",
    last30dOrders: 1450,
    avgPrepMinutes: 14,
    avgRating: 4.4,
    enabled: true
  },
  {
    id: "deliv-oxford-ubereats",
    venueId: "elan-oxford-circus",
    platform: "ubereats",
    last30dOrders: 860,
    avgPrepMinutes: 15,
    avgRating: 4.3,
    enabled: true
  },
  {
    id: "deliv-market-deliveroo",
    venueId: "elan-market-place",
    platform: "deliveroo",
    last30dOrders: 980,
    avgPrepMinutes: 13,
    avgRating: 4.5,
    enabled: true
  }
];
