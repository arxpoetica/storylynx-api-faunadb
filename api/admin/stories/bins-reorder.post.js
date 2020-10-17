const { EOL } = require('os')
const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ bin_changes }) {
	const mutation = `mutation {
		${bin_changes.map(({ id, order }) => `
			bin_${id}: updateAssetsBin(where: { id: "${id}" } data: { order: ${order} }) { id order }
		`).join(EOL)}
	}`
	console.log(mutation)

	return await cms_mutate(mutation)

}
