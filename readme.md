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

## Setting the Project up

### 1. Clone the repository and install the dependencies via package.json

Clone this repository to your local machine:

```bash
git clone https://github.com/luisggf/polls-nlw-expert
cd <repository-directory>
```

### 2. Install Project Dependencies

The package.json file is already configured with all the necessary dependencies. To install them, simply run:

```bash
npm install
```

## To Run This Project

### 1. Set Up Environment Variables

Create a `.env` file in the root directory with the following contents (i kept my local .env and .yml configs in this repository but you can change it to your own). Example:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/polls?schema=public"
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

### 2. Run Docker to Create Database Containers

Use Docker to start PostgreSQL and Redis containers:

```bash
docker compose up -d
```

### 3. Apply Database Migrations

After setting up the Docker containers, apply the latest database migrations:

```bash
npx prisma migrate dev
```

In case this command doesn't work make sure to check if there's any PostGres instance running locally in the background. This programs interfere directly with the Prisma migration for the Docker VM.

### 4. Seed the Database

This project has a seed script to populate the database with initial data, run:

```bash
npm run seed
```

In case this command doesn't work make sure to check if the ts-node dependency is installed. In case you run into problems related to the ts-node, please run:

```bash
npm install -g ts-node
```

### 5. Start the Development Server

To start the server the following inline command can be used:

```bash
npm run dev
```

### 5. End

Now you're good to go, the server is sucessfully running and the Backend is ready to accept/communicate with client side application :)
The Frontend application can be found here: https://github.com/luisggf/polls-front

OBS: To rerun this server other times you need to run, in sequence, this commands:

```bash
docker compose up
npm run dev
```

- Note that the Docker Desktop program must be running.
