const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { green, yellow, red } = require('ansi-colors')

let dots = '..'
let timer
function show_timelapsed() {
	timer = setTimeout(() => {
		dots += '.'
		process.stdout.write(`\rInitializing ${dots} stand by, this may take a minute or so ...`)
		show_timelapsed()
	}, 1000)
}

module.exports = async() => {
	const start = Date.now()
	show_timelapsed()
	try {
		const url = `https://graphql.fauna.com/import${process.env.LYNX_FAUNADB_INIT_OVERRIDE ? '?mode=override' : ''}`
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
				'Authorization': `Bearer ${process.env.LYNX_FAUNADB_API_KEY}`,
			},
			credentials: 'same-origin',
			body: fs.createReadStream(path.join(process.cwd(), 'node_modules/storylynx-api-faunadb/schema.gql')),
		})

		console.log(Object.keys(res))
		console.log(Object.keys(res.__proto__))
		console.log(res.status)
		console.log(res.statusText)

		if (res.status > 299) {
			throw new Error(`${res.status} ${res.statusText} - ${await res.text()}`)
		}

		const end = Math.round((Date.now() - start) / 100) / 10
		clearTimeout(timer)
		console.log('\n\n')
		console.log(green('------------------------------>>>'))
		console.log(`Initialized in [${end}] seconds`)
		console.log(green('------------------------------>>>'))
		console.log(res)
	} catch (error) {
		const end = Math.round((Date.now() - start) / 100) / 10
		clearTimeout(timer)
		console.log('\n\n')
		console.log(red('------------------------------>>>'))
		console.log(yellow('Something went wrong. Please try initializing again in a few minutes.'))
		console.log(error)
		console.log(`Operation took [${end}] seconds`)
		console.log(red('------------------------------>>>'))
	}
}
