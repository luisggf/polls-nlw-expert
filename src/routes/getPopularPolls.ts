import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

export async function getPopularPolls(app: FastifyInstance) {
  app.get("/popular-polls", async (request, reply) => {
    try {
      // Fetch all polls with their options from the database
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
              title: option.title,
              score: votes[option.id] || 0,
            })),
            totalVotes, // Store total votes for sorting
          };
        })
      );

      // Sort polls by totalVotes and take the top 4
      const topPolls = pollsWithScores
        .sort((a, b) => b.totalVotes - a.totalVotes)
        .slice(0, 4);

      return reply.send(topPolls);
    } catch (error) {
      console.error("Error fetching polls:", error);
      return reply.status(500).send({ error: "Failed to fetch polls" });
    }
  });
}
