const { Pool } = require('pg');

/**
 * A connection pool (rather than opening a new connection per request)
 * so the server reuses a small set of open connections instead of
 * paying the cost of a fresh TCP + TLS handshake to Supabase on every
 * single API call.
 *
 * SIMPLEST SETUP: paste your Supabase pooler connection string
 * directly into DB_CONNECTION_STRING below and skip the .env file
 * entirely if environment variables have given you trouble before —
 * just remember to blank it out again before pushing publicly.
 */
const DB_CONNECTION_STRING =
  process.env.DATABASE_URL || '<paste-your-supabase-connection-string-here>';

const pool = new Pool({
  connectionString: DB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

module.exports = pool;
