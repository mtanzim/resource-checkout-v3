"use client";

import { deleteResourceGroup } from "@/actions/resourceGroup";
import { useAuth } from "@clerk/nextjs";
import { ResourceGroup } from "@prisma/client";
import Link from "next/link";
import { useState, useTransition } from "react";

type Props = {
  idx: number;
  g: ResourceGroup;
};

export function HeaderRow() {
  return (
    <thead>
      <tr>
        <th className="w-1/8"></th>
        <th className="w-1/4">Name</th>
        <th className="w-1/8">Action</th>
      </tr>
    </thead>
  );
}

export function Row({ idx, g }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { userId } = useAuth();

  if (!userId) {
    return <></>;
  }

  return (
    <>
      <tr className="hover" key={g.id}>
        <th className="w-1/8">{idx + 1}</th>
        <td className="w-1/4">
          <Link href={`/resource-groups/${g.id}`}>
            <button className="btn btn-outline btn-primary">{g.title}</button>
          </Link>
        </td>
        <td className="w-1/8">
          <button
            onClick={() =>
              startTransition(async () => {
                setErrorMsg(null);
                const { error } = await deleteResourceGroup(g.id, userId);
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
