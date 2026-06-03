const { DataSource } = require('typeorm')
const { createClient } = require('redis')
require('dotenv').config()

const mySqlDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOSTNAME,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    entities: ['src/entities/*.js'],
    migrations: ['src/migrations/*.js'],

    synchronize: process.env.NODE_ENV !== 'production',
    logging: false
})

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOSTNAME,
        port: Number(process.env.REDIS_PORT)
    }
})

module.exports = {
    mySqlDataSource,
    redis
}
