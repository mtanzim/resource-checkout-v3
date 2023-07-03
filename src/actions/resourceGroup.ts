"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { ResourceGroup } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().max(20).min(3),
});

export async function addResourceGroup(
  data: FormData,
  userId: string | null
): Promise<{ error: string | null }> {
  try {
    if (!userId) {
      throw new Error("user not found");
    }
    const newGroupName = data.get("title");
    const { title } = inputSchema.parse({ title: newGroupName });
    await prisma.resourceGroup.create({
      data: {
        title,
        users: [userId],
        admins: [userId],
      },
    });
    revalidatePath("/resource-groups");
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: "Could not add resource group" };
  }
}

export async function deleteResourceGroup(
  resourceGroupId: ResourceGroup["id"]
): Promise<{ error: string | null }> {
  try {
    const user = await selectUser();
    if (!user) {
      throw new Error("user not found");
    }

    await prisma.resourceGroup.delete({
      where: {
        id: resourceGroupId,
      },
    });
    revalidatePath("/resource-groups");
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: "Could not delete resource group!" };
  }
}
