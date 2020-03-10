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
				styles
				html { html }
				sequences: children {
					id
					title
					order
					styles
					html { html }
					clips: children {
						id
						title
						order
						template
						themes
						transition
						styles
						html { html }
						assets { id handle url source summary height width size mime_type: mimeType }
						# intervals { id }
						# children {}
					}
				}
			}
		}
	}`)

	// FIXME: I'd really like to have a way to cache all of this...
	// TODO: how deep will this go? fine for now
	story.rootclip.html = story.rootclip.html.html
	story.rootclip.sequences = story.rootclip.sequences
		.map(sequence => {
			sequence.html = sequence.html.html
			sequence.clips = sequence.clips
				.map(clip => {
					clip.html = clip.html.html
					clip.template = clip.template || 'Column'
					return clip
				})
				.sort((clip_a, clip_b) => clip_a.order.localeCompare(clip_b.order, undefined, {
					numeric: true,
					sensitivity: 'base',
				}))
			return sequence
		})
		.sort((seq_a, seq_b) => seq_a.order.localeCompare(seq_b.order, undefined, {
			numeric: true,
			sensitivity: 'base',
		}))

	return { story }

}
