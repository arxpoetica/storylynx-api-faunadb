const { cms_query } = require('../../loaders.js')

module.exports = async function({ title }) {

	// TODO: maybe just return story, root clip, and sequence IDs
	// -- load sequences seperately???
	const { story } = await cms_query(`query {
		story(where: { title: "${title.toLowerCase()}" }) {
			id
			title
			rootclip {
				id
				title
				order
				sequences: children(orderBy: order_ASC) {
					id
					title
					order
					clips: children(orderBy: order_ASC) {
						id
						title
						order
						template
						themes
						transition
						assets { id handle url source summary height width size mime_type: mimeType }
						asset_groups: assetGroups(orderBy: order_ASC) {
							order
							assets { id handle url source summary height width size mime_type: mimeType }
							# links // NOTE: will use in the near future for vimeo, etc.
							html_blocks: htmlBlocks { html }
						}
					}
				}
			}
		}
	}`)

	// FIXME: I'd really like to have a way to cache all of this...
	// TODO: how deep will this go? fine for now
	story.rootclip.sequences = story.rootclip.sequences.map(sequence => {
		sequence.clips = sequence.clips.map(clip => {
			clip.template = clip.template || 'Column1'
			clip.asset_groups.map(group => {
				group.html_blocks = group.html_blocks.map(block => {
					block.mime_type = 'text/html'
					return block
				})
				group.assets = group.assets.concat(group.html_blocks)
				delete group.html_blocks
				return group
			})
			return clip
		})
		return sequence
	})

	return { story }

}
