import { ReactElement } from 'react'
import styles from './styles.module.scss'

const GetRatingCircle = (fill: number): ReactElement => {
	let circle = <div></div>

	if (fill >= 1) {
		circle = (
			<svg viewBox='0 0 1 1' className={styles.filled}>
				<circle cx={0.5} cy={0.5} r={0.5} />
			</svg>
		)
	} else if (fill < 0) {
		circle = (
			<svg viewBox='0 0 1 1' className={styles.empty}>
				<circle cx={0.5} cy={0.5} r={0.5} />
			</svg>
		)
	} else {
		circle = (
			<>
				<svg viewBox='0 0 1 1' className={styles.empty}>
					<circle cx={0.5} cy={0.5} r={0.5} />
				</svg>
				<svg viewBox='0 0 1 1' className={styles.filled}>
					<mask id='myMask'>
						<circle cx={0.5} cy={0.5} r={0.5} fill='white' />
					</mask>
					<rect
						className={styles.filled}
						x={-0.5}
						y={0}
						width={1}
						height={1}
						transform='rotate(45, .5, .5)'
						mask='url(#myMask)'
					/>
				</svg>
			</>
		)
	}

	return <div key={fill} className={styles['circle-wrapper']}>{circle}</div>
}

const GetRatingCircles = (rating: number): ReactElement[] => {
	let circles: ReactElement[] = []

	for (let i = 0; i < 5; i++) {
		circles.push(GetRatingCircle(rating / 2 - i))
	}
	return circles
}
interface Props {
	rating: number
}

const Rating: React.FunctionComponent<Props> = ({ rating }) => {
	return <>{GetRatingCircles(rating)}</>
}

export default Rating
