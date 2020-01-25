const faunadb = require('faunadb')
const q = faunadb.query
var client = new faunadb.Client({
	secret: process.env.LYNX_FAUNADB_API_KEY,
	keepAlive: false,
})

module.exports = async() => {
	// const helper = client.paginate(q.Match(q.Index('Tags')), { size: 2 })
	// console.log(helper)
	// helper.each(page => {
	// 	console.log(page)
	// })

	// client.Map(
	// 	q.Paginate(
	// 		q.Match(
	// 			q.Index('tags')
	// 		)
	// 	),
	// 	q.Lambda('X', q.Get(q.Var('X')))
	// )

	// Map(
	// 	Paginate(Match(Index("all_letters")), { size: 3 }),
	// 	Lambda("X", Get(Var("X")))
	// )

}


// https://coderwall.com/p/lkcaag/pagination-you-re-probably-doing-it-wrong
