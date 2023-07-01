import { Resource, ResourceGroup, User } from "@prisma/client";
import { Row, HeaderRow } from "./Row";

type Props = {
  resources: Array<Resource & { currentOwner: User | null }>;
  user: User;
};

export const Table = ({ resources, user }: Props) => {
  return (
    <div className="overflow-x-auto p-8">
      <table className="table">
        <HeaderRow />
        <tbody>
          {resources.map((r, idx) => (
            <Row user={user} key={r.id} r={r} idx={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
