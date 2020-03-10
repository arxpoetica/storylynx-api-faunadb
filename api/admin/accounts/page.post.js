const { cms_query } = require('../../../loaders.js')

module.exports = async function({ sort }) {

	const { items, accountsConnection } = await cms_query(`{
		items: accounts(orderBy: username_${sort.toUpperCase()}) {
			username
			role
			firstName
			lastName
			avatar { url summary handle }
		}
		accountsConnection { aggregate {count} }
	}`)
	return { items, itemsCount: accountsConnection.aggregate.count }

}
