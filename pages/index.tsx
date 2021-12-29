import type { NextPage } from 'next'
import { useState, useEffect, useRef, MutableRefObject, useCallback, BaseSyntheticEvent } from 'react'
import Head from 'next/head'
import { withSessionSsr } from 'lib/iron_config'
import styles from 'styles/home.module.scss'
import Sidebar from 'components/sidebar'
import Card from 'components/card'
import Search from 'components/search'
import type { Content } from 'components/card'
import { ContentType } from '@prisma/client'
import { GetTrending } from 'lib/api_functions'

interface Props {
	content_data: {
		page: number
		results: Array<Content>
		total_pages: number
		total_results: number
	}
	content_type: ContentType
}

const CONTENT_DIR = {
	MOVIE: 'Movies',
	TV: 'TV Series',
}

const Home: NextPage<Props> = ({ content_data, content_type }) => {
	const [contentData, setContentData] = useState(content_data.results)
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)

	let isMountRef = useRef(true)
	const isReadyRef = useRef(true)
	let contentListRef: MutableRefObject<HTMLUListElement | null> = useRef(null)

	// Update content on content type or search query change
	useEffect(() => {
		if (isMountRef.current) return
		fetch(`api/query?content_type=${content_type}&search_query=${searchQuery}`)
			.then(async (res) => {
				return await res.json()
			})
			.then(async (json) => {
				setContentData(json.results)
			})
	}, [content_type, searchQuery])

	useEffect(() => {
		isMountRef.current = false
	}, [])

	const AddContent = (page: number) => {
		fetch(`api/query?content_type=${content_type}&search_query=${searchQuery}&page=${page}`)
			.then(async (res) => {
				return await res.json()
			})
			.then(async ({ results }) => {
				console.log(results)
				setContentData([...contentData, ...results])
			})
	}

	const UpdateScroll = (e: BaseSyntheticEvent) => {
		if (!contentListRef.current) return

		const scrollContainer = contentListRef.current.parentElement as HTMLElement
		let lastChild = contentListRef.current.lastElementChild as HTMLElement

		if (scrollContainer.getBoundingClientRect().height + scrollContainer.scrollTop > lastChild.offsetTop && isReadyRef.current) {
			isReadyRef.current = false

			setTimeout(() => {
				isReadyRef.current = true
			}, 1000)

			AddContent(currentPage + 1)
			setCurrentPage(currentPage + 1)
			console.log('fire')
		}
	}

	return (
		<div>
			<Head>
				<title>EBase</title>
			</Head>
			<div className={styles.container}>
				<Sidebar />
				<main className={styles.main} onScroll={UpdateScroll}>
					<div className={styles.head}>
						<h1>{CONTENT_DIR[content_type]}</h1>
						<Search Search={setSearchQuery} />
					</div>
					<ul ref={contentListRef} className={styles['content-list']}>
						{contentData.map((content) => {
							return (
								<li key={content.id}>
									<Card content={content} contentType={content_type} />
								</li>
							)
						})}
					</ul>
					{/* <button onClick={LogOut}>Log Out</button> */}
				</main>
			</div>
		</div>
	)
}

export const getServerSideProps = withSessionSsr(async ({ req, query }) => {
	if (!req.session.user) {
		return {
			redirect: {
				permanent: false,
				destination: '/log-in',
			},
		}
	}

	const contentType = query.content_type ? query.content_type.toString() : 'movie'
	return { props: { content_data: await GetTrending(contentType), content_type: contentType.toUpperCase() } }
})

export default Home
