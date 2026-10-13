import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️  DATABASE_URL is not set in backend/.env");
}

// Enable SSL when connecting to cloud providers (e.g. Neon, Supabase, Render, AWS RDS)
const isCloudDb = connectionString && !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  ssl: isCloudDb ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);

export default { pool, query };
