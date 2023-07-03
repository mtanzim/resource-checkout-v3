import { prisma } from "@/lib/prisma";
import { Table } from "./Table";
import { AddNew } from "./AddNew";
import { currentUser } from "@clerk/nextjs";

async function getGroups(userId: string) {
  const groups = await prisma.resourceGroup.findMany({
    where: { users: { hasSome: userId } },
    orderBy: {
      title: "asc",
    },
  });
  return groups;
}

export default async function Page() {
  // TODO: get user context
  const user = await currentUser();
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
