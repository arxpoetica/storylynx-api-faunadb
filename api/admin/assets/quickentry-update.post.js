const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ id, title, summary, content_type, year, subject, source }) {

	const title_str = title !== undefined ? `title: "${title}"` : ''
	const summary_str = summary !== undefined ? `summary: "${summary}"` : ''
	const contentType_str = content_type !== undefined ? `contentType: ${content_type}` : ''
	const year_str = year !== undefined ? `year: ${year}` : ''
	const subject_str = subject !== undefined ? `subject: ${subject}` : ''
	const source_str = source !== undefined ? `source: "${source}"` : ''

	const mutation = `mutation {
		asset_group: updateAssetGroup(
			where: { id: "${id}" }
			data: {
				${title_str}
				${summary_str}
				${contentType_str}
				${year_str}
				${subject_str}
				${source_str}
			}
		) {
			id	
			# title
			# summary
			# content_type: contentType
			# year
			# subject
			# source
		}
	}`

	return await cms_mutate(mutation)

}
