const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    environment: {
      APP_PORT: Number(process.env.APP_PORT),
      APP_HOSTNAME: process.env.APP_HOSTNAME,

    DOMAIN_CORS: process.env.DOMAIN_CORS,

    DATABASE_HOSTNAME: process.env.DATABASE_HOSTNAME,
    DATABASE_PORT: Number(process.env.DATABASE_PORT),
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,

    LOG_LEVEL: process.env.LOG_LEVEL,

    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    REDIS_HOSTNAME: process.env.REDIS_HOSTNAME,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_TLS: process.env.REDIS_TLS,
    REDIS_URL: process.env.REDIS_URL,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',

    INIT_ADMIN_EMAIL: process.env.INIT_ADMIN_EMAIL,
    INIT_ADMIN_USERNAME: process.env.INIT_ADMIN_USERNAME,
    INIT_ADMIN_PASSWORD: process.env.INIT_ADMIN_PASSWORD
  }
}
