import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, "migration");

async function runMigrations() {
  console.log("🚀 Starting Merca Database Migrations...");
  const client = await pool.connect();

  try {
    // 1. Create migrations tracking table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // 2. Read already applied migrations
    const { rows: appliedRows } = await client.query(
      "SELECT filename FROM schema_migrations ORDER BY id ASC;"
    );
    const appliedSet = new Set(appliedRows.map((r) => r.filename));

    // 3. Read migration files sorted alphabetically
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    let executedCount = 0;

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`⏩ [Skipped]  ${file} (already applied)`);
        continue;
      }

      console.log(`⏳ [Applying] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      await client.query("BEGIN;");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1);",
          [file]
        );
        await client.query("COMMIT;");
        console.log(`✅ [Applied]  ${file}`);
        executedCount++;
      } catch (err) {
        await client.query("ROLLBACK;");
        console.error(`❌ [Failed]   ${file}: ${err.message}`);
        throw err;
      }
    }

    if (executedCount === 0) {
      console.log("✨ All migrations are up to date! Nothing to run.");
    } else {
      console.log(`🎉 Successfully applied ${executedCount} migration(s)!`);
    }
  } catch (err) {
    console.error("💥 Migration process terminated with errors.");
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
