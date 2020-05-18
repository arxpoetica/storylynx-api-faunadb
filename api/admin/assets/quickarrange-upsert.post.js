const { cms_mutate } = require('../../../loaders.js')


module.exports = async function({ id, title, connect_ids, disconnect_ids }) {

	let assets = ''
	if (connect_ids.length || disconnect_ids.length) {
		assets += 'assets: { '
		if (connect_ids.length) {
			assets += 'connect: ['
			assets += connect_ids.map(id => `{ id: "${id}" }`).join(' ')
			assets += ']'
		}
		if (disconnect_ids.length) {
			assets += 'disconnect: ['
			assets += disconnect_ids.map(id => `{ id: "${id}" }`).join(' ')
			assets += ']'
		}
		assets += ' }'
	}

	const mutation = `mutation {
		upsert: upsertAssetGroup(
			where: { id: "${id}" }
			create: {
				title: "${title}"
				${assets}
			}
			update: {
				title: "${title}"
				${assets}
			}
		) {
			id
			title
			assets { id }
		}
	}`

	return await cms_mutate(mutation)

}
