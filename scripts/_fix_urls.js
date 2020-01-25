const { graphql } = require('../loaders.js')
const graphcms_assets = require('./assets.js')

async function operate() {

	query = `query { Assets(_size: 1000) { data { _id old_id } } }`
	const { Assets } = await graphql(query)
	const { data: assets } = Assets

	for (let asset of assets) {
		const old_asset = graphcms_assets.find(old_asset => old_asset.id === asset.old_id)

		query = `mutation {
			partialUpdateAsset(id: "${asset._id}", data: {
				url: "${old_asset.url}"
			}) {
				url
				handle
				filename
			}
		}`
		console.log(query)
		// const res = await graphql(query)
		// console.log(res)
	}

}
operate()
