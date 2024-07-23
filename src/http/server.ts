import fastify from "fastify";
import { createPoll } from "../routes/pollsRoute";
import { getPoll } from "../routes/getPollsRoute";
import { voteOnPollRoute } from "../routes/voteOnPollRoute";
import { pollResults } from "./ws/poll-results"; // Import the pollResults route
import cookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { getAllPolls } from "../routes/getAllPolls";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(cookie, {
  secret: "polls-app-nlw-secret-string",
  hook: "onRequest",
  parseOptions: {},
});

app.register(fastifyWebsocket);

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPollRoute);
app.register(getAllPolls);
app.register(pollResults); // Register the pollResults route

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Running");
});
