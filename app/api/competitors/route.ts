// app/api/competitors/route.ts

import { NextResponse } from "next/server";
import {
  Competitor,
  CompetitorSummaryResponse,
  CompetitorChannel,
  CompetitorChangeImpact,
  CompetitorChangeMetric,
} from "@/types/competitors";

const channels: CompetitorChannel[] = ["dine_in", "delivery", "takeaway"];

const mockCompetitors: Competitor[] = [
  {
    id: "c1",
    name: "Trattoria Milano",
    brandColor: "#f97316",
    isChain: false,
    cuisines: ["Italian", "Pizza", "Pasta"],
    location: {
      city: "London",
      area: "Soho",
      lat: 51.5136,
      lng: -0.1317,
      distanceKm: 0.6,
    },
    channels,
    avgPriceIndex: 104,
    deliveryEtaMinutes: 35,
    rating: 4.4,
    reviewVolume: 1230,
    lastMenuSync: "2025-12-05T10:30:00.000Z",
    lastDeliveryScan: "2025-12-06T19:05:00.000Z",
    priceSample: [
      {
        id: "c1-p1",
        itemName: "Margherita Pizza",
        category: "Pizza",
        channel: "dine_in",
        yourPrice: 11.0,
        competitorPrice: 12.5,
        currency: "GBP",
      },
      {
        id: "c1-p2",
        itemName: "Cacio e Pepe",
        category: "Pasta",
        channel: "dine_in",
        yourPrice: 14.0,
        competitorPrice: 15.0,
        currency: "GBP",
      },
      {
        id: "c1-p3",
        itemName: "Tiramisu",
        category: "Dessert",
        channel: "dine_in",
        yourPrice: 7.5,
        competitorPrice: 7.0,
        currency: "GBP",
      },
    ],
    changes: [
      {
        id: "c1-ch1",
        competitorId: "c1",
        date: "2025-12-06T08:10:00.000Z",
        metric: "price",
        impact: "positive",
        title: "Pizza prices increased by 7 percent",
        description:
          "Average price of core pizzas went up by 7 percent. ODYAN suggests reviewing your own pizza GP and delivery pricing bands.",
        estimatedGpImpactBps: 40,
      },
      {
        id: "c1-ch2",
        competitorId: "c1",
        date: "2025-12-05T17:45:00.000Z",
        metric: "promotion",
        impact: "negative",
        title: "Two for one pasta on Mondays",
        description:
          "New weekly offer on pastas every Monday after 18:00. Expect some shift in Monday dine in demand.",
        estimatedGpImpactBps: -25,
      },
    ],
    notes: "Strong local following. Heavy use of promotions on Mondays and Thursdays.",
  },
  {
    id: "c2",
    name: "City Bowl Kitchen",
    brandColor: "#22c55e",
    isChain: true,
    cuisines: ["Healthy", "Bowls", "Vegan"],
    location: {
      city: "London",
      area: "Fitzrovia",
      lat: 51.5183,
      lng: -0.1361,
      distanceKm: 1.1,
    },
    channels: ["delivery", "takeaway"],
    avgPriceIndex: 98,
    deliveryEtaMinutes: 27,
    rating: 4.6,
    reviewVolume: 860,
    lastMenuSync: "2025-12-04T14:15:00.000Z",
    lastDeliveryScan: "2025-12-06T18:40:00.000Z",
    priceSample: [
      {
        id: "c2-p1",
        itemName: "Grilled Chicken Bowl",
        category: "Bowls",
        channel: "delivery",
        yourPrice: 12.5,
        competitorPrice: 11.8,
        currency: "GBP",
      },
      {
        id: "c2-p2",
        itemName: "Vegan Falafel Bowl",
        category: "Bowls",
        channel: "delivery",
        yourPrice: 11.0,
        competitorPrice: 10.5,
        currency: "GBP",
      },
    ],
    changes: [
      {
        id: "c2-ch1",
        competitorId: "c2",
        date: "2025-12-06T12:05:00.000Z",
        metric: "menu",
        impact: "neutral",
        title: "Added two new limited bowls",
        description:
          "Winter menu items appeared in the delivery menu. No change in base pricing, but higher margin toppings mix.",
        estimatedGpImpactBps: 15,
      },
    ],
    notes: "Very strong in vegan and plant based. Delivery only, no dine in capacity.",
  },
  {
    id: "c3",
    name: "Bella Napoli Express",
    brandColor: "#3b82f6",
    isChain: true,
    cuisines: ["Italian", "Delivery"],
    location: {
      city: "London",
      area: "Shoreditch",
      lat: 51.5236,
      lng: -0.0785,
      distanceKm: 3.2,
    },
    channels: ["delivery"],
    avgPriceIndex: 90,
    deliveryEtaMinutes: 22,
    rating: 4.2,
    reviewVolume: 2040,
    lastMenuSync: "2025-12-03T13:20:00.000Z",
    lastDeliveryScan: "2025-12-06T19:10:00.000Z",
    priceSample: [
      {
        id: "c3-p1",
        itemName: "Pepperoni Pizza",
        category: "Pizza",
        channel: "delivery",
        yourPrice: 14.0,
        competitorPrice: 11.9,
        currency: "GBP",
      },
      {
        id: "c3-p2",
        itemName: "Garlic Bread",
        category: "Sides",
        channel: "delivery",
        yourPrice: 5.0,
        competitorPrice: 3.9,
        currency: "GBP",
      },
    ],
    changes: [
      {
        id: "c3-ch1",
        competitorId: "c3",
        date: "2025-12-05T19:55:00.000Z",
        metric: "rating",
        impact: "negative",
        title: "Rating dropped by 0.2 in last week",
        description:
          "Several low star reviews mentioning delivery delays. Opportunity to compete with reliable dispatch times.",
        estimatedGpImpactBps: 10,
      },
    ],
    notes: "Aggressive on discount codes during off peak hours.",
  },
];

export async function GET() {
  const response: CompetitorSummaryResponse = {
    competitors: mockCompetitors,
    meta: {
      venueName: "ODYAN Test Venue",
      venueCity: "London",
      currency: "GBP",
      lastGlobalSync: "2025-12-06T19:30:00.000Z",
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=10",
    },
  });
}
