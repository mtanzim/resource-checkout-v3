import { AppUser } from "@/types";
import { User } from "@clerk/backend";

export function userToAppUser(u: User): AppUser {
  return {
    firstName: u.firstName,
    id: u.id,
    lastName: u.lastName,
    username: u.username,
    primaryEmail:
      u.emailAddresses.find(
        (ea) => u.primaryEmailAddressId && ea.id === u.primaryEmailAddressId
      )?.emailAddress || "address not found",
  };
}
