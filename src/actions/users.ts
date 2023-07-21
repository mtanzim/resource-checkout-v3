"use server";
import { AppUser } from "@/types";
import { clerkClient } from "@clerk/nextjs";

export async function gatherUserDetails(userIds: string[]) {
  return clerkClient.users.getUserList({ userId: userIds });
}

export async function getUserList(query?: string): Promise<AppUser[]> {
  if (!query) {
    return [];
  }
  const users = await clerkClient.users.getUserList({
    query,
    limit: 10,
  });
  if (!users) {
    throw new Error("failed to get users");
  }
  const appUsers: AppUser[] = users.map((u) => ({
    firstName: u.firstName,
    id: u.id,
    lastName: u.lastName,
    username: u.username,
    primaryEmail:
      u.emailAddresses.find(
        (ea) => u.primaryEmailAddressId && ea.id === u.primaryEmailAddressId
      )?.emailAddress || "address not found",
  }));
  return appUsers;
}
