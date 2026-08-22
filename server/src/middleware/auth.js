const { verifyToken } = require('../services/authService');

/**
 * Protects a route by requiring a valid "Authorization: Bearer <token>"
 * header. On success, attaches the decoded user info to req.user so
 * downstream route handlers know who's making the request — this is
 * how applicationController scopes queries to only the logged-in
 * user's own applications.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
