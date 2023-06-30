import { Resource, ResourceGroup } from "@prisma/client";
import { Row, HeaderRow } from "./Row";

export const Table = ({ resources }: { resources: Resource[] }) => {
  return (
    <div className="overflow-x-auto p-8">
      <table className="table">
        <HeaderRow />
        <tbody>
          {resources.map((r, idx) => (
            <Row key={r.id} r={r} idx={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
