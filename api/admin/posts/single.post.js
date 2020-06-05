const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const { post, tags } = await cms_query(`{
		post(where: { id: "${id}" }) {
			id
			status
			headline
			subheadline
			slug
			published: publishedDatetime
			byline
			linkback
			detail { html }
			assets { id url caption handle filename: fileName }
			tags { id name: tag }
		}
		tags { name: tag }
	}`)
	return { post, tags }

}
