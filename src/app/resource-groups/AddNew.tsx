import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().max(20),
});

async function selectUser() {
  return prisma.user.findFirst();
}

async function addResourceGroup(data: FormData) {
  "use server";
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
  await Promise.resolve(console.log(newGroupName));
}

export default function AddNew() {
  return (
    <form action={addResourceGroup}>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-base">Add a new resource group</span>
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs p-2"
          />
          <input
            type="submit"
            className="btn btn-primary"
            value="Submit"
          ></input>
        </div>
      </div>
    </form>
  );
}
