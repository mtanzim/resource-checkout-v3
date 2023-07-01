"use client";

import { allocateResource, deleteResource } from "@/actions/resources";
import { Resource, User } from "@prisma/client";
import { useState, useTransition } from "react";

type Props = {
  idx: number;
  r: Resource & { currentOwner: User | null };
  user: User;
};

export function HeaderRow() {
  return (
    <thead>
      <tr>
        <th className="w-1/8"></th>
        <th className="w-1/4">Name</th>
        <th className="w-1/8">Current owner</th>
      </tr>
    </thead>
  );
}

export function Row({ idx, r, user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const assignResourceLocal = async (
    userId: User["id"],
    resourceId: Resource["id"]
  ) => {
    setErrorMsg(null);
    const { error } = await allocateResource({ userId, resourceId });
    if (error) {
      setErrorMsg(error);
    }
  };
  return (
    <>
      <tr className="hover" key={r.id}>
        <th className="w-1/8">{idx + 1}</th>
        <td className="w-1/4">{r.title}</td>
        <td>
          {r?.currentOwner?.email ? (
            <p>{r?.currentOwner?.email}</p>
          ) : (
            <button
              onClick={() =>
                startTransition(() => assignResourceLocal(user.id, r.id))
              }
              className="btn btn-success"
            >
              {isPending ? "Loading..." : "Check out"}
            </button>
          )}
        </td>
        <td className="w-1/4">{errorMsg ?? errorMsg}</td>
      </tr>
      {errorMsg && (
        <div className="toast">
          <div className="alert alert-warning">
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
    </>
  );
}
