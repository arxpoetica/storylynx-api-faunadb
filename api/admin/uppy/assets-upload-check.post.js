import { EOL } from 'os'
import { cms_query } from '../../../loaders.js'

export const api = async function({ filenames }) {

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
