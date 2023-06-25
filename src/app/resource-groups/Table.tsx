import { ResourceGroup } from "@prisma/client";

export const Table = ({ groups }: { groups: ResourceGroup[] }) => {
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