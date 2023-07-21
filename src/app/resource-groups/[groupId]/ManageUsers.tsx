"use client";

import {
  makeUserAdmin,
  removeUserFromAdmin,
  removeUserFromGroup,
} from "@/actions/resourceGroup";
import { AppUser } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { ResourceGroup } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  resourceGroupId: ResourceGroup["id"];
  users: AppUser[];
  adminList: string[];
};

type AddUserToGroupParams = {
  userId: string | null;
  resourceGroupId: ResourceGroup["id"];
  userIdToAdd: string;
};

type RemoveUserFromGroupParams = {
  userId: string | null;
  resourceGroupId: ResourceGroup["id"];
  userIdToRemove: string;
};

export default function ManageUsers({
  children,
  resourceGroupId,
  users,
  adminList,
}: Props) {
  const { userId } = useAuth();

  const isUserAdmin = (userId: string) =>
    adminList.findIndex((al) => al === userId) > -1;

  if (!userId) {
    return null;
  }

  const onDelete = async (userIdToRemove: string) => {
    await removeUserFromGroup({ resourceGroupId, userId, userIdToRemove });
  };

  const makeAdmin = async (args: AddUserToGroupParams) => {
    await makeUserAdmin(args);
  };

  const removeAdmin = async (args: RemoveUserFromGroupParams) => {
    await removeUserFromAdmin(args);
  };

  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Manage Users
        <span className="m-4 badge badge-primary badge-outline">Admin</span>
      </div>
      <div className="collapse-content">
        <h2 className="text-xl m-2">Current Users</h2>
        {users.map((u) => (
          <div className="flex gap-4 my-4" key={u.id}>
            <p className="mx-2">
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
            {u.id !== userId && !isUserAdmin(u.id) && (
              <button
                onClick={() =>
                  makeAdmin({
                    resourceGroupId,
                    userId,
                    userIdToAdd: u.id,
                  })
                }
                className="btn btn-xs btn-success"
              >
                Make admin
              </button>
            )}
            {u.id !== userId && isUserAdmin(u.id) && (
              <button
                onClick={() =>
                  removeAdmin({
                    resourceGroupId,
                    userId,
                    userIdToRemove: u.id,
                  })
                }
                className="btn btn-xs btn-error"
              >
                Remove admin
              </button>
            )}
          </div>
        ))}
        <div className="divider"></div>
        {children}
      </div>
    </div>
  );
}
