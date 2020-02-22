import { yellow, magenta, red } from 'ansi-colors'

const start = yellow('----- >>>')
const stop = yellow('----- ^^^')

export const log = (logs, grouping) => {
	logs = Array.isArray(logs) ? logs : [logs]
	grouping = grouping || 'migration log'
	console.log()
	console.log(`${start} ${magenta(grouping)}`)
	for (let log of logs) {
		console.dir(log, { depth: null, colors: true })
	}
	console.log(stop)
}

export const log_error = error => {
	console.log(red('Migration error:'))
	console.error(error)
}
