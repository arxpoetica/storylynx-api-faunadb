const { cms_query } = require('../../../loaders.js')

module.exports = async function() {

	// FIXME: figure out what constitutes "related"
	// FIXME: figure out what constitutes "related"
	// FIXME: figure out what constitutes "related"

	const res = await cms_query(`{
		related: assetGroups(
			first: 4
			orderBy: title_ASC
		) {
			id
			title
			assets {
				# FIXME: assets on assets is broken in the new API, hence the indirection, ugh
				assetCover { asset { url caption handle mime_type: mimeType filename: fileName } }
				id url caption handle mime_type: mimeType filename: fileName
			}
			asset_links: assetLinks {
				summary
				link
				cover { url handle }
			}
			content_type: contentType
			year
			subject
		}
	}`)

	// FIXME: this can be removed when the asset on assets fix is implemented above
	res.related = res.related.map(rel => {
		rel.assets = rel.assets.map(asset => {
			asset.cover = asset.assetCover && asset.assetCover.asset ? asset.assetCover.asset : null
			delete asset.assetCover
			return asset
		})
		return rel
	})

	return res

}
