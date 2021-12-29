import { ContentState, ContentType } from "types";

const SaveContent = (content_id: number, content_type: ContentType, content_state: ContentState) => {
	fetch(`api/save-content?content_id=${content_id}&content_type=${content_type}&content_state=${content_state}`, { method: 'POST' }).then(
		(res) => {
			if (res.ok) console.log('saved')
		}
	)
}
const GetTrending = async (contentType: string, page = 1) => {
	return fetch(`https://api.themoviedb.org/3/trending/${contentType.toLowerCase()}/week?api_key=${process.env.MOVIE_DB_API}&page=${page}`)
			.then(async (res) => {
				return await res.json()
			})
}

export { SaveContent, GetTrending }