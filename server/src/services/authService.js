const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIMPLEST SETUP: replace this directly if environment variables give
// you trouble. This secret signs every login token — treat it like a
// password and never commit a real one to a public repo.
const JWT_SECRET = process.env.JWT_SECRET || '<replace-with-a-long-random-string>';
const JWT_EXPIRY = '7d';

async function hashPassword(plainPassword) {
  const SALT_ROUNDS = 10; // higher = slower to brute-force, but slower to hash too
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

function signToken(user) {
  // Only ever put non-sensitive, small data in a JWT payload — it's
  // base64-encoded, NOT encrypted, so anyone holding the token can
  // read this part even without the secret.
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET); // throws if invalid/expired
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
