import { cache, server } from '@/app'
import db, { connection } from '@/db'
import { StudentEntity } from '@/models'
// import { classNames } from '@pkyad/jslib1'
import request from 'supertest'

let app: ReturnType<typeof request>
beforeAll(async () => {
	app = request(await server)
	// console.log(classNames('dsdas', 'second'))
})

afterAll(async () => {
	// close the server after each test
	;(await server).close()
	connection.disconnect()
	cache.disconnect()
	// console.log('server closed!')
})

describe('first suite', () => {
	it('test 1', async () => {
		const response = await app.get('/healthcheck')
		expect(response.text).toBe('OK 2')
	})
	it('test 2', async () => {
		const response = await app.get('/test1')
		expect(response.body).toMatchObject({ key: 'val' })
	})
	it('checks if unauthorized', async () => {
		const response = await app.get('/')

		const allStudents = await db.find(StudentEntity)
		expect(allStudents.length).toBeGreaterThan(0)
		expect(response.status).toBe(401)
	})
	it('checks response from cache', async () => {
		const cacheData = 'val-cached'
		cache.set('koa-ts-data', cacheData)
		const response = await app.get('/cache-test')
		expect(response.body).toMatchObject({ key: cacheData })
	})
	it('checks if tenants can be created with adminstrator', async () => {
		const student = new StudentEntity()
		student.name = 'second tenant 12'
		student.has_cab_service = true
		student.updated_at = new Date().toDateString()
		student.created_at = new Date()
		student.roll_number = 'ROLL01'
		student.on_scholarship = false
		student.address = 'Address text'

		await db.save(student)
	})
	it('gets admins from a tenant', async () => {
		const allStudents = await db.find(StudentEntity, {
			relations: {
				courses: true
			}
		})
		const lastStudent = allStudents[allStudents.length - 1]
		expect(lastStudent).toBeDefined()
	})
	// it('laads many to many fields', async () => {
	// 	const m2mTestModels = await db.find(Many2ManyTestEntity, {
	// 		relations: {
	// 			testModels: true,
	// 			crossAppModel: true
	// 		}
	// 	})
	// 	const testModels = await db.find(TestEntity, {
	// 		relations: {
	// 			main_models: true
	// 		}
	// 	})
	// 	// eslint-disable-next-line no-console
	// 	console.log({ m2mTestModels, testModels })
	// })
})
