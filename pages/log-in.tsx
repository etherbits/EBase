import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import styles from '/styles/auth.module.scss'
import { withSessionSsr } from 'lib/iron_config'
const LogIn: NextPage = () => {
	return (
		<div>
			<Head>
				<title>EBase Log In</title>
				<meta name='EBase' content='EBase' />
			</Head>
			<main className={styles.container}>
				<span className={styles.logo}>
					<span>E</span>BASE
				</span>
				<form className={styles.form} method='POST' action='api/log-in'>
					<span className={styles.title}>LOG IN</span>
					<label>
						Username
						<input name='username' placeholder='username' type='text' />
					</label>

					<label>
						Password
						<input name='password' placeholder='password' type='password' />
					</label>
					<div className={styles['button-container']}>
						<button type='submit'>LOG IN</button>
						<Link href='/register'>
							<a className={styles.redirect}>REGISTER</a>
						</Link>
					</div>
				</form>
			</main>
		</div>
	)
}

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
	if (req.session.user) {
		return { redirect: {
			permanent: false,
			destination: "/"
		}}
	}
	return { props: {} }
})

export default LogIn
