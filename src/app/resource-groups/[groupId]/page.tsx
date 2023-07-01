import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Table } from "./Table";
import { AddNew } from "./AddNew";
import Link from "next/link";
import ManagerResources from "./ManageResources";

const paramsSchema = z.object({
  groupId: z.coerce.number(),
});

async function getResources(groupId: number) {
  return prisma.resource.findMany({
    where: {
      groupId,
    },
    include: {
      currentOwner: true,
    },
    orderBy: {
      title: "asc",
    },
  });
}

async function selectUser() {
  return prisma.user.findFirst();
}

export default async function Page({ params: rawParams }: never) {
  // TODO: get user context
  const user = await selectUser();
  if (!user) {
    throw new Error("user not found");
  }
  const { groupId } = paramsSchema.parse(rawParams);
  const resources = await getResources(groupId);
  return (
    <div>
      <h1 className="text-2xl">Resources</h1>
      <Link href="/resource-groups">
        <button className="btn btn-xs btn-secondary">Back</button>
      </Link>
      <Table resources={resources} user={user} />
      <div className="divider" />
      <ManagerResources resources={resources}>
        <AddNew groupId={groupId} />
      </ManagerResources>
    </div>
  );
}
