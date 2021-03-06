const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const { asset_group } = await cms_query(`{
		asset_group: assetGroup(where: { id: "${id}" }) {
			id
			title
			assets(orderBy: assetGroupOrder_ASC) {
				id
				url
				caption
				handle
				filename: fileName
				width
				height
				mime_type: mimeType
			}
			asset_links: assetLinks {
				summary
				link
				cover { url handle }
			}
			tags { name: tag }
			content_type: contentType
			year
			subject
			source
			detail
		}
	}`)

	asset_group.tags = asset_group.tags.map(tag => tag.name)

	return { asset_group }

}
