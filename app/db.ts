import models from '@/models/i_am_1'
import { DataSource } from 'typeorm'

const appDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'postgres',
	database: 'django',
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
