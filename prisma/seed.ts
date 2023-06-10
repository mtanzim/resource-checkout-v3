import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type groupNames = "full stack team" | "mobile team" | "cross-functional-team";

async function main() {
  await prisma.user.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceGroup.deleteMany();
  const groupUsers: Record<groupNames, string[]> = {
    "full stack team": ["developer@mail.com", "qaTester@mail.com"],
    "mobile team": ["mobile-developer@mail.com", "mobile-qaTester@mail.com"],
    "cross-functional-team": ["developer@mail.com", "mobile-qaTester@mail.com"],
  };

  const groupResources: Record<groupNames, string[]> = {
    "full stack team": ["next-ui", "rails-be"],
    "mobile team": ["kotlin-ui", "go-be"],
    "cross-functional-team": ["scala-backend", "react-spa"],
  };
  const usedEmails = new Set<string>();

  return Promise.all(
    Object.entries(groupUsers).map(([groupName, userNames]) => {
      return prisma.resourceGroup.create({
        data: {
          title: groupName,
          users: {
            connectOrCreate: userNames.map((email) => ({
              create: {
                email: email,
              },
              where: {
                email: email,
              },
            })),
          },
          Resource: {
            createMany: {
              data: groupResources[groupName as groupNames].map((title) => ({
                title,
              })),
            },
          },
        },
      });
    })
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
