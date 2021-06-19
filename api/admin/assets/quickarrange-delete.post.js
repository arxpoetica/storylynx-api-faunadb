import { cms_mutate } from '../../../loaders.js'

export const api = async function({ id }) {

	const mutation = `mutation {
		asset_group: deleteAssetGroup(where: { id: "${id}" }) { id }
	}`
	return await cms_mutate(mutation)

}
