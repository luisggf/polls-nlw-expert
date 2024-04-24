import fastify from "fastify";
import { createPoll } from "../routes/pollsRoute";
import { getPoll } from "../routes/getPollsRoute";
import { voteOnPollRoute } from "../routes/voteOnPollRoute";
import cookie from "@fastify/cookie"
import {fastifyWebsocket} from "@fastify/websocket";
import { pollResults } from "./ws/poll-results";
const app = fastify()

app.register(cookie, {
  secret: "polls-app-nlw-secret-string",
  hook: "onRequest",
  parseOptions: {}
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPollRoute)
app.register(fastifyWebsocket)
app.register(pollResults)

app.listen({port : 3333}).then(()=>{
  console.log('HTTP Running')
})