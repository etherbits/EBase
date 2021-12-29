import Link from 'next/link'
import FilmIcon from '/public/icons/film.svg'
import TvIcon from '/public/icons/tv.svg'
import ListIcon from '/public/icons/list.svg'
import UserIcon from '/public/icons/user.svg'
import styles from './styles.module.scss'
import { useState } from 'react'

const LogOut = () => {
	fetch('api/log-out', { method: 'POST' })
}

const Sidebar: React.FunctionComponent = () => {
	const [isMenuVisible, setIsMenuVisible] = useState(false)

	return (
		<aside className={styles.sidebar}>
			<nav className={styles['navigation']}>
				<div className={styles['top']}>
					<Link href='/?content_type=movie'>
						<a>
							<FilmIcon />
						</a>
					</Link>
					<Link href='/?content_type=tv'>
						<a>
							<TvIcon />
						</a>
					</Link>
					<Link href='/list?content_type=movie&content_state=planning'>
						<a>
							<ListIcon />
						</a>
					</Link>
				</div>
				<div className={styles['bottom']}>
					<div className={styles['user-wrapper']}>
						<button
							className={styles['user-button']}
							onClick={() => {
								setIsMenuVisible(!isMenuVisible)
							}}>
							<UserIcon />
						</button>
						<button
							className={styles['log-out']}
							is-visible={isMenuVisible.toString()}
							onClick={() => {
								LogOut()
								setTimeout(function () {
									window.location.reload()
								}, 200)
							}}>
							Log out
						</button>
					</div>
				</div>
			</nav>
		</aside>
	)
}

export default Sidebar
