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

	const {
		asset_groups,
		meta,
		content_types,
		min_year,
		max_year,
		subjects,
	} = await cms_query(`{
		asset_groups: assetGroups(
			first: ${page_size},
			skip: ${(page - 1) * page_size},
			where: ${where},
			orderBy: title_ASC
		) {
			id
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

		meta: assetGroupsConnection(where: ${where}) { aggregate { count } }
		content_types: __type(name: "ContentTypes") { enumValues { name } }
		min_year: assetGroups(first: 1, orderBy: year_ASC, where: { year_not: null }) { year }
		max_year: assetGroups(first: 1, orderBy: year_DESC, where: { year_not: null }) { year }
		subjects: __type(name: "Subjects") { enumValues { name } }
	}`)

	// TODO: when migrating, let's just use a decades Enumeration
	// OR BETTER YET, rework the whole freaking taxonomy, because, well...it's not very well built
	const first = Math.floor(min_year[0].year / 10) * 10
	const last = Math.floor(max_year[0].year / 10) * 10
	const decades = [...Array((last - first) / 10).keys()].map(index => first + (index * 10) + 's')

	return {
		items: asset_groups,
		items_count: meta.aggregate.count,
		content_types: content_types.enumValues.map(val => val.name),
		decades,
		subjects: subjects.enumValues.map(val => val.name),
	}

}
