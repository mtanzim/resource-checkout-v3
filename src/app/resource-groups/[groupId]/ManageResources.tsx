"use client";

import { deleteResource } from "@/actions/resources";
import { Resource, User } from "@prisma/client";

type Props = {
  resources: Array<Resource & { currentOwner: User | null }>;
  children: React.ReactNode;
};

export default function ManagerResources({ resources, children }: Props) {
  const onDelete = async (id: Resource["id"]) => {
    return deleteResource(id);
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
        {resources.map((r) => (
          <div className="flex gap-4 my-4" key={r.id}>
            <p>{r.title}</p>
            <button
              onClick={() => onDelete(r.id)}
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
