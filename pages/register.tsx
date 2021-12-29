import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import styles from '/styles/auth.module.scss'
import { withSessionSsr } from 'lib/iron_config'
const Register: NextPage = () => {
	return (
		<div>
			<Head>
				<title>EBase Register</title>
				<meta name='EBase' content='EBase' />
			</Head>
			<main className={styles.container}>
				<span className={styles.logo}>
					<span>E</span>BASE
				</span>
				<form className={styles.form} method='POST' action='/api/register'>
					<span className={styles.title}>Register</span>
					<label>
						Username
						<input name='username' placeholder='username' type='text' autoComplete='username' />
					</label>

					<label>
						Password
						<input name='password1' placeholder='password' type='password' autoComplete='new-password' minLength={6}/>
					</label>

					<label> 
						Confirm Password
						<input name='password2' placeholder='password' type='password' />
					</label>
					<div className={styles['button-container']}>
						<button type='submit'>Register</button>
						<Link href='/log-in'>
							<a className={styles.redirect}>Log In</a>
						</Link>
					</div>
				</form>
			</main>
		</div>
	)
}

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
	console.log(req.session.user)
	if (req.session.user) {
		return {
			redirect: {
				permanent: false,
				destination: '/',
			},
		}
	}
	return { props: {} }
})

export default Register
