import { EOL } from 'os'
import { merge_asset } from '../../../utils.js'
import { cms_mutate } from '../../../loaders.js'

export const api = async function({ bin_id, assets }) {

	const created_assets = assets.map(asset => `{
		order: ${asset.order}
		asset: { connect: { id: "${asset.id}" } }
	}`).join(EOL)

	const mutation = `mutation {
		updateAssetsBin(
			where: { id: "${bin_id}" }
			data: {
				storyAssets: {
					create: [${created_assets}]
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

	const res = await cms_mutate(mutation)
	res.assets = res.updateAssetsBin.assets.map(merge_asset)
	delete res.updateAssetsBin

	return res

}
