const { cms_query } = require('../../../loaders.js')

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
					transitions
					styles {
						top right left bottom
						gap
						width: templateWidth
						height: templateHeight
						percent: widthAsPercent
					}
					asset_bins: assetBins(orderBy: order_ASC) {
						order
						assets(orderBy: order_ASC) {
							id
							handle
							url
							source
							caption
							# summary # talk w/ Nathaniel. I don't think we'll have a longer form description on the timeline
							width: widthOverride
							height: heightOverride
							contain
							mime_type: mimeType
							bg_pos: backgroundPosition
							volume
						}
						# links // NOTE: will use in the near future for vimeo, etc.
						transition
						html_blocks: htmlBlocks(orderBy: order_ASC) { template color: highlightColor html }
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
			clip.asset_bins = clip.asset_bins.map(bin => {
				bin.assets = bin.assets.map(asset => {
					// clamping volume putting in range between 0 and 1
					if (asset.volume) {
						asset.volume = Math.max(Math.min(asset.volume / 10, 1), 0)
					}
					return asset
				})
				for (let block of bin.html_blocks) {
					block.mime_type = 'text/html'
					bin.assets.push(block)
				}
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
