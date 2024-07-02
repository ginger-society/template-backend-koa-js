import { cache } from '@/app'
import db from '@/db'
import prom from '@/measure'
import fs from 'fs'
// import { choice_fieldEnum, TestEntity } from '@/models/i_am_1'
import { type Context } from 'koa'
import Router from 'koa-router'
import path from 'path'
import swaggerJsdoc from 'swagger-jsdoc'
import { StudentEntity } from './models'
import { djangoService } from './services'

const router = new Router()

const schemas = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, 'models', 'schema.json'), 'utf8')
)

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Hello World',
			version: '1.0.0'
		},
		components: {
			schemas: {
				...schemas.definitions
			}
		}
	},
	apis: ['./app/routes*.ts'] // files containing annotations as above
}

const todocounter = new prom.Counter({
	name: 'forethought_number_of_todos_total',
	help: 'The number of items added to the to-do list, total'
})

/**
 * Base route, return a 401
 */
router.get('/', async (ctx) => (ctx.status = 401))

/**
 * Basic healthcheck
 */
router.get('/healthcheck', async (ctx) => {
	ctx.body = 'OK 2'
})

/**
 * @swagger
 * /test1:
 *  get:
 *    description: Returns the current user meta data in json edited
 *    operationId: getCurrentSession
 *    responses:
 *       200:
 *         description: returns current user object, should only be called
 *          once for a entire load or after sign in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentEntity'
 *       401:
 *         description: if the jwt token is not present in the cookie or its invalid
 */
const testHandler = async (ctx: Context) => {
	const student = new StudentEntity()
	student.address = 'address text'
	student.father_name = 'Another name'
	student.has_cab_service = false
	student.on_scholarship = true
	student.name = 'SStudent'
	student.roll_number = '1023B'
	student.created_at = new Date()
	student.updated_at = '2024-07-02'
	todocounter.inc()
	await db.save(student)
	ctx.body = {
		key: 'val'
	}
}

router.get('/test1', testHandler)
router.get('/openapi.json', (ctx) => {
	const openapiSpecification = swaggerJsdoc(options)
	ctx.body = openapiSpecification
})

/**
 * @param {Context} ctx
 */
const promHandler = async (ctx: Context) =>
	(ctx.body = await prom.register.metrics())

router.get('/metrics', promHandler)

router.get('/cache-test', async (ctx: Context) => {
	ctx.body = { key: await cache.get('koa-ts-data') }
})
router.get('/external-service-test', async (ctx: Context) => {
	ctx.body = await djangoService.listtestView4s()
})

export const routes = router.routes()
