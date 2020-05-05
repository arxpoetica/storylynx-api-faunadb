const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ id, changes }) {

	let data = ''
	data += changes.status ? `status: ${changes.status} ` : ''
	data += changes.title ? `title: "${changes.title}" ` : ''
	data += changes.slug ? `slug: "${changes.slug}" ` : ''
	data += changes.published ? `publishedDatetime: "${changes.published}" ` : ''
	data += changes.html ? `html: "${changes.html}" ` : ''
	data += changes.summary ? `summary: "${changes.summary}" ` : ''
	data += changes.assets ? 'assets: { set: $assets } ' : ''
	data += changes.tags ? 'tags: { set: $tags } ' : ''

	let update = ''
	if (changes.assets || changes.tags) {
		update += 'update('
		update += changes.assets ? '$assets: [AssetWhereUniqueInput!] ' : ''
		update += changes.tags ? '$tags: [PostTagWhereUniqueInput!] ' : ''
		update += ')'
	}

	const mutation = `
		mutation ${update} {
			updatePost(
				where: { id: "${id}" }
				data: { ${data} }
			) {
				id
				status
				published: publishedDatetime
				title
				slug
				html
				summary
				assets { id url summary handle fileName }
				tags { id tag }
			}
		}
	`
	const variables = {}
	if (changes.assets) {
		variables.assets = changes.assets.map(asset => ({ id: asset.id }))
	}
	if (changes.tags) {
		variables.tags = changes.tags.map(tag => ({ id: tag.id }))
	}

	const answer = await cms_mutate(mutation, variables)

	return { answer }

}
