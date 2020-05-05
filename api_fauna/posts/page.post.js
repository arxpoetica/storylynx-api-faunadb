// const { red } = require('ansi-colors')
const { graphql } = require('../../loaders.js')

module.exports = async function({ page, page_size, tags }) {

	try {
		const query = `query {
			Posts(_size: 12) {
				data {
					id: _id
					published
					headline
					subheadline
					slug
					assets { data { id: _id url summary handle mime_type filename } }
					tags { data { name } }
				}
			}
		}`
		const res = await graphql(query)
		if (res.error) { throw new Error(res.message) }

		const items = res.Posts.data.map(post => {
			post.assets = post.assets.data.map(asset => asset)
			post.tags = post.tags.data.map(tag => tag.name)
			return post
		})

		return {
			items,
			items_count: 6,
			page_size,
		}
	} catch (error) {
		console.log(error)
	}

	// const { posts, postsConnection } = await cms_query(`{
	// 	posts(
	// 		first: ${page_size},
	// 		skip: ${(page - 1) * page_size},
	// 		where: ${where},
	// 		orderBy: publishedDatetime_DESC
	// 	) {
	// 		id
	// 		publishedDatetime
	// 		headline
	// 		subheadline
	// 		slug
	// 		assets { id url summary handle mimeType fileName }
	// 		tags { tag }
	// 	}

	// 	postsConnection(where: ${where}) { aggregate { count } }
	// }`)

}
