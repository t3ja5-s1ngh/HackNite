const jwt = require('jsonwebtoken');
const SECRET = "demo_secret_key_123";

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  try {
    const tokenPart = token.split(" ")[1]; 
    const verified = jwt.verify(tokenPart, SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

module.exports = {verifyToken};
