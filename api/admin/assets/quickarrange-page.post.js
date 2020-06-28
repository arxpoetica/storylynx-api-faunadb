const { cms_query } = require('../../../loaders.js')

module.exports = async function() {
	const query = `{

		ungrouped_assets: assets(
			where: {
				AND: [
					{ archivalAsset: true }
					{ relatedAssetGroups_every: { id: null} }
				]
			}
			orderBy: fileName_ASC
		) {
			id
			handle
			filename: fileName
			mime_type: mimeType
		}

		asset_groups: assetGroups(orderBy: title_ASC) {
			id
			title
			assets(orderBy: assetGroupOrder_ASC) {
				id
				order: assetGroupOrder
				handle
				filename: fileName
				mime_type: mimeType
			}
		}

	}`
	return await cms_query(query)
}
