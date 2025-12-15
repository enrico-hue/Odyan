"use client";

import React, { useMemo, useState, useEffect, ChangeEvent } from "react";
import {
  Search,
  ChevronDown,
  ChefHat,
  UtensilsCrossed,
  Wand2,
  Brain,
  SlidersHorizontal,
  AlertTriangle,
  Sparkles,
  Camera,
  X,
} from "lucide-react";

type Country = "UK" | "UAE" | "KSA" | "Qatar";
type Channel = "Dine in" | "Delivery" | "Grab & Go";
type MenuFamily =
  | "All Day Brunch"
  | "Lunch & Dinner"
  | "Patisserie"
  | "Drinks"
  | "Frappes & Shakes";

type Category =
  | "Brunch"
  | "Eggs"
  | "Croissants"
  | "Salads & Sandwiches"
  | "Pasta"
  | "Burgers"
  | "Chapati"
  | "Cakes"
  | "Single Serves"
  | "Cheesecakes"
  | "Brownies"
  | "Milkshakes"
  | "Speciality Lattes"
  | "Coffee & Teas"
  | "Frappes"
  | "Mocktails"
  | "Smoothies"
  | "Bubble Tea";

type Status = "Live" | "In R&D" | "Paused";

interface Recipe {
  id: string;
  name: string;
  shortName: string;
  menuFamily: MenuFamily;
  category: Category;
  country: Country;
  city: string;
  outlet: string;
  channel: Channel;
  imageUrl?: string;
  cogsPercent: number;
  gpPercent: number;
  rsp: number;
  currency: "GBP";
  isSignature: boolean;
  allergens: string[];
  tags: string[];
  lastUpdated: string;
  version: number;
  status: Status;
  hasAiNotes: boolean;
}

interface FiltersState {
  country: Country | "All";
  city: string | "All";
  outlet: string | "All";
  menuFamily: MenuFamily | "All";
  category: Category | "All";
  channel: Channel | "All";
  status: Status | "All";
  onlyLowGP: boolean;
  onlySignature: boolean;
}

interface IngredientRow {
  key: string;
  name: string;
  supplier: string;
  qty: string;
  unitCost: number;
  lineCost: number;
  isBatch?: boolean;
}

// Base EL&N recipes (same as before)
const coreRecipes: Omit<
  Recipe,
  | "id"
  | "country"
  | "city"
  | "outlet"
  | "channel"
  | "cogsPercent"
  | "gpPercent"
  | "rsp"
  | "currency"
  | "lastUpdated"
  | "version"
  | "status"
  | "hasAiNotes"
