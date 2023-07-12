import { clerkClient } from "@clerk/nextjs";

export async function gatherUserDetails(userIds: string[]) {
  return clerkClient.users.getUserList({ userId: userIds });
}
