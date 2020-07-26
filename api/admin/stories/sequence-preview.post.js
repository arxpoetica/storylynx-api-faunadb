// NOTE: this is identical to api/public/stories/single.post.js
// but it only pulls one clip, not all of them...
// other changes:
//  * removed navigation (not necessary)

const { cms_query } = require('../../../loaders.js')

module.exports = async function({ title, slug, clip_id }) {

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
			assets(orderBy: order_ASC) {
				id
				handle
				url
				source
				caption
				width: widthOverride
				height: heightOverride
				contain
				mime_type: mimeType
				bg_pos: backgroundPosition
				volume
				play_once: playOnce
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
	}`

	const { story } = await cms_query(`query {
		story(where: { title: "${title.toLowerCase()}" }) {
			id
			title
			slug
			sequences(where: { slug: "${slug}" }) {
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

	for (let audio_clip of story.sequence.audio_clips) {
		const volume = audio_clip.audio_asset.volume
		if (volume) {
			audio_clip.audio_asset.volume = Math.max(Math.min(volume / 10, 1), 0)
		}
	}

	return { story }

}
