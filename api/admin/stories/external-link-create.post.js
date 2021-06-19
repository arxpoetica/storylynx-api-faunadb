import { merge_asset } from '../../../utils.js'
import { cms_mutate } from '../../../loaders.js'

export const api = async function({ bin_id, order, name, link, caption, source }) {

	const mutation = `mutation create_link($link: String, $name: String, $caption: String, $source: String) {
		updateAssetsBin(
			where: { id: "${bin_id}" }
			data: {
				storyAssets: {
					create: [{
						order: ${order}
						link: $link
						name: $name
						caption: $caption
						source: $source
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
				link
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

	const variables = { link, name, caption: caption || '', source: source || '' }
	const res = await cms_mutate(mutation, variables)

	res.assets = res.updateAssetsBin.assets.map(merge_asset)
	delete res.updateAssetsBin

	return res

}
