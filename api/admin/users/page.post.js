import { cms_query } from '../../../loaders.js'

export const api = async function({ sort }) {

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
