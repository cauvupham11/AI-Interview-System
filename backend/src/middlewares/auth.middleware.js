const { verifyAccessToken } = require('../utils/token.util');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Access token la bat buoc',
        });
    }

    try {
        req.account = verifyAccessToken(token);
        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Access token khong hop le hoac da het han',
        });
    }
};

module.exports = {
    authenticate,
};
