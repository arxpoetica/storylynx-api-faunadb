const { red } = require('ansi-colors')
const fetch = require('node-fetch')

// TEMPORARYYYYYY!!!!!
process.env.LYNX_FAUNADB_API_KEY = 'fnADir2x0wACCvARZFnAqPxFO5FJTmOPnvIlcuuU'

module.exports = {

	graphql: async function(query, variables) {
		try {
			const res = await fetch('https://graphql.fauna.com/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Schema-Preview': 'partial-update-mutation',
					Authorization: 'Bearer ' + process.env.LYNX_FAUNADB_API_KEY,
				},
				body: JSON.stringify({ query, variables }),
			})
			const json = await res.json()
			if (json.errors) { throw Error(json.errors.map(err => `  ${err.message}`).join('\n')) }
			return json.data
		} catch (error) {
			console.log(red('FaunaDB GraphQL Errors:\n'), error.message)
			return { error: 1, message: error.message }
		}
	},

}
