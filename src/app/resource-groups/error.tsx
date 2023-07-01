"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 className="text-2xl my-2">Something went wrong!</h2>
      <p>{error.message}</p>
      <button className="btn btn-accent my-4" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
