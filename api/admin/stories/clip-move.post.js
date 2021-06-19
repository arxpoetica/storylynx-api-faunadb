import { cms_mutate } from '../../../loaders.js'

export const api = async function({ id, order, parent_id }) {

	const mutation = `
		mutation {
			updated_clip: updateClip(
				where: { id: "${id}" }
				data: {
					order: ${order}
					parentSequence: { connect: { id: "${parent_id}" } }
				}
			) {
				id
				order
			}
		}
	`
	return await cms_mutate(mutation)

}
