import { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, formatDate, PRIORITY_STYLES, TASK_TYPE } from "../utils";
import AddSubTask from "./Task/AddSubTask";
import TaskDialog from "./Task/TaskDialog";
import UserInfo from "./UserInfo";
import { Link } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  normal: <MdKeyboardDoubleArrowDown />,
  low: <MdKeyboardArrowDown />,
};

function TaskCard({ task, refetch }) {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-full box-border h-fit bg-white dark:bg-[#121212] shadow-md p-4 rounded">
        <div className="w-full flex justify-between">
          <div
            className={`flex flex-1 gap-1 items-center text-sm font-medium ${
              PRIORITY_STYLES[task?.priority]
            }`}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>

          {/* TaskDialog Button */}
          <div className="relative">
            <TaskDialog task={task} isAdmin={user.isAdmin} refetch={refetch} />
          </div>
        </div>

        <>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 flex-shrink-0 rounded-full ${
                TASK_TYPE[task.stage]
              }`}
            />
            <Link
              to={`/task/${task._id}`}
              className="text-black dark:text-white"
            >
              <h4 className="line-clamp-1 cursor-pointer">{task?.title}</h4>
            </Link>
          </div>

          <span className="text-sm text-gray-600 dark:text-gray-300">
            {formatDate(new Date(task?.createdAt))}
          </span>
        </>

        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />
        <div className="flex items-center justify-between mb-2">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-300">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>

            <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-300">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>

            <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-300">
              <FaList />
              <span>{task?.subTasks?.length}</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-row-reverse">
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-0.1 ${
                  BGS[index % BGS?.length]
                }`}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* SUB TASKS */}
        {task?.subTasks?.length > 0 ? (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="text-base line-clamp-1 text-black dark:text-white">
              {task?.subTasks[0].title}
            </h5>

            <div className="p-4 space-x-8">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className="bg-blue-600/10 dark:bg-blue-300/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                {task?.subTasks[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-200">
              No Sub Task
            </span>
          </div>
        )}

        <div className="w-full pb-2">
          <button
            onClick={() => setOpen(true)}
            disabled={user.isAdmin ? false : true}
            className="w-full flex gap-4 items-center text-sm text-yellow-500  font-semibold disabled:cursor-not-allowed disabled:text-gray-300 disabled:dark:text-gray-600"
          >
            <IoMdAdd className="text-lg" />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
}

export default TaskCard;
