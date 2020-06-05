const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const { asset, tags } = await cms_query(`{
		asset: resource(where: { id: "${id}" }) {
			id
			status
			published: publishedDatetime
			title
			slug
			detail
			assets { id url summary handle fileName }
			externalAssets
			tags { id tag }
		}
		tags: resourceTags { id tag }
	}`)

	return { asset, tags }

}
