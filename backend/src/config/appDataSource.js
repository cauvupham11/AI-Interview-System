const { DataSource } = require('typeorm')
const { createClient } = require('redis')
require('dotenv').config()

const isDatabaseSslEnabled = process.env.DATABASE_SSL === 'true'
const isRedisTlsEnabled = process.env.REDIS_TLS === 'true'
const cleanEnvValue = (value) => {
    if (!value) {
        return value
    }

    return value.trim().replace(/^['"]|['"]$/g, '')
}

const redisUrl = cleanEnvValue(process.env.REDIS_URL)
const redisHostname = cleanEnvValue(process.env.REDIS_HOSTNAME)
const redisUsername = cleanEnvValue(process.env.REDIS_USERNAME)
const redisPassword = cleanEnvValue(process.env.REDIS_PASSWORD)
const redisConnectTimeout = Number(process.env.REDIS_CONNECT_TIMEOUT || 5000)
const isLocalRedisHostname = ['localhost', '127.0.0.1', '::1'].includes(redisHostname)
const isRedisConfigured = Boolean(
    redisUrl ||
        (redisHostname && (process.env.NODE_ENV !== 'production' || !isLocalRedisHostname))
)

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
    ? redisUrl
        ? {
              url: redisUrl,
              socket: {
                  connectTimeout: redisConnectTimeout,
                  reconnectStrategy: false
              }
          }
        : {
              username: redisUsername || undefined,
              password: redisPassword || undefined,
              socket: {
                  host: redisHostname,
                  port: Number(process.env.REDIS_PORT || 6379),
                  tls: isRedisTlsEnabled || undefined,
                  connectTimeout: redisConnectTimeout,
                  reconnectStrategy: false
              }
          }
    : null

const redis = redisConfig ? createClient(redisConfig) : null

module.exports = {
    mySqlDataSource,
    redis,
    isRedisConfigured
}
