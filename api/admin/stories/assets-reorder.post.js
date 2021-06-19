import { EOL } from 'os'
import { cms_mutate } from '../../../loaders.js'

export const api = async function({ asset_changes }) {

	const mutation = `mutation {
		${asset_changes.map(({ id, order }) => `
			story_asset_${id}: updateStoryAsset(where: { id: "${id}" } data: { order: ${order} }) { id order }
		`).join(EOL)}
	}`

	return await cms_mutate(mutation)

}
