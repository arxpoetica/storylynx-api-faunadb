module.exports = {
	/* eslint-disable max-len */
	models: [{
		schema: 'Asset',
		name: 'assets',
		fields: 'handle fileName width height size mimeType assetGroupOrder assetPart caption volume newsAsset archivalAsset avatarAccount { id } coverLinkedAsset { id } relatedPosts { id } audioAssetAudioClip { id } relatedAssetGroups { id } relatedAssetCover { id } assetCover { id } parentAssetBins { id } parentStoryAsset { id }',
	}, {
		schema: 'Account',
		name: 'accounts',
		fields: 'publishedAt username hash salt role first last avatar { id }',
	}, {
		schema: 'AssetCover',
		name: 'assetCovers',
		fields: 'publishedAt asset { id } relatedAsset { id }',
	}, {
		schema: 'AssetGroup',
		name: 'assetGroups',
		fields: 'publishedAt title caption source detail assets { id } assetLinks { id } contentType categories subject year tags { id } externalAssets',
	}, {
		schema: 'AssetsBin',
		name: 'assetsBins',
		fields: 'parentClip { id } order storyAssets { id } transition assets { id }',
	}, {
		schema: 'AudioClip',
		name: 'audioClips',
		fields: 'name audioAsset { id } clipsInRange { id } parentSequence { id }',
	}, {
		schema: 'Clip',
		name: 'clips',
		fields: 'slug hideClip hideNavigation parentName order template themeElements transitions assetBins { id } styles { id } parentAudioClips { id } parentSequence { id }',
	}, {
		schema: 'ClipStyle',
		name: 'clipStyles',
		fields: 'parentClip { id } top right bottom left gap templateWidth templateHeight widthAsPercent',
	}, {
		schema: 'LinkedAsset',
		name: 'linkedAssets',
		fields: 'link cover { id } source summary relatedAssetGroups { id }',
	}, {
		schema: 'Page',
		name: 'pages',
		fields: 'title slug content { html } footerNavigation',
	}, {
		schema: 'Post',
		name: 'posts',
		fields: 'headline subheadline slug publishedDatetime byline linkback detail { html } assets { id } tags { id }',
	}, {
		schema: 'Sequence',
		name: 'sequences',
		fields: 'parentStory { id } title slug hideSequence hideNavigation order clips { id } audioClips { id }',
	}, {
		schema: 'Story',
		name: 'stories',
		fields: 'title slug hideStory sequences { id }',
	}, {
		schema: 'StoryAsset',
		name: 'storyAssets',
		fields: 'asset { id } name order caption source volume playOnce widthOverride heightOverride contain backgroundPosition htmlTemplate htmlHighlightColor htmlCode html parentAssetBin { id }',
	}, {
		schema: 'Tag',
		name: 'tags',
		fields: 'tag posts { id } assetGroups { id }',
	}],
	/* eslint-enable max-len */
}
