import { gatherUserDetails } from "@/actions/users";
import { prisma } from "@/lib/prisma";
import { User } from "@clerk/backend";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { z } from "zod";
import { AddNew } from "./AddNew";
import ManagerResources from "./ManageResources";
import ManageUsers, { AppUser } from "./ManageUsers";
import { Table } from "./Table";

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

async function getCurrentGroup(userId: string, groupId: ResourceGroup["id"]) {
  const groups = await prisma.resourceGroup.findMany({
    where: {
      id: groupId,
      AND: {
        users: {
          has: userId,
        },
      },
    },
  });
  return groups?.at(0);
}

export default async function Page({ params: rawParams }: never) {
  // TODO: get user context
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const { groupId } = paramsSchema.parse(rawParams);
  const isAdmin = await isCurrentUserAdmin(user.id, groupId);

  const group = await getCurrentGroup(user.id, groupId);
  if (!group) {
    throw new Error("group not found");
  }

  const users = await gatherUserDetails(group.users);
  const appUsers: AppUser[] = users.map((u) => ({
    firstName: u.firstName,
    id: u.id,
    lastName: u.lastName,
    username: u.username,
  }));

  const resources = await getResources(groupId);
  const userMap = new Map<string, User>();
  users.forEach((u) => {
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

      <div className="divider" />
      {isAdmin && (
        <ManageUsers resourceGroupId={groupId} users={appUsers}>
          <p className="text-red-500">Still working on the form</p>
        </ManageUsers>
      )}
    </div>
  );
}
