const { cms_query } = require('../../loaders.js')

module.exports = async function({ page, page_size, tags, type, decade, subject, search_term }) {

	let where = '{ AND: ['
	where += '{ status: PUBLISHED }'
	if (tags && tags.length) {
		where += tags.map(tag => `{ tags_some: { tag: "${tag}" } }`).join(' ')
	}
	if (type) {
		where += ` { contentType: ${type} }`
	}
	if (decade) {
		where += ` { year_gte: ${parseInt(decade)} }`
		where += ` { year_lt: ${parseInt(decade) + 10} }`
	}
	if (subject) {
		where += ` { subject: ${subject} }`
	}
	if (search_term) {
		where += [
			'{ OR: [',
			`{ title_contains: "${search_term}" }`,
			`{ content_contains: "${search_term}" }`,
			']}',
		].join(' ')
	}
	where += '] }'

	const { asset_groups, meta, content_types, subjects } = await cms_query(`{
		asset_groups: resources(
			first: ${page_size},
			skip: ${(page - 1) * page_size},
			where: ${where},
			orderBy: publishedDatetime_DESC
		) {
			id
			published: publishedDatetime
			title
			slug
			assets {
				cover { url summary handle mime_type: mimeType filename: fileName }
				id url summary handle mime_type: mimeType filename: fileName
			}
			asset_links: assetLinks {
				summary
				link
				cover { url handle }
			}
			content_type: contentType
			year
			subject
		}

		meta: resourcesConnection(where: ${where}) { aggregate { count } }
		content_types: __type(name: "ContentTypes") { enumValues { name } }
		subjects: __type(name: "Subjects") { enumValues { name } }
	}`)

	return {
		items: asset_groups,
		items_count: meta.aggregate.count,
		content_types: content_types.enumValues.map(val => val.name),
		subjects: subjects.enumValues.map(val => val.name),
	}

}
