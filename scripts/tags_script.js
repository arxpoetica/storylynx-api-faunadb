const { batch } = require('./_tools.js')
const tags = require('./tags.js')

batch({
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
			assets { data { mime_type } }
			posts { data { headline } }
		}
	}`,
	// live_run: true,
})
