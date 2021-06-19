import { cms_mutate } from '../../../loaders.js'

/* eslint-disable max-len */
export const api = async function({ bin_id, asset_ids }) {


	let assets_delete = ''
	if (asset_ids.length) {
		const joined_asset_ids = asset_ids.map(id => `"${id}"`).join(', ')
		assets_delete = `deleted_assets: deleteManyStoryAssetsConnection(where: { id_in: [${joined_asset_ids}] }) { aggregate { count } }`
	}

	const mutation = `
		mutation {
			deleted_bin: deleteAssetsBin(where: { id: "${bin_id}" }) { id }
			${assets_delete}
		}
	`

	const res = await cms_mutate(mutation)
	return res

}
