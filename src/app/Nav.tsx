import { UserButton } from "@clerk/nextjs";

export default function Nav() {
  return (
    <div>
      <div className="m-4 flex">
        <UserButton afterSignOutUrl="/" />
        <h1 className="text-xl mx-4">Resource Checkout</h1>
      </div>
      <div className="divider"></div>
    </div>
  );
}
