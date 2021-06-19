import { cms_query } from '../../../loaders.js'

export const api = async function({ ids, search, page, page_size, column, sort }) {

	ids = (ids || []).map(id => `"${id}"`).join(',')
	search = search || ''
	page = page || 1
	page_size = page_size || 50
	column = column === 'created' ? 'createdAt' : column
	sort = sort || 'ASC'

	const query = `query assets_search($search: String) {
		assets(
			first: ${page_size}
			skip: ${(page - 1) * page_size}
			where: {
				AND: [
					${ids ? `{ id_not_in: [${ids}] }` : ''}
					{ fileName_contains: $search }
				]
			}
			orderBy: ${column}_${sort.toUpperCase()}
		) {
			id
			created: createdAt
			url
			caption
			filename: fileName
			handle
			height
			width
			mime_type: mimeType
		}
	}`

	const variables = { search }
	const res = await cms_query(query, variables)

	res.assets = res.assets.map(asset => {
		asset.created = new Date(asset.created).getTime()
		return asset
	})
	return res

}
