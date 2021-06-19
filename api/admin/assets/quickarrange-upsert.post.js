import { cms_mutate } from '../../../loaders.js'


export const api = async function({ id, title, connect_ids, disconnect_ids, order }) {

	connect_ids = connect_ids.map(id => `{ id: "${id}" }`).join(' ')
	disconnect_ids = disconnect_ids.map(id => `{ id: "${id}" }`).join(' ')

	const order_mutations = order.map((id, index) => {
		const num = index + 1
		let update = `update${num}: updateAsset(`
		update += `where: { id: "${id}" } data: { assetGroupOrder: ${num} }`
		update += ') { id assetGroupOrder fileName }'
		return update
	}).join('\n')

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

		${order_mutations}
	}`

	return await cms_mutate(mutation)

}
