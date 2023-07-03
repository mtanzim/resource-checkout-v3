"use client";

import { addResourceGroup } from "@/actions/resourceGroup";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function AddNew() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { userId } = useAuth();
  if (!userId) {
    return null;
  }
  return (
    <form
      action={async (formData: FormData) => {
        setErrorMsg(null);
        const { error } = await addResourceGroup(formData, userId);
        if (error) {
          setErrorMsg(error);
        }
      }}
    >
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-base">Add a new resource group</span>
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
