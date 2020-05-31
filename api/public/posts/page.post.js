const { cms_query } = require('../../../loaders.js')

module.exports = async function({ page, page_size, tags }) {

	let where
	if (tags && tags.length) {
		where = '{ AND: [{ status: PUBLISHED }, '
		where += tags.map(tag => `{ tags_some: { tag: "${tag}" } }`).join(', ')
		where += '] }'
	} else {
		where = '{ status: PUBLISHED }'
	}

	const { posts, meta } = await cms_query(`{
		posts: posts(
			first: ${page_size},
			skip: ${(page - 1) * page_size},
			where: ${where},
			orderBy: publishedDatetime_DESC
		) {
			id
			published: publishedDatetime
			headline
			subheadline
			slug
			assets { id url summary handle mime_type: mimeType filename: fileName }
			tags { name: tag }
		}

		meta: postsConnection(where: ${where}) { aggregate { count } }
	}`)

	const items = posts.map(post => {
		post.tags = post.tags.map(tag => tag.name)
		return post
	})

	return {
		items,
		items_count: meta.aggregate.count,
	}

}
