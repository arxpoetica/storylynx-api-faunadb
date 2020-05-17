const { cms_query } = require('../../../loaders.js')

module.exports = async function() {
	const query = `{
		assets {
			id
			url
			summary
			handle
			filename: fileName
		}
	}`
	const { assets } = await cms_query(query)
	return { items: assets }
}
// const query = `{
// 	assets(where: { relatedAssetGroups_some: { id_not: null } }) {
// 		id

// 		url
// 		summary
// 		handle
// 		filename: fileName

// 		relatedAssetGroups {
// 			id
// 			title
// 			subject
// 			contentType
// 			source
// 			summary
// 			year
// 			tags { id tag }
// 			# assets { id }
// 		}
// 	}
// }`
