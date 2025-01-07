import { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { toast } from "sonner";
import Button from "../components/Button";
import ConfirmationDialog from "../components/Dialogs";
import Loader from "../components/Loader";
import Title from "../components/Title";
import {
  useDeleteRestoreTaskMutation,
  useGetAllTaskQuery,
} from "../redux/slices/api/taskApiSlice";
import { PRIORITY_STYLES, TASK_TYPE } from "../utils";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardDoubleArrowDown />,
  low: <MdKeyboardArrowDown />,
};

function Trash() {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: "",
    isTrashed: "true",
    search: "",
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const deleteRestoreHandler = async () => {
    try {
      let result;
      switch (type) {
        case "delete":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "delete",
          }).unwrap();
          break;

        case "deleteAll":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "deleteAll",
          }).unwrap();
          break;

        case "restore":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "restore",
          }).unwrap();
          break;

        case "restoreAll":
          result = await deleteRestoreTask({
            id: selected,
            actionType: "restoreAll",
          }).unwrap();
          break;
      }
      toast.success(result?.message);

      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Are you sure you want to delete all tasks?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Are you sure you want to restore all tasks?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setSelected(id);
    setType("delete");
    setMsg("Are you sure you want to delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Are you sure you want to restore this task?");
    setOpenDialog(true);
  };

  if (isLoading)
    return (
      <div className="py-10">
        <Loader />
      </div>
    );

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className=" text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 ">Modified On</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${TASK_TYPE[item.stage]}`} />

          <p className="w-full  text-base ">{item?.title}</p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className={"flex gap-1 items-center"}>
          <span className={`text-lg ${PRIORITY_STYLES[item?.priority]}`}>
            {ICONS[item?.priority]}
          </span>
          <span>{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-start">{item?.stage}</td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-blue-600" />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={
            <MdDelete className="text-xl text-gray-600 dark:text-white/90 hover:text-red-500 dark:hover:text-red-500" />
          }
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />
        </div>

        {data?.tasks?.length > 0 ? (
          <div>
            <div className="bg-white dark:bg-[#121212] dark:text-gray-300 px-2 md:px-6 py-4 shadow-md rounded">
              {/* Add proper styles for scrolling */}
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[530px] mb-5">
                  {/* Set a minimum width */}
                  <TableHeader />
                  <tbody>
                    {data?.tasks?.map((tk, id) => (
                      <TableRow key={id} item={tk} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex gap-2 md:gap-4 items-center justify-end mt-4">
              <Button
                label="Restore All"
                icon={<MdOutlineRestore className="text-lg " />}
                className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white  text-sm md:text-base rounded-md 2xl:py-2.5"
                onClick={() => restoreAllClick()}
              />
              <Button
                label="Delete All"
                icon={<MdDelete className="text-lg " />}
                className="flex flex-row-reverse gap-1 items-center text-gray-600  dark:text-white/90 text-sm md:text-base rounded-md 2xl:py-2.5"
                onClick={() => deleteAllClick()}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mt-9">
            <p className="text-lg dark:text-gray-300">No Trashed Task</p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </>
  );
}

export default Trash;
