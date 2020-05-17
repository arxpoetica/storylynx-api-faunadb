const { cms_query } = require('../../../loaders.js')

module.exports = async function() {
	const query = `{
		ungrouped_assets: assets(where: {
			AND: [
				{ archivalAsset: true }
				{ relatedAssetGroups_every: { id: null} }
			]
		}) {
			id
			handle
			filename: fileName
			mime_type: mimeType
		}
		grouped_assets: assets(where: {
			relatedAssetGroups_some: { id_not: null}
		}) {
			id
			handle
			filename: fileName
			mime_type: mimeType
		}
	}`
	return await cms_query(query)
}
