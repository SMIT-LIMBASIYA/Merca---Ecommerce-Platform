import { pool } from "./index.js";

async function testConnection() {
  console.log("🔄 Testing PostgreSQL connection...");
  try {
    const res = await pool.query("SELECT current_database(), current_user, version();");
    const { current_database, current_user, version } = res.rows[0];
    console.log("✅ Successfully connected to PostgreSQL!");
    console.log(`📦 Database: ${current_database}`);
    console.log(`👤 User:     ${current_user}`);
    console.log(`ℹ️  Version:  ${version.split(",")[0]}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error(`Reason: ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
