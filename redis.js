const Redis = require('ioredis');
const config = require('./config');

const redisClient = new Redis({
    host: config.redisUrl,
    port: config.redisPort
});

module.exports = redisClient;