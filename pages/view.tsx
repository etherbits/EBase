import { NextPage } from 'next'
import { withSessionSsr } from 'lib/iron_config'
import { useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import styles from 'styles/view.module.scss'
import Rating from 'components/rating'
import { MinsToHHMM } from 'lib/helpers'
import Sidebar from 'components/sidebar'
import { prisma } from 'lib/prisma_client'
import { ContentType, ContentState } from 'types'
import { SaveContent } from 'lib/api_functions'

export type Content = {
	id: number
	title?: string
	name?: string
	overview: string
	release_date?: string
	first_air_date?: string
	poster_path?: string
	vote_average: number
	status?: string
	runtime: number
	episode_run_time: number
	number_of_episodes: number
	number_of_seasons: number
	budget: number
	revenue: number
	production_companies: string[]
	genres: string[]
}

interface Props {
	content: Content
	type: ContentType
	state: ContentState | null
}

// fix types btw

const View: NextPage<Props> = ({ content, type, state }) => {
	const [contentState, setContentState] = useState<ContentState | null>(state)

	const UpdateContentState = (contentState: ContentState) => {
		setContentState(contentState)
		SaveContent(content.id, type, contentState)
	}

	return (
		<div className={styles.page}>
			<Head>
				<title>EBase</title>
			</Head>
			<div>
				<Sidebar />
			</div>
			<div className={styles.container}>
				<div className={styles['content-wrapper']}>
					<main className={styles.card}>
						{content ? (
							<>
								<div className={styles.left}>
									<div className={styles['poster-wrapper']}>
										<Image
											className={styles.poster}
											src={
												content.poster_path
													? `https://image.tmdb.org/t/p/w780${content.poster_path}`
													: '/images/not_found.gif'
											}
											placeholder='blur'
											blurDataURL={
												content.poster_path
													? `https://image.tmdb.org/t/p/w400${content.poster_path}`
													: '/images/not_found.gif'
											}
											layout='intrinsic'
											width={720}
											height={1080}
											quality={80}
											alt={`${content.title} poster`}
										/>
									</div>
									<div className={styles['rating-wrapper']}>
										<Rating rating={content.vote_average} />
									</div>
								</div>
								<div className={styles.right}>
									<h1>{content.title ? content.title : content.name}</h1>
									<p>{content.overview}</p>
									<span>Status: {content.status}</span>
									<span>Length: {MinsToHHMM(content.runtime ? content.runtime : content.episode_run_time)}</span>
									<span>Release Date: {content.release_date ? content.release_date : content.first_air_date}</span>
									{content.number_of_episodes && <span>Episode Count: {content.number_of_episodes}</span>}
									{content.number_of_seasons && <span>Season Count: {content.number_of_seasons}</span>}
									{content.budget && <span>Budget: ${content.budget}</span>}
									{content.revenue && <span>Revenue: ${content.revenue}</span>}
									{content.production_companies.length > 0 && (
										<span>
											Companies: {content.production_companies.map((company: any) => company.name).join(', ')}
										</span>
									)}
									<ul className={styles.genres}>
										{content.genres.map((genre: any) => (
											<li key={genre.id}>{genre.name}</li>
										))}
									</ul>
								</div>
							</>
						) : (
							<h1 style={{ margin: '0 auto' }}>Content not found</h1>
						)}
					</main>
					<div className={styles['action-bar']}>
						<div
							className={styles.action}
							onClick={() => {
								UpdateContentState('PLANNING')
							}}>
							<span>Plan on watching</span>
							<div
								className={styles['planning-check']}
								currently-active={(contentState === ContentState.PLANNING).toString()}></div>
						</div>
						<div
							className={styles.action}
							onClick={() => {
								UpdateContentState('WATCHING')
							}}>
							<span>Currently watching</span>
							<div
								className={styles['watching-check']}
								currently-active={(contentState === ContentState.WATCHING).toString()}></div>
						</div>
						<div
							className={styles.action}
							onClick={() => {
								UpdateContentState('COMPLETED')
							}}>
							<span>Completed watching</span>
							<div
								className={styles['completed-check']}
								currently-active={(contentState === ContentState.COMPLETED).toString()}></div>
						</div>
					</div>
				</div>
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

	const contentId = query.content_id ? query.content_id.toString() : ''
	const contentType = query.content_type ? query.content_type.toString() : ''

	const contentTypeUpper = contentType.toUpperCase()
	const contentTypeLower = contentType.toLowerCase()

	let content = null
	let contentState: ContentState | null = null

	if (contentId && (contentTypeUpper === ContentType.MOVIE || contentTypeUpper === ContentType.TV)) {
		const savedContent = await prisma.content.findFirst({
			where: {
				userId: req.session.user.id,
				contentId: parseInt(contentId),
				type: contentTypeUpper,
			},
			select: {
				state: true,
			},
		})

		if (savedContent) {
			contentState = savedContent.state
		}

		await fetch(`https://api.themoviedb.org/3/${contentTypeLower}/${contentId}?language=en-US&api_key=${process.env.MOVIE_DB_API}`)
			.then(async (res) => {
				if (!res.ok) return
				return await res.json()
			})
			.then(async (json) => {
				content = json
			})
	}

	return { props: { content, type: contentTypeUpper, state: contentState } }
})

export default View
