"use server";

import { prisma } from "@/lib/prisma";
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
  resourceGroupId: ResourceGroup["id"],
  userId: string | null
): Promise<{ error: string | null }> {
  try {
    if (!userId) {
      throw new Error("user not found");
    }

    const toDelete = await prisma.resourceGroup.findMany({
      where: {
        id: resourceGroupId,
        AND: {
          admins: { has: userId },
        },
      },
    });
    if (toDelete.length < 1) {
      throw new Error("user is not an admin");
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

type RemoveUserFromGroupParams = {
  userId: string | null;
  resourceGroupId: ResourceGroup["id"];
  userIdToRemove: string;
};

export async function removeUserFromGroup({
  userId,
  resourceGroupId,
  userIdToRemove,
}: RemoveUserFromGroupParams): Promise<{ error: string | null }> {
  try {
    const toUpdate = await prisma.resourceGroup.findMany({
      where: {
        id: resourceGroupId,
        AND: {
          admins: { has: userId },
        },
      },
    });
    if (toUpdate.length < 1) {
      throw new Error("user is not an admin");
    }
    if (toUpdate.length > 1) {
      throw new Error("multiple groups found, invalid app state");
    }
    const currentUsers = toUpdate?.at(0)?.users;
    if (!currentUsers) {
      throw new Error("no users available on the resource group");
    }
    const updatedUsers = currentUsers.filter((uid) => uid !== userIdToRemove);
    await prisma.resourceGroup.updateMany({
      where: {
        id: resourceGroupId,
        AND: {
          admins: { has: userId },
        },
      },
      data: {
        users: {
          set: updatedUsers,
        },
      },
    });
    revalidatePath("/resource-groups");
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: "Could not remove user from resource group!" };
  }
}

type AddUserToGroupParams = {
  userId: string | null;
  resourceGroupId: ResourceGroup["id"];
  userIdToAdd: string;
};
export async function addUserToGroup({
  userId,
  resourceGroupId,
  userIdToAdd,
}: AddUserToGroupParams): Promise<{ error: string | null }> {
  try {
    const toUpdate = await prisma.resourceGroup.updateMany({
      where: {
        id: resourceGroupId,
        AND: {
          admins: { has: userId },
        },
      },
      data: {
        users: {
          push: userIdToAdd,
        },
      },
    });
    if (toUpdate.count !== 1) {
      throw new Error(`user id ${userIdToAdd} cannot be added`);
    }
    revalidatePath("/resource-groups");
    return { error: null };
  } catch (err) {
    console.log(err);
    return { error: "Could not remove user from resource group!" };
  }
}
