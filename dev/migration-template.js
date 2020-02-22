import { log, log_error } from '../../migration-tools.js'
import { q, client } from '../../../db.js'

export const up = async function() {
	try {

		// DATA LOADING ---------------------------------------------------- >>>

		// const migrationData = require('../data/...')

		// MAIN ACTIONS ---------------------------------------------------- >>>

		// ----- >>> sub_actions

		// log()

	} catch (error) {
		log_error(error)
	}
}

export const down = async function() {
	try {

		// DATA UNLOADING -------------------------------------------------- >>>

		// const migrationData = require('../data/...')

		// MAIN ACTIONS ---------------------------------------------------- >>>

		// ----- >>> sub_actions

		// log()

	} catch (error) {
		log_error(error)
	}
}
