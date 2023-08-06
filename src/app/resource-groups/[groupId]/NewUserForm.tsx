"use client";

import { addUserToGroup } from "@/actions/resourceGroup";
import { getUserList } from "@/actions/users";
import { AppUser } from "@/types";
import { type ResourceGroup } from "@prisma/client";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

type Props = {
  curUserId: AppUser["id"];
  resourceGroupId: ResourceGroup["id"];
  curUsers: AppUser[];
};

export const NewUserForm = (props: Props) => {
  const [query, setQuery] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AppUser[]>([]);
  const debouncedQuery = useDebounce<string | null>(query, 500);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!debouncedQuery) {
        return;
      }
      try {
        const curUserIdSet = new Set<string>(props.curUsers.map((u) => u.id));
        setLoading(true);
        const users = await getUserList(debouncedQuery);
        setSuggestions(users.filter((u) => !curUserIdSet.has(u.id)));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedQuery, props.curUsers]);

  const addToGroup = async (
    curUserId: AppUser["id"],
    resourceGroupId: ResourceGroup["id"],
    userIdToAdd: AppUser["id"]
  ) => {
    setToastMsg(null);
    setQuery(null);
    const res = await addUserToGroup({
      userId: curUserId,
      resourceGroupId,
      userIdToAdd,
    });

    if (res.error) {
      setToastMsg(res.error);
      return;
    }
    setToastMsg("User added successfully!");
  };

  return (
    <div>
      <h2 className="text-xl m-2">Add new users</h2>
      <input
        type="text"
        placeholder="Start typing here query existing users"
        className="input w-full max-w-xs"
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="m-2">
        <ul>
          {isLoading ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            suggestions.map((s) => (
              <li className="flex" key={s.id}>
                <p>{s.primaryEmail}</p>
                <button
                  onClick={() =>
                    addToGroup(props.curUserId, props.resourceGroupId, s.id)
                  }
                  className="btn btn-success btn-sm mx-4"
                >
                  Add
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="m2">
        {query && suggestions.length === 0 ? (
          <>
            <p>No users found!</p>
            {/* TODO: invitations */}
            {/* <button className="btn btn-success btn-sm">Invite a new user</button> */}
          </>
        ) : null}
      </div>
      <div className="toast">
        {toastMsg ? (
          <div className="alert alert-info">
            <span>{toastMsg}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
