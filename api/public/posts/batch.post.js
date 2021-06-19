import { cms_query } from '../../../loaders.js'

export const api = async function({ batch, batch_size, tags }) {

	let where = ''
	if (tags && tags.length) {
		where += 'where: '
		where += tags.map(tag => `{ tags_some: { tag: "${tag}" } }`).join(', ')
	}

	const { posts, connection } = await cms_query(`{
		posts(
			first: ${batch_size}
			skip: ${(batch - 1) * batch_size}
			${where}
			orderBy: publishedDatetime_DESC
		) {
			id
			published: publishedDatetime
			headline
			subheadline
			slug
			assets { id url caption handle mime_type: mimeType filename: fileName }
			tags { name: tag }
		}

		connection: postsConnection(
			first: ${batch_size}
			skip: ${(batch - 1) * batch_size}
			${where}
			orderBy: publishedDatetime_DESC
		) {
			pageInfo {
				hasNextPage
			}
		}
	}`)

	const items = posts.map(post => {
		post.tags = post.tags.map(tag => tag.name)
		return post
	})

	return {
		items,
		next_batch: connection.pageInfo.hasNextPage ? items[items.length - 1].id : false,
	}

}
