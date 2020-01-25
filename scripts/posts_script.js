const { batch } = require('./_tools.js')
const posts = require('./posts.js')

batch({
	collection: 'Post',
	items: posts,
	parser: post => `mutation {
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
	}`,
	// live_run: true,
})
