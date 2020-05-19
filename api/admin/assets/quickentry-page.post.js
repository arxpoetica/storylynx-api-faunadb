const { cms_query } = require('../../../loaders.js')

module.exports = async function() {

	const query = `{

		# assets {
		# 	id
		# 	url
		# 	summary
		# 	handle
		# 	filename: fileName
		# }

		asset_groups: assetGroups(orderBy: title_ASC) {
			id
			title
			subject
			content_type: contentType
			source
			summary
			# detail {
			#	 html
			# }
			year
			tags { name: tag }
			assets { id handle filename: fileName mime_type: mimeType }
		}

		content_types: __type(name: "ContentTypes") {
			values: enumValues { value: name }
		}
		subjects: __type(name: "Subjects") {
			values: enumValues { value: name }
		}

	}`

	const res = await cms_query(query)
	res.content_types = res.content_types.values.map(value => value.value)
	res.subjects = res.subjects.values.map(value => value.value)
	res.asset_groups = res.asset_groups.map(group => {
		group.tags = group.tags.map(tag => tag.name)
		return group
	})

	return res

}
