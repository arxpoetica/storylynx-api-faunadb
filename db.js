const { LYNX_FAUNA_DOMAIN, LYNX_FAUNA_SCHEME, LYNX_FAUNA_PORT, LYNX_FAUNA_ROOT_KEY, LYNX_FAUNADB_DB } = process.env

const domain = LYNX_FAUNA_DOMAIN || 'localhost'
const scheme = LYNX_FAUNA_SCHEME || 'http'
const port = LYNX_FAUNA_PORT || 8443
const secret = LYNX_FAUNA_ROOT_KEY || 'secret'
const db = LYNX_FAUNADB_DB || 'jmdb'

const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ domain, scheme, port, secret: `${secret}:${db}:admin` })
const admin = new faunadb.Client({ domain, scheme, port, secret })

module.exports = { q, client, admin }
