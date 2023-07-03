"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Resource Checkout app!!</h1>
      <Link href="/resource-groups">
        <button className="btn btn-primary">Get started</button>
      </Link>
    </main>
  );
}
