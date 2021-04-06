const request = require('supertest');
const assert = require('chai').assert;
const redisClient = require('../redis');

const app = require('../app');
const config = require('../config');


describe('Rate Limit', () => {
    const mockIp = 'TEST_MOCK_IP';
    
    before(async () => {
        await redisClient.del(mockIp);
    });
    
    it('Should return correct rate limit values', done => {
        request(app)
            .get('/')
            .set('X-Forwarded-For', mockIp)
            .expect(200)
            .end((err, res) => {
                if (err) { done(err) };
                assert.isDefined(res.headers['x-ratelimit-remaining']);
                assert.isDefined(res.headers['x-ratelimit-reset']);
                assert.equal(res.headers['x-ratelimit-remaining'], config.rateLimitCount - 1);
                
                done();
            });
    });
});