module.exports = {

	pascal_to_words: str => str.split(/(?=[A-Z0-9])/).join(' '),

	merge_asset: asset => {
		if (asset.asset) {
			asset.asset_id = asset.asset.id
			delete asset.asset.id
			asset = Object.assign({}, asset, asset.asset)
			delete asset.asset
		} else {
			asset.mime_type = 'text/html'
			asset.code = asset.code ? JSON.parse(asset.code) : {}
		}

		// clamping volume putting in range between 0 and 1
		if (asset.volume) {
			asset.volume = Math.max(Math.min(asset.volume / 10, 1), 0)
		}
		return asset
	},

	create_where: function({ status = [], tags = [] }) {
		let where = ''
		if (status.length || tags.length) {
			where = 'where: { AND: ['
			if (status.length) {
				where += '{ OR: ['
				where += status.map(stat => `{ status: ${stat} }`).join(' ')
				where += '] }'
			}
			where += tags.length ? tags.map(tag => `{ tags_some: { tag: "${tag}" } }`).join(' ') : ''
			where += '] }'
		}
		// console.log(where)
		return where
	},

}
