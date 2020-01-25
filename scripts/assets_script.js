const { batch } = require('./_tools.js')
const assets = require('./assets.js')

batch({
	collection: 'Asset',
	items: assets,
	parser: asset => {
		const summary = asset.summary ? `summary: "${asset.summary}"` : ''
		const source = asset.source ? `source: "${asset.source}"` : ''
		return `mutation {
			createAsset(data: {
				old_id: "${asset.id}"
				url: "${asset.url}"
				handle: "${asset.handle}"
				filename: "${asset.fileName}"
				width: ${asset.width}
				height: ${asset.height}
				size: ${asset.size}
				mime_type: "${asset.mimeType}"
				${summary}
				${source}
			}) {
				_id
				_ts
				old_id
				url
				handle
				filename
				width
				height
				size
				mime_type
				summary
				source
				content_type
				subject
				year
				poster { filename }
				tags { data { name } }
				posts { data { old_id } }
			}
		}`
	},
	// live_run: true,
})
