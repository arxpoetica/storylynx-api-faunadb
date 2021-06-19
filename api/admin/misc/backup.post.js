import { EOL } from 'os'
import { cms_query } from '../../../loaders.js'
import { models } from '../../../models.js'

// TODO: think this through much more comprehensively
export const api = async function() {

	// // DEV ONLY CACHE...UNCOMMENT...
	// const cache = dev_only_get_from_cache()
	// if (cache) { return cache }
	// // DEV ONLY CACHE...UNCOMMENT...

	// backup the schema, in case we ever lose it
	const schema_query = models.map(model => {
		return `${model.schema}: __type(name: "${model.schema}") { name fields { name type { name kind } } }`
	}).join(EOL)
	const schema = await cms_query(`{ ${schema_query} }`)

	// get counts query
	const counts_query = models.map(model => {
		return `${model.name}: ${model.name}Connection { aggregate { count } }`
	}).join(EOL)
	const counts_query_res = await cms_query(`{ ${counts_query} }`)

	// 1. simplify counts object for the response
	// 2. sort models into normal (`main`) and ones that need pagination
	const counts = {}
	const main_models = []
	const page_models = []
	for (const [key, obj] of Object.entries(counts_query_res)) {
		const { count } = obj.aggregate
		counts[key] = obj.aggregate.count

		const model = models.find(model => model.name === key)
		if (count < 999) {
			main_models.push(model)
		} else {
			page_models.push(model)
		}
	}

	// load main/normal model data
	const main_query = main_models.map(model => {
		return `${model.name}(first: 1000) { id createdAt updatedAt ${model.fields} }`
	}).join(EOL)
	const entries = await cms_query(`{ ${main_query} }`)

	// load paginated model data for models that have 1,000+ entries
	// SEE: https://graphcms.com/docs/content-api/pagination
	for (const model of page_models) {
		const page_count = Math.ceil(counts[model.name] / 1000)
		const pages = new Array(page_count).fill('')
		entries[model.name] = entries[model.name] || []
		for (const [index] of pages.entries()) {
			const query = [
				`{ ${model.name}(first: 1000, skip: ${index * 1000})`,
				`{ id createdAt updatedAt ${model.fields} } }`,
			].join(' ')
			const more = await cms_query(query)
			entries[model.name] = [...entries[model.name], ...more[model.name]]
		}
	}

	// finally, lets get all the enum values
	const enum_names = [
		'AssetTransitions',
		'BackgroundPositions',
		'Categories',
		'ContentTypes',
		'HtmlHighlightColors',
		'HtmlTemplates',
		'Subjects',
		'TemplateTransitions',
		'Templates',
		'ThemeElements',
	]
	const enums_query = enum_names.map(name => {
		return `${name}: __type(name: "${name}") { enumValues { name } }`
	}).join(EOL)
	const enums_res = await cms_query(`{ ${enums_query} }`)
	const enums = {}
	for (const [key, { enumValues }] of Object.entries(enums_res)) {
		enums[key] = enumValues.map(value => value.name)
	}

	// send the response
	const final = { plugin: 'graphcms', schema, counts, entries, enums }

	// // DEV ONLY CACHE...UNCOMMENT...
	// dev_only_save_to_cache(final)
	// // DEV ONLY CACHE...UNCOMMENT...

	return final

}

// function dev_only_get_from_cache() {
// 	const { existsSync, readFileSync } = require('fs')
// 	const { join } = require('path')
// 	const filename = join(process.cwd(), 'node_modules/storylynx-api-graphcms/.backup-cache.json')
// 	if (existsSync(filename)) {
// 		console.log('...loading from cache...')
// 		const cache = JSON.parse(readFileSync(filename, 'utf8'))
// 		// console.log(cache)
// 		return cache
// 	}
// 	return false
// }

// function dev_only_save_to_cache(data) {
// 	console.log('...saving to cache...')
// 	// console.log(data)
// 	const { writeFileSync } = require('fs')
// 	const { join } = require('path')
// 	const filename = join(process.cwd(), 'node_modules/storylynx-api-graphcms/.backup-cache.json')
// 	writeFileSync(filename, JSON.stringify(data, null, '\t') + EOL, 'utf8')
// }
