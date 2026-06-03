const express = require('express');

const authRoutes = require('./auth.routes');
const interviewRoutes = require('./interview.routes');
const historyRoutes = require('./history.routes');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API running');
});

router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/histories', historyRoutes);

module.exports = router;
