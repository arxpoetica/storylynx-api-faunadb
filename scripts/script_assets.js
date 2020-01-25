const { green } = require('ansi-colors')
const { batch } = require('./_tools.js')
const assets = require('./original_assets.js')

module.exports = async(live_run) => {

	console.log(green('\n========== >>> CREATING ALL ASSETS\n'))

	await batch({
		collection: 'Asset',
		items: assets,
		parser: asset => {
			const summary = asset.summary ? `summary: "${asset.summary}"` : ''
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
					poster { filename }
					posts { data { old_id } }
				}
			}`
		},
		live_run,
	})

}
