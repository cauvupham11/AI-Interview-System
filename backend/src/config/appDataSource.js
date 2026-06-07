const { DataSource } = require('typeorm')
const { createClient } = require('redis')
require('dotenv').config()

const isDatabaseSslEnabled = process.env.DATABASE_SSL === 'true'
const isRedisTlsEnabled = process.env.REDIS_TLS === 'true'
const isRedisConfigured = Boolean(process.env.REDIS_URL || process.env.REDIS_HOSTNAME)

const mySqlDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOSTNAME,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: isDatabaseSslEnabled
        ? {
              minVersion: 'TLSv1.2',
              rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
          }
        : undefined,

    entities: ['src/entities/*.js'],
    migrations: ['src/migrations/*.js'],

    synchronize: process.env.NODE_ENV !== 'production',
    logging: false
})

const redisConfig = isRedisConfigured
    ? process.env.REDIS_URL
        ? {
              url: process.env.REDIS_URL
          }
        : {
              username: process.env.REDIS_USERNAME || undefined,
              password: process.env.REDIS_PASSWORD || undefined,
              socket: {
                  host: process.env.REDIS_HOSTNAME,
                  port: Number(process.env.REDIS_PORT || 6379),
                  tls: isRedisTlsEnabled || undefined
              }
          }
    : null

const redis = redisConfig ? createClient(redisConfig) : null

module.exports = {
    mySqlDataSource,
    redis,
    isRedisConfigured
}
