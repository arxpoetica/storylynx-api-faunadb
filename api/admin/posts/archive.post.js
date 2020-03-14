const { cms_mutate } = require('../../../loaders.js')

module.exports = async function({ ids }) {

	const concatenatedIds = ids.map(id => `"${id}"`).join(', ')
	const mutation = `
		mutation {
			updateManyArticles(
				where: { id_in: [${concatenatedIds}] }
				data: { status: ARCHIVED }
			) { count }
		}
	`
	const answer = await cms_mutate(mutation)
	
	return { answer }

}
