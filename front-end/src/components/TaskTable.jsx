import { BGS, PRIORITY_STYLES, TASK_TYPE } from "../utils";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import UserInfo from "./UserInfo";
import moment from "moment";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    normal: <MdKeyboardDoubleArrowDown color="green" />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:text-gray-600">
      <tr className="w-full text-black dark:text-white text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Team</th>
        <th className="py-2 hidden md:block">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className=" border-b border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300/10 dark:hover:bg-gray-700/10 ">
      <td className=" py-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 flex-shrink-0 rounded-full ${
              TASK_TYPE[task.stage]
            }`}
          />

          <p className="text-base text-black dark:text-white">{task.title}</p>
        </div>
      </td>

      <td className="py-2 pr-4">
        <div className="flex gap-1 items-center">
          <span className={`text-lg ${PRIORITY_STYLES[task.priority]}`}>
            {ICONS[task.priority]}
          </span>
          <span className="uppercase">{task.priority}</span>
        </div>
      </td>

      <td className="py-2 pr-4">
        <div className="flex">
          {task.team.map((m, index) => (
            <div
              key={index}
              className={`w-7 h-7 rounded-full text-white font-semibold  flex items-center justify-center text-sm -mr-1
                ${BGS[index % BGS.length]}`}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 hidden md:block">
        <span className="text-base text-gray-600 dark:text-gray-300">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full lg:w-2/3 bg-white dark:bg-[#121212] px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskTable;
