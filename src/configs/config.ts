import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export default {
    // General
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    MONGODB_DATABASE_URL: process.env.MONGODB_DATABASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    REDIS_URL: process.env.REDIS_URL,
    GLOBAL_RATE_LIMIT: process.env.GLOBAL_RATE_LIMIT,
    API_KEY_CACHE_TTL: process.env.API_KEY_CACHE_TTL || '300'
} as const
