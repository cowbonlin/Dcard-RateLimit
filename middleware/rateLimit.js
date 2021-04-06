const Redis = require('ioredis');
const redisClient = require('../redis');
const config = require('../config');

const rateLimit = async (req, res, next) => {
    const ip = req.headers['X-Real-IP'] || req.ip || req.connection.remoteAddress;
    let count = await redisClient.get(ip);
    let resetTime;
    
    if (count === null) {
        await redisClient.set(ip, 1, 'EX', config.rateLimitInterval * 60 * 60);
        count = 1;
        resetTime = config.rateLimitInterval * 60 * 60;
    }
    else if (count < config.rateLimitCount) {
        count = await redisClient.incr(ip);
        resetTime = await redisClient.ttl(ip);
    }
    else {
        resetTime = await redisClient.ttl(ip);
        res.set({
            'X-RateLimit-Reset': Math.round(new Date().getTime() / 1000 + resetTime)
        });
        return res.status(429).send();
    }
    
    res.set({
        'X-RateLimit-Remaining': config.rateLimitCount - count,
        'X-RateLimit-Reset': Math.round(new Date().getTime() / 1000 + resetTime)
    });
    
    return next();
};

module.exports = rateLimit;