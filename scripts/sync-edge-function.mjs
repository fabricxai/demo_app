/**
 * Copies Edge Function sources from src/supabase/functions/server/ into
 * supabase/functions/make-server-1f923fcd/ (index.tsx → index.ts for CLI).
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, "src", "supabase", "functions", "server");
const destDir = join(root, "supabase", "functions", "make-server-1f923fcd");

mkdirSync(destDir, { recursive: true });
copyFileSync(join(srcDir, "index.tsx"), join(destDir, "index.ts"));
copyFileSync(join(srcDir, "kv_store.tsx"), join(destDir, "kv_store.tsx"));
console.log("Synced to supabase/functions/make-server-1f923fcd/ (index.ts, kv_store.tsx)");
