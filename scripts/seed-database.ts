/**
 * Seeds the Supabase database with sample categories, products, and roles by
 * running the SQL files in supabase/seed against the configured database.
 *
 * Usage:  npm run seed-database
 * Requires: the Supabase CLI and a running local DB (or a linked project).
 */
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const SEED_FILES = [
  "supabase/seed/sample-categories.sql",
  "supabase/seed/sample-products.sql",
  "supabase/seed/sample-admin-users.sql",
];

function run(): void {
  for (const file of SEED_FILES) {
    const path = resolve(process.cwd(), file);
    console.log(`Applying ${file}…`);
    execSync(`npx supabase db execute --file "${path}"`, { stdio: "inherit" });
  }
  console.log("Seed complete.");
}

run();
