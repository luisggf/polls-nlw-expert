import fastify from "fastify";
import { createPoll } from "../routes/pollsRoute";
import { getPoll } from "../routes/getPollsRoute";
import { voteOnPollRoute } from "../routes/voteOnPollRoute";
import { pollResults } from "./ws/poll-results"; // Import the pollResults route
import cookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { getAllPolls } from "../routes/getAllPolls";
import { getPopularPolls } from "../routes/getPopularPolls";

const app = fastify();

app.register(cors, {
  origin: "http://localhost:5173", // Replace with your frontend origin
  credentials: true, // Allow cookies and other credentials
});

app.register(cookie, {
  secret: "polls-app-nlw-secret-string",
  hook: "onRequest",
  parseOptions: { domain: undefined },
});

app.register(fastifyWebsocket);

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPollRoute);
app.register(getAllPolls);
app.register(pollResults); // Register the pollResults route
app.register(getPopularPolls);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Running");
});
