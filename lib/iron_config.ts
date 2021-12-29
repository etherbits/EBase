import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'

declare module 'iron-session' {
	interface IronSessionData {
		user?: {
			id: number
		}
	}
}

const sessionOptions = {
	cookieName: 'ebase_cookie',
	password: process.env.COOKIE_PASS ?? 'V5kW3RxFBqWdAY5JwbeKKHuNta4pTQxu',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
}

const withSessionRoute = (handler: NextApiHandler) => {
	return withIronSessionApiRoute(handler, sessionOptions)
}

const withSessionSsr = <P extends { [key: string]: unknown } = { [key: string]: unknown }>(
	handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => {
	return withIronSessionSsr(handler, sessionOptions)
}

export { withSessionRoute, withSessionSsr }
