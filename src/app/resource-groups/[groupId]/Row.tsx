"use client";

import { allocateResource } from "@/actions/resources";
import { Resource } from "@prisma/client";
import { useState, useTransition } from "react";

type Props = {
  idx: number;
  r: Resource;
  userId: string;
  curOwnerLabel: string;
};

export function HeaderRow() {
  return (
    <thead>
      <tr>
        <th className="w-1/8"></th>
        <th className="w-1/4">Name</th>
        <th className="w-1/4">Current owner</th>
        <th className="w-1/4">Action</th>
      </tr>
    </thead>
  );
}

export function Row({ idx, r, userId, curOwnerLabel }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!userId) {
    return null;
  }

  const assignResourceLocal = async (
    userId: string | null,
    resourceId: Resource["id"]
  ) => {
    setErrorMsg(null);
    const { error } = await allocateResource({
      currentOwner: userId,
      resourceId,
    });
    if (error) {
      setErrorMsg(error);
    }
  };

  const genAction = (r: Resource) => {
    if (r?.currentOwner === userId) {
      return (
        <button
          onClick={() => startTransition(() => assignResourceLocal(null, r.id))}
          className="btn btn-info"
        >
          Return
        </button>
      );
    }
    if (r?.currentOwner) {
      return <button className="btn btn-warning">Nudge</button>;
    }
    return (
      <button
        onClick={() => startTransition(() => assignResourceLocal(userId, r.id))}
        className="btn btn-success"
      >
        {isPending ? "Loading..." : "Check out"}
      </button>
    );
  };

  return (
    <>
      <tr className="hover" key={r.id}>
        <th className="w-1/8">{idx + 1}</th>
        <td className="w-1/4">{r.title}</td>
        <td className="w-1/4">{curOwnerLabel}</td>
        <td>{genAction(r)} </td>
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
