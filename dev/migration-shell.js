// excellent article on all this: https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a

import fs from 'fs'
import glob from 'tiny-glob'
import { spawn } from 'child_process'
const { NODE_ENV, npm_lifecycle_event: script, npm_config_argv } = process.env

async function parse_and_run() {
	let command
	const compiler = '--compiler="js:./dev/babel-compiler.js"'
	const dirs = '--migrations-dir=dev/migrations/files'
	const filename = `dev/migrations/.migrate-${NODE_ENV || 'development'}`
	const shared = `${dirs} -f ${filename} ${compiler}`

	if (script === 'm:up') {
		command = `migrate up ${shared} ${await get_migration('up', filename)}`
	} else if (script === 'm:down') {
		command = `migrate down ${shared} ${await get_migration('down', filename)}`
	} else if (script === 'm:up:all') {
		command = `migrate up ${shared}`
	} else if (script === 'm:down:all') {
		command = `migrate down ${shared}`
	} else if (script === 'm:create') {
		const args = JSON.parse(npm_config_argv).original
		command = `migrate create ${args[1]} ${shared} --template-file=dev/migration-template.js`
	} else if (script === 'm:list') {
		command = `migrate list ${shared}`
	}

	// RUN IT!
	if (script.match(/^m:dry:/)) {
		const command = script.split('m:dry:')[1]
		const migration = await get_migration('up', filename)
		console.log(`--- DRY RUN '${command}' for migration ${migration} --->`)
		require(`./migrations/files/${migration}`)[command]()
	} else {
		// console.log(command)
		spawn(command, { stdio: 'inherit', shell: true })
	}
}
parse_and_run()

// migration helper ----- >>>>>

async function get_migration(direction, filename) {
	let migrate_file = {}
	if (fs.existsSync(filename)) {
		migrate_file = JSON.parse(fs.readFileSync(filename, 'utf8'))
	}
	const migrations = (await glob('dev/migrations/files/**/*.js')).map(path => path.split('/files/')[1])

	const { lastRun } = migrate_file

	// console.log(migrations)
	// console.log(lastRun)

	if (direction === 'up') {
		const index = migrations.indexOf(lastRun)
		const next = migrations[index + 1]
		return next ? next : migrations[index]
	} else if (direction === 'down') {
		return lastRun || migrations[0]
	}
}
