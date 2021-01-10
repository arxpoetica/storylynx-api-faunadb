const { EOL } = require('os')
const { cms_query } = require('../../../loaders.js')

module.exports = async function({ filenames }) {

	const query = `{
  		assets: assetsConnection(where: {
			OR: [
				${filenames.map(name => `{ fileName: "${name}" }` + EOL)}
			]
		}) { aggregate { count } }
	}`

	const { assets } = await cms_query(query)
	return { count: assets.aggregate.count }

}