>[] = [
  // All Day Brunch – bowls, pancakes, croissants, eggs
  {
    name: "Açai Bowl",
    shortName: "Acai Bowl",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: true,
    allergens: ["Nuts"],
    tags: ["Vegan", "Healthy"],
  },
  {
    name: "Dutch Baby Pancakes",
    shortName: "Dutch Baby",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: true,
    allergens: ["Egg", "Gluten", "Dairy"],
    tags: ["Sharing"],
  },
  {
    name: "Umali Croissant Bread & Butter Pudding",
    shortName: "Umali Pudding",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg", "Nuts"],
    tags: ["Warm dessert"],
  },
  {
    name: "Nutella & Strawberries American Pancakes",
    shortName: "Nutella Pancakes",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: true,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: ["Best seller"],
  },
  {
    name: "Yoghurt & Mixed Berries American Pancakes",
    shortName: "Yoghurt Pancakes",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: ["Lighter option"],
  },
  {
    name: "Turkey & Maple Butter American Pancakes",
    shortName: "Turkey Pancakes",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: ["Sweet and savoury"],
  },
  {
    name: "Burrata & Truffle Scrambled Egg Croissant",
    shortName: "Burrata Egg Croissant",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: true,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: ["Truffle"],
  },
  {
    name: "Cheese & Salmon Croissant",
    shortName: "Salmon Croissant",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Fish", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Eggs Benedict & Truffle Hollandaise Croissant",
    shortName: "Eggs Benedict Croissant",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Avocado & Truffle Scrambled Egg Croissant",
    shortName: "Avocado Egg Croissant",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "Full EL&N Breakfast",
    shortName: "Full EL&N",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: true,
    allergens: ["Egg", "Gluten", "Dairy"],
    tags: ["Served until 11:30"],
  },
  {
    name: "Full Veggie EL&N Breakfast",
    shortName: "Veggie Breakfast",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Egg", "Gluten", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "English Muffins Eggs Royale",
    shortName: "Eggs Royale",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Fish", "Dairy"],
    tags: [],
  },
  {
    name: "English Muffins Eggs Florentine",
    shortName: "Eggs Florentine",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "English Muffins Eggs Benedict",
    shortName: "Eggs Benedict",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Smashed Avocado On Toast",
    shortName: "Smashed Avocado",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: true,
    allergens: ["Gluten"],
    tags: ["Vegan option"],
  },
  {
    name: "EL&N Shakshuka",
    shortName: "EL&N Shakshuka",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: true,
    allergens: ["Egg"],
    tags: ["Vegetarian"],
  },
  {
    name: "Turkish Eggs On Simit Bread",
    shortName: "Turkish Eggs Simit",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Egg", "Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Turkish Eggs",
    shortName: "Turkish Eggs",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Eggs, Cheese & Sujuk",
    shortName: "Eggs Sujuk",
    menuFamily: "All Day Brunch",
    category: "Eggs",
    isSignature: false,
    allergens: ["Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Avocado & Beetroot Hummus Tartlet",
    shortName: "Avocado Beetroot Tartlet",
    menuFamily: "All Day Brunch",
    category: "Brunch",
    isSignature: false,
    allergens: ["Gluten", "Sesame"],
    tags: ["Vegetarian"],
  },
  // Supreme croissants and cubes
  {
    name: "Mozzarella Melt Cube",
    shortName: "Mozzarella Cube",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Mushroom & Cheese Melt Cube",
    shortName: "Mushroom Cube",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "Salmon & Cheese Melt Cube",
    shortName: "Salmon Cube",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Fish"],
    tags: [],
  },
  {
    name: "Za’atar & Cheese Melt Cube",
    shortName: "Za’atar Cube",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Sesame"],
    tags: ["Vegetarian"],
  },
  {
    name: "Croque Madame Cube",
    shortName: "Croque Madame Cube",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Croque Monsieur Cube",
    shortName: "Croque Monsieur Cube",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Truffled Camembert Round Croissant",
    shortName: "Truffle Camembert Croissant",
    menuFamily: "All Day Brunch",
    category: "Croissants",
    isSignature: true,
    allergens: ["Gluten", "Dairy"],
    tags: ["Truffle"],
  },
  // Salads, sandwiches, focaccia, chapatis
  {
    name: "Avocado, Tuna & Cheese Toastie",
    shortName: "Avocado Tuna Toastie",
    menuFamily: "Lunch & Dinner",
    category: "Salads & Sandwiches",
    isSignature: false,
    allergens: ["Fish", "Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Wild Mushroom & Cheese Toastie",
    shortName: "Wild Mushroom Toastie",
    menuFamily: "Lunch & Dinner",
    category: "Salads & Sandwiches",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "Chicken Club Sandwich",
    shortName: "Chicken Club",
    menuFamily: "Lunch & Dinner",
    category: "Salads & Sandwiches",
    isSignature: false,
    allergens: ["Gluten", "Egg"],
    tags: [],
  },
  {
    name: "Mozzarella Focaccia",
    shortName: "Mozzarella Focaccia",
    menuFamily: "Lunch & Dinner",
    category: "Salads & Sandwiches",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "Chicken Focaccia",
    shortName: "Chicken Focaccia",
    menuFamily: "Lunch & Dinner",
    category: "Salads & Sandwiches",
    isSignature: false,
    allergens: ["Gluten"],
    tags: [],
  },
  {
    name: "Chicken Caesar Salad",
    shortName: "Chicken Caesar",
    menuFamily: "Lunch & Dinner",
    category: "Salads & Sandwiches",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Fish", "Egg"],
    tags: [],
  },
  {
    name: "Toasted Chapati",
    shortName: "Toasted Chapati",
    menuFamily: "Lunch & Dinner",
    category: "Chapati",
    isSignature: false,
    allergens: ["Gluten"],
    tags: [],
  },
  {
    name: "Sweet Nutella Chapati",
    shortName: "Nutella Chapati",
    menuFamily: "Lunch & Dinner",
    category: "Chapati",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: ["Dessert"],
  },
  // Pasta
  {
    name: "Spicy Tomato & Burrata Rigatoni",
    shortName: "Spicy Burrata Rigatoni",
    menuFamily: "Lunch & Dinner",
    category: "Pasta",
    isSignature: true,
    allergens: ["Gluten", "Dairy"],
    tags: ["Spicy"],
  },
  {
    name: "Cherry Tomato & Basil Rigatoni",
    shortName: "Tomato Basil Rigatoni",
    menuFamily: "Lunch & Dinner",
    category: "Pasta",
    isSignature: false,
    allergens: ["Gluten"],
    tags: ["Vegetarian"],
  },
  {
    name: "Creamy Chicken & Mushroom Rigatoni",
    shortName: "Chicken Mushroom Rigatoni",
    menuFamily: "Lunch & Dinner",
    category: "Pasta",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Rigatoni Bolognese",
    shortName: "Rigatoni Bolognese",
    menuFamily: "Lunch & Dinner",
    category: "Pasta",
    isSignature: false,
    allergens: ["Gluten"],
    tags: [],
  },
  {
    name: "Truffle Cacio e Pepe",
    shortName: "Truffle Cacio e Pepe",
    menuFamily: "Lunch & Dinner",
    category: "Pasta",
    isSignature: true,
    allergens: ["Gluten", "Dairy"],
    tags: ["Truffle", "Vegetarian"],
  },
  // Burgers & sides
  {
    name: "Chicken Schnitzel Burger",
    shortName: "Schnitzel Burger",
    menuFamily: "Lunch & Dinner",
    category: "Burgers",
    isSignature: false,
    allergens: ["Gluten", "Egg"],
    tags: [],
  },
  {
    name: "Pulled Beef Brisket Burger",
    shortName: "Beef Brisket Burger",
    menuFamily: "Lunch & Dinner",
    category: "Burgers",
    isSignature: false,
    allergens: ["Gluten"],
    tags: [],
  },
  {
    name: "Truffle Mushroom Burger",
    shortName: "Truffle Mushroom Burger",
    menuFamily: "Lunch & Dinner",
    category: "Burgers",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: ["Vegetarian"],
  },
  {
    name: "Rosemary Potatoes",
    shortName: "Rosemary Potatoes",
    menuFamily: "Lunch & Dinner",
    category: "Burgers",
    isSignature: false,
    allergens: [],
    tags: ["Side"],
  },
  {
    name: "Creamy Paprika Potatoes",
    shortName: "Paprika Potatoes",
    menuFamily: "Lunch & Dinner",
    category: "Burgers",
    isSignature: false,
    allergens: [],
    tags: ["Side"],
  },
  {
    name: "Dressed Mixed Leaves",
    shortName: "Mixed Leaves",
    menuFamily: "Lunch & Dinner",
    category: "Burgers",
    isSignature: false,
    allergens: [],
    tags: ["Side", "Vegan"],
  },
  // Milkshakes
  {
    name: "Nutella Milkshake",
    shortName: "Nutella Shake",
    menuFamily: "Frappes & Shakes",
    category: "Milkshakes",
    isSignature: true,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Strawberry & Coconut Milkshake",
    shortName: "Strawberry Coconut Shake",
    menuFamily: "Frappes & Shakes",
    category: "Milkshakes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Banana & Mango Milkshake",
    shortName: "Banana Mango Shake",
    menuFamily: "Frappes & Shakes",
    category: "Milkshakes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Lotus Biscoff Milkshake",
    shortName: "Lotus Shake",
    menuFamily: "Frappes & Shakes",
    category: "Milkshakes",
    isSignature: false,
    allergens: ["Dairy", "Gluten"],
    tags: [],
  },
  // Special lattes and coffees
  {
    name: "Spiced Chai Latte",
    shortName: "Chai Latte",
    menuFamily: "Drinks",
    category: "Speciality Lattes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Crème Brûlée Iced Latte",
    shortName: "Crème Brûlée Latte",
    menuFamily: "Drinks",
    category: "Speciality Lattes",
    isSignature: true,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Matcha Latte",
    shortName: "Matcha Latte",
    menuFamily: "Drinks",
    category: "Speciality Lattes",
    isSignature: true,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Matcha Rose Iced Latte",
    shortName: "Matcha Rose Latte",
    menuFamily: "Drinks",
    category: "Speciality Lattes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Classic Spanish Latte",
    shortName: "Spanish Latte",
    menuFamily: "Drinks",
    category: "Speciality Lattes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Pistachio Spanish Latte",
    shortName: "Pistachio Spanish Latte",
    menuFamily: "Drinks",
    category: "Speciality Lattes",
    isSignature: true,
    allergens: ["Dairy", "Nuts"],
    tags: [],
  },
  {
    name: "House Cappuccino",
    shortName: "Cappuccino",
    menuFamily: "Drinks",
    category: "Coffee & Teas",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "House Caffè Latte",
    shortName: "Caffè Latte",
    menuFamily: "Drinks",
    category: "Coffee & Teas",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "House Flat White",
    shortName: "Flat White",
    menuFamily: "Drinks",
    category: "Coffee & Teas",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Hot Chocolate Nutella",
    shortName: "Nutella Hot Chocolate",
    menuFamily: "Drinks",
    category: "Coffee & Teas",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Rose Lemonade",
    shortName: "Rose Lemonade",
    menuFamily: "Drinks",
    category: "Coffee & Teas",
    isSignature: false,
    allergens: [],
    tags: ["Lemonade"],
  },
  {
    name: "Mojito Lemonade",
    shortName: "Mojito Lemonade",
    menuFamily: "Drinks",
    category: "Coffee & Teas",
    isSignature: false,
    allergens: [],
    tags: ["Lemonade"],
  },
  // Frappes
  {
    name: "Ferrero Frappé",
    shortName: "Ferrero Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy", "Nuts"],
    tags: [],
  },
  {
    name: "Vanilla Frappé",
    shortName: "Vanilla Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Coffee Frappé",
    shortName: "Coffee Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Coffee Caramel Frappé",
    shortName: "Coffee Caramel Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Strawberry & Coconut Frappé",
    shortName: "Strawberry Coconut Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Salted Caramel Frappé",
    shortName: "Salted Caramel Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Pistachio Frappé",
    shortName: "Pistachio Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy", "Nuts"],
    tags: [],
  },
  {
    name: "Oreo Frappé",
    shortName: "Oreo Frappé",
    menuFamily: "Frappes & Shakes",
    category: "Frappes",
    isSignature: false,
    allergens: ["Dairy", "Gluten"],
    tags: [],
  },
  // Mocktails
  {
    name: "Blood Orange Sorbet",
    shortName: "Blood Orange Sorbet",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Raspberry Mojito",
    shortName: "Raspberry Mojito",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Strawberry Mojito",
    shortName: "Strawberry Mojito",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Classic Mojito",
    shortName: "Classic Mojito",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Coffee Crème Mocktail",
    shortName: "Coffee Crème",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Ombré Passion Fruit Cooler",
    shortName: "Passion Fruit Cooler",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Strawberry Granita",
    shortName: "Strawberry Granita",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Nutella Martini Mocktail",
    shortName: "Nutella Martini",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Butterfly Pea Flower Cooler",
    shortName: "Butterfly Pea",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  {
    name: "Dragon Fruit & Mango Cooler",
    shortName: "Dragon Mango Cooler",
    menuFamily: "Drinks",
    category: "Mocktails",
    isSignature: false,
    allergens: [],
    tags: [],
  },
  // Smoothies
  {
    name: "The Islander Smoothie",
    shortName: "The Islander",
    menuFamily: "Drinks",
    category: "Smoothies",
    isSignature: false,
    allergens: [],
    tags: ["Vegan"],
  },
  {
    name: "Super Green Smoothie",
    shortName: "Super Green",
    menuFamily: "Drinks",
    category: "Smoothies",
    isSignature: false,
    allergens: [],
    tags: ["Vegetarian"],
  },
  {
    name: "The Energiser Smoothie",
    shortName: "The Energiser",
    menuFamily: "Drinks",
    category: "Smoothies",
    isSignature: false,
    allergens: [],
    tags: ["Vegan"],
  },
  // Bubble tea
  {
    name: "Green Matcha Bubble Tea",
    shortName: "Matcha Bubble Tea",
    menuFamily: "Drinks",
    category: "Bubble Tea",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Ube Bubble Tea",
    shortName: "Ube Bubble Tea",
    menuFamily: "Drinks",
    category: "Bubble Tea",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Nutella Bubble Tea",
    shortName: "Nutella Bubble Tea",
    menuFamily: "Drinks",
    category: "Bubble Tea",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Spanish Latte Bubble Tea",
    shortName: "Spanish Bubble Tea",
    menuFamily: "Drinks",
    category: "Bubble Tea",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Pistachio Bubble Tea",
    shortName: "Pistachio Bubble Tea",
    menuFamily: "Drinks",
    category: "Bubble Tea",
    isSignature: false,
    allergens: ["Dairy", "Nuts"],
    tags: [],
  },
  // Patisserie single serves, cheesecake, cakes etc
  {
    name: "Strawberry Tart",
    shortName: "Strawberry Tart",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Pistachio & Raspberry Macaron",
    shortName: "Pistachio Raspberry Macaron",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: ["Gluten", "Nuts", "Egg"],
    tags: [],
  },
  {
    name: "Lemon Meringue Tart",
    shortName: "Lemon Meringue Tart",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Vegan Chocolate Cake Slice",
    shortName: "Vegan Chocolate Slice",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: [],
    tags: ["Vegan"],
  },
  {
    name: "Knafeh",
    shortName: "Knafeh",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Nuts"],
    tags: [],
  },
  {
    name: "Lotus Biscoff Cheesecake",
    shortName: "Lotus Cheesecake",
    menuFamily: "Patisserie",
    category: "Cheesecakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Oreo Cheesecake",
    shortName: "Oreo Cheesecake",
    menuFamily: "Patisserie",
    category: "Cheesecakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Mixed Berry Mousse",
    shortName: "Berry Mousse",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: ["Dairy"],
    tags: [],
  },
  {
    name: "Mixed Nut Brownie",
    shortName: "Nut Brownie",
    menuFamily: "Patisserie",
    category: "Brownies",
    isSignature: false,
    allergens: ["Gluten", "Nuts"],
    tags: [],
  },
  {
    name: "Dulche de Leche Classic Cake",
    shortName: "Dulche de Leche Classic",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Dulche de Leche Saffron Cake",
    shortName: "Dulche Saffron",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Dulche de Leche Lotus Cake",
    shortName: "Dulche Lotus",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Pistachio & Rose Cake",
    shortName: "Pistachio Rose Cake",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Nuts"],
    tags: [],
  },
  {
    name: "Tiramisu Slice",
    shortName: "Tiramisu",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Oreo Cake Slice",
    shortName: "Oreo Cake",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Lotus Cake Slice",
    shortName: "Lotus Cake",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Kish Kash",
    shortName: "Kish Kash",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "Honey Cake",
    shortName: "Honey Cake",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Fresh Fruit Slice",
    shortName: "Fresh Fruit",
    menuFamily: "Patisserie",
    category: "Single Serves",
    isSignature: false,
    allergens: [],
    tags: ["Gluten free"],
  },
  {
    name: "Strawberry Diplomat Cake",
    shortName: "Strawberry Diplomat",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Carrot Cake Slice",
    shortName: "Carrot Cake",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Pink Velvet Cake",
    shortName: "Pink Velvet",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Red Velvet Cake",
    shortName: "Red Velvet",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Victoria Sponge Cake",
    shortName: "Victoria Sponge",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Bogtrotter’s Chocolate Cake",
    shortName: "Bogtrotter Chocolate",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Egg", "Dairy"],
    tags: [],
  },
  {
    name: "Nutella & Coffee Cake",
    shortName: "Nutella Coffee Cake",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
  {
    name: "Salted Caramel Napoleon",
    shortName: "Caramel Napoleon",
    menuFamily: "Patisserie",
    category: "Cakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy"],
    tags: [],
  },
  {
    name: "San Sebastián Cheesecake",
    shortName: "San Sebastián",
    menuFamily: "Patisserie",
    category: "Cheesecakes",
    isSignature: false,
    allergens: ["Gluten", "Dairy", "Egg"],
    tags: [],
  },
];

const OUTLETS = [
  { country: "UK" as Country, city: "London", name: "Hans Crescent" },
  { country: "UK" as Country, city: "London", name: "Oxford Circus" },
  { country: "UK" as Country, city: "London", name: "Park Lane" },
  { country: "UAE" as Country, city: "Dubai", name: "Dubai Mall" },
  { country: "KSA" as Country, city: "Riyadh", name: "Riyadh Front" },
  { country: "Qatar" as Country, city: "Doha", name: "Place Vendôme" },
];

const CHANNELS: Channel[] = ["Dine in", "Delivery", "Grab & Go"];

function generateRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  let idCounter = 1;

  for (const outlet of OUTLETS) {
    for (const base of coreRecipes) {
      const channel =
        base.menuFamily === "Drinks" || base.menuFamily === "Frappes & Shakes"
          ? "Dine in"
          : CHANNELS[idCounter % CHANNELS.length];

      const cogs = 25 + ((idCounter * 7) % 35);
      const gp = 100 - cogs;
      const rsp = 6 + ((idCounter * 13) % 120) / 2;

      recipes.push({
        id: `R${idCounter.toString().padStart(4, "0")}`,
        name: base.name,
        shortName: base.shortName,
        menuFamily: base.menuFamily,
        category: base.category,
        country: outlet.country,
        city: outlet.city,
        outlet: outlet.name,
        channel,
        cogsPercent: cogs,
        gpPercent: gp,
        rsp: Number(rsp.toFixed(2)),
        currency: "GBP",
        isSignature: base.isSignature,
        allergens: base.allergens,
        tags: base.tags,
        lastUpdated: `2025-${((idCounter % 12) + 1)
          .toString()
          .padStart(2, "0")}-${((idCounter % 27) + 1)
          .toString()
          .padStart(2, "0")}`,
        version: 1 + (idCounter % 3),
        status: gp < 62 ? "Live" : gp < 70 ? "In R&D" : "Paused",
        hasAiNotes: gp < 58 || cogs > 42,
      });

      idCounter += 1;
    }
  }

  return recipes;
}

