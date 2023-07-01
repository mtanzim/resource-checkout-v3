import { Resource, ResourceGroup, User } from "@prisma/client";
import { Row, HeaderRow } from "./Row";

type Props = {
  resources: Array<Resource & { currentOwner: User | null }>;
};

export const Table = ({ resources }: Props) => {
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
