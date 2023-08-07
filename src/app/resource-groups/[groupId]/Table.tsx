import { Resource } from "@prisma/client";
import { Row, HeaderRow } from "./Row";
import { User } from "@clerk/backend";
import { userToAppUser } from "@/lib/utils";

type Props = {
  resources: Array<Resource>;
  userId: string;
  userMap: Map<string, User>;
  isAdmin: boolean;
  groupName: string;
};

export const Table = ({
  resources,
  userId,
  userMap,
  isAdmin,
  groupName,
}: Props) => {
  const getCurOwnerObj = (userId: string | null) => {
    if (!userId) {
      return;
    }
    return userMap.get(userId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <HeaderRow />
        <tbody>
          {resources.map((r, idx) => (
            <Row
              curOwner={
                getCurOwnerObj(r.currentOwner)
                  ? userToAppUser(getCurOwnerObj(r.currentOwner)!)
                  : undefined
              }
              groupName={groupName}
              userId={userId}
              key={r.id}
              r={r}
              idx={idx}
              isAdmin={isAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
