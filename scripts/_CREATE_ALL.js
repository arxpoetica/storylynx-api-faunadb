const { green, yellow } = require('ansi-colors')

const tags_batch = require('./script_tags')
const assets_batch = require('./script_assets')
const assetgroups_batch = require('./script_assetgroups')
const posts_batch = require('./script_posts')

module.exports = async(live_run) => {

	console.log()
	if (live_run) {
		console.log(yellow('================================================== >>>'))
		console.log(yellow('================================================== >>> LIVE RUN!!!'))
		console.log(yellow('================================================== >>>'))
	} else {
		console.log(green('================================================== >>>'))
		console.log(green('================================================== >>> DRY RUN'))
		console.log(green('================================================== >>>'))
	}
	console.log()

	await tags_batch(live_run)
	await assets_batch(live_run)
	await assetgroups_batch(live_run)
	await posts_batch(live_run)

}
