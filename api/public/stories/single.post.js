const { cms_query } = require('../../../loaders.js')
const { merge_asset } = require('../../../utils.js')

module.exports = async function({ story_slug, sequence_slug }) {

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
				clips(where: { hideClip: false }, orderBy: order_ASC) {
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
							link
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
			navigation: sequences(where: { hideSequence: false }, orderBy: order_ASC) {
				title
				slug
				hide_navigation: hideNavigation
				order
				subnavigation: clips(where: { hideClip: false }, orderBy: order_ASC) {
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
