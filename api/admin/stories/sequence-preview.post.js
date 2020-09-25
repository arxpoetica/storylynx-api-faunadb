// NOTE: this is identical to api/public/stories/single.post.js
// but it only pulls one clip, not all of them...
// other changes:
//  * removed navigation (not necessary)

const { cms_query } = require('../../../loaders.js')
const { merge_asset } = require('../../../utils.js')

module.exports = async function({ story_slug, sequence_slug, clip_id }) {

	const clip_query = `{
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
			assets: storyAssets(orderBy: order_ASC) {
				id
				asset {
					id
					handle
					url
					mime_type: mimeType
				}
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
				html
			}
			# links // NOTE: will use in the near future for vimeo, etc.
			transition
		}
		audio_clips: parentAudioClips(where: { parentSequence: { id_not: null } }) {
			id
			audio_asset: audioAsset { mime_type: mimeType }
			clips_in_range: clipsInRange(orderBy: order_ASC) { id }
			# TODO: throw a transition on the audio clips????
			# transition
		}
	}`

	const { story } = await cms_query(`query {
		story(where: { slug: "${story_slug}" }) {
			id
			title
			slug
			sequences(where: { slug: "${sequence_slug}" }) {
				id
				title
				slug
				order
				clip_1: clips(before: "${clip_id}", orderBy: order_ASC, last: 1) ${clip_query}
				clip_2: clips(where: { id: "${clip_id}" }, orderBy: order_ASC) ${clip_query}
				clip_3: clips(after: "${clip_id}", orderBy: order_ASC, first: 1) ${clip_query}
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
			navigation: sequences(orderBy: order_ASC) {
				title
				slug
				hide_navigation: hideNavigation
				order
				subnavigation: clips(orderBy: order_ASC) {
					slug
					hide_navigation: hideNavigation
					order
				}
			}
		}
	}`)

	// FIXME: I'd really like to have a way to cache all of this...
	// TODO: how deep will this go? fine for now
	story.sequence = story.sequences[0]
	delete story.sequences

	story.sequence.clips = [].concat(story.sequence.clip_1, story.sequence.clip_2, story.sequence.clip_3)
	delete story.sequence.clip_1
	delete story.sequence.clip_2
	delete story.sequence.clip_3

	story.sequence.clips = story.sequence.clips.map(clip => {
		clip.template = clip.template || 'Column1'
		clip.asset_bins = clip.asset_bins.map(bin => {
			bin.assets = bin.assets.map(merge_asset)
			return bin
		})
		return clip
	})

	for (let audio_clip of story.sequence.audio_clips) {
		const volume = audio_clip.audio_asset.volume
		if (volume) {
			audio_clip.audio_asset.volume = Math.max(Math.min(volume / 10, 1), 0)
		}
	}

	return { story }

}
