const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ clip_id, style_id, asset_bin_ids, html_block_ids }) {

	const delete_style = style_id ? `deleted_style: deleteClipStyle(where: { id: "${style_id}" }) { id }` : ''

	let asset_bins_delete = ''
	if (asset_bin_ids.length) {
		const joined_asset_bin_ids = asset_bin_ids.map(id => `"${id}"`).join(', ')
		asset_bins_delete =
			`deleted_assets_bins_count: deleteManyAssetsBins(where: { id_in: [${joined_asset_bin_ids}] }) { count }`
	}
	let html_blocks_delete
	if (html_block_ids.length) {
		const joined_html_block_ids = html_block_ids.map(id => `"${id}"`).join(', ')
		html_blocks_delete =
			`deleted_html_blocks_count: deleteManyHtmlBlocks(where: { id_in: [${joined_html_block_ids}] }) { count }`
	}

	const mutation = `
		mutation {
			deleted_clip: deleteClip(where: { id: "${clip_id}" }) { id }
			${delete_style}
			${asset_bins_delete}
			${html_blocks_delete}
		}
	`

	const res = await cms_mutate(mutation)
	return res

}
