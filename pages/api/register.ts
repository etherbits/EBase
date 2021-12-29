import { withSessionRoute } from 'lib/iron_config'
import type { NextApiHandler } from 'next'
import { prisma } from 'lib/prisma_client'
import argon2 from 'argon2'
import { argon2Config } from 'lib/auth_config'

const handler: NextApiHandler = async (req, res): Promise<any> => {
	if (req.method !== 'POST') return res.status(405).send('Method not allowed')
	const { username, password1, password2 } = req.body



	if (!(username && password1 && password2)) {
		return res.status(401).send('Invalid registration data')
	}

	if (password1.length < 6) {
		return res.status(401).send('Password must be at least 6 characters long')
	}

	if (password1 !== password2) {
		return res.status(401).send('Passwords do not match')
	}


	const user = await prisma.user.findUnique({
		where: {
			username: username
		}
	})

	if (user) {
		return res.status(401).send('User with the given name already exists')
	}

	new Promise<string>(async (resolve, reject) => {
		try {
			resolve(await argon2.hash(password1, argon2Config))
		} catch (err) {
			reject(Error('Hashing problem'))
		}
	})
		.then(async (hash) => {
			const { id } = await prisma.user.create({
				data: {
					username: username,
					hash: hash,
				},
				select: {
					id: true,
				},
			})
			req.session.user = { id: id }
			await req.session.save()
		})
		.then(() => {
			return res.status(302).redirect('/')
		})
		.catch((err) => {
			return res.status(500).send('something went wrong')
		})
}

export default withSessionRoute(handler)
