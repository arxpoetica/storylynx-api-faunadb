const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const query = `query {

		sequence(where: { id: "${id}" }) {
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
				# FIXME: this should be assetBins with an ending s and no middle s !!!!! 
				asset_bins: assetsBin(orderBy: order_ASC) {
					id
					order
					assets {
						id
						handle
						source
						summary
						width: widthOverride
						height: heightOverride
						contain
						filename: fileName
						mime_type: mimeType
						bg_pos: backgroundPosition
						volume
					}
					# links // NOTE: will use in the near future for vimeo, etc.
					html_block: htmlBlock {
						id
						name
						template
						color: highlightColor
						code
						html
					}
					transition
				}
				# audio_clips: parentAudioClips(where: { parentSequence: { id_not: null } }) {
				# 	id
				# 	audio_asset: audioAsset { mime_type: mimeType }
				# 	clips_in_range: clipsInRange(orderBy: order_ASC) { id }
				# 	# TODO: throw a transition on the audio clips????
				# 	# transition
				# }
			}
			# audio_clips: audioClips {
			# 	id
			# 	audio_asset: audioAsset {
			# 		url
			# 		mime_type: mimeType
			# 		volume
			# 	}
			# 	# clips_in_range: clipsInRange(orderBy: order_ASC) { id }
			# }
			story: parentStory {
				id
				title
				slug
			}
		}

		html_templates: __type(name: "HtmlTemplates") {
			values: enumValues { name }
		}

		html_colors: __type(name: "HtmlHighlightColors") {
			values: enumValues { name }
		}

	}`

	const res = await cms_query(query)
	res.html_templates = res.html_templates.values.map(value => value.name)
	res.html_colors = res.html_colors.values.map(value => value.name)

	// FIXME: I'd really like to have a way to cache all of this...
	// TODO: how deep will this go? fine for now

	res.sequence.clips = res.sequence.clips.map(clip => {
		// clip.template = clip.template || 'Column1'
		clip.asset_bins = clip.asset_bins.map(bin => {
			bin.html_block = bin.html_block || {}
			bin.html_block.code = bin.html_block.code ? JSON.parse(bin.html_block.code) : {}
			// bin.assets = bin.assets.map(asset => {
			// 	// clamping volume putting in range between 0 and 1
			// 	if (asset.volume) {
			// 		asset.volume = Math.max(Math.min(asset.volume / 10, 1), 0)
			// 	}
			// 	return asset
			// })
			// bin.assets = bin.assets.concat(bin.html_blocks)
			// delete bin.html_blocks
			return bin
		})
		return clip
	})
	// for (let audio_clip of sequence.audio_clips) {
	// 	const volume = audio_clip.audio_asset.volume
	// 	if (volume) {
	// 		audio_clip.audio_asset.volume = Math.max(Math.min(volume / 10, 1), 0)
	// 	}
	// }

	return res
}
