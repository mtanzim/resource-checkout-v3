"use client";

import { deleteResourceGroup } from "@/actions/resourceGroup";
import { ResourceGroup } from "@prisma/client";
import { useState, useTransition } from "react";

type Props = {
  idx: number;
  g: ResourceGroup;
};
export default function Row({ idx, g }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  return (
    <tr className="hover" key={g.id}>
      <th>{idx + 1}</th>
      <td>{g.title}</td>
      <td>
        <button
          onClick={() =>
            startTransition(async () => {
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
      <td>{errorMsg ?? errorMsg}</td>
    </tr>
  );
}
