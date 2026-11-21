const Redis = require("ioredis");

let cacheInstance = new Redis(process.env.REDIS_URI);

module.exports = cacheInstance;
