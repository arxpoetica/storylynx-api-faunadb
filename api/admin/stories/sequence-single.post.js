const { pascal_to_words } = require('../../../utils.js')
const { cms_query } = require('../../../loaders.js')

module.exports = async function({ id }) {

	const query = `query {

		sequence(where: { id: "${id}" }) {
			id
			slug
			hide_navigation: hideNavigation
			order
			clips(orderBy: order_ASC) {
				# TODO: dry this up...it's used in a few places, such as clip-duplicate.post.js
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
						url
						source
						caption
						width: widthOverride
						height: heightOverride
						contain
						filename: fileName
						mime_type: mimeType
						bg_pos: backgroundPosition
						volume
						play_once: playOnce
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

		enum_templates: __type(name: "Templates") { values: enumValues { name } }
		enum_theme_elements: __type(name: "ThemeElements") { values: enumValues { name } }
		enum_template_transitions: __type(name: "TemplateTransitions") { values: enumValues { name } }
		enum_html_templates: __type(name: "HtmlTemplates") { values: enumValues { name } }
		enum_html_colors: __type(name: "HtmlHighlightColors") { values: enumValues { name } }

	}`

	const res = await cms_query(query)

	// FIXME: I'd really like to have a way to cache all of this...
	// TODO: how deep will this go? fine for now

	res.enum_templates = res.enum_templates.values
		.sort((one, two) => one.name.localeCompare(two.name))
		.map(value => ({ id: value.name, text: pascal_to_words(value.name) }))
	res.enum_theme_elements = res.enum_theme_elements.values
		.sort((one, two) => one.name.localeCompare(two.name))
		.map(value => ({ id: value.name, text: pascal_to_words(value.name) }))
	res.enum_template_transitions = res.enum_template_transitions.values
		.sort((one, two) => one.name.localeCompare(two.name))
		.map(value => ({ id: value.name, text: pascal_to_words(value.name) }))
	res.enum_html_templates = res.enum_html_templates.values
		.sort((one, two) => one.name.localeCompare(two.name))
		.map(value => ({ id: value.name, text: pascal_to_words(value.name) }))
	res.enum_html_colors = res.enum_html_colors.values
		.sort((one, two) => one.name.localeCompare(two.name))
		.map(value => ({ id: value.name, text: pascal_to_words(value.name) }))

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
