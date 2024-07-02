import { config } from '@/config'
import { connection } from '@/db'
import { logger } from '@/logger'
import { routes } from '@/routes'
import cors from '@koa/cors'
import Koa from 'koa'
import { koaSwagger } from 'koa2-swagger-ui'
import { koaBody } from 'koa-body'
import koaBunyanLogger from 'koa-bunyan-logger'
import serve from 'koa-static'
import { createClient } from 'redis'
import 'reflect-metadata'

export const cache = createClient({
	url: 'redis://localhost:6379'
})

cache.on('error', () => {
	logger.info('Redis Client Error')
})

const koaValidator = require('koa-async-validator')

const app = new Koa()

app.use(koaBody())
app.use(koaValidator())
app.use(cors())
app.use(koaBunyanLogger(logger))
app.use(koaBunyanLogger.requestLogger())
app.use(koaBunyanLogger.timeContext())
app.use(routes)
app.use(serve('public'))
app.use(
	koaSwagger({
		routePrefix: '/swagger',
		swaggerOptions: {
			url: '/openapi.json',
			header: {
				display: 'none'
			}
		}
	})
)

export const server = new Promise<ReturnType<typeof app.listen>>(
	(resolve, _reject) => {
		connection.connect().then(() => {
			logger.info('DB connected')
			cache.connect().then(() => {
				logger.info('Redis connected')
				resolve(app.listen(config.port))
				logger.info(`Server running on port ${config.port}`)
			})
		})
	}
)
