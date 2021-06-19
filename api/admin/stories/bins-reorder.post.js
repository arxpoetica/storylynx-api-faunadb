import { EOL } from 'os'
import { cms_mutate } from '../../../loaders.js'

export const api = async function({ bin_changes }) {
	const mutation = `mutation {
		${bin_changes.map(({ id, order }) => `
			bin_${id}: updateAssetsBin(where: { id: "${id}" } data: { order: ${order} }) { id order }
		`).join(EOL)}
	}`

	return await cms_mutate(mutation)
}
