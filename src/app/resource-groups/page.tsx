import { prisma } from "@/lib/prisma";
import { ResourceGroup } from "@prisma/client";

async function getGroups(userId: number) {
  const groups = await prisma.resourceGroup.findMany({
    where: { users: { some: { id: userId } } },
  });
  return groups;
}

async function selectUser() {
  return prisma.user.findFirst();
}

const Table = ({ groups }: { groups: ResourceGroup[] }) => {
  return (
    <div className="overflow-x-auto p-8">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => (
            <tr className="hover" key={g.id}>
              <th>{idx + 1}</th>
              <td>{g.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default async function Page() {
  // TODO: get user context
  const user = await selectUser();
  if (!user) {
    throw new Error("user not found");
  }
  const groups = await getGroups(user.id);
  return (
    <div>
      <h1 className="text-xl">My resource groups</h1>
      <Table groups={groups} />
    </div>
  );
}
