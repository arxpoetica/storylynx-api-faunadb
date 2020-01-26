const { green } = require('ansi-colors')
const { batch } = require('./_tools.js')
const { graphql } = require('../loaders.js')
const assetgroups = require('./original_assetgroups.js')

module.exports = async(live_run) => {

	let query = `query { Assets(_size: 1000) { data { _id old_id } } }`
	const { Assets } = await graphql(query)
	const { data: assets } = Assets

	query = `query { Tags { data { _id name } } }`
	const { Tags } = await graphql(query)
	const { data: tags } = Tags

	console.log(green('\n========== >>> CREATING ALL ASSET GROUPS BASED ON ASSETS\n'))

	await batch({
		collection: 'AssetGroup',
		items: assetgroups,
		parser: group => {
			const summary = group.summary ? `summary: ${JSON.stringify(group.summary)}` : ''
			const html = group.detail && group.detail.html ? `html: ${JSON.stringify(group.detail.html)}` : ''
			const source = group.source ? `source: "${group.source}"` : ''
			const content_type = group.contentType ? `content_type: "${group.contentType}"` : ''
			const subject = group.subject ? `subject: "${group.subject}"` : ''
			const year = group.year ? `year: ${group.year}` : ''

			let assets_mutation = ''
			if (live_run && group.assets.length) {
				const connect_ids = group.assets.map(old_asset => assets.find(asset => asset.old_id === old_asset.old_id)._id)
				assets_mutation = `assets: { connect: ${JSON.stringify(connect_ids)} }`
			}

			let tags_mutation = ''
			if (live_run && group.tags.length) {
				const connect_ids = group.tags.map(old_tag => tags.find(tag => tag.name === old_tag.tag)._id)
				tags_mutation = `tags: { connect: ${JSON.stringify(connect_ids)} }`
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
					${source}
					${content_type}
					${subject}
					${year}
					${assets_mutation}
					${tags_mutation}
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
					assets { data {
						_id
						filename
						size
					} }
					source
					content_type
					subject
					year
					tags { data { name } }
				}
			}`
		},
		live_run,
		// single: true,
	})

}
