const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const { post, post_tags } = await cms_query(`{
		post(where: { id: "${id}" }) {
			id
			status
			publishedDatetime
			title
			slug
			html
			summary
			assets { id url summary handle fileName }
			tags { id tag }
		}
		post_tags: articleTags { id tag }
	}`)
	return { post, post_tags }

}
