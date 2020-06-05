const { cms_query } = require('../../../loaders.js')

module.exports = async function() {

	// FIXME: figure out what constitutes "related"
	// FIXME: figure out what constitutes "related"
	// FIXME: figure out what constitutes "related"

	return await cms_query(`{
		related: assetGroups(
			first: 4
			orderBy: title_ASC
		) {
			id
			title
			assets {
				cover { url caption handle mime_type: mimeType filename: fileName }
				id url caption handle mime_type: mimeType filename: fileName
			}
			asset_links: assetLinks {
				summary
				link
				cover { url handle }
			}
			content_type: contentType
			year
			subject
		}
	}`)

}
