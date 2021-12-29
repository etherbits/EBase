import { withSessionRoute } from 'lib/iron_config'
import type { NextApiHandler } from 'next'
import { prisma } from 'lib/prisma_client'
import { verify } from 'argon2'

const handler: NextApiHandler = async (req, res): Promise<any> => {
	if (req.method !== 'POST') return res.status(405).send('Method not allowed')
	const { username, password } = req.body
	if (!(username && password)) {
		console.log(username, password)
		return res.status(200).send('Invalid registration data')
	}

	const user = await prisma.user.findUnique({
		where: {
			username: username
		},
		select: {
			id: true,
			hash: true
		}
	})

	if (!user) return res.status(401).send("No user exists with the given username")

	try {
		if (!(await verify(user.hash, password.normalize()))) {
			return res.status(401).send("Incorrect password")
		}
	} catch (err) {
		return res.status(500).send('Internal server error')
	}

	req.session.user = {
		id: user.id
	}


	await req.session.save()

	return res.status(302).redirect('/')
}

export default withSessionRoute(handler)
