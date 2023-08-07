import { ResourceGroup } from "@prisma/client";
import { Row, HeaderRow } from "./Row";

export const Table = ({ groups }: { groups: ResourceGroup[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <HeaderRow />
        <tbody>
          {groups.map((g, idx) => (
            <Row key={g.id} g={g} idx={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
