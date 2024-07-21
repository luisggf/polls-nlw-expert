import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

export async function getAllPolls(app: FastifyInstance) {
  app.get("/all-polls", async (request, reply) => {
    try {
      const polls = await prisma.poll.findMany({
        include: {
          options: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      const pollsWithScores = await Promise.all(
        polls.map(async (poll) => {
          const result = await redis.zrange(poll.id, 0, -1, "WITHSCORES");

          const votes = result.reduce((obj, line, index) => {
            if (index % 2 === 0) {
              const score = result[index + 1];
              Object.assign(obj, { [line]: Number(score) });
            }
            return obj;
          }, {} as Record<string, number>);

          return {
            id: poll.id,
            title: poll.title,
            options: poll.options.map((option) => ({
              id: option.id,
              title: option.title,
              score: votes[option.id] || 0,
            })),
          };
        })
      );

      return reply.send(pollsWithScores);
    } catch (error) {
      console.error("Error fetching polls:", error);
      return reply.status(500).send({ error: "Failed to fetch polls" });
    }
  });
}
