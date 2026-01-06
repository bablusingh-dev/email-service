import { drizzle } from 'drizzle-orm/postgres-js'
import postgres, { Sql } from 'postgres'
import * as schema from './schema'
import config from '../configs/config'

const connectionString = config.DATABASE_URL as string
if (!connectionString) {
    throw new Error('DATABASE_URL is missing')
}
// Create postgres client
const client: Sql = postgres(connectionString, {
    max: 10,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    idle_timeout: 20,
    connect_timeout: 10
})

// Create drizzle instance with schema
export const db = drizzle(client, { schema, logger: process.env.NODE_ENV === 'development' })

// Export client for cleanup
export { client }
