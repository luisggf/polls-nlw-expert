import { FastifyInstance } from "fastify";
import {z} from "zod"
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

export async function voteOnPollRoute (app: FastifyInstance) {
    // we must use async parameter whenever there`s an await promise inside the function
    // reply parameter can be used to inform more precise requests codes, in this case 201 os more suited than 200
    app.post('/polls/:pollId/votes', async (request, reply) => {
        const VoteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        })

        const VoteOnPollParams = z.object({
            pollId: z.string().cuid()
        })
        const { pollId } = VoteOnPollParams.parse(request.params)
        const { pollOptionId } = VoteOnPollBody.parse(request.body)

        let {sessionId} = request.cookies

        if (!sessionId){
            sessionId = randomUUID()
            
            reply.setCookie("sessionId", sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                signed: true,
                httpOnly: true
            })
        }

        const userPreviousVote = await prisma.vote.findUnique({
            where: {
                sessionId_pollId: {
                    sessionId,
                    pollId,
                }
            }
        })

        if (userPreviousVote && userPreviousVote.pollOptionId != pollOptionId){
            // delete the previous vote and rewrite the new vote
            await prisma.vote.delete({
                where: {
                    id: userPreviousVote.id
                }
            })
        } else if (userPreviousVote){
            return reply.status(400).send({message: "User already voted at this poll!"})
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId
            }
        })
        
        return reply.send({sessionId}) 
    })
}