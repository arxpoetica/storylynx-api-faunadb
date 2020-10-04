const { cms_mutate } = require('../../../loaders.js')

/* eslint-disable max-len */
module.exports = async function({ clip_id, style_id, asset_bin_ids, asset_ids }) {

	const delete_style = style_id ? `deleted_style: deleteClipStyle(where: { id: "${style_id}" }) { id }` : ''

	let asset_bins_delete = ''
	if (asset_bin_ids.length) {
		const joined_asset_bin_ids = asset_bin_ids.map(id => `"${id}"`).join(', ')
		asset_bins_delete = `deleted_assets_bins: deleteManyAssetsBinsConnection(where: { id_in: [${joined_asset_bin_ids}] }) { aggregate { count } }`
	}
	let assets_delete = ''
	if (asset_ids.length) {
		const joined_asset_ids = asset_ids.map(id => `"${id}"`).join(', ')
		assets_delete = `deleted_assets: deleteManyStoryAssetsConnection(where: { id_in: [${joined_asset_ids}] }) { aggregate { count } }`
	}

	const mutation = `
		mutation {
			deleted_clip: deleteClip(where: { id: "${clip_id}" }) { id }
			${delete_style}
			${asset_bins_delete}
			${assets_delete}
		}
	`

	const res = await cms_mutate(mutation)
	return res

}
