import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Table } from "./Table";
import { AddNew } from "./AddNew";
import Link from "next/link";
import ManagerResources from "./ManageResources";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { User } from "@clerk/backend";

const paramsSchema = z.object({
  groupId: z.coerce.number(),
});

async function getResources(groupId: number) {
  return prisma.resource.findMany({
    where: {
      groupId,
    },
    orderBy: {
      title: "asc",
    },
  });
}

async function isCurrentUserAdmin(userId: string, groupId: number) {
  const groups = await prisma.resourceGroup.findMany({
    where: {
      id: groupId,
      AND: {
        admins: {
          has: userId,
        },
      },
    },
  });
  return groups.length > 0;
}

async function getClerkUser(userId: string) {
  return clerkClient.users.getUser(userId);
}

export default async function Page({ params: rawParams }: never) {
  // TODO: get user context
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const { groupId } = paramsSchema.parse(rawParams);
  const isAdmin = await isCurrentUserAdmin(user.id, groupId);

  const resources = await getResources(groupId);
  const userIds = resources
    .map((r) => r.currentOwner)
    .filter(Boolean) as string[];
  const userInfo = await Promise.allSettled(userIds.map(getClerkUser));
  const filteredInfo = (
    userInfo.filter(
      (ui) => ui.status === "fulfilled"
    ) as PromiseFulfilledResult<User>[]
  ).map((ui) => ui.value);
  const userMap = new Map<string, User>();
  filteredInfo.forEach((u) => {
    userMap.set(u.id, u);
  });

  return (
    <div>
      <h1 className="text-2xl">Resources</h1>
      <Link href="/resource-groups">
        <button className="btn btn-xs btn-secondary">Back</button>
      </Link>
      {resources.length > 0 ? (
        <Table userMap={userMap} resources={resources} userId={user.id} />
      ) : (
        <p className="text my-4">Please add resources to get started.</p>
      )}

      <div className="divider" />
      {isAdmin && (
        <ManagerResources resources={resources}>
          <AddNew groupId={groupId} />
        </ManagerResources>
      )}
    </div>
  );
}
