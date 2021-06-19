import { cms_query } from '../../../loaders.js'

export const api = async function() {

	const {
		content_types,
		min_year,
		max_year,
		subjects,
	} = await cms_query(`{
		content_types: __type(name: "ContentTypes") { enumValues { name } }
		min_year: assetGroups(first: 1, orderBy: year_ASC, where: { year_not: null }) { year }
		max_year: assetGroups(first: 1, orderBy: year_DESC, where: { year_not: null }) { year }
		subjects: __type(name: "Subjects") { enumValues { name } }
	}`)

	// TODO: when migrating, let's just use a decades Enumeration
	// OR BETTER YET, rework the whole freaking taxonomy, because, well...it's not very well built
	const first = Math.floor(min_year[0].year / 10) * 10
	const last = Math.floor(max_year[0].year / 10) * 10
	const decades = [...Array((last - first) / 10).keys()].map(index => first + (index * 10) + 's')

	return {
		content_types: content_types.enumValues.map(val => val.name),
		decades,
		subjects: subjects.enumValues.map(val => val.name),
	}

}
