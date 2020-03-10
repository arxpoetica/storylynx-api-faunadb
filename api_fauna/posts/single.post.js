const { graphql } = require('../../loaders.js')

module.exports = async function({ slug }) {

	try {
		const query = `query {
			findPostBySlug(slug: "${slug}") {
				slug
				headline
				subheadline
				byline
				published
				html
				assets { data { id: _id url summary handle filename width height } }
				tags { data { name } }
				link_back
			}
		}`
		const res = await graphql(query)
		if (res.error) { throw new Error(res.message) }

		const post = res.findPostBySlug
		post.assets = post.assets.data.map(asset => asset)
		post.tags = post.tags.data.map(tag => tag.name)

		return { post }
	} catch (error) {
		console.log(error)
	}

	// 		id
	// 		publishedDatetime
	// 		title
	// 		summary
	// 		detail { html }
	// 		assets { id url summary handle fileName width height mimeType }
	// 		assetLinks {
	// 			summary
	// 			link
	// 			cover { url handle }
	// 		}
	// 		tags { tag }
	// 		contentType
	// 		year
	// 		subject
	// 		source

}
