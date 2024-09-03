import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

export async function getPolls(app: FastifyInstance) {
  app.get("/polls-scroll", async (request, reply) => {
    try {
      const { offset = 0, limit = 4 } = request.query as {
        offset: string;
        limit: string;
      };

      // Fetch polls with pagination from the database
      const polls = await prisma.poll.findMany({
        skip: Number(offset),
        take: Number(limit),
        include: {
          options: {
            select: {
              id: true,
              poll_title: true,
            },
          },
        },
      });

      // Process each poll to get votes from Redis and compute scores
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

          const totalVotes = Object.values(votes).reduce(
            (acc, score) => acc + score,
            0
          );

          return {
            id: poll.id,
            options: poll.options.map((option) => ({
              id: option.id,
              title: option.poll_title,
              score: votes[option.id] || 0,
            })),
            totalVotes, // Store total votes for sorting
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
