import { withIronSessionApiRoute } from 'iron-session/next'
import { withSessionRoute } from 'lib/iron_config'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'lib/prisma_client'
import argon2 from 'argon2'
import { argon2Config } from 'lib/auth_config'
import { IronSession } from 'iron-session'

const handler: NextApiHandler = async (req, res): Promise<any> => {
	if (req.method !== 'POST') return res.status(405).send('Method not allowed')
	req.session.destroy()
	return res.status(302).redirect('/')
}

export default withSessionRoute(handler)
