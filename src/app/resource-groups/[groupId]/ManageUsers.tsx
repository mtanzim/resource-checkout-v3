"use client";

import { removeUserFromGroup } from "@/actions/resourceGroup";
import { AppUser } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { ResourceGroup } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  resourceGroupId: ResourceGroup["id"];
  users: AppUser[];
};

export default function ManageUsers({
  children,
  resourceGroupId,
  users,
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
        Manage Users
        <span className="m-4 badge badge-primary badge-outline">Admin</span>
      </div>
      <div className="collapse-content">
        {children}
        {users.map((u) => (
          <div className="flex gap-4 my-4" key={u.id}>
            <p>
              {u.firstName} {u.lastName}
            </p>
            {u.id !== userId && (
              <button
                onClick={() => onDelete(u.id)}
                className="btn btn-xs btn-error"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
