import { Resource } from "@prisma/client";
import { Row, HeaderRow } from "./Row";
import { User } from "@clerk/backend";

type Props = {
  resources: Array<Resource>;
  userId: string;
  userMap: Map<string, User>;
};

export const Table = ({ resources, userId, userMap }: Props) => {
  const getCurOwnerLabel = (userId: string | null) => {
    if (!userId) {
      return "";
    }
    return `${userMap.get(userId)?.firstName ?? ""} ${
      userMap.get(userId)?.lastName ?? ""
    }`;
  };

  return (
    <div className="overflow-x-auto p-8">
      <table className="table">
        <HeaderRow />
        <tbody>
          {resources.map((r, idx) => (
            <Row
              curOwnerLabel={getCurOwnerLabel(r.currentOwner)}
              userId={userId}
              key={r.id}
              r={r}
              idx={idx}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
