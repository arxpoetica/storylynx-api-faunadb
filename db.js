const { FAUNA_DOMAIN, FAUNA_SCHEME, FAUNA_PORT, FAUNA_ROOT_KEY } = process.env

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
	domain: FAUNA_DOMAIN || 'localhost',
	scheme: FAUNA_SCHEME || 'http',
	port: FAUNA_PORT || 8443,
	secret: FAUNA_ROOT_KEY || 'secret',
})

module.exports = { q, client }
