import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
const JWT_SECRET= process.env.NODE_ENV=='test'? process.env.VITE_JWT_SECRET:process.env.JWT_SECRET;

const verifyAuth = (requiredRoles) => (req, res, next) => {
  const token = req.cookies.token 
    ? req.cookies.token 
    : (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  
  if (!token) {
    logger.error('Error on token validation', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: 'Access denied: No token provided',
    });
    return res.status(401).send({ error: 'Access denied: No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
  
    const hasRequiredRole = requiredRoles.some(role => decoded.roles.includes(role));
    if (!hasRequiredRole) {
      logger.error('Error on token validation', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
        userId: decoded.userId,
        error: 'Access denied. Insufficient permissions.',
        roles: decoded.roles
      });
      return res.status(403).send({ error: 'Access denied: Insufficient permissions' });
    }
  
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Error on token validation', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error.message
    });
    res.status(400).send({ error: 'Invalid token', message: error.message });
  }
};
  
export const paymentPermissions = verifyAuth(['clinicadmin','admin']);
export const clinicPermissions = verifyAuth(['clinicadmin','admin']);
  