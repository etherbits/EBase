import { ContentType } from '@prisma/client'
import { Content } from 'pages/view'
import Image from 'next/image'
import styles from './styles.module.scss'
import Rating from 'components/rating'
import { MinsToHHMM } from 'lib/helpers'
import AlarmIcon from 'public/icons/alarm_big.svg'
import EyeIcon from 'public/icons/eye_big.svg'
import CheckIcon from 'public/icons/check_big.svg'
import { SaveContent } from 'lib/api_functions'
import Link from 'next/link'

interface Props {
	contentList: Content[]
	type: ContentType
}

const ContentTable: React.FunctionComponent<Props> = ({ contentList, type }) => {
	return (
		// <div className={styles.item}>
		<ul className={styles.grid}>
			<li className={styles.row}>
				<span></span>
				<span>Title</span>
				<span>Rating</span>
				<span>Genres</span>
				<span>Runtime</span>
				<span>Release date</span>
				<span>Status</span>
				<span></span>
			</li>
			{contentList.map((content) => {
				return (
					<Link key={content.id} href={`/view?content_id=${content.id}&content_type=${type}`}>
						<a>
							<li className={styles.row}>
								<div className={styles['poster-wrapper']}>
									<Image
										className={styles.poster}
										src={
											content.poster_path
												? `https://image.tmdb.org/t/p/w400${content.poster_path}`
												: '/images/not_found.gif'
										}
										placeholder='blur'
										blurDataURL={
											content.poster_path
												? `https://image.tmdb.org/t/p/w400${content.poster_path}`
												: '/images/not_found.gif'
										}
										layout='intrinsic'
										width={50}
										height={75}
										quality={80}
										alt={`${content.title} poster`}
									/>
								</div>
								<div className={styles['title-col']}>
									<span>{type === 'MOVIE' ? content.title : content.name}</span>
								</div>
								<div>
									<div className={styles['rating-wrapper']}>
										<Rating rating={content.vote_average} />
									</div>
								</div>
								<div className={styles['genres-col']}>
									<ul className={styles.genres}>
										{content.genres.map((genre: any) => (
											<li key={genre.id}>{genre.name}</li>
										))}
									</ul>
								</div>
								<div>{MinsToHHMM(content.runtime ? content.runtime : content.episode_run_time)}</div>
								<div>
									<span>{type === 'MOVIE' ? content.release_date : content.first_air_date}</span>
								</div>
								<div>
									<span>{content.status}</span>
								</div>
								<div className={styles.actions}>
									<div
										className={styles.planning}
										onClick={(e) => {
											e.preventDefault()

											SaveContent(content.id, type, 'PLANNING')
											setTimeout(function () {
												window.location.reload()
											}, 20)
										}}>
										<AlarmIcon />
									</div>
									<div
										className={styles.watching}
										onClick={(e) => {
											e.preventDefault()

											SaveContent(content.id, type, 'WATCHING')
											setTimeout(function () {
												window.location.reload()
											}, 20)
										}}>
										<EyeIcon />
									</div>

									<div
										className={styles.completed}
										onClick={(e) => {
											e.preventDefault()

											SaveContent(content.id, type, 'COMPLETED')
											setTimeout(function () {
												window.location.reload()
											}, 20)
										}}>
										<CheckIcon />
									</div>
								</div>
							</li>
						</a>
					</Link>
				)
			})}
		</ul>
	)
}

export default ContentTable
