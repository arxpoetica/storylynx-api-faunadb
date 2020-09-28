const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ asset_ids }) {

	const joined_asset_ids = asset_ids.map(id => `"${id}"`).join(', ')

	const mutation = `mutation {
		deleted_assets: deleteManyStoryAssetsConnection(where: { id_in: [${joined_asset_ids}] }) {
			aggregate {
				count
			}
		}
	}`

	return await cms_mutate(mutation)

}
