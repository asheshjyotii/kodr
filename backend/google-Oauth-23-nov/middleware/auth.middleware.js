export function authenticateJWT(req, res, next) {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    if (req.accepts('html')) {
      return res.redirect('/');
    }
    return res.status(401).json({ authenticated: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.clearCookie('token');
    if (req.accepts('html')) {
      return res.redirect('/redirect-to-error-page');
    }
    return res.status(401).json({ authenticated: false, message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}