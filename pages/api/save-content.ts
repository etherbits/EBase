import { withSessionRoute } from 'lib/iron_config'
import type { NextApiHandler } from 'next'
import { prisma } from 'lib/prisma_client'
import {  ContentState, ContentType } from 'types'

const handler: NextApiHandler = async (req, res): Promise<any> => {
	if (req.method !== 'POST') return res.status(405).send('Method not allowed')

	if (!req.session.user) return res.status(401).send("Missing authentication")

	const contentId = req.query.content_id.toString()
	const type = req.query.content_type.toString()
	const state = req.query.content_state.toString()

	console.log(contentId, type, state)

	if (!(contentId && type && state) || (type !== ContentType.MOVIE && type !== ContentType.TV)
		|| (state !== ContentState.PLANNING && state !== ContentState.WATCHING && state !== ContentState.COMPLETED)) {
		return res.status(500).send("Internal server error")
	}

	const content = await prisma.content.findFirst({
		where: {
			contentId: parseInt(contentId),
			userId: req.session.user.id
		}
	})

	if (content) {
		await prisma.content.update({
			where: {
				id: content.id
			},
			data: {
				state: state
			}
		})
	}
	else {
		await prisma.content.create({
			data: {
				contentId: parseInt(contentId),
				type: type,
				state: state,
				userId: req.session.user.id
			}
		})
	}

	res.send({ ok: true });
}

export default withSessionRoute(handler)
