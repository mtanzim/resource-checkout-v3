"use client";

import { addResource } from "@/actions/resources";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export function AddNewResource({ groupId }: { groupId: number }) {
  const { userId } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  if (!userId) {
    return null;
  }
  return (
    <form
      action={async (formData: FormData) => {
        setErrorMsg(null);
        const { error } = await addResource(formData, groupId, userId);
        if (error) {
          setErrorMsg(error);
        }
      }}
    >
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-base">Add a new resource</span>
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs p-2"
          />
          <input
            type="submit"
            className="btn btn-primary"
            value="Submit"
          ></input>
        </div>
      </div>
      {errorMsg && (
        <div className="toast">
          <div className="alert alert-warning">
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
    </form>
  );
}
