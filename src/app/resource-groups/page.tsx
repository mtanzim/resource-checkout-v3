import { prisma } from "@/lib/prisma";

async function getGroups(userId: number) {
  const groups = await prisma.resourceGroup.findMany({
    where: { users: { some: { id: userId } } },
  });
  return groups;
}

export default async function Page() {
  const groups = await getGroups(16);
  console.log({ groups });
  return <p>{JSON.stringify(groups)}</p>;
}
