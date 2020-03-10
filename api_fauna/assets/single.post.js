const { graphql } = require('../../loaders.js')

module.exports = async function({ slug }) {

	try {
		const query = `query {
			findAssetGroupBySlug(slug: "${slug}") {
				id: _id
				published
				title
				summary
				html
				assets { data {
					id: _id url summary handle filename width height mime_type
				} }
				content_type
				year
				subject
				tags { data { name } }
				source
			}
		}`
		const res = await graphql(query)
		if (res.error) { throw new Error(res.message) }

		const asset_group = res.findAssetGroupBySlug
		asset_group.assets = asset_group.assets.data
		asset_group.tags = asset_group.tags.data.map(tag => tag.name)

		return { asset_group }

	} catch (error) {
		console.log(error)
	}

}
