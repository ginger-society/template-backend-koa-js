import { cache, server } from '@/app'
import db, { connection } from '@/db'
import {
	AdministratorEntity,
	Many2ManyTestEntity,
	TenantEntity,
	TestEntity
} from '@/models/i_am_1'
// import { classNames } from '@pkyad/jslib1'
import request from 'supertest'

let app: ReturnType<typeof request>
beforeAll(async () => {
	app = request(await server)
	// console.log(classNames('dsdas', 'second'))
})

afterAll(async () => {
	// close the server after each test
	; (await server).close()
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

		const allUsers = await db.find(TestEntity)
		expect(allUsers.length).toBeGreaterThan(0)
		expect(response.status).toBe(401)
	})
	it('checks response from cache', async () => {
		const cacheData = 'val-cached'
		cache.set('koa-ts-data', cacheData)
		const response = await app.get('/cache-test')
		expect(response.body).toMatchObject({ key: cacheData })
	})
	it('checks if tenants can be created with adminstrator', async () => {
		const tenant = new TenantEntity()
		tenant.name = 'second tenant 12'
		tenant.is_active = true
		tenant.expiry_date = new Date().toDateString()

		await db.save(tenant)

		const admin = new AdministratorEntity()
		admin.email = 'test11@gmail.com'
		admin.is_active = true
		admin.is_admin = true
		admin.is_staff = true
		admin.last_login = new Date()
		admin.mobile = '9876543210'
		admin.tenant = tenant
		admin.name = 'User Kumar'
		admin.next_password_change_due = new Date().toDateString()
		admin.password = 'encryptedStr'
		admin.password_change_required = true

		await db.save(admin)

		// const allTenants = await db.find(TenantEntity)
		// const allAdmin = await db.find(AdministratorEntity, {
		// 	relations: {
		// 		tenant: true
		// 	}
		// })
		// console.log(allTenants, allAdmin)
	})
	it('gets admins from a tenant', async () => {
		const allTenants = await db.find(TenantEntity, {
			relations: {
				users: true
			}
		})
		const lastTenant = allTenants[allTenants.length - 1]
		expect(lastTenant).toBeDefined()
	})
	it('laads many to many fields', async () => {
		const m2mTestModels = await db.find(Many2ManyTestEntity, {
			relations: {
				testModels: true,
				crossAppModel: true
			}
		})
		const testModels = await db.find(TestEntity, {
			relations: {
				main_models: true
			}
		})
		// eslint-disable-next-line no-console
		console.log({ m2mTestModels, testModels })
	})
})
