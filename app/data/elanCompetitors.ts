// app/data/elanCompetitors.ts

export type ChannelFocus = "all" | "dine-in" | "delivery" | "mixed";
export type CompetitorType = "all" | "brunch" | "dessert" | "coffee" | "bakery";

export type ElanVenue = {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  address: string;
};

export type ElanCompetitor = {
  id: string;
  venueId: string; // which EL&N it is “competing” with
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  channel: ChannelFocus;
  competitorType: CompetitorType;
  overlap: number;           // % menu / occasion overlap
  rating: number;            // Google / Deliveroo style rating
  gpRiskPerWeek: number;     // £ GP risk per week
  priceIndexVsYou: number;   // 100 = same price level as EL&N
  favourite?: boolean;       // “enemy to watch”
};

// NOTE: coords are approximations around Oxford Circus / Soho.
// This is enough to make the map + table realistic.

export const ELAN_VENUES: ElanVenue[] = [
  {
    id: "oxford-circus",
    name: "EL&N Oxford Circus",
    shortName: "Oxford Circus",
    lat: 51.5154,
    lng: -0.1410,
    address: "Oxford Circus, London W1"
  },
  {
    id: "st-christophers-place",
    name: "EL&N St Christopher's Place",
    shortName: "St Christopher's",
    lat: 51.5144,
    lng: -0.1470,
    address: "St Christopher's Pl, London W1"
  },
  {
    id: "soho",
    name: "EL&N Soho",
    shortName: "Soho",
    lat: 51.5136,
    lng: -0.1347,
    address: "Soho, London W1"
  }
];

export const ELAN_COMPETITORS: ElanCompetitor[] = [
  // Around Oxford Circus
  {
    id: "gails-oxford",
    venueId: "oxford-circus",
    name: "GAIL's Bakery Oxford Circus",
    lat: 51.5158,
    lng: -0.1418,
    distanceKm: 0.09,
    channel: "all",
    competitorType: "bakery",
    overlap: 40,
    rating: 4.3,
    gpRiskPerWeek: 940,
    priceIndexVsYou: 100,
    favourite: true
  },
  {
    id: "leto-oxford",
    venueId: "oxford-circus",
    name: "L'ETO Oxford Circus",
    lat: 51.5152,
    lng: -0.1392,
    distanceKm: 0.11,
    channel: "all",
    competitorType: "dessert",
    overlap: 55,
    rating: 4.4,
    gpRiskPerWeek: 1150,
    priceIndexVsYou: 108,
    favourite: true
  },
  {
    id: "ole-steen-oxford",
    venueId: "oxford-circus",
    name: "Ole & Steen",
    lat: 51.5161,
    lng: -0.1397,
    distanceKm: 0.14,
    channel: "all",
    competitorType: "bakery",
    overlap: 35,
    rating: 4.2,
    gpRiskPerWeek: 720,
    priceIndexVsYou: 96
  },
  {
    id: "pret-oxford",
    venueId: "oxford-circus",
    name: "Pret A Manger (Oxford St)",
    lat: 51.5150,
    lng: -0.1425,
    distanceKm: 0.10,
    channel: "delivery",
    competitorType: "coffee",
    overlap: 25,
    rating: 4.1,
    gpRiskPerWeek: 540,
    priceIndexVsYou: 88
  },
  {
    id: "costa-oxford",
    venueId: "oxford-circus",
    name: "Costa Coffee",
    lat: 51.5148,
    lng: -0.1434,
    distanceKm: 0.16,
    channel: "dine-in",
    competitorType: "coffee",
    overlap: 20,
    rating: 4.0,
    gpRiskPerWeek: 410,
    priceIndexVsYou: 82
  },

  // Around St Christopher's Place
  {
    id: "leto-stchris",
    venueId: "st-christophers-place",
    name: "L'ETO St Christopher's Place",
    lat: 51.5143,
    lng: -0.1474,
    distanceKm: 0.02,
    channel: "all",
    competitorType: "dessert",
    overlap: 65,
    rating: 4.5,
    gpRiskPerWeek: 1320,
    priceIndexVsYou: 110,
    favourite: true
  },
  {
    id: "angelina-stchris",
    venueId: "st-christophers-place",
    name: "Angelina Café",
    lat: 51.5147,
    lng: -0.1466,
    distanceKm: 0.05,
    channel: "dine-in",
    competitorType: "brunch",
    overlap: 38,
    rating: 4.3,
    gpRiskPerWeek: 880,
    priceIndexVsYou: 102
  },

  // Around Soho
  {
    id: "soho-house-cafe",
    venueId: "soho",
    name: "Soho House Café",
    lat: 51.5138,
    lng: -0.1355,
    distanceKm: 0.08,
    channel: "all",
    competitorType: "brunch",
    overlap: 45,
    rating: 4.6,
    gpRiskPerWeek: 1240,
    priceIndexVsYou: 115
  },
  {
    id: "soho-dessert-bar",
    venueId: "soho",
    name: "Soho Dessert Bar",
    lat: 51.5132,
    lng: -0.1339,
    distanceKm: 0.11,
    channel: "all",
    competitorType: "dessert",
    overlap: 52,
    rating: 4.4,
    gpRiskPerWeek: 990,
    priceIndexVsYou: 104,
    favourite: true
  }
];
