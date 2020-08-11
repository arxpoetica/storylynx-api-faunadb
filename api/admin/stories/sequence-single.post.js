const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const query = `query {

		sequence(where: { id: "${id}" }) {
			id
			slug
			hide_navigation: hideNavigation
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
					id
					top right left bottom
					gap
					width: templateWidth
					height: templateHeight
					percent: widthAsPercent
				}
				asset_bins: assetBins(orderBy: order_ASC) {
					id
					order
					assets {
						id
						handle
						source
						caption
						width: widthOverride
						height: heightOverride
						contain
						filename: fileName
						mime_type: mimeType
						bg_pos: backgroundPosition
						volume
					}
					# links // NOTE: will use in the near future for vimeo, etc.
					html_blocks: htmlBlocks {
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
			for (let block of bin.html_blocks) {
				block.code = block.code ? JSON.parse(block.code) : {}
			}
			return bin
		})
		return clip
	})

	return res
}
