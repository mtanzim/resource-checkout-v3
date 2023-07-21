"use client";

import { getUserList } from "@/actions/users";
import { AppUser } from "@/types";
import { useEffect, useState } from "react";

export const NewUserForm = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AppUser[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!query) {
        return;
      }
      const users = await getUserList(query);
      setSuggestions(users);
    };
    load();
  }, [query]);
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
          {suggestions.map((s) => (
            <li className="flex" key={s.id}>
              <p>{s.primaryEmail}</p>
              <button className="btn btn-success btn-sm mx-4">Add</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="m2">
        {!query && suggestions.length === 0 ? (
          <>
            <p>No users found!</p>
            <button className="btn btn-success btn-sm">Invite a new user</button>
          </>
        ) : null}
      </div>
    </div>
  );
};
