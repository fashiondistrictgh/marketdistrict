/**
 * Generates TypeScript types from the live Supabase schema and writes a copy
 * into each app's shared folder so both stay in sync with the database.
 *
 * Usage:  npx tsx scripts/generate-types.ts   (run from the repo root)
 * Requires: the Supabase CLI installed and SUPABASE_PROJECT_ID set (or local DB running).
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUTPUTS = [
  "apps/mobile/src/shared/types/database.generated.ts",
  "apps/admin-web/src/shared/types/database.generated.ts",
];

const projectId = process.env.SUPABASE_PROJECT_ID;

function run(): void {
  const target = projectId ? `--project-id ${projectId}` : "--local";
  console.log(`Generating Supabase types (${projectId ? "remote" : "local"})…`);

  const output = execSync(
    `npx supabase gen types typescript ${target} --schema public`,
    { encoding: "utf8" },
  );

  for (const out of OUTPUTS) {
    const path = resolve(process.cwd(), out);
    writeFileSync(path, output, "utf8");
    console.log(`Wrote ${path}`);
  }
}

run();
