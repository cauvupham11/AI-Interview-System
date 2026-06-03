const createRateLimiter = ({ windowMs, max, message }) => {
    const buckets = new Map();

    return (req, res, next) => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const bucket = buckets.get(key);

        if (!bucket || bucket.resetAt <= now) {
            buckets.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });
            return next();
        }

        bucket.count += 1;

        if (bucket.count > max) {
            const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
            res.set('Retry-After', String(retryAfter));
            return res.status(429).json({
                message,
            });
        }

        return next();
    };
};

const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Qua nhieu yeu cau, vui long thu lai sau',
});

module.exports = {
    createRateLimiter,
    authRateLimiter,
};
