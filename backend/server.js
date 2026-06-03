const app = require('./app')
const { mySqlDataSource, redis } = require('./src/config/appDataSource')

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
    try {
        await redis.connect()
        console.log('Redis connected successfully')
    } catch (error) {
        console.log('Redis connect error:', error)
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