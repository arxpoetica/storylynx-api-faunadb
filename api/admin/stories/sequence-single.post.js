const { pascal_to_words, merge_asset } = require('../../../utils.js')
const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const query = `query {

		sequence(where: { id: "${id}" }) {
			id
			slug
			hide_sequence: hideSequence
			hide_navigation: hideNavigation
			order
			clips(orderBy: order_ASC) {
				id
				slug
				hide_clip: hideClip
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
					assets: storyAssets(orderBy: order_ASC) {
						id
						asset {
							id
							handle
							url
							filename: fileName
							mime_type: mimeType
						}
						link
						order
						name
						source
						caption
						width: widthOverride
						height: heightOverride
						contain
						bg_pos: backgroundPosition
						volume
						play_once: playOnce
						template: htmlTemplate
						color: htmlHighlightColor
						code: htmlCode
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

		enum_templates: __type(name: "Templates") { values: enumValues { name } }
		enum_theme_elements: __type(name: "ThemeElements") { values: enumValues { name } }
		enum_template_transitions: __type(name: "TemplateTransitions") { values: enumValues { name } }
		enum_asset_transitions: __type(name: "AssetTransitions") { values: enumValues { name } }
		enum_background_positions: __type(name: "BackgroundPositions") { values: enumValues { name } }
		enum_html_templates: __type(name: "HtmlTemplates") { values: enumValues { name } }
		enum_html_colors: __type(name: "HtmlHighlightColors") { values: enumValues { name } }

	}`

	const res = await cms_query(query)

	res.sequence.clips = res.sequence.clips.map(clip => {
		// clip.template = clip.template || 'Column1'
		clip.asset_bins = clip.asset_bins.map(bin => {
			bin.assets = bin.assets.map(merge_asset)
			return bin
		})
		clip.styles = clip.styles || {
			top: null,
			bottom: null,
			left: null,
			right: null,
			gap: null,
			width: null,
			height: null,
			percent: null,
		}
		return clip
	})

	return {
		sequence: res.sequence,
		sequence_enums: {
			// FIXME: I'd really like to have a way to cache all of this...
			// TODO: how deep will this go? fine for now
			templates: res.enum_templates.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
			theme_elements: res.enum_theme_elements.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
			template_transitions: res.enum_template_transitions.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
			asset_transitions: res.enum_asset_transitions.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
			background_positions: res.enum_background_positions.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
			html_templates: res.enum_html_templates.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
			html_colors: res.enum_html_colors.values
				.sort((one, two) => one.name.localeCompare(two.name))
				.map(value => ({ id: value.name, text: pascal_to_words(value.name) })),
		},
	}
}
