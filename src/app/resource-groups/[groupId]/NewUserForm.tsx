"use client";

import { getUserList } from "@/actions/users";
import { AppUser } from "@/types";
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

export const NewUserForm = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AppUser[]>([]);
  const debouncedQuery = useDebounce<string | null>(query, 500);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const load = async () => {
      if (!debouncedQuery) {
        return;
      }
      try {
        setLoading(true);
        const users = await getUserList(debouncedQuery);
        setSuggestions(users);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedQuery]);

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
                <button className="btn btn-success btn-sm mx-4">Add</button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="m2">
        {query && suggestions.length === 0 ? (
          <>
            <p>No users found!</p>
            {/* <button className="btn btn-success btn-sm">Invite a new user</button> */}
          </>
        ) : null}
      </div>
    </div>
  );
};
