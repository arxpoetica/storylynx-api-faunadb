const { red } = require('ansi-colors')
const { graphql } = require('../loaders.js')

module.exports.batch = async({ collection, items, parser, live_run, single }) => {

	const good_ids = []
	const error_ids = []

	if (single) {
		items = [items[0]]
	}

	let res
	for (let item of items) {
		try {
			const query = parser(item)
			if (live_run) {
				res = await graphql(query)
				if (res.error) {
					throw new Error(res.message)
				}
				if (!single) {
					console.log(res[`create${collection}`])
				}
			} else {
				console.log(query)
			}
			good_ids.push(item.id)
		} catch (error) {
			console.log(red('This one errored out:'), item.id)
			console.log(error)
			error_ids.push(item.id)
		}
	}

	if (single) {
		return res
	} else {
		console.log(' :: GOOD IDs :: =========== >>')
		console.log(JSON.stringify(good_ids))
		console.log(' :: BAD IDs  :: =========== >>')
		console.log(JSON.stringify(error_ids))

		console.log(' ::  INFO   :: =========== >>')
		const query = `
			mutation {
				createInfo(data: {
					collection: "${collection}"
					count: ${good_ids.length}
				}) {
					_id
					_ts
					collection
					count
				}
			}
		`
		if (live_run) {
			const { createInfo } = await graphql(query)
			console.log(createInfo)
		} else {
			console.log(query)
		}
	}
}
