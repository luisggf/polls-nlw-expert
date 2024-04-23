# Description
API to serve a Polling app. In this project an user can create polls, other users can reply to them and the result can be accessed in real-time.

# Concepts used in this project
- REST API
- Docker
- PostgreSQL
- Redis
- Fastify
- Prisma
- Cookies
- Radis
- Websockets
- Pub/Sub

# Libraries and commands used in this project:

Init a node project
```npm init -y```

Typescript to allow data typing in JS:
```npm install typescript @types/node -D```
```npx tsc --init```

Install tsx as a dev dependency:
```npm install tsx -D```
```npm run dev```

Library to create node API:
```npm i fastify```
```npm i @fastify/cookie```
```npm i @fastify/websocket```

ORM to manipulate the data with ease:
```npm i prisma -D```
```npx prisma init```
```npx prisma studio```

Validate data in requisitions:
```npm i zod```

Redis cahce database that runs in principal memory:
```npm i ioredis```


# To run this project:

Run docker to create DB containers
```sudo docker compose up -d``

Update to the last DB migration (version) containers
```npx prisma init```

Run whenver the database model changes
```npx prisma migrate dev```

Start the server
```npm run dev```