export interface CategoryDefinition {
  slug: string;
  name: string;
  icon: string; // Lucide / emoji icon name used by the apps
}

/** Default grocery categories used to seed the catalog. */
export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  { slug: "fruits-vegetables", name: "Fruits & Vegetables", icon: "Apple" },
  { slug: "meat-seafood", name: "Meat & Seafood", icon: "Fish" },
  { slug: "dairy-eggs", name: "Dairy & Eggs", icon: "Egg" },
  { slug: "bakery", name: "Bakery", icon: "Croissant" },
  { slug: "beverages", name: "Beverages", icon: "CupSoda" },
  { slug: "snacks", name: "Snacks", icon: "Cookie" },
  { slug: "pantry", name: "Pantry & Staples", icon: "Wheat" },
  { slug: "frozen", name: "Frozen Foods", icon: "Snowflake" },
  { slug: "household", name: "Household", icon: "SprayCan" },
  { slug: "personal-care", name: "Personal Care", icon: "Sparkles" },
  { slug: "baby", name: "Baby Care", icon: "Baby" },
  { slug: "pets", name: "Pet Supplies", icon: "PawPrint" },
];