const ALL_RECIPES: Recipe[] = generateRecipes();

const initialFilters: FiltersState = {
  country: "All",
  city: "All",
  outlet: "All",
  menuFamily: "All",
  category: "All",
  channel: "All",
  status: "All",
  onlyLowGP: false,
  onlySignature: false,
};

function buildMockIngredients(recipe: Recipe): IngredientRow[] {
  const num = parseInt(recipe.id.slice(1), 10) || 1;
  const baseQty = 1 + (num % 3);
  const garnishQty = 0.05 * ((num % 4) + 1);
  const sauceQty = 0.15 * ((num % 3) + 1);

  const baseUnitCost = 3.2 + (num % 5) * 0.25;
  const sauceUnitCost = 2.1 + (num % 4) * 0.2;
  const garnishUnitCost = 8 + (num % 3) * 0.5;

  const baseLine = baseQty * baseUnitCost;
  const sauceLine = sauceQty * sauceUnitCost;
  const garnishLine = garnishQty * garnishUnitCost;

  const isPatisserie = recipe.menuFamily === "Patisserie";
  const isDrink =
    recipe.menuFamily === "Drinks" || recipe.menuFamily === "Frappes & Shakes";

  const baseName = isPatisserie
    ? `${recipe.shortName} sponge / base`
    : isDrink
    ? `${recipe.shortName} liquid base`
    : `${recipe.shortName} mise en place`;

  const sauceName = isDrink
    ? "Flavour / syrup mix"
    : isPatisserie
    ? "Filling / mousse"
    : "Sauce / dressing";

  const garnishName = isPatisserie
    ? "Decoration & toppings"
    : "Garnish & finishing";

  const supplierBase = isDrink ? "CPU beverages" : "CPU kitchen";
  const supplierSauce = isPatisserie ? "Central bakery" : "External";
  const supplierGarnish = "Grocery / garnish";

  return [
    {
      key: "base",
      name: baseName,
      supplier: supplierBase,
      qty: `${baseQty.toFixed(2)} ${isDrink ? "L" : "kg"}`,
      unitCost: Number(baseUnitCost.toFixed(2)),
      lineCost: Number(baseLine.toFixed(2)),
      isBatch: true,
    },
    {
      key: "sauce",
      name: sauceName,
      supplier: supplierSauce,
      qty: `${sauceQty.toFixed(2)} kg`,
      unitCost: Number(sauceUnitCost.toFixed(2)),
      lineCost: Number(sauceLine.toFixed(2)),
    },
    {
      key: "garnish",
      name: garnishName,
      supplier: supplierGarnish,
      qty: `${garnishQty.toFixed(2)} kg`,
      unitCost: Number(garnishUnitCost.toFixed(2)),
      lineCost: Number(garnishLine.toFixed(2)),
    },
  ];
}

