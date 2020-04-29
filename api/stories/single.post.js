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
				slug
				order
				sequences: children(orderBy: order_ASC) {
					id
					slug
					order
					clips: children(orderBy: order_ASC) {
						id
						slug
						order
						template
						theme_elements: themeElements
						transition
						assets_bin: assetsBin(orderBy: order_ASC) {
							order
							assets {
								id
								handle
								url
								source
								summary
								height
								width
								size
								mime_type: mimeType
								bg_pos: backgroundPosition
								volume
							}
							# links // NOTE: will use in the near future for vimeo, etc.
							html_blocks: htmlBlocks { html }
							transition
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
			clip.assets_bin = clip.assets_bin.map(bin => {
				bin.html_blocks = bin.html_blocks.map(block => {
					block.mime_type = 'text/html'
					// FIXME: THIS IS HORRIBLY INEFFICIENT...but then again, when we move to FaunaDB it won't be an issue...
					// FIXME: THIS IS HORRIBLY INEFFICIENT...but then again, when we move to FaunaDB it won't be an issue...
					// FIXME: THIS IS HORRIBLY INEFFICIENT...but then again, when we move to FaunaDB it won't be an issue...
					// FIXME: THIS IS HORRIBLY INEFFICIENT...but then again, when we move to FaunaDB it won't be an issue...
					// FIXME: THIS IS HORRIBLY INEFFICIENT...but then again, when we move to FaunaDB it won't be an issue...
					block.html = block.html.replace(/<p><\/p>/gi, '')
					return block
				})
				bin.assets = bin.assets.map(asset => {
					// clamping volume putting in range between 0 and 1
					if (asset.volume) {
						asset.volume = Math.max(Math.min(asset.volume / 10, 1), 0)
					}
					return asset
				})
				bin.assets = bin.assets.concat(bin.html_blocks)
				delete bin.html_blocks
				return bin
			})
			return clip
		})
		return sequence
	})

	return { story }

}
