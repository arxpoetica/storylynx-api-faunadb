const { cms_query } = require('../../../loaders.js')

module.exports = async function({ story_id }) {

	const res = await cms_query(`query {
		sequences(orderBy: order_ASC, where: { parentStory: { id: "${story_id}" } }) {
			id
			title
			slug
			order
			clips(orderBy: order_ASC) {
				id
				slug
				order
			}
		}
	}`)

	return res
}
