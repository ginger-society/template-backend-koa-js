import models from '@/models'
import { DataSource } from 'typeorm'

const appDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'postgres',
	database: 'Test-db',
	synchronize: false,
	logging: true,
	entities: models,
	subscribers: [],
	migrations: []
})

export default appDataSource.manager

export const connection = {
	disconnect: async () => {
		await appDataSource.destroy()
	},
	connect: async () => {
		await appDataSource.initialize()
	}
}
