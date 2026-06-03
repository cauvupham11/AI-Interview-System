const express = require('express');
const cors = require('cors');

const routes = require('./src/routes')
const { environment } = require('./src/config/env');
const errorMiddleware = require('./src/middlewares/error.middleware');

const app = express();

app.use(cors({
    origin: environment.DOMAIN_CORS || true,
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (req, res) => {
    res.json({
        message: 'AI Interview System API',
    });
});

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
