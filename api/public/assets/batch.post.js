const { cms_query } = require('../../../loaders.js')

module.exports = async function({ batch, batch_size, tags, type, decade, subject, search_term }) {

	let where = '{ AND: ['
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
			`{ summary_contains: "${search_term}" }`,
			']}',
		].join(' ')
	}
	where += '] }'

	const { items, connection } = await cms_query(`{
		items: assetGroups(
			first: ${batch_size}
			skip: ${(batch - 1) * batch_size}
			where: ${where}
			orderBy: title_ASC
		) {
			id
			title
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

		connection: assetGroupsConnection(
			first: ${batch_size}
			skip: ${(batch - 1) * batch_size}
			where: ${where}
			orderBy: title_ASC
		) {
			pageInfo {
				hasNextPage
			}
		}
	}`)

	return {
		items,
		next_batch: connection.pageInfo.hasNextPage ? items[items.length - 1].id : false,
	}

}
