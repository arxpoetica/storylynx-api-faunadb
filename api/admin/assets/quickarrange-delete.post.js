const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const mutation = `mutation {
		asset_group: deleteAssetGroup(where: { id: "${id}" }) { id }
	}`
	return await cms_mutate(mutation)

}
