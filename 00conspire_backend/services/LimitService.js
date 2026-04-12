const rateLimit = require('express-rate-limit');

const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({ message: "Limit reached for this user." });
  }
});

module.exports = {scraperLimiter};
