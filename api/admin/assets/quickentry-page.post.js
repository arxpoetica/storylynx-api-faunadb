import { cms_query } from '../../../loaders.js'

export const api = async function() {

	const query = `{

		asset_groups: assetGroups(orderBy: title_ASC) {
			id
			title
			subject
			content_type: contentType
			caption
			source
			detail
			year
			tags { name: tag }
			assets(orderBy: assetGroupOrder_ASC) { id handle filename: fileName mime_type: mimeType }
		}

		content_types: __type(name: "ContentTypes") {
			values: enumValues { name }
		}
		subjects: __type(name: "Subjects") {
			values: enumValues { name }
		}

	}`

	const res = await cms_query(query)
	res.content_types = res.content_types.values.map(value => value.name)
	res.subjects = res.subjects.values.map(value => value.name)
	res.asset_groups = res.asset_groups.map(group => {
		group.tags = group.tags.map(tag => tag.name)
		return group
	})

	return res

}
