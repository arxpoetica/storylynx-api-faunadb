const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ id, title, caption, content_type, year, subject, source, detail }) {

	content_type = content_type === '' ? null : content_type
	year = year === '' ? null : year
	subject = subject === '' ? null : subject

	const title_str = title !== undefined ? `title: "${title}"` : ''
	const caption_str = caption !== undefined ? `caption: "${caption}"` : ''
	const contentType_str = content_type !== undefined ? `contentType: ${content_type}` : ''
	const year_str = year !== undefined ? `year: ${year}` : ''
	const subject_str = subject !== undefined ? `subject: ${subject}` : ''
	const source_str = source !== undefined ? `source: "${source}"` : ''
	const detail_str = detail !== undefined ? `detail: "${detail}"` : ''

	const mutation = `mutation {
		asset_group: updateAssetGroup(
			where: { id: "${id}" }
			data: {
				${title_str}
				${caption_str}
				${contentType_str}
				${year_str}
				${subject_str}
				${source_str}
				${detail_str}
			}
		) {
			id	
			# title
			# caption
			# content_type: contentType
			# year
			# subject
			# source
			# detail
		}
	}`

	return await cms_mutate(mutation)

}