// Sub-ingredients that appear when a batch row is expanded
function buildMockBatchSubIngredients(recipe: Recipe): IngredientRow[] {
  const num = parseInt(recipe.id.slice(1), 10) || 1;
  const base = 0.4 + (num % 3) * 0.1;

  return [
    {
      key: "sub1",
      name: "Base mix dry ingredients",
      supplier: "Dry store",
      qty: `${(base * 0.4).toFixed(2)} kg`,
      unitCost: 1.1,
      lineCost: Number((base * 0.4 * 1.1).toFixed(2)),
    },
    {
      key: "sub2",
      name: "Base mix liquids / dairy",
      supplier: "Chilled",
      qty: `${(base * 0.4).toFixed(2)} kg`,
      unitCost: 1.6,
      lineCost: Number((base * 0.4 * 1.6).toFixed(2)),
    },
    {
      key: "sub3",
      name: "Flavour / inclusions",
      supplier: "Grocery",
      qty: `${(base * 0.2).toFixed(2)} kg`,
      unitCost: 4.5,
      lineCost: Number((base * 0.2 * 4.5).toFixed(2)),
    },
  ];
}

export default function RecipesWorkspacePage() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [navSearch, setNavSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(
    ALL_RECIPES[0]
  );
  const [highlightLowGP, setHighlightLowGP] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Sidebar collapsed ON by default → big Excel-style grid from first load
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // View mode for FLAGS / INSIGHTS: "dense" = many chips, "relaxed" = minimal text
  const [viewMode, setViewMode] = useState<"dense" | "relaxed">("relaxed");

  const filteredRecipes = useMemo(() => {
    return ALL_RECIPES.filter((r) => {
      if (filters.country !== "All" && r.country !== filters.country) {
        return false;
      }
      if (filters.city !== "All" && r.city !== filters.city) {
        return false;
      }
      if (filters.outlet !== "All" && r.outlet !== filters.outlet) {
        return false;
      }
      if (
        filters.menuFamily !== "All" &&
        r.menuFamily !== filters.menuFamily
      ) {
        return false;
      }
      if (filters.category !== "All" && r.category !== filters.category) {
        return false;
      }
      if (filters.channel !== "All" && r.channel !== filters.channel) {
        return false;
      }
      if (filters.status !== "All" && r.status !== filters.status) {
        return false;
      }
      if (filters.onlyLowGP && r.gpPercent >= 65) {
        return false;
      }
      if (filters.onlySignature && !r.isSignature) {
        return false;
      }

      if (recipeSearch.trim()) {
        const q = recipeSearch.toLowerCase();
        const haystack = [
          r.name,
          r.shortName,
          r.menuFamily,
          r.category,
          r.outlet,
          r.city,
          r.tags.join(" "),
          r.allergens.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (navSearch.trim()) {
        const q = navSearch.toLowerCase();
        const navHaystack = [r.outlet, r.city, r.country]
          .join(" ")
          .toLowerCase();
        if (!navHaystack.includes(q)) return false;
      }

      return true;
    });
  }, [filters, recipeSearch, navSearch]);

  // metrics for top info bar (on filtered slice)
  const sliceMetrics = useMemo(() => {
    const outlets = new Set<string>();
    const countries = new Set<Country>();
    const families = new Set<MenuFamily>();

    filteredRecipes.forEach((r) => {
      outlets.add(r.outlet);
      countries.add(r.country);
      families.add(r.menuFamily);
    });

    return {
      outletsInView: outlets.size,
      countriesInView: countries.size,
      familiesInView: families.size,
    };
  }, [filteredRecipes]);

  const uniqueCountries: Country[] = Array.from(
    new Set(ALL_RECIPES.map((r) => r.country))
  ) as Country[];

  const uniqueCities = Array.from(
    new Set(
      ALL_RECIPES.filter((r) =>
        filters.country === "All" ? true : r.country === filters.country
      ).map((r) => r.city)
    )
  );

  const uniqueOutlets = Array.from(
    new Set(
      ALL_RECIPES.filter((r) => {
        if (filters.country !== "All" && r.country !== filters.country) {
          return false;
        }
        if (filters.city !== "All" && r.city !== filters.city) {
          return false;
        }
        return true;
      }).map((r) => r.outlet)
    )
  );

  const uniqueMenuFamilies: MenuFamily[] = Array.from(
    new Set(ALL_RECIPES.map((r) => r.menuFamily))
  ) as MenuFamily[];

  const uniqueCategories: Category[] = Array.from(
    new Set(ALL_RECIPES.map((r) => r.category))
  ) as Category[];

  const handleFilterChange =
    <K extends keyof FiltersState>(key: K) =>
    (value: FiltersState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipeSearch(e.target.value);
  };

  const handleRowClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditorOpen(true);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setRecipeSearch("");
    setNavSearch("");
  };

  const openPhotoGenerator = () => {
    // Placeholder for VisionPRO trigger
    console.log("Open VisionPRO");
  };

  // Row padding based on view mode
  const rowPadding = viewMode === "dense" ? "py-1" : "py-1.5";

  return (
    <div className="relative flex min-h-screen w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Re-open button when nav is collapsed */}
      {/* Slim left-edge reopen tab */}
{isNavCollapsed && (
  <button
    type="button"
    onClick={() => setIsNavCollapsed(false)}
    className="
      fixed left-0 top-1/2 -translate-y-1/2 
      z-30 flex items-center 
      rounded-r-xl border border-slate-700 
      bg-slate-900/95 px-2 py-3 
      text-[11px] text-slate-200 
      shadow-xl hover:bg-slate-800
    "
  >
    <UtensilsCrossed className="h-4 w-4 mr-1 text-sky-400" />
    Filters
  </button>
)}


      {/* Left navigation / filters */}
      <aside
        className={`shrink-0 border-r border-slate-800 bg-slate-950/95 transition-all duration-300 ease-in-out ${
          isNavCollapsed
            ? "w-0 px-0 py-0 opacity-0 pointer-events-none"
            : "w-64 px-3 py-4 opacity-100"
        }`}
      >
        {!isNavCollapsed && (
          <div className="h-full space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-sky-500/10 p-2">
                  <UtensilsCrossed className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Odyan
                  </p>
                  <p className="text-sm font-semibold text-slate-50">
                    Recipe workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNavCollapsed(true)}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-800"
              >
                Hide
              </button>
            </div>

            <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-3 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                Navigation
              </p>

              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search outlet, city, country"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 pl-7 pr-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-3 text-xs text-slate-200">
                <FilterBlock
                  label="Country"
                  value={filters.country}
                  onChange={(value) =>
                    handleFilterChange("country")(value as Country | "All")
                  }
                  options={["All", ...uniqueCountries]}
                />
                <FilterBlock
                  label="City"
                  value={filters.city}
                  onChange={(value) => handleFilterChange("city")(value as any)}
                  options={["All", ...uniqueCities]}
                />
                <FilterBlock
                  label="Outlet"
                  value={filters.outlet}
                  onChange={(value) =>
                    handleFilterChange("outlet")(value as string | "All")
                  }
                  options={["All", ...uniqueOutlets]}
                />
                <FilterBlock
                  label="Menu family"
                  value={filters.menuFamily}
                  onChange={(value) =>
                    handleFilterChange("menuFamily")(
                      value as MenuFamily | "All"
                    )
                  }
                  options={["All", ...uniqueMenuFamilies]}
                />
                <FilterBlock
                  label="Category"
                  value={filters.category}
                  onChange={(value) =>
                    handleFilterChange("category")(value as Category | "All")
                  }
                  options={["All", ...uniqueCategories]}
                />
                <FilterBlock
                  label="Channel"
                  value={filters.channel}
                  onChange={(value) =>
                    handleFilterChange("channel")(value as Channel | "All")
                  }
                  options={["All", ...CHANNELS]}
                />
                <FilterBlock
                  label="Status"
                  value={filters.status}
                  onChange={(value) =>
                    handleFilterChange("status")(value as Status | "All")
                  }
                  options={["All", "Live", "In R&D", "Paused"]}
                />

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.onlyLowGP}
                      onChange={(e) =>
                        handleFilterChange("onlyLowGP")(e.target.checked)
                      }
                      className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-[11px] text-slate-300">
                      Only low GP
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.onlySignature}
                      onChange={(e) =>
                        handleFilterChange("onlySignature")(e.target.checked)
                      }
                      className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-[11px] text-slate-300">
                      Only signature dishes
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-800"
              >
                Clear all filters
              </button>
            </div>

            <div className="rounded-2xl border border-sky-700/40 bg-sky-900/10 p-3 space-y-2 text-[11px] text-sky-100">
              <div className="flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-sky-300" />
                <p className="font-semibold tracking-[0.16em] uppercase">
                  Smart checks
                </p>
              </div>
              <p className="text-sky-100/80">
                GP alerts, sanity checks and optimisation tools appear
                automatically on low performing dishes.
              </p>
              <div className="flex items-center gap-2 text-[10px]">
                <Sparkles className="h-3 w-3 text-sky-300" />
                <span>Click a dish row to open the full editor workbench.</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main recipe list and hero */}
      <main className="flex-1 px-4 py-4 overflow-hidden">
        <div className="flex h-full w-full flex-col gap-3 overflow-hidden">
          {/* VisionPRO hero banner */}
          <PhotoRecipeHero onClick={openPhotoGenerator} />

          {/* Light workspace card with Excel-style grid */}
          <div className="flex-1 max-w-full overflow-hidden rounded-3xl bg-slate-100/96 text-slate-900 shadow-2xl border border-slate-200">
            {/* Header */}
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-3 bg-slate-100/90">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900/90 p-2 text-slate-50">
                  <ChefHat className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Workspace
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Global recipe library
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {ALL_RECIPES.length} recipes · Outlets in view:{" "}
                    {sliceMetrics.outletsInView || 0} · Countries:{" "}
                    {sliceMetrics.countriesInView || 0} · Families:{" "}
                    {sliceMetrics.familiesInView || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    value={recipeSearch}
                    onChange={handleSearchChange}
                    placeholder="Search recipes, tags, allergens"
                    className="w-full rounded-full border border-slate-300 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setHighlightLowGP((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-sky-50"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  {highlightLowGP ? "Highlight low GP" : "Plain view"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewMode((m) => (m === "dense" ? "relaxed" : "dense"))
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-sky-50"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {viewMode === "dense" ? "Relaxed view" : "Dense view"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-sky-50"
                >
                  <Brain className="h-3.5 w-3.5 text-sky-600" />
                  Scan recipes
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-slate-800"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Column setup
                </button>
              </div>
            </header>

            {/* List + info bar */}
            <section className="flex-1 flex flex-col overflow-hidden">
              {/* Top info bar */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-2 bg-slate-100/80">
                <div className="flex items-center gap-3 text-[11px] text-slate-600">
                  <span className="rounded-full bg-slate-900 text-slate-50 px-2 py-0.5">
                    {filteredRecipes.length} recipes
                  </span>
                  <span>
                    Outlets in view:{" "}
                    <strong className="font-semibold">
                      {sliceMetrics.outletsInView || "0"}
                    </strong>
                  </span>
                  <span>
                    Countries:{" "}
                    <strong className="font-semibold">
                      {sliceMetrics.countriesInView || "0"}
                    </strong>
                  </span>
                  <span className="hidden md:inline">
                    Families:{" "}
                    <strong className="font-semibold">
                      {sliceMetrics.familiesInView || "0"}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px]">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        filters.onlyLowGP || filters.onlySignature
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`}
                    />
                    Filters{" "}
                    {filters.onlyLowGP || filters.onlySignature ? "on" : "off"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" />
                    <span>GP ok</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-sm bg-amber-400" />
                    <span>GP watch</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-sm bg-rose-500" />
                    <span>GP critical</span>
                  </span>
                </div>
              </div>

              {/* Recipe grid with inner-only scrolling */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full w-full overflow-y-auto">
                  <table className="w-full border-t border-slate-200 text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-100/95">
                      <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left">
                          Code
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left">
                          Dish
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left">
                          Menu / category
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left">
                          Location
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left">
                          Channel
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-right">
                          COGS %
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-right">
                          GP %
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-right">
                          RSP £
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left">
                          Flags
                        </th>
                        <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-center">
                          Insights
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-50">
                      {filteredRecipes.map((recipe) => {
                        const isSelected = selectedRecipe?.id === recipe.id;
                        const gpLevel =
                          recipe.gpPercent >= 68
                            ? "high"
                            : recipe.gpPercent >= 62
                            ? "mid"
                            : "low";

                        let gpBg = "";
                        if (highlightLowGP) {
                          if (gpLevel === "low") {
                            gpBg = "bg-rose-50";
                          } else if (gpLevel === "mid") {
                            gpBg = "bg-amber-50";
                          } else {
                            gpBg = "bg-emerald-50";
                          }
                        }

                        const allergensCount = recipe.allergens.length;
                        const tagsCount = recipe.tags.length;

                        return (
                          <tr
                            key={recipe.id}
                            onClick={() => handleRowClick(recipe)}
                            className={`cursor-pointer border-b border-slate-100 text-[11px] hover:bg-sky-50 ${
                              isSelected ? "bg-sky-50" : ""
                            }`}
                          >
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} font-mono text-[11px] text-slate-500`}
                            >
                              {recipe.id}
                            </td>
                            <td className={`min-w-[180px] px-3 ${rowPadding}`}>
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 flex-shrink-0 rounded-md bg-slate-200/80" />
                                <div className="space-y-0.5">
                                  <p className="text-[11px] font-semibold text-slate-900">
                                    {recipe.shortName}
                                    {recipe.isSignature && (
                                      <span className="ml-1 rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-semibold text-pink-700">
                                        Signature
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-slate-500">
                                    {recipe.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-slate-700`}
                            >
                              <div className="flex flex-col">
                                <span>{recipe.menuFamily}</span>
                                <span className="text-[10px] text-slate-500">
                                  {recipe.category}
                                </span>
                              </div>
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-slate-700`}
                            >
                              <span className="font-medium">
                                {recipe.country}
                              </span>{" "}
                              · {recipe.city} · {recipe.outlet}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-slate-700`}
                            >
                              {recipe.channel}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-right text-slate-700`}
                            >
                              {recipe.cogsPercent.toFixed(1)}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-right font-semibold ${gpBg}`}
                            >
                              <span
                                className={
                                  gpLevel === "low"
                                    ? "text-rose-600"
                                    : gpLevel === "mid"
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                                }
                              >
                                {recipe.gpPercent.toFixed(1)}
                              </span>
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-right text-slate-700`}
                            >
                              {recipe.rsp.toFixed(2)}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-slate-600`}
                            >
                              {viewMode === "dense" ? (
                                <div className="flex items-center gap-2 text-[10px]">
                                  <span className="inline-flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 text-rose-700">
                                    {allergensCount || 0} allergen
                                    {allergensCount === 1 ? "" : "s"}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-sky-50 px-1.5 py-0.5 text-sky-700">
                                    {tagsCount || 0} tag
                                    {tagsCount === 1 ? "" : "s"}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500">
                                  {allergensCount || 0} allergen
                                  {allergensCount === 1 ? "" : "s"},{" "}
                                  {tagsCount || 0} tag
                                  {tagsCount === 1 ? "" : "s"}
                                </span>
                              )}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 ${rowPadding} text-center`}
                            >
                              {recipe.hasAiNotes ? (
                                viewMode === "dense" ? (
                                  <span className="inline-flex items-center justify-center rounded-full bg-slate-900 text-[9px] text-slate-50 px-1.5 py-0.5">
                                    <Wand2 className="mr-1 h-3 w-3" />
                                    Idea
                                  </span>
                                ) : (
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/90 text-[9px] text-slate-50">
                                    AI
                                  </span>
                                )
                              ) : (
                                <span className="text-[9px] text-slate-400">
                                  -
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Full-screen editor overlay */}
      {isEditorOpen && selectedRecipe && (
        <RecipeEditor
          recipe={selectedRecipe}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------- helpers below stay in this chunk ---------- */

function FilterBlock(props: {
  label: string;
  value: string | Country | Channel | Status | "All" | MenuFamily | Category;
  options: (
    | string
    | Country
    | Channel
    | Status
    | "All"
    | MenuFamily
    | Category
  )[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {props.label}
      </p>
      <div className="relative">
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {props.options.map((opt) => (
            <option key={String(opt)} value={String(opt)}>
              {String(opt)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3 w-3 text-slate-500" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const base = "inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px]";
  if (status === "Live") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Live
      </span>
    );
  }
  if (status === "In R&D") {
    return (
      <span className={`${base} bg-amber-50 text-amber-700`}>
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
        In R&D
      </span>
    );
  }
  return (
    <span className={`${base} bg-slate-100 text-slate-600`}>
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
      Paused
    </span>
  );
}

function KpiBox(props: {
  label: string;
  value: string;
  tone: "gp" | "cogs" | "price" | "neutral";
}) {
  let border = "border-slate-300";
  let bg = "bg-slate-100";
  let text = "text-slate-800";

  if (props.tone === "gp") {
    border = "border-emerald-300";
    bg = "bg-emerald-50";
    text = "text-emerald-800";
  } else if (props.tone === "cogs") {
    border = "border-amber-300";
    bg = "bg-amber-50";
    text = "text-amber-800";
  } else if (props.tone === "price") {
    border = "border-sky-300";
    bg = "bg-sky-50";
    text = "text-sky-800";
  }

  return (
    <div
      className={`rounded-2xl border ${border} ${bg} px-3 py-2 flex flex-col justify-between`}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {props.label}
      </p>
      <p className={`text-sm font-semibold ${text}`}>{props.value}</p>
    </div>
  );
}

function PhotoRecipeHero({ onClick }: { onClick: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-sky-500/50 bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 px-6 py-4 shadow-[0_0_50px_rgba(56,189,248,0.5)]">
      {/* Glow elements */}
      <div className="pointer-events-none absolute -left-16 -top-10 h-40 w-40 rounded-full bg-sky-500/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 -bottom-16 h-44 w-44 rounded-full bg-pink-500/35 blur-3xl" />

      <div className="relative flex items-center justify-between gap-6">
        {/* Left copy */}
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-sky-200 border border-sky-400/70 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300">
              <Camera className="h-2.5 w-2.5 text-slate-900" />
            </div>
            <span>Odyan VisionPRO</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-50">
            Turn any dish photo into a fully costed recipe, in seconds.
          </h2>
          <p className="text-xs text-sky-100/85">
            Upload a plate photo and VisionPRO detects the dish, estimates
            batch, builds ingredients &amp; batches, calculates GP%, flags
            allergens and writes the method – ready for your global library.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClick}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-pink-400 px-4 py-1.5 text-[11px] font-semibold text-slate-900 shadow-[0_0_30px_rgba(56,189,248,0.9)] hover:brightness-110"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate recipe from photo
            </button>
            <span className="text-[10px] text-sky-100/80">
              JPG · PNG · HEIC | Ready for your next photo.
            </span>
          </div>
          <p className="text-[10px] text-sky-200/80 pt-1">
            Recently generated:{" "}
            <span className="font-semibold">Truffle Cacio · 2025-12-08</span>
          </p>
        </div>

        {/* Right visual */}
        <div className="hidden md:flex h-24 w-56 flex-shrink-0 items-center justify-center rounded-2xl border border-sky-500/60 bg-slate-900/80 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.5)]">
          <div className="space-y-2 text-[10px] text-sky-100/90">
            <div className="flex items-center gap-2">
              <div className="h-9 w-12 rounded-md bg-slate-800/80" />
              <div>
                <p className="text-[10px] font-semibold">Detected dish</p>
                <p className="text-[9px] text-sky-100/70">
                  Açai Bowl · 280 g · Brunch
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px]">
              <div className="rounded-xl bg-emerald-500/15 px-2 py-1">
                <p className="uppercase tracking-[0.15em] text-emerald-300">
                  GP%
                </p>
                <p className="text-xs font-semibold text-emerald-100">68.0</p>
              </div>
              <div className="rounded-xl bg-amber-500/15 px-2 py-1">
                <p className="uppercase tracking-[0.15em] text-amber-200">
                  COGS%
                </p>
                <p className="text-xs font-semibold text-amber-100">32.0</p>
              </div>
              <div className="rounded-xl bg-sky-500/15 px-2 py-1">
                <p className="uppercase tracking-[0.15em] text-sky-200">
                  RSP £
                </p>
                <p className="text-xs font-semibold text-sky-100">12.50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecipeEditor({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const ingredients = useMemo(
    () => buildMockIngredients(recipe),
    [recipe.id, recipe.menuFamily, recipe.shortName]
  );
  const batchSubIngredients = useMemo(
    () => buildMockBatchSubIngredients(recipe),
    [recipe.id]
  );

  const [selectedBatchKey, setSelectedBatchKey] = useState<string | null>(null);
  const [portions, setPortions] = useState(14);

  useEffect(() => {
    setSelectedBatchKey(null);
    setPortions(14);
  }, [recipe.id]);

  const totalQtyKg = ingredients.reduce((acc, ing) => {
    const numeric = parseFloat(ing.qty);
    if (!Number.isFinite(numeric)) return acc;
    return acc + numeric;
  }, 0);

  const totalCost = ingredients.reduce((acc, ing) => acc + ing.lineCost, 0);
  const portionCost = totalCost / (portions || 1);

  const batchRow = ingredients.find(
    (ing) => ing.key === selectedBatchKey && ing.isBatch
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-slate-950/70 overflow-y-auto py-6 px-2 sm:px-4">
      <div className="relative flex w-full max-w-6xl flex-col rounded-3xl border border-slate-200 bg-slate-50 text-slate-900 shadow-2xl max-h-[calc(100vh-48px)]">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-3 bg-slate-100/95 rounded-t-3xl">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recipe editor
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {recipe.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {recipe.menuFamily} · {recipe.category} · {recipe.country} ·{" "}
              {recipe.outlet} · {recipe.channel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-sky-50"
            >
              <Brain className="h-3.5 w-3.5 text-sky-600" />
              Check recipe
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-slate-800"
              onClick={onClose}
            >
              Save &amp; close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Body grid */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="grid h-full grid-cols-1 gap-4 overflow-hidden text-xs text-slate-800 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
            {/* Left side: KPIs + ingredients */}
            <div className="flex flex-col gap-3 overflow-hidden">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <KpiBox
                  label="GP %"
                  value={recipe.gpPercent.toFixed(1)}
                  tone="gp"
                />
                <KpiBox
                  label="COGS %"
                  value={recipe.cogsPercent.toFixed(1)}
                  tone="cogs"
                />
                <KpiBox
                  label="RSP £"
                  value={recipe.rsp.toFixed(2)}
                  tone="price"
                />
                <KpiBox
                  label="Version"
                  value={`v${recipe.version}`}
                  tone="neutral"
                />
              </div>

              {/* Ingredients grid */}
              <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 min-h-[0]">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Ingredients &amp; batches
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-sky-50"
                    >
                      <Wand2 className="h-3 w-3 text-sky-500" />
                      Optimise GP
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-sky-50"
                    >
                      <Brain className="h-3 w-3 text-sky-500" />
                      Suggest swap
                    </button>
                  </div>
                </div>

                <div className="h-[230px] overflow-auto rounded-xl border border-slate-200 bg-slate-100/80">
                  <table className="min-w-full text-[11px]">
                    <thead className="bg-slate-100">
                      <tr className="text-slate-500">
                        <th className="px-2 py-1 text-left font-medium">
                          Ingredient
                        </th>
                        <th className="px-2 py-1 text-left font-medium">
                          Supplier
                        </th>
                        <th className="px-2 py-1 text-right font-medium">
                          Qty
                        </th>
                        <th className="px-2 py-1 text-right font-medium">
                          Unit cost
                        </th>
                        <th className="px-2 py-1 text-right font-medium">
                          Line cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map((ing) => {
                        const isSelected =
                          ing.key === selectedBatchKey && ing.isBatch;
                        return (
                          <React.Fragment key={ing.key}>
                            <tr
                              className={`border-t border-slate-100 ${
                                ing.isBatch ? "cursor-pointer" : ""
                              } ${
                                isSelected
                                  ? "bg-sky-50"
                                  : ing.isBatch
                                  ? "bg-slate-50/70"
                                  : "bg-slate-100/40"
                              }`}
                              onClick={() => {
                                if (!ing.isBatch) return;
                                setSelectedBatchKey(
                                  ing.key === selectedBatchKey ? null : ing.key
                                );
                              }}
                            >
                              <td className="px-2 py-1.5">
                                <div className="flex items-center gap-1.5">
                                  {ing.isBatch && (
                                    <span className="rounded-full bg-slate-900 text-[9px] text-slate-50 px-1 py-0.5">
                                      Batch
                                    </span>
                                  )}
                                  <span>{ing.name}</span>
                                </div>
                              </td>
                              <td className="px-2 py-1.5 text-slate-500">
                                {ing.supplier}
                              </td>
                              <td className="px-2 py-1.5 text-right">
                                {ing.qty}
                              </td>
                              <td className="px-2 py-1.5 text-right">
                                {ing.unitCost.toFixed(2)}
                              </td>
                              <td className="px-2 py-1.5 text-right">
                                {ing.lineCost.toFixed(2)}
                              </td>
                            </tr>

                            {ing.isBatch && selectedBatchKey === ing.key && (
                              <>
                                {batchSubIngredients.map((sub) => (
                                  <tr
                                    key={sub.key}
                                    className="border-t border-slate-100 bg-slate-50"
                                  >
                                    <td className="px-5 py-1.5 text-slate-700">
                                      {sub.name}
                                    </td>
                                    <td className="px-2 py-1.5 text-slate-500">
                                      {sub.supplier}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {sub.qty}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {sub.unitCost.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1.5 text-right">
                                      {sub.lineCost.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </>
                            )}
                          </React.Fragment>
                        );
                      })}
                      <tr className="border-t border-slate-200 bg-slate-50/90">
                        <td className="px-2 py-1.5 font-semibold">
                          Total batch
                        </td>
                        <td />
                        <td className="px-2 py-1.5 text-right">
                          {totalQtyKg.toFixed(2)} kg / L
                        </td>
                        <td />
                        <td className="px-2 py-1.5 text-right font-semibold">
                          £{totalCost.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-500">
                  <span>
                    Batch yield:{" "}
                    <strong>{portions} portions (simulated)</strong> · Approx.
                    portion cost:{" "}
                    <strong>£{portionCost.toFixed(2)}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1">
                      <span>Portions:</span>
                      <select
                        value={portions}
                        onChange={(e) => {
                          const v = Number(e.target.value) || 1;
                          setPortions(v);
                        }}
                        className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        {[8, 10, 12, 14, 16, 18, 20].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 hover:bg-sky-50"
                    >
                      <Wand2 className="h-3 w-3 text-sky-500" />
                      Scale batch
                    </button>
                    {batchRow && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 hover:bg-sky-50"
                      >
                        <Sparkles className="h-3 w-3 text-sky-500" />
                        Open batch as recipe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: method, allergens, menu performance, notes */}
            <div className="flex flex-col gap-3 overflow-hidden">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Method &amp; plating
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-sky-50"
                    >
                      <Wand2 className="h-3 w-3 text-sky-500" />
                      Rewrite steps
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-sky-50"
                    >
                      <Sparkles className="h-3 w-3 text-sky-500" />
                      Generate description
                    </button>
                  </div>
                </div>
                <textarea
                  className="mt-1 h-32 w-full resize-none rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  defaultValue={`1. Prepare all mise en place for ${recipe.shortName}.\n2. Follow EL&N standard method (CPU / store spec).\n3. Plate according to brand presentation guidelines with garnishes.\n4. Capture photo and attach to recipe gallery for training.`}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Allergen summary
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {recipe.allergens.length ? (
                      recipe.allergens.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-rose-50 px-1.5 py-0.5 text-rose-700"
                        >
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">
                        No major allergens set.
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-sky-50"
                  >
                    <Brain className="h-3 w-3 text-sky-500" />
                    Check allergen consistency
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Menu &amp; performance
                  </p>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    <li>
                      • Menu position:{" "}
                      <span className="font-medium">
                        {recipe.menuFamily} core range
                      </span>
                    </li>
                    <li>• Attach to: brunch, lunch and delivery menus.</li>
                    <li>• Note: project GP impact if price is +£0.50.</li>
                  </ul>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 hover:bg-sky-50"
                  >
                    <Wand2 className="h-3 w-3 text-sky-500" />
                    Simulate menu change
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Version control &amp; comments
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600">
                  <span>
                    Last edit: <strong>{recipe.lastUpdated}</strong> · Version{" "}
                    <strong>v{recipe.version}</strong>
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 hover:bg-sky-50"
                  >
                    <Sparkles className="h-3 w-3 text-sky-500" />
                    Summarise changes
                  </button>
                </div>
                <textarea
                  className="h-18 w-full resize-none rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Internal notes, change reasons, testing feedback..."
                />
              </div>

              {/* Placeholder zone for future panels (C) */}
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-3 space-y-1 text-[10px] text-slate-500">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Coming next in this workspace
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Sales &amp; volume trend card (per dish, per outlet, per
                    channel).
                  </li>
                  <li>
                    Supplier comparison tile with live price drift
                    visualisation.
                  </li>
                  <li>
                    Prep &amp; training assets block (photos, videos, SOP
                    links).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
