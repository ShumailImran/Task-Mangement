import moment from "moment";
import { getInitials } from "../utils";
import { useSelector } from "react-redux";

const UserTable = ({ users }) => {
  const { user } = useSelector((state) => state.auth);

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-white  text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Status</th>
        <th className="py-2">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200  text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white  flex items-center justify-center text-sm bg-violet-700">
            <span className="text-center">{getInitials(user?.name)}</span>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300"> {user.name}</p>
            <span className="text-xs text-black dark:text-white">
              {user?.role}
            </span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={`
            w-fit px-3 py-1 rounded-full text-sm ${
              user?.isActive ? "bg-blue-200" : "bg-yellow-100"
            }

        `}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>
      <td className="py-2 text-sm text-gray-700 dark:text-gray-300">
        {moment(user?.createdAt).fromNow()}
      </td>
    </tr>
  );

  return (
    <>
      {user?.isAdmin && (
        <div className="w-full lg:w-1/3 bg-white dark:bg-[#121212] h-fit px-2 md:px-6 py-4 shadow-md rounded">
          <table className="w-full mb-5">
            <TableHeader />
            <tbody>
              {users?.map((user, index) => (
                <TableRow key={index + user?._id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UserTable;
