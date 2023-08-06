import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function Nav() {
  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <div className="m-4 flex">
          <Link href="/resource-groups">
            <button className="btn btn-primary">Please log in</button>
          </Link>
        </div>
        <div className="divider"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="m-4 flex">
        <UserButton afterSignOutUrl="/" />
        <p className="text-base mx-2">Hello {user?.firstName}</p>
      </div>
      <div className="divider"></div>
    </div>
  );
}
