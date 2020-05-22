const { cms_query } = require('../../loaders.js')

module.exports = async function({ title }) {

	const { story } = await cms_query(`query {
		story(where: { title: "${title.toLowerCase()}" }) {
			id
			title
			slug
			sequences(orderBy: order_ASC) {
				id
				slug
				order
				clips(orderBy: order_ASC) {
					id
					slug
					hide_navigation: hideNavigation
					order
					template
					theme_elements: themeElements
					transition
					# FIXME: this should be assetBins with an ending s and no middle s !!!!! 
					assets_bin: assetsBin(orderBy: order_ASC) {
						order
						assets {
							id
							handle
							url
							source
							summary
							width: widthOverride
							height: heightOverride
							contain
							mime_type: mimeType
							bg_pos: backgroundPosition
							volume
						}
						# links // NOTE: will use in the near future for vimeo, etc.
						html_blocks: htmlBlocks { html }
						transition
					}
					audio_clips: parentAudioClips(where: { parentSequence: { id_not: null } }) {
						id
						audio_asset: audioAsset { mime_type: mimeType }
						clips_in_range: clipsInRange(orderBy: order_ASC) { id }
						# TODO: throw a transition on the audio clips????
						# transition
					}
				}
				audio_clips: audioClips {
					id
					audio_asset: audioAsset {
						url
						mime_type: mimeType
						volume
					}
					# clips_in_range: clipsInRange(orderBy: order_ASC) { id }
				}
			}
		}
	}`)

	// FIXME: I'd really like to have a way to cache all of this...
	// TODO: how deep will this go? fine for now
	story.sequences = story.sequences.map(sequence => {
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
		for (let audio_clip of sequence.audio_clips) {
			const volume = audio_clip.audio_asset.volume
			if (volume) {
				audio_clip.audio_asset.volume = Math.max(Math.min(volume / 10, 1), 0)
			}
		}
		return sequence
	})

	return story

}
