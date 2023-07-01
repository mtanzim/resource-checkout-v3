import { prisma } from "@/lib/prisma";
import { Table } from "./Table";
import { AddNew } from "./AddNew";

async function getGroups(userId: number) {
  const groups = await prisma.resourceGroup.findMany({
    where: { users: { some: { id: userId } } },
  });
  return groups;
}

async function selectUser() {
  return prisma.user.findFirst();
}

export default async function Page() {
  // TODO: get user context
  const user = await selectUser();
  if (!user) {
    throw new Error("user not found");
  }
  const groups = await getGroups(user.id);
  return (
    <div>
      <h1 className="text-2xl">My resource groups</h1>
      <Table groups={groups} />
      <AddNew />
    </div>
  );
}
