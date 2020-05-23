const { cms_query } = require('../../../loaders.js')

module.exports = async function({ search_term, size }) {

	if (!search_term.trim()) {
		return { assets: [] }
	}

	size = typeof size === 'number' ? size : 4

	const query = `query SearchAssets($term: String) {
		assets(
			where: {
				AND: [
					{ _search: $term }
					{ mimeType_starts_with: "image" }
				]
			}
			first: ${size}
			orderBy: fileName_ASC
		) {
			id
			url
			handle
			filename: fileName
			summary
			source
			mime_type: mimeType
		}
	}`

	const variables = { term: search_term }

	return await cms_query(query, variables)

}
