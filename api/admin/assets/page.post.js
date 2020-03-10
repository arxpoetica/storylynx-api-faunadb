const { cms_mutate, create_where } = require('../../../loaders.js')

module.exports = async function({ page, pageSize, tags, status, column, sort }) {

	const resources_where = create_where({ status, tags })
	const draft_where = create_where({ status: ['DRAFT'] })
	const published_where = create_where({ status: ['PUBLISHED'] })
	const archived_where = create_where({ status: ['ARCHIVED'] })

	const query = `{
		resources(
			first: ${pageSize}
			skip: ${(page - 1) * pageSize}
			${resources_where}
			orderBy: ${column}_${sort.toUpperCase()}
		) {
			id
			status
			publishedDatetime
			title
			summary
			html
			assets { id url summary handle fileName }
			externalAssets
			tags { tag }
		}

		drafts: resourcesConnection(${draft_where}) { aggregate { count } }
		published: resourcesConnection(${published_where}) { aggregate { count } }
		archived: resourcesConnection(${archived_where}) { aggregate { count } }
	}`
	// console.log(query)
	const { resources, drafts, published, archived } = await cms_query(query)

	return {
		items: resources,
		itemsCount: drafts.aggregate.count + published.aggregate.count + archived.aggregate.count,
		draftsCount: drafts.aggregate.count,
		publishedCount: published.aggregate.count,
		archivedCount: archived.aggregate.count,
	}

}
