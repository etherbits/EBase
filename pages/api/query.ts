import { withSessionRoute } from 'lib/iron_config'
import type { NextApiHandler } from 'next'
import { ContentType } from 'types'

const handler: NextApiHandler = async (req, res): Promise<any> => {
	if (req.method !== 'GET') return res.status(405).send('Method not allowed')

	if (!req.session.user) return res.status(401).send("Missing authentication")

	let type = req.query.content_type
	const searchQuery = req.query.search_query
	const page = req.query.page ? req.query.page : 1

	if (type !== ContentType.MOVIE && type !== ContentType.TV) {
		return res.status(500).send("Internal server error")
	}

	type = type.toLowerCase()
	await fetch((searchQuery === "" ?
		`https://api.themoviedb.org/3/trending/${type}/week?page=${page}&`
		: `https://api.themoviedb.org/3/search/${type}?query=${searchQuery}&include_adult=false&page=${page}&`)
		+ `api_key=${process.env.MOVIE_DB_API}`)
		.then(async (res) => {
			return await res.json()
		})
		.then(async (json) => {
			return res.send(json);
		})

}

export default withSessionRoute(handler)
