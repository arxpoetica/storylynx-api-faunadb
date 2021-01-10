const { EOL } = require('os')
const { cms_query } = require('../../../loaders.js')

module.exports = async function({ filenames }) {

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
