/**
 * XEVOPROP — OFFICIAL LOCATION & PROPERTY TYPES
 * Sourced directly from corporate specification table:
 * States, Cities, Usage Types, Property Types, and Budget Presets.
 */

export const REAL_ESTATE_STATES = [
  {
    name: "Telegana",
    displayName: "Telangana",
    cities: ["Hyderabad", "Nizamabad"],
  },
  {
    name: "Maharastra",
    displayName: "Maharashtra",
    cities: ["Mumbai", "Pune", "Thane", "Sambhaji Nagar"],
  },
  {
    name: "Karnataka",
    displayName: "Karnataka",
    cities: ["Banglore", "Manglore"],
  },
];

export const CITIES_BY_STATE = {
  Telegana: ["Hyderabad", "Nizamabad"],
  Telangana: ["Hyderabad", "Nizamabad"],
  Maharastra: ["Mumbai", "Pune", "Thane", "Sambhaji Nagar"],
  Maharashtra: ["Mumbai", "Pune", "Thane", "Sambhaji Nagar"],
  Karnataka: ["Banglore", "Manglore"],
};

export const ALL_CITIES = [
  "Hyderabad",
  "Nizamabad",
  "Mumbai",
  "Pune",
  "Thane",
  "Sambhaji Nagar",
  "Banglore",
  "Manglore",
];

export const USAGE_TYPES = [
  "Investment",
  "Residence",
];

export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Plot",
  "Commercial",
];

export const BUDGET_PRESETS = [
  { label: "25 Lakh", value: 2500000, priceText: "₹25 Lakh" },
  { label: "50 Lakh", value: 5000000, priceText: "₹50 Lakh" },
  { label: "75 Lakh", value: 7500000, priceText: "₹75 Lakh" },
  { label: "1 CR", value: 10000000, priceText: "₹1 Crore" },
  { label: "1.5 CR", value: 15000000, priceText: "₹1.5 Crore" },
  { label: "2 CR", value: 20000000, priceText: "₹2 Crore" },
  { label: "3 CR", value: 30000000, priceText: "₹3 Crore" },
];

export const LOCATION_OPTIONS = [
  "All",
  "Financial District",
  "Gachibowli",
  "Hitec City",
  "Jubilee Hills",
  "Bandra",
  "Andheri",
  "Whitefield",
  "Indiranagar",
];
