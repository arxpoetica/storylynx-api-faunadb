const { cms_query, create_where } = require('../../../loaders.js')

module.exports = async function({ page, page_size, tags, status, column, sort }) {

	const articles_where = create_where({ status, tags })
	const draft_where = create_where({ status: ['DRAFT'] })
	const published_where = create_where({ status: ['PUBLISHED'] })
	const archived_where = create_where({ status: ['ARCHIVED'] })

	const query = `{
		articles(
			first: ${page_size}
			skip: ${(page - 1) * page_size}
			${articles_where}
			orderBy: ${column}_${sort.toUpperCase()}
		) {
			id
			status
			publishedDatetime
			title
			summary
			assets { id url summary handle fileName }
			tags { tag }
		}

		drafts: articlesConnection(${draft_where}) { aggregate {count} }
		published: articlesConnection(${published_where}) { aggregate {count} }
		archived: articlesConnection(${archived_where}) { aggregate {count} }
	}`
	// console.log(query)
	const { articles, drafts, published, archived } = await cms_query(query)

	return {
		items: articles,
		items_count: drafts.aggregate.count + published.aggregate.count + archived.aggregate.count,
		drafts_count: drafts.aggregate.count,
		published_count: published.aggregate.count,
		archived_count: archived.aggregate.count,
	}

}
