import { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import AddUser from "../components/AddUser";
import ConfirmationDialog, { UserAction } from "../components/Dialogs";
import {
  useDeleteUserMutation,
  useGetTeamListQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import Loader from "../components/Loader";
import { MdDelete, MdEdit } from "react-icons/md";

function Users() {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSeleted] = useState(null);

  const { data, isLoading, refetch } = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,

        id: selected?._id,
      });

      refetch();

      toast.success(result?.data?.message);
      setSeleted(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteHandler = async () => {
    try {
      const result = await deleteUser(selected);

      refetch();

      toast.success(result?.data?.message);
      setSeleted(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteClick = (id) => {
    setSeleted(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSeleted(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSeleted(el);
    setOpenAction(true);
  };

  if (isLoading)
    return (
      <div className="py-10">
        <Loader />
      </div>
    );

  const TableHeader = () => (
    <thead className="border-b ">
      <tr className="text-left ">
        <th className="py-2 ">Full Name</th>
        <th className="py-2 ">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b  hover:bg-gray-400/10 dark:hover:bg-gray-700/50">
      <td className="py-2 text-left pr-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full  flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs text-white font-semibold ms:text-sm text-center">
              {getInitials(user?.name)}
            </span>
          </div>
          {user?.name}
        </div>
      </td>

      <td className="pr-2">{user.title}</td>
      <td className="pr-2">{user.email || "user@email.com"}</td>
      <td className="pr-2">{user.role}</td>

      <td>
        <button
          onClick={() => userStatusClick(user)}
          className={`w-fit px-4 py-1 rounded-full ${
            user?.isActive
              ? "bg-blue-600 text-gray-200"
              : "bg-yellow-600 text-gray-200"
          }`}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>

      <td className="p-2 flex gap-[-4] md:gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-1"
          // label="Edit"
          icon={<MdEdit className="text-lg " />}
          type="button"
          onClick={() => editClick(user)}
        />

        <Button
          className="text-white/90 hover:text-red-500 font-semibold sm:px-1"
          // label="Delete"
          icon={<MdDelete className="text-lg " />}
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md  2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white dark:bg-[#121212] dark:text-gray-300 px-2 md:px-4 py-4 border-gray-300 dark:border-gray-600 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.users?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        refetch={refetch}
        key={new Date().getTime().toString()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
}

export default Users;
