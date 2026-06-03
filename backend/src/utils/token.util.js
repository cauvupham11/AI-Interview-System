const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { environment } = require('../config/env');

const signAccessToken = (payload) => {
    return jwt.sign(
        payload,
        environment.accessSecret,
        {
            expiresIn: environment.accessExpiresIn,
        }
    );
};

const signRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        environment.refreshSecret,
        {
            expiresIn: environment.refreshExpiresIn,
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        environment.accessSecret
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        environment.refreshSecret
    );
};

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashToken,
};