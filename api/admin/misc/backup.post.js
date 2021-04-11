const { EOL } = require('os')
const { cms_query } = require('../../../loaders.js')

// TODO: think this through much more comprehensively
module.exports = async function() {

	// // DEV ONLY CACHE...UNCOMMENT...
	// const cache = dev_only_get_from_cache()
	// if (cache) { return cache }
	// // DEV ONLY CACHE...UNCOMMENT...

	/* eslint-disable max-len */
	const models = [{
		name: 'assets',
		fields: 'handle fileName width height size mimeType assetGroupOrder assetPart caption volume newsAsset archivalAsset avatarAccount { id } coverLinkedAsset { id } relatedPosts { id } audioAssetAudioClip { id } relatedAssetGroups { id } relatedAssetCover { id } assetCover { id } parentAssetBins { id } parentStoryAsset { id }',
	}, {
		name: 'accounts',
		fields: 'publishedAt username hash salt role first last avatar { id }',
	}, {
		name: 'assetCovers',
		fields: 'publishedAt asset { id } relatedAsset { id }',
	}, {
		name: 'assetGroups',
		fields: 'publishedAt title caption source detail assets { id } assetLinks { id } contentType categories subject year tags { id } externalAssets',
	}, {
		name: 'assetsBins',
		fields: 'parentClip { id } order storyAssets { id } links transition assets { id }',
	}, {
		name: 'audioClips',
		fields: 'name audioAsset { id } clipsInRange { id } parentSequence { id }',
	}, {
		name: 'clips',
		fields: 'slug hideNavigation parentName order template themeElements transitions assetBins { id } styles { id } parentAudioClips { id } parentSequence { id }',
	}, {
		name: 'clipStyles',
		fields: 'parentClip { id } top right bottom left gap templateWidth templateHeight widthAsPercent',
	}, {
		name: 'linkedAssets',
		fields: 'link cover { id } source summary relatedAssetGroups { id }',
	}, {
		name: 'pages',
		fields: 'title slug content { html } footerNavigation',
	}, {
		name: 'posts',
		fields: 'headline subheadline slug publishedDatetime byline linkback detail { html } assets { id } tags { id }',
	}, {
		name: 'sequences',
		fields: 'parentStory { id } title slug hideNavigation order clips { id } audioClips { id }',
	}, {
		name: 'stories',
		fields: 'title slug sequences { id }',
	}, {
		name: 'storyAssets',
		fields: 'asset { id } name order caption source volume playOnce widthOverride heightOverride contain backgroundPosition htmlTemplate htmlHighlightColor htmlCode html parentAssetBin { id }',
	}, {
		name: 'tags',
		fields: 'tag posts { id } assetGroups { id }',
	}]
	/* eslint-enable max-len */

	// get count queries
	const count_queries = models.map(model => `${model.name}: ${model.name}Connection { aggregate { count } }`)
	const count_queries_res = await cms_query(`{ ${count_queries.join(EOL)} }`)

	// 1. simplify counts object for the response
	// 2. sort models into normal (`main`) and ones that need pagination
	const counts = {}
	const main_models = []
	const page_models = []
	for (const [key, obj] of Object.entries(count_queries_res)) {
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
	const main_queries = main_models.map(model => {
		return `${model.name}(first: 1000) { id createdAt updatedAt ${model.fields} }`
	})
	const entries = await cms_query(`{ ${main_queries.join(EOL)} }`)

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

	const final = { entries, counts }

	// // DEV ONLY CACHE...UNCOMMENT...
	// dev_only_save_to_cache(final)
	// // DEV ONLY CACHE...UNCOMMENT...

	return final

}

// function dev_only_get_from_cache() {
// 	const { existsSync, readFileSync } = require('fs')
// 	const { join } = require('path')
// 	const filename = join(process.cwd(), 'node_modules/storylynx-api-faunadb/.backup-cache.json')
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
// 	const filename = join(process.cwd(), 'node_modules/storylynx-api-faunadb/.backup-cache.json')
// 	writeFileSync(filename, JSON.stringify(data, null, '\t') + EOL, 'utf8')
// }
