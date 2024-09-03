# Would You Rather Poll Backend

## Description

This project is an API that serves a polling application, where users can create polls, other users can reply to them, and the results can be accessed in real-time. The backend is built using Node.js, Fastify, Prisma, PostgreSQL, and Redis, with WebSocket integration for real-time updates.

## Concepts Used in This Project

- REST API
- Docker
- PostgreSQL
- Redis
- Fastify
- Prisma
- Cookies
- WebSockets
- Pub/Sub

## Libraries and Commands Used in This Project

### 1. Initialize a Node Project

Create a new Node.js project:

```bash
npm init -y
```

### 2. Set Up TypeScript

TypeScript is used for data typing in JavaScript:

```bash
npm install typescript @types/node -D
npx tsc --init
```

### 3. Install `tsx` for TypeScript Execution

Install `tsx` as a development dependency to run TypeScript files:

```bash
npm install tsx -D
```

### 4. Set Up Prisma ORM

Prisma is an ORM that simplifies data manipulation:

```bash
npm install prisma -D
npx prisma init
```

To manage your database schema, you can use (for visualization of the data):

```bash
npx prisma studio
```

To apply schema changes and run migrations:

```bash
npx prisma migrate dev
```

## To Run This Project

### 1. Set Up Environment Variables

Create a `.env` file in the root directory with the following contents:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/polls?schema=public"
REDIS_URL="redis://localhost:6379"
```

### 2. Run Docker to Create Database Containers

Use Docker to start PostgreSQL and Redis containers:

```bash
docker-compose up -d
```

### 3. Apply Database Migrations

After setting up the Docker containers, apply the latest database migrations:

```bash
npx prisma migrate dev
```

### 4. Seed the Database

This project has a seed script to populate the database with initial data, run:

```bash
npm run migrate:seed
```

### 5. Start the Development Server

To start the server the following inline command can be used:

```bash
npm run dev
```

## Docker Configuration

The `docker-compose.yml` file defines the services for PostgreSQL and Redis:

```yaml
version: "3.7"

services:
  postgres:
    image: bitnami/postgresql:latest
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=polls
    volumes:
      - polls_pg_data:/bitnami/postgresql

  redis:
    image: bitnami/redis:latest
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
    ports:
      - "6379:6379"
    volumes:
      - "polls_redis_data:/bitnami/redis/data"

volumes:
  polls_pg_data:
  polls_redis_data:
```

### Important Notes:

- Ensure that the `POSTGRES_USER` and `POSTGRES_PASSWORD` in the `docker-compose.yml` file match the credentials specified in the `.env` file.
- Use the `DATABASE_URL` in the `.env` file to connect to the PostgreSQL database.
