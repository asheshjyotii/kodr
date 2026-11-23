import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_EXPIRES_IN = '1d';

export function signToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn
    });
  } catch (error) {
    console.error('Error signing JWT token:', error.message);
    throw new Error('Token generation failed');
  }
}

export function verifyToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.warn('JWT verification warning:', error.message);
    return null;
  }
}