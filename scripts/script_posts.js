const { green } = require('ansi-colors')
const { batch } = require('./_tools.js')
const { graphql } = require('../loaders.js')
const posts = require('./original_posts.js')

module.exports = async(live_run) => {

	let query = `query { Assets(_size: 1000) { data { _id old_id } } }`
	const { Assets } = await graphql(query)
	const { data: assets } = Assets

	query = `query { Tags { data { _id name } } }`
	const { Tags } = await graphql(query)
	const { data: tags } = Tags

	console.log(green('\n========== >>> CREATING ALL POSTS\n'))

	await batch({
		collection: 'Post',
		items: posts,
		parser: post => {

			let assets_mutation = ''
			if (live_run && post.assets.length) {
				const connect_ids = post.assets.map(old_asset => {
					const found = assets.find(asset => asset.old_id === old_asset.old_id)
					return found ? found._id : null
				}).filter(id => id)
				assets_mutation = `assets: { connect: ${JSON.stringify(connect_ids)} }`
			}

			let tags_mutation = ''
			if (live_run && post.tags.length) {
				const connect_ids = post.tags.map(old_tag => {
					const found = tags.find(tag => tag.name === old_tag.tag)
					return found ? found._id : null
				}).filter(id => id)
				tags_mutation = `tags: { connect: ${JSON.stringify(connect_ids)} }`
			}

			return `mutation {
				createPost(data: {
					old_id: "${post.id}"
					published: ${new Date(post.publishedDatetime).getTime()}
					status: "${post.status}"
					slug: "${post.slug}"
					headline: "${post.headline}"
					subheadline: "${post.subheadline}"
					byline: "${post.byline}"
					link_back: "${post.linkBack}"
					html: ${JSON.stringify(post.detail.html)}
					${tags_mutation}
					${assets_mutation}
				}) {
					_id
					_ts
					old_id
					published
					status
					slug
					headline
					subheadline
					author
					byline
					link_back
					html
					assets { data { mime_type } }
					tags { data { name } }
				}
			}`
		},
		live_run,
	})

}
