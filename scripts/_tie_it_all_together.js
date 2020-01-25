const { graphql } = require('../loaders.js')
const graphcms_posts = require('./posts.js')

async function operate() {

	let query = `query { Posts { data { _id old_id } } }`
	const { Posts } = await graphql(query)
	const { data: posts } = Posts

	query = `query { Assets(_size: 1000) { data { _id old_id } } }`
	const { Assets } = await graphql(query)
	const { data: assets } = Assets

	query = `query { Tags { data { _id name } } }`
	const { Tags } = await graphql(query)
	const { data: tags } = Tags

	for (let post of posts) {
		const old_post = graphcms_posts.find(old_post => old_post.id === post.old_id)
		const asset = assets.find(asset => asset.old_id === old_post.assets[0].id)
		const old_tags = old_post.tags.map(old_tag => tags.find(tag => tag.name === old_tag.tag)._id)
		const tag_updates = old_tags.length ? `tags: { connect: ${JSON.stringify(old_tags)} }` : ''

		query = `mutation {
			partialUpdatePost(id: "${post._id}", data: {
				assets: { connect: ["${asset._id}"] }
				${tag_updates}
			}) {
				headline
				assets { data { _id filename } }
				tags { data { _id name } }
			}
		}`
		console.log(query)
		// const res = await graphql(query)
		// console.log(res)
	}

}
operate()
