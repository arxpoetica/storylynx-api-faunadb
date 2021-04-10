const { EOL } = require('os')
const { cms_query } = require('../../../loaders.js')

// TODO: think this through much more comprehensively
module.exports = async function() {

	// // DEV ONLY CACHE...UNCOMMENT...
	// const cache = dev_only_get_from_cache()
	// if (cache) { return cache }
	// // DEV ONLY CACHE...UNCOMMENT...

	const common_1 = '(first: 1000) { id createdAt updatedAt'

	/* eslint-disable max-len */
	// TODO: this will ultimately require pagination for huge datasets...
	// SEE: https://graphcms.com/docs/content-api/pagination
	const queries = [
		`assets${common_1} handle fileName width height size mimeType assetGroupOrder assetPart caption volume newsAsset archivalAsset avatarAccount { id } coverLinkedAsset { id } relatedPosts { id } audioAssetAudioClip { id } relatedAssetGroups { id } relatedAssetCover { id } assetCover { id } parentAssetBins { id } parentStoryAsset { id } }`,
		`accounts${common_1} publishedAt username hash salt role first last avatar { id } }`,
		`assetCovers${common_1} publishedAt asset { id } relatedAsset { id } }`,
		`assetGroups${common_1} publishedAt title caption source detail assets { id } assetLinks { id } contentType categories subject year tags { id } externalAssets }`,
		`assetsBins${common_1} parentClip { id } order storyAssets { id } links transition assets { id } }`,
		`audioClips${common_1} name audioAsset { id } clipsInRange { id } parentSequence { id } }`,
		`clips${common_1} slug hideNavigation parentName order template themeElements transitions assetBins { id } styles { id } parentAudioClips { id } parentSequence { id } }`,
		`clipStyles${common_1} parentClip { id } top right bottom left gap templateWidth templateHeight widthAsPercent }`,
		`linkedAssets${common_1} link cover { id } source summary relatedAssetGroups { id } }`,
		`pages${common_1} title slug content { html } footerNavigation }`,
		`posts${common_1} headline subheadline slug publishedDatetime byline linkback detail { html } assets { id } tags { id } }`,
		`sequences${common_1} parentStory { id } title slug hideNavigation order clips { id } audioClips { id } }`,
		`stories${common_1} title slug sequences { id } }`,
		`storyAssets${common_1} asset { id } name order caption source volume playOnce widthOverride heightOverride contain backgroundPosition htmlTemplate htmlHighlightColor htmlCode html parentAssetBin { id } }`,
		`tags${common_1} tag posts { id } assetGroups { id } }`,
	]
	/* eslint-enable max-len */
	const queries_res = await cms_query(`{ ${queries.join(EOL)} }`)

	const count_queries = [
		'assets: assetsConnection { aggregate { count } }',
		'accounts: accountsConnection { aggregate { count } }',
		'assetCovers: assetCoversConnection { aggregate { count } }',
		'assetGroups: assetGroupsConnection { aggregate { count } }',
		'assetsBins: assetsBinsConnection { aggregate { count } }',
		'audioClips: audioClipsConnection { aggregate { count } }',
		'clips: clipsConnection { aggregate { count } }',
		'clipStyles: clipStylesConnection { aggregate { count } }',
		'linkedAssets: linkedAssetsConnection { aggregate { count } }',
		'pages: pagesConnection { aggregate { count } }',
		'posts: postsConnection { aggregate { count } }',
		'sequences: sequencesConnection { aggregate { count } }',
		'stories: storiesConnection { aggregate { count } }',
		'storyAssets: storyAssetsConnection { aggregate { count } }',
		'tags: tagsConnection { aggregate { count } }',
	]
	const count_queries_res = await cms_query(`{ ${count_queries.join(EOL)} }`)

	const counts = {}
	for (const [key, obj] of Object.entries(count_queries_res)) {
		counts[key] = obj.aggregate.count
	}
	const final = { entries: queries_res, counts }

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
// 		return JSON.parse(readFileSync(filename, 'utf8'))
// 	}
// 	return false
// }

// function dev_only_save_to_cache(data) {
// 	const { writeFileSync } = require('fs')
// 	const { join } = require('path')
// 	const filename = join(process.cwd(), 'node_modules/storylynx-api-faunadb/.backup-cache.json')
// 	writeFileSync(filename, JSON.stringify(data, null, '\t'), 'utf8')
// }
