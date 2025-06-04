const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Incoming token:', token);

  // ✅ Allow hardcoded admin bypass token
  if (token === 'admin-token') {
    req.user = { email: 'admin@medibook.com', role: 'admin', name: 'Admin' };
    console.log('✅ Using hardcoded admin-token');
    return next();
  }

  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      console.log('❌ JWT verification failed:', err.message);
      return res.sendStatus(403);
    }

    console.log('✅ Decoded user:', user);
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
