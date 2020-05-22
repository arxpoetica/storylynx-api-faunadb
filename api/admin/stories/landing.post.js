const { cms_query } = require('../../../loaders.js')

module.exports = async function() {
	return await cms_query(`query {
		stories(orderBy: title_ASC) {
			id
			title
			slug
			sequences(orderBy: order_ASC) {
				id
				slug
				order
			}
		}
	}`)

}
