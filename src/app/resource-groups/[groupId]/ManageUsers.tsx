"use client";

import { removeUserFromGroup } from "@/actions/resourceGroup";
import { deleteResource } from "@/actions/resources";
import { gatherUserDetails } from "@/actions/users";
import { User } from "@clerk/backend";
import { useAuth } from "@clerk/nextjs";
import { Resource, ResourceGroup } from "@prisma/client";

type Props = {
  users: Array<User>;
  children: React.ReactNode;
  resourceGroupId: ResourceGroup["id"];
};

export default async function ManageUsers({
  users,
  children,
  resourceGroupId,
}: Props) {
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  const onDelete = async (userIdToRemove: string) => {
    await removeUserFromGroup({ resourceGroupId, userId, userIdToRemove });
  };
  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Manage Resources
        <span className="m-4 badge badge-primary badge-outline">Admin</span>
      </div>
      <div className="collapse-content">
        {children}
        {users.map((u) => (
          <div className="flex gap-4 my-4" key={u.id}>
            <p>
              {u.firstName} {u.lastName}
            </p>
            <button
              onClick={() => onDelete(u.id)}
              className="btn btn-xs btn-error"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
