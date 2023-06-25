"use client";

import { deleteResourceGroup } from "@/actions/resourceGroup";
import { ResourceGroup } from "@prisma/client";
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
        <th className="w-1/4"></th>
      </tr>
    </thead>
  );
}

export function Row({ idx, g }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  return (
    <tr className="hover" key={g.id}>
      <th className="w-1/8">{idx + 1}</th>
      <td className="w-1/4">{g.title}</td>
      <td className="w-1/8">
        <button
          onClick={() =>
            startTransition(async () => {
              setErrorMsg(null);
              const { error } = await deleteResourceGroup(g.id);
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
