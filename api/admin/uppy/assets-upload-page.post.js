import { EOL } from 'os'
import { cms_query } from '../../../loaders.js'

export const api = async function({ filenames }) {

	const query = `query {
		assets(
			where: {
				OR: [
					${filenames.map(name => `{ fileName: "${name}" }` + EOL)}
				]
			}
			orderBy: createdAt_DESC
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

	const res = await cms_query(query)

	res.assets = res.assets.map(asset => {
		asset.created = new Date(asset.created).getTime()
		return asset
	})
	return res

}
