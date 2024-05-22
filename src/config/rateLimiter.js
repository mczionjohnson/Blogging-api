// configure rateLimiter
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // half a minute
  max: 4, // Limit each IP to 4 requests per `window` (here, per half a minute)
  keyGenerator: function (req) {
    return req.headers['x-device-id'] || req.ip
}, // by device id, user id or ip address
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
