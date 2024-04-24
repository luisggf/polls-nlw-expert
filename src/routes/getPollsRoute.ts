import { FastifyInstance } from "fastify";
import {number, object, z} from "zod"
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

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

        if (!poll){
            return reply.status(400).send({message: "Couldn't get the requested poll!"})
        }
        const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')

        // reduce function converts objects of different types into the type necessary, in this case, we're assigning each obj from reduce as a dict(string, int) type 
        const votes = result.reduce((obj, line, index) => {
            if (index % 2 === 0){
                const score = result[index + 1]
                Object.assign(obj, {[line]: Number(score)})
                
            }
            return obj}, {} as Record<string, number>)
        
        return reply.send({poll: {
            id: poll.id,
            title: poll.title,
            options: poll.options.map(options => {
                return {
                    id: options.id,
                    title: options.title,
                    score: (options.id in votes) ? votes[options.id] : 0
                }
            
            })
        }}) 
    })
}