import { EOL } from 'os'
import { cms_mutate } from '../../../loaders.js'

export const api = async function({ clip_changes }) {

	const mutation = `mutation {
		${clip_changes.map(({ id, order }) => `
			clip_${id}: updateClip(where: { id: "${id}" } data: { order: ${order} }) { id order }
		`).join(EOL)}
	}`

	return await cms_mutate(mutation)

}
