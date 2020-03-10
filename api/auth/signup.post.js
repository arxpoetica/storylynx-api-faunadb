const { cms_mutate } = require('../../loaders.js')

module.exports = async function({ data }) {

	// NOTE: because of unique constraint on username fields, this
	// simulataneously checks if user exists, which I can then throw
	// an error against.
	const answer = await cms_mutate(`mutation {
		createAccount(
			data: { ${data} }
		) {
			username
			role
			firstName
			lastName
			avatar
		}
	}`)

	return { answer }

}
