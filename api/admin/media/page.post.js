const { cms_query } = require('../../../loaders.js')

module.exports = async function({ page, page_size, tags }) {

	let where = 'where:'
	if (tags && tags.length) {
		where = '{ AND: [ '
		where += tags.map(tag => `{ tags_some: { tag: "${tag}" } }`).join(', ')
		where += '] }'
	} else {
		where += '{}'
	}

	const { assets, assetsConnection } = await cms_query(`{
		items: assets(
			first: ${page_size}
			skip: ${(page - 1) * page_size}
			${where}
			orderBy: fileName_ASC
		) {
			id
			url
			handle
			summary
			fileName
		}

		assetsConnection(${where}) { aggregate { count } }
	}`)

	return { items, items_count: assetsConnection.aggregate.count }

}
