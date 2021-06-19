import { cms_query } from '../../../loaders.js'
import { create_where } from '../../../utils.js'

export const api = async function({ page, page_size, tags, status, column, sort }) {
	const resources_where = create_where({ status, tags })
	column = column === 'published' ? 'publishedDatetime' : column

	const draft_where = create_where({ status: ['DRAFT'] })
	const published_where = create_where({ status: ['PUBLISHED'] })
	const archived_where = create_where({ status: ['ARCHIVED'] })

	const query = `{
		resources(
			first: ${page_size}
			skip: ${(page - 1) * page_size}
			${resources_where}
			orderBy: ${column}_${sort.toUpperCase()}
		) {
			id
			status
			published: publishedDatetime
			title
			detail
			assets { id url caption handle filename: fileName }
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
		items_count: drafts.aggregate.count + published.aggregate.count + archived.aggregate.count,
		drafts_count: drafts.aggregate.count,
		published_count: published.aggregate.count,
		archived_count: archived.aggregate.count,
	}

}
