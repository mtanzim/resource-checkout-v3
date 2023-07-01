"use client";

import { deleteResource } from "@/actions/resources";
import { Resource, User } from "@prisma/client";

type Props = {
  resources: Array<Resource & { currentOwner: User | null }>;
};

export default function ManagerResources({ resources }: Props) {
  const onDelete = async (id: Resource["id"]) => {
    return deleteResource(id);
  };
  return (
    <div className="mt-4">
      <h2 className="text-xl mb-4">Manage Resources</h2>
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
  );
}
