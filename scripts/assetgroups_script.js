const { batch } = require('./_tools.js')
const assetgroups = require('./assetgroups.js')

async function operate() {

	const { Assets } = await batch({
		collection: 'Assets',
		items: [1],
		parser: () => `query { Assets(_size: 1000) { data { _id old_id } } }`,
		live_run: true,
		single: true,
	})
	const { data: assets } = Assets

	batch({
		collection: 'AssetGroup',
		items: assetgroups,
		parser: group => {
			const summary = group.summary ? `summary: ${JSON.stringify(group.summary)}` : ''
			const html = group.detail && group.detail.html ? `html: ${JSON.stringify(group.detail.html)}` : ''

			let assets_mutation = ''
			if (group.assets.length) {
				const old_ids = group.assets.map(asset => asset.old_id)
				const connect_ids = old_ids.map(old_id => assets.find(asset => asset.old_id === old_id)._id)
				assets_mutation = `assets: { connect: ${JSON.stringify(connect_ids)} }`
			}

			return `mutation {
				createAssetGroup(data: {
					old_id: "${group.id}"
					status: "${group.status}"
					published: ${new Date(group.publishedDatetime).getTime()}
					title: "${group.title}"
					slug: "${group.slug}"
					${summary}
					${html}
					${assets_mutation}
				}) {
					_id
					_ts
					old_id
					status
					published
					title
					slug
					summary
					html
					assets {
						data {
							_id
							filename
							size
						}
					}
				}
			}`
		},
		// live_run: true,
		// single: true,
	})
}
operate()
