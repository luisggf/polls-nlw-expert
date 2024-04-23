import fastify from "fastify";
import { PrismaClient } from "@prisma/client"
import {z} from "zod"

const app = fastify()

const prisma = new PrismaClient()

// we must use async parameter whenever there`s an await promise inside the function
// reply parameter can be used to inform more precise requests codes, in this case 201 os more suited than 200
app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string()
  })
  const { title } = createPollBody.parse(request.body)
  const poll = await prisma.poll.create({
    data: {
      title,
    }
  }) 
  console.log("Funciona")
  return reply.status(201).send({poll_id: poll.id})
})


app.listen({port : 3333}).then(()=>{
  console.log('HTTP Running')
})