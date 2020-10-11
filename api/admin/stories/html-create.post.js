const { merge_asset } = require('../../../utils.js')
const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ bin_id, order, name }) {

	const mutation = `mutation update_html($name: String) {
		updateAssetsBin(
			where: { id: "${bin_id}" }
			data: {
				storyAssets: {
					create: [{
						order: ${order}
						name: $name
						htmlCode: "{}"
						html: $name
					}]
				}
			}
		) {
			id
			assets: storyAssets(orderBy: order_ASC) {
				id
				asset {
					id
					handle
					url
					filename: fileName
					mime_type: mimeType
				}
				order
				name
				source
				caption
				width: widthOverride
				height: heightOverride
				contain
				bg_pos: backgroundPosition
				volume
				play_once: playOnce
				template: htmlTemplate
				color: htmlHighlightColor
				code: htmlCode
				html
			}
		}
	}`

	const variables = { name }
	const res = await cms_mutate(mutation, variables)

	res.assets = res.updateAssetsBin.assets.map(merge_asset)
	delete res.updateAssetsBin

	return res

}
