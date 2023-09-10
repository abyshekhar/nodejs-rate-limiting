const redis = require('redis')
const client = redis.createClient({
    url: process.env.REDIS_URL
})

const rateLimiter = (allowedRequests, time) => {
    return async (req, res, next)=> {
            try {
                //You can define your logic to determine the IP
                const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
                if (!client.isOpen) {
                    await client.connect();
                }
                let ttl
                const requests = await client.incr(ip)
                if (requests === 1) {
                    await client.expire(ip, time)
                    ttl = time
                } else {
                    ttl = await client.ttl(ip)
                }
                if (requests > allowedRequests) {
                    return res.status(429).json({
                        error: 'Too many requests. Try again after sometime. TTL' + ttl
                    });
                }
                next();
            } catch (err) {
                return res.status(500).json({
                    error: 'An error occurred while processing the request!' + err
                });
            }
        }
    }

    module.exports =rateLimiter
