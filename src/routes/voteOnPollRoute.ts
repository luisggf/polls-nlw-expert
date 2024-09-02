import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { voting } from "../utils/voting-pub-sub";

export async function voteOnPollRoute(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const VoteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
      username: z.string().min(1).optional(), // Include username validation
    });

    const VoteOnPollParams = z.object({
      pollId: z.string().cuid(),
    });

    const { pollId } = VoteOnPollParams.parse(request.params);
    const { pollOptionId, username } = VoteOnPollBody.parse(request.body); // Parse username from body

    let { sessionId } = request.cookies;

    console.log(request.cookies);

    const finalUsername = username || request.cookies.username || "Anonymous"; // Determine final username

    console.log(finalUsername);

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true,
      });
    }

    const userPreviousVote = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          sessionId,
          pollId,
        },
      },
    });

    if (userPreviousVote && userPreviousVote.pollOptionId !== pollOptionId) {
      // Delete the previous vote and rewrite the new vote
      await prisma.vote.delete({
        where: {
          id: userPreviousVote.id,
        },
      });

      const votes = await redis.zincrby(
        pollId,
        -1,
        userPreviousVote.pollOptionId
      );

      voting.publish(pollId, {
        pollOptionId: userPreviousVote.pollOptionId,
        votes: Number(votes),
        username: finalUsername, // Broadcast the final username
      });
    } else if (userPreviousVote) {
      return reply
        .status(400)
        .send({ message: "User already voted at this poll!" });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    const votes = await redis.zincrby(pollId, 1, pollOptionId);

    voting.publish(pollId, {
      pollOptionId,
      votes: Number(votes),
      username: finalUsername, // Broadcast the final username
    });

    // Broadcast the update via WebSocket
    console.log(
      `Broadcasting update for poll ${pollId} and option ${pollOptionId}`
    );
    app.websocketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        // 1 means the connection is open
        client.send(
          JSON.stringify({
            pollId,
            pollOptionId,
            votes: Number(votes),
            username: finalUsername, // Include the final username in WebSocket message
          })
        );
      }
    });

    return reply.send({ sessionId });
  });
}
