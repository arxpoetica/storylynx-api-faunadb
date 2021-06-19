import bcrypt from 'bcryptjs'
import { cms_mutate } from '../../loaders.js'

export const api = async function({ username, password, role }) {

	// NOTE: only a basic checks here...
	// normally protect against injection attacks, etc...
	// TODO: check that username is a correctly formatted email?????????
	if (typeof username !== 'string' || username.length < 3) {
		return { error: 'Username must be at least 3 characters.' }
	} else if (typeof password !== 'string' || password.length < 8) {
		return { error: 'Password must be at least 8 characters.' }
	}

	// FIXME: salt this -- in a more secure auth example, we would salt with a
	// unique imprint and store on the user or somewhere safe
	const hash = await bcrypt.hash(password, 10)

	let data = ''
	data += `username: "${username}" `
	data += `hash: "${hash}" `
	data += `role: "${role}" `
	// data += firstName ? `firstName: "${firstName}"` : ''
	// data += lastName ? `lastName: "${lastName}"` : ''
	// data += avatar ? `avatar: "${avatar}"` : ''

	// NOTE: because of unique constraint on username fields, this
	// simulataneously checks if user exists, which I can then throw
	// an error against.
	const answer = await cms_mutate(`mutation {
		createAccount(
			data: { ${data} }
		) {
			username
			role
			first
			last
			avatar
		}
	}`)

	if (answer.error) {
		if (answer.message.indexOf('A unique constraint would be violated on Account') > -1) {
			return { error: `User ${username} already exists.` }
		} else {
			return { error: 'Something went wrong. Please contact the code wizards 🧙‍♂️.' }
		}
	}

	const user = answer.createAccount
	return { first: user.first, last: user.last, avatar: user.avatar }

}
