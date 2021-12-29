import type { NextPage } from 'next'
import Head from 'next/head'
import { prisma } from 'lib/prisma_client'
import { withSessionSsr } from 'lib/iron_config'
import { ContentState, ContentType } from '@prisma/client'
import { Content } from './view'
import ContentTable from 'components/content_table'
import Sidebar from 'components/sidebar'
import styles from 'styles/list.module.scss'
import Link from 'next/link'
import { useEffect, useState } from 'react'
const stateDict = {
	PLANNING: 0,
	WATCHING: 1,
	COMPLETED: 2,
}

const contentDict = {
	MOVIE: 'Movies',
	TV: 'TV Series',
}

interface Props {
	contentList: Content[]
	type: ContentType
	state: ContentState
}

const List: NextPage<Props> = ({ contentList, type, state }) => {
	return (
		<div className={styles.page}>
			<Head>
				<title>EBase List</title>
				<meta name='EBase' content='EBase' />
			</Head>
			<Sidebar />
			<main className={styles.main}>
				<div className={styles.head}>
					<div className={styles.types}>
						<Link href={`/list?content_type=movie&content_state=${state}`}>
							<a active-type={type === 'MOVIE' ? 'true' : 'false'}>Movies</a>
						</Link>
						<Link href={`/list?content_type=tv&content_state=${state}`}>
							<a active-type={type === 'TV' ? 'true' : 'false'}>TV series</a>
						</Link>
					</div>
					<div className={styles.states}>
						<Link href={`/list?content_type=${type}&content_state=planning`}>
							<a active-state={state === 'PLANNING' ? 'true' : 'false'}>Planning</a>
						</Link>
						<Link href={`/list?content_type=${type}&content_state=watching`}>
							<a active-state={state === 'WATCHING' ? 'true' : 'false'}>Watching</a>
						</Link>
						<Link href={`/list?content_type=${type}&content_state=completed`}>
							<a active-state={state === 'COMPLETED' ? 'true' : 'false'}>Completed</a>
						</Link>
					</div>
				</div>
				<ContentTable contentList={contentList} type={type} />
			</main>
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

	const contentType = query.content_type ? query.content_type.toString() : ''
	const contentState = query.content_state ? query.content_state.toString() : ''

	const contentTypeUpper = contentType.toUpperCase()
	const contentStateUpper = contentState.toUpperCase()

	console.log(contentTypeUpper, contentStateUpper)

	let userContentData: any[] = []

	if (
		!(
			(contentTypeUpper === ContentType.MOVIE || contentTypeUpper === ContentType.TV) &&
			(contentStateUpper === ContentState.PLANNING ||
				contentStateUpper === ContentState.WATCHING ||
				contentStateUpper === ContentState.COMPLETED)
		)
	) {
		return { notFound: true }
	}

	const userContent = await prisma.content.findMany({
		where: {
			userId: req.session.user.id,
			state: contentStateUpper,
		},
	})

	for (let content of userContent) {
		if (content.type !== contentTypeUpper) continue

		await fetch(`https://api.themoviedb.org/3/${contentType.toLowerCase()}/${content.contentId}?language=en-US&api_key=${process.env.MOVIE_DB_API}`)
			.then(async (res) => {
				if (!res.ok) return
				return await res.json()
			})
			.then((json) => {
				userContentData.push(json)
			})
	}

	return { props: { contentList: userContentData, type: contentTypeUpper, state: contentStateUpper } }
})

export default List
