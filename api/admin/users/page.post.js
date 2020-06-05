const { cms_query } = require('../../../loaders.js')

module.exports = async function({ sort }) {

	const { items, accountsConnection } = await cms_query(`{
		items: accounts(orderBy: username_${sort.toUpperCase()}) {
			username
			role
			first
			last
			avatar { url caption handle }
		}
		accountsConnection { aggregate { count } }
	}`)
	return { items, items_count: accountsConnection.aggregate.count }

}
