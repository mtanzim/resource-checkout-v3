import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { AddNew } from "./AddNew";
import { Table } from "./Table";

async function getGroups(userId: string) {
  const groups = await prisma.resourceGroup.findMany({
    where: { users: { hasSome: [userId] } },
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
      {groups.length > 0 ? (
        <Table groups={groups} />
      ) : (
        <p className="text my-4">Please add resource groups to get started.</p>
      )}
      <div className="divider"></div>
      <AddNew />
    </div>
  );
}
