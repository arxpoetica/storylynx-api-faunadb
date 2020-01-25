// const { red } = require('ansi-colors')
const { graphql } = require('../../loaders.js')

module.exports = async function({ page, page_size, tags, type, decade, subject, search_term }) {

	try {
		const query = `query {
			AssetGroups(_size: 12) {
				data {
					id: _id
					published
					title
					slug
					assets { data {
						id: _id url summary handle mime_type filename
						poster { url summary handle mime_type filename }
						content_type year subject
					} }
				}
			}
		}`
		const res = await graphql(query)
		if (res.error) { throw new Error(res.message) }

		const items = res.AssetGroups.data.map(group => {
			group.assets = group.assets.data.map(asset => asset)
			return group
		})

		return {
			items,
			items_count: 0,
			content_types: [],
			subjects: [],
		}
	} catch (error) {
		console.log(error)
	}


	// const { resources, resourcesConnection, content_types, subjects } = await cms_query(`{
	// 	resources(
	// 		first: ${page_size},
	// 		skip: ${(page - 1) * page_size},
	// 		where: ${where},
	// 		orderBy: publishedDatetime_DESC
	// 	) {
	// 		id
	// 		publishedDatetime
	// 		title
	// 		slug
	// 		assets {
	// 			cover { url summary handle mimeType fileName }
	// 			id url summary handle mimeType fileName
	// 		}
	// 		assetLinks {
	// 			summary
	// 			link
	// 			cover { url handle }
	// 		}
	// 		contentType
	// 		year
	// 		subject
	// 	}



	// let where = '{ AND: ['
	// where += '{ status: PUBLISHED }'
	// if (tags && tags.length) {
	// 	where += tags.map(tag => `{ tags_some: { tag: "${tag}" } }`).join(' ')
	// }
	// if (type) {
	// 	where += ` { contentType: ${type} }`
	// }
	// if (decade) {
	// 	where += ` { year_gte: ${parseInt(decade)} }`
	// 	where += ` { year_lt: ${parseInt(decade) + 10} }`
	// }
	// if (subject) {
	// 	where += ` { subject: ${subject} }`
	// }
	// if (search_term) {
	// 	where += [
	// 		'{ OR: [',
	// 		`{ title_contains: "${search_term}" }`,
	// 		`{ content_contains: "${search_term}" }`,
	// 		']}',
	// 	].join(' ')
	// }
	// where += '] }'

	// const { resources, resourcesConnection, content_types, subjects } = await cms_query(`{
	// 	resources(
	// 		first: ${page_size},
	// 		skip: ${(page - 1) * page_size},
	// 		where: ${where},
	// 		orderBy: publishedDatetime_DESC
	// 	) {
	// 		id
	// 		publishedDatetime
	// 		title
	// 		slug
	// 		assets {
	// 			cover { url summary handle mimeType fileName }
	// 			id url summary handle mimeType fileName
	// 		}
	// 		assetLinks {
	// 			summary
	// 			link
	// 			cover { url handle }
	// 		}
	// 		contentType
	// 		year
	// 		subject
	// 	}

	// 	resourcesConnection(where: ${where}) { aggregate { count } }
	// 	content_types: __type(name: "ContentTypes") { enumValues { name } }
	// 	subjects: __type(name: "Subjects") { enumValues { name } }
	// }`)

	// return {
	// 	items: resources,
	// 	items_count: resourcesConnection.aggregate.count,
	// 	content_types: content_types.enumValues.map(val => val.name),
	// 	subjects: subjects.enumValues.map(val => val.name),
	// }

}
