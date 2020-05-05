const { cms_query, create_where } = require('../../../loaders.js')

module.exports = async function({ page, page_size, tags, status, column, sort }) {
	const posts_where = create_where({ status, tags })
	column = column === 'published' ? 'publishedDatetime' : column

	const draft_where = create_where({ status: ['DRAFT'] })
	const published_where = create_where({ status: ['PUBLISHED'] })
	const archived_where = create_where({ status: ['ARCHIVED'] })

	const query = `{
		posts(
			first: ${page_size}
			skip: ${(page - 1) * page_size}
			${posts_where}
			orderBy: ${column}_${sort.toUpperCase()}
		) {
			id
			status
			published: publishedDatetime
			headline
			subheadline
			byline
			slug
			assets { id url summary handle mime_type: mimeType filename: fileName }
			tags { name: tag }
			assets { id url summary handle fileName }
			tags { tag }
		}

		drafts: postsConnection(${draft_where}) { aggregate {count} }
		published: postsConnection(${published_where}) { aggregate {count} }
		archived: postsConnection(${archived_where}) { aggregate {count} }
	}`
	// console.log(query)
	const { posts, drafts, published, archived } = await cms_query(query)

	return {
		items: posts,
		items_count: drafts.aggregate.count + published.aggregate.count + archived.aggregate.count,
		drafts_count: drafts.aggregate.count,
		published_count: published.aggregate.count,
		archived_count: archived.aggregate.count,
	}

}
