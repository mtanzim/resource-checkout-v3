"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function selectUser() {
  return prisma.user.findFirst();
}

const inputSchema = z.object({
  title: z.string().max(20),
});

export async function addResourceGroup(data: FormData) {
  const user = await selectUser();
  if (!user) {
    throw new Error("user not found");
  }
  const newGroupName = data.get("title");
  const { title } = inputSchema.parse({ title: newGroupName });
  await prisma.resourceGroup.create({
    data: {
      title,
      users: {
        connect: [
          {
            id: user.id,
          },
        ],
      },
    },
  });
  revalidatePath('/resource-groups')
}
