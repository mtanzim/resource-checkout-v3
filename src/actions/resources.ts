"use server";

import { prisma } from "@/lib/prisma";
import { Resource, ResourceGroup } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().max(20).min(3),
});

type AllocateResourceArgs = {
  resourceId: Resource["id"];
  currentOwner: string | null;
};

export async function allocateResource({
  currentOwner,
  resourceId,
}: AllocateResourceArgs) {
  return prisma.resource
    .update({
      where: {
        id: resourceId,
      },
      data: {
        currentOwner,
      },
    })
    .then(() => {
      revalidatePath("/resources");
      return { error: null };
    })
    .catch((err) => {
      console.log(err);
      return { error: "Could not allocate resource" };
    });
}

// TODO: this may not be secure
export async function addResource(
  data: FormData,
  groupId: ResourceGroup["id"],
  userId: string
): Promise<{ error: string | null }> {
  try {
    if (!userId) {
      throw new Error("user not found");
    }
    const resourceName = data.get("title");
    const { title } = inputSchema.parse({ title: resourceName });
    await prisma.resource.create({
      data: {
        title,
        groupId,
      },
    });
    revalidatePath("/resources");
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: "Could not add resource" };
  }
}

// TODO: check api protection
export async function deleteResource(
  resourceId: Resource["id"],
  userId: string
): Promise<{ error: string | null }> {
  try {
    if (!userId) {
      throw new Error("user not found");
    }

    await prisma.resource.delete({
      where: {
        id: resourceId,
      },
    });
    revalidatePath("/resources");
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: "Could not delete resource!" };
  }
}
