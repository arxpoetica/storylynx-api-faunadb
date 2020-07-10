const { cms_query } = require('../../../loaders.js')

module.exports = async function() {
	const res = await cms_query(`query {
		stories(orderBy: title_ASC) {
			id
			title
			slug
			sequences(orderBy: order_ASC) {
				id
				slug
				order
				clips {
					assetBins {
						assets(where: { mimeType_contains: "image" }, first: 1) {
							mimeType
							handle
						}
					}
				}
			}
		}
	}`)

	res.stories = res.stories.map(story => {
		story.sequences = story.sequences.map(seq => {
			const clip = seq.clips.find(clip => {
				return clip.assetBins.find(bin => {
					return bin.assets.find(asset => asset.mimeType.includes('image'))
				})
			})
			seq.asset = clip ? clip.assetBins[0].assets[0] : null
			delete seq.clips
			return seq
		})
		return story
	})

	return res
}
