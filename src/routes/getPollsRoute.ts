import { FastifyInstance } from "fastify";
import {z} from "zod"
import { prisma } from "../lib/prisma";

export async function getPoll (app: FastifyInstance) {
    // we must use async parameter whenever there`s an await promise inside the function
    // reply parameter can be used to inform more precise requests codes, in this case 201 os more suited than 200
    app.get('/polls/:pollId', async (request, reply) => {
        const getPollParams = z.object({
            pollId: z.string().cuid(),
        })

        const { pollId } = getPollParams.parse(request.params)

        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId,
            },
            include: {
                options: {select: {id: true,
                                   title: true,
                }}
            }
        }) 

        return reply.send({poll}) 
    })
}