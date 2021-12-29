import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import { Genres, ContentType } from 'types'
import AlarmIcon from 'public/icons/alarm.svg'
import EyeIcon from 'public/icons/eye.svg'
import CheckIcon from 'public/icons/check.svg'
import Rating from 'components/rating'
import { SaveContent } from 'lib/api_functions'

export type Content = {
	id: number
	title?: string
	original_title?: string
	name?: string
	overview: string
	release_date?: string
	first_air_date?: string
	poster_path?: string
	vote_average: number
	media_type: 'movie' | 'tv'
	genre_ids: Array<number>
}

interface Props {
	content: Content
	contentType: ContentType
}

const Card: React.FunctionComponent<Props> = ({ content, contentType }) => {
	return (
		<div key={content.id} className={styles.card}>
			<Link href={`/view?content_id=${content.id}&content_type=${contentType}`}>
				<a>
					<div className={styles['image-wrapper']}>
						<Image
							className={styles.poster}
							src={content.poster_path ? `https://image.tmdb.org/t/p/w400${content.poster_path}` : '/images/not_found.gif'}
							placeholder='blur'
							blurDataURL={
								content.poster_path ? `https://image.tmdb.org/t/p/w200${content.poster_path}` : '/images/not_found.gif'
							}
							layout='intrinsic'
							width={600}
							height={900}
							quality={80}
							alt={`${content.title} poster`}
						/>
					</div>
					<div className={styles.overlay}>
						<div className={styles['rating-wrapper']}>{<Rating rating={content.vote_average} />}</div>
						<div className={styles.details}>
							<h3 lang='en' className={styles.title}>
								{content.media_type === 'movie'
									? content.title
									: content.original_title
									? content.original_title
									: content.name}
							</h3>
							<span className={styles.genre}>
								Genre:
								{content.genre_ids.map((genre_id) => {
									return <span key={genre_id}> {Genres[genre_id]}</span>
								})}
							</span>
							<span className={styles.release}>
								Release date: {content.release_date ? content.release_date : content.first_air_date}
							</span>
						</div>
					</div>
					<div className={styles['action-wrapper']}>
						<div
							className={styles.planning}
							onClick={(e) => {
								e.preventDefault()

								SaveContent(content.id, contentType, 'PLANNING')
							}}>
							<AlarmIcon />
						</div>
						<div
							className={styles.watching}
							onClick={(e) => {
								e.preventDefault()

								SaveContent(content.id, contentType, 'WATCHING')
							}}>
							<EyeIcon />
						</div>
						<div
							className={styles.completed}
							onClick={(e) => {
								e.preventDefault()

								SaveContent(content.id, contentType, 'COMPLETED')
							}}>
							<CheckIcon />
						</div>
					</div>
				</a>
			</Link>
		</div>
	)
}

export default Card
