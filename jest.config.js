/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverageFrom: [
		'<rootDir>/app/**/*.{ts,js}',
		'!<rootDir>/app/models/**/*.{ts,js}',
		'!<rootDir>/app/services/**/*.{ts,js}'
	],
	modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
	testMatch: ['<rootDir>/__test__/**/?(*.)+(spec|test).[jt]s'],
	moduleNameMapper: {
		// Handle module aliases (this will be automatically configured for you soon)
		'^@/(.*)$': '<rootDir>/app/$1'
	},
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		}
	}
}
