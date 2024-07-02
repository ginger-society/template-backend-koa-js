const fs = require('fs')
const path = require('path')

// Path to the schema.json file
const schemaPath = path.resolve(__dirname, '..', 'app', 'models', 'schema.json')

// Read the schema.json file
fs.readFile(schemaPath, 'utf8', (err, data) => {
	if (err) {
		console.error(`Error reading the schema.json file: ${err}`)
		process.exit(1)
	}

	// Replace all instances of #/definitions/ with #/components/schemas/
	const updatedData = data.replace(/#\/definitions\//g, '#/components/schemas/')

	// Write the updated data back to the schema.json file
	fs.writeFile(schemaPath, updatedData, 'utf8', (err) => {
		if (err) {
			console.error(`Error writing to the schema.json file: ${err}`)
			process.exit(1)
		}

		console.log(
			'Successfully replaced all instances of #/definitions/ with #/components/schemas/'
		)
	})
})
