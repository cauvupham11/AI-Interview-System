const express = require('express');
const authController = require('../controllers/auth.controllers');
const { authRateLimiter } = require('../middlewares/rateLimit.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const {
    normalizeAuthBody,
    validateRegister,
    validateLogin,
    validateRefreshToken,
} = require('../middlewares/validateAuth.middleware');

const router = express.Router();

router.post('/register', authRateLimiter, normalizeAuthBody, validateRegister, authController.register);
router.post('/login', authRateLimiter, normalizeAuthBody, validateLogin, authController.login);
router.post('/refresh-token', authRateLimiter, validateRefreshToken, authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
