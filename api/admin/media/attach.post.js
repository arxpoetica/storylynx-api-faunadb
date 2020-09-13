const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ assets }) {

	const items = []

	for (let asset of assets) {
		const { handle, fileName, size, mimeType } = asset
		const res = await cms_mutate(`mutation uploadAsset {
			createAsset(data: {
				handle: "${handle}"
				fileName: "${fileName}"
				size: ${size}
				mimeType: "${mimeType}"
			}) {
				id
				url
				handle
				fileName
			}
		}`)
		// WHAT TO DO HERE INSTEAD???
		if (res.error) {
			throw Error(res.message)
		}
		items.push(res.createAsset)
	}

	return { items, items_count: items.length }

}
