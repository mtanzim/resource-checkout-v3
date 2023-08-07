"use client";

import { allocateResource } from "@/actions/resources";
import { AppUser } from "@/types";
import { Resource } from "@prisma/client";
import { useState, useTransition } from "react";

type Props = {
  idx: number;
  r: Resource;
  userId: string;
  isAdmin: boolean;
  groupName: string;
  curOwner?: AppUser;
};

const MailLink: React.FC<{
  user: AppUser;
  r: Resource;
  groupName: string;
  children: React.ReactNode;
}> = ({ user, r, groupName, children }) => {
  return (
    <a
      target="_blank"
      href={`mailto:${user.primaryEmail}?subject=Please release ${r.title} under ${groupName} &body=You are requested to release ${r.title} from ${groupName}`}
    >
      {children}
    </a>
  );
};

export function HeaderRow() {
  return (
    <thead>
      <tr>
        <th className="w-1/8"></th>
        <th className="w-1/6">Name</th>
        <th className="w-1/6">Current owner</th>
        <th className="w-1/6">Action</th>
        <th className="w-1/6"></th>
      </tr>
    </thead>
  );
}

export function Row({ idx, r, userId, curOwner, isAdmin, groupName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCurOwnerLabel = (user?: AppUser) => {
    if (!user) {
      return "";
    }
    return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;
  };

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
    if (curOwner?.id === userId) {
      return (
        <button
          onClick={() =>
            startTransition(async () => assignResourceLocal(null, r.id))
          }
          className="btn btn-info"
        >
          {isPending ? "Loading..." : "Return"}
        </button>
      );
    }
    if (curOwner) {
      return (
        <MailLink user={curOwner} r={r} groupName={groupName}>
          <button className="btn btn-warning">Nudge</button>
        </MailLink>
      );
    }
    return (
      <button
        onClick={() =>
          startTransition(async () => assignResourceLocal(userId, r.id))
        }
        className="btn btn-success"
      >
        {isPending ? "Loading..." : "Check out"}
      </button>
    );
  };
  const genSecondaryAction = (r: Resource) => {
    if (isAdmin && curOwner && curOwner?.id !== userId) {
      return (
        <button
          onClick={() =>
            startTransition(async () => await assignResourceLocal(null, r.id))
          }
          className="btn btn-error"
        >
          Force unassign
        </button>
      );
    }
    return null;
  };

  return (
    <>
      <tr className="hover" key={r.id}>
        <th className="w-1/8">{idx + 1}</th>
        <td className="w-1/4">{r.title}</td>
        <td className="w-1/4">{getCurOwnerLabel(curOwner)}</td>
        <td>{genAction(r)} </td>
        <td>{genSecondaryAction(r)} </td>
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
