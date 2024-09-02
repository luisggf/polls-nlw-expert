import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function createPoll(app: FastifyInstance) {
  // we must use async parameter whenever there`s an await promise inside the function
  // reply parameter can be used to inform more precise requests codes, in this case 201 os more suited than 200
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      options: z.array(z.string()),
    });
    const { options } = createPollBody.parse(request.body);

    const poll = await prisma.poll.create({
      data: {
        options: {
          createMany: {
            data: options.map((obj) => {
              return { title: obj };
            }),
          },
        },
      },
    });

    return reply.status(201).send({ poll_id: poll.id });
  });
}
