const { cms_mutate } = require('../../../loaders.js')


module.exports = async function({ id, title, connect_ids, disconnect_ids }) {

	connect_ids = connect_ids.map(id => `{ id: "${id}" }`).join(' ')
	disconnect_ids = disconnect_ids.map(id => `{ id: "${id}" }`).join(' ')

	const mutation = `mutation {
		asset_group: upsertAssetGroup(
			where: { id: "${id}" }
			create: {
				title: "${title}"
				assets: {
					connect: [${connect_ids}]
				}
			}
			update: {
				title: "${title}"
				assets: {
					connect: [${connect_ids}]
					disconnect: [${disconnect_ids}]
				}
			}
		) {
			id
			title
			assets { id }
		}
	}`

	return await cms_mutate(mutation)

}
