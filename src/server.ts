import app from './app'
import config from './configs/config'
import logger from './utils/logger'
import loggerDatabaseService from './database/loggerDatabaseService'
import { connectRedis } from './configs/redis'
const server = app.listen(config.PORT)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
    try {
        const connection = await loggerDatabaseService.connect()
        logger.info(`DATABASE_CONNECTION`, {
            meta: {
                CONNECTION_NAME: connection.name
            }
        })
        logger.info(`APPLICATION_STARTED`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
         connectRedis()
    } catch (err) {
        logger.error(`APPLICATION_ERROR`, { meta: err })

        server.close((error) => {
            if (error) {
                logger.error(`APPLICATION_ERROR`, { meta: error })
            }

            process.exit(1)
        })
    }
})()
