import { useState } from "react";
import {
  MdAttachFile,
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";

import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { BGS, formatDate, PRIORITY_STYLES, TASK_TYPE } from "../../utils";
import Button from "../Button";
import ConfirmationDialog from "../Dialogs";
import UserInfo from "../UserInfo";
import { useTrashTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import AddTask from "./AddTask";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardDoubleArrowDown />,
  low: <MdKeyboardArrowDown />,
};

function Table({ tasks, refetch, user }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [trashTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editTaskHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await trashTask({
        id: selected,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        refetch();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300 dark:border-gray-600">
      <tr className="w-full text-black dark:text-white text-left mr-3">
        <th className="py-2 ">Task Title</th>
        <th className="py-2 pr-10 ">Priority</th>
        <th className="py-2 pr-10">Created</th>
        <th className="py-2 pr-20">Assets</th>
        <th className="py-2 pr-10">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600 dark:text-gray-300 hover:bg-gray-300/10 dark:hover:bg-gray-700/10">
      {/* TITLE */}
      <td className="py-2 pr-4">
        <div className="flex items-center gap-1">
          <div
            className={`w-4 h-4 flex-shrink-0 rounded-full ${
              TASK_TYPE[task.stage]
            }`}
          />
          <p className="w-full text-base ">{task?.title}</p>
        </div>
      </td>

      {/* PRIORITY */}
      <td className="py-2">
        <div className="flex items-center gap-1">
          <span className={`text-lg ${PRIORITY_STYLES[task?.priority]}`}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize">{task?.priority}</span>
        </div>
      </td>

      {/* CREATED AT */}
      <td className="py-2">
        <span className="text-sm">{formatDate(new Date(task?.date))}</span>
      </td>

      {/* ASSETS */}

      <td className="py-2 ">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center text-sm ">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>

          <div className="flex gap-1 items-center text-sm ">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>

          <div className="flex gap-1 items-center text-sm ">
            <FaList />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      {/* TEAM */}

      <td className="py-2">
        <div className="flex">
          {task?.team.map((m, index) => (
            <div
              key={m._id}
              className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm font-semibold -mr-1 ${
                BGS[index % BGS.length]
              }`}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      {/* BUTTON */}

      {user?.isAdmin && (
        <td className="py-2">
          <div className="flex">
            <Button
              className="text-blue-600 hover:text-blue-500 py-10 text-sm md:text-base flex items-center"
              icon={<MdEdit className="text-lg " />}
              type="button"
              onClick={() => editTaskHandler(task)}
            />
            <Button
              className="text-gray-600 dark:text-white/90  hover:text-red-500 dark:hover:text-red-500 sm:px-1 text-sm md:text-base"
              icon={<MdDelete className="text-lg " />}
              type="button"
              onClick={() => deleteClicks(task._id)}
            />
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <>
      <div className="bg-white dark:bg-[#121212] px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="overflow-y-hidden">
          <table className="w-full ">
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
}

export default Table;
