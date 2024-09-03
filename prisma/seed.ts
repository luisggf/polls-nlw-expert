import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if there are already polls in the database
  const pollCount = await prisma.poll.count();
  if (pollCount > 0) {
    console.log("Polls already seeded");
    return;
  }

  // Create some initial polls with options
  const poll1 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Always have to sing everything you say" },
            { poll_title: "Always have to dance everywhere you go" },
          ],
        },
      },
    },
  });

  const poll2 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Be able to fly but only as fast as you can walk" },
            { poll_title: "Be able to teleport but only once per day" },
          ],
        },
      },
    },
  });

  const poll3 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Be able to talk to animals" },
            { poll_title: "Be able to speak all human languages fluently" },
          ],
        },
      },
    },
  });

  const poll4 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Live in a world where everyone tells the truth" },
            { poll_title: "Live in a world where everyone can read minds" },
          ],
        },
      },
    },
  });

  const poll5 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            {
              poll_title:
                "Have the ability to stop time for 10 seconds every day",
            },
            { poll_title: "Rewind time by 10 minutes once a week" },
          ],
        },
      },
    },
  });

  const poll6 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Always know when someone is lying" },
            { poll_title: "Be able to get away with any lie you tell" },
          ],
        },
      },
    },
  });

  const poll7 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            {
              poll_title:
                "Have an unlimited supply of your favorite food but never be able to taste anything else",
            },
            {
              poll_title:
                "Always be able to try new foods but never have your favorites again",
            },
          ],
        },
      },
    },
  });

  const poll8 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Live in a world where you can only whisper" },
            { poll_title: "In a world where you can only shout" },
          ],
        },
      },
    },
  });

  const poll9 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Be famous for something embarrassing" },
            {
              poll_title:
                "Be totally unknown despite doing something remarkable",
            },
          ],
        },
      },
    },
  });

  const poll10 = await prisma.poll.create({
    data: {
      options: {
        createMany: {
          data: [
            { poll_title: "Be able to remember everything you read" },
            {
              poll_title:
                "Be able to perfectly recall any conversation you’ve had",
            },
          ],
        },
      },
    },
  });

  console.log(
    `Created polls: ${poll1.id}, ${poll2.id}, ${poll3.id}, ${poll4.id}, ${poll5.id}, ${poll6.id}, ${poll7.id}, ${poll8.id}, ${poll9.id}, ${poll10.id}`
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
