"use client";

import { deleteResource } from "@/actions/resources";
import { Resource, User } from "@prisma/client";
import { useState, useTransition } from "react";

type Props = {
  idx: number;
  r: Resource & { currentOwner: User };
};

export function HeaderRow() {
  return (
    <thead>
      <tr>
        <th className="w-1/8"></th>
        <th className="w-1/4">Name</th>
        <th className="w-1/8">Current owner</th>
        <th className="w-1/8"></th>
      </tr>
    </thead>
  );
}

export function Row({ idx, r }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  return (
    <tr className="hover" key={r.id}>
      <th className="w-1/8">{idx + 1}</th>
      <td className="w-1/4">{r.title}</td>
      <td>
        {r.userId ? (
          <p>{r.currentOwner.email}</p>
        ) : (
          <button className="btn btn-success">Check out</button>
        )}
      </td>
      {/* Fix delete flow for resources */}
      <td className="w-1/8 hidden">
        <button
          onClick={() =>
            startTransition(async () => {
              setErrorMsg(null);
              const { error } = await deleteResource(r.id);
              if (error) {
                setErrorMsg(error);
              }
            })
          }
          className="btn btn-error w-24"
        >
          {isPending ? "Loading..." : "Delete"}
        </button>
      </td>
      <td className="w-1/4">{errorMsg ?? errorMsg}</td>
    </tr>
  );
}
