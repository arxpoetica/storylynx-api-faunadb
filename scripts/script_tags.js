const { green } = require('ansi-colors')
const { batch } = require('./_tools.js')
const tags = require('./original_tags.js')

module.exports = async(live_run) => {

	console.log(green('\n========== >>> CREATING ALL TAGS\n'))

	await batch({
		collection: 'Tag',
		items: tags,
		parser: tag => `mutation {
			createTag(data: {
				old_id: "${tag.id}"
				name: "${tag.name}"
			}) {
				_id
				_ts
				old_id
				name
				asset_groups { data { title } }
				posts { data { headline } }
			}
		}`,
		live_run,
	})

}
