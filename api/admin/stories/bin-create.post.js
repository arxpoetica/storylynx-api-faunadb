const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ clip_id, order }) {

	const mutation = `mutation {
		asset_bin: createAssetsBin(data: {
			order: ${order}
			parentClip: { connect: { id: "${clip_id}" } }
		}) { id }
	}`

	const res = await cms_mutate(mutation)
	return res

}
