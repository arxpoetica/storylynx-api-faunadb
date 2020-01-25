const { yellow, red } = require('ansi-colors')
const faunadb = require('faunadb')
const q = faunadb.query
var client = new faunadb.Client({
	secret: process.env.LYNX_FAUNADB_API_KEY,
	keepAlive: false,
})

async function delete_all() {

	const { data: indexes } = await client.query(q.Paginate(q.Indexes()))
	if (indexes.length) {
		console.log(red('\n========== >>> DELETING ALL INDEXES\n'))
		for (let index of indexes) {
			try {
				const ret = await client.query(q.Delete(index))
				console.log('Deleted: ', index)
			} catch (error) {
				console.log(red('Unable to delete index:'), index)
			}
		}
	} else {
		console.log(yellow('\n========== >>> THERE ARE NO INDEXES TO DELETE\n'))
	}

	const { data: collections } = await client.query(q.Paginate(q.Collections()))
	if (collections.length) {
		console.log(red('\n========== >>> DELETING ALL COLLECTIONS\n'))
		for (let collection of collections) {
			try {
				const ret = await client.query(q.Delete(collection))
				console.log('Deleted: ', collection)
			} catch (error) {
				console.log(red('Unable to delete collection:'), collection)
			}
		}
	} else {
		console.log(yellow('\n========== >>> THERE ARE NO COLLECTIONS TO DELETE\n'))
	}

}
delete_all()
