const app = require('./app')
const { mySqlDataSource, redis, isRedisConfigured } = require('./src/config/appDataSource')

const PORT = process.env.APP_PORT || 5000

async function startMysql() {
    try {
        await mySqlDataSource.initialize()
        console.log('Database connected successfully')
    } catch (error) {
        console.log('MySQL connect error:', error)
    }
}

async function startRedis() {
    if (!isRedisConfigured) {
        console.log('Redis is not configured. Set REDIS_URL for Upstash/Render Redis if you need it.')
        return
    }

    try {
        await redis.connect()
        console.log('Redis connected successfully')
    } catch (error) {
        console.warn('Redis unavailable, continuing without Redis:', error.message)
    }
}

async function startServer() {
    await startMysql()
    await startRedis()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer()
