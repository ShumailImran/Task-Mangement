import moment from "moment";
import { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Tabs from "../components/Tabs";
import {
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import { PRIORITY_STYLES, TASK_TYPE, getInitials } from "../utils";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
  normal: <MdKeyboardDoubleArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

function TaskDetails() {
  const { id } = useParams();

  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

  const [selected, setSelected] = useState(0);
  const task = data?.task;

  if (isLoading)
    return (
      <div className="py-10">
        <Loader />
      </div>
    );
  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 dark:text-gray-200 font-bold ">
        {task?.title}
      </h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white dark:bg-black/50 shadow-md p-8 overflow-y-auto">
              {/* -----------LEFT SIDE------------ */}

              <div className="w-full md:w-1/2 space-y-8">
                <div className="flex items-center gap-5">
                  {/* PRIORITY */}
                  <div
                    className={`flex gap-1 items-center text-base font-medium px-3 py-1 rounded-full ${
                      PRIORITY_STYLES[task?.priority]
                    } ${bgColor[task?.priority]}`}
                  >
                    <span className="text-lg">{ICONS[task?.priority]}</span>
                    <span className="uppercase">{task?.priority} Priority</span>
                  </div>

                  {/* STAGE */}
                  <div className={`flex items-center gap-2`}>
                    <div
                      className={`w-4 h-4 rounded-full ${
                        TASK_TYPE[task?.stage]
                      }`}
                    />
                    <span className="text-black dark:text-gray-300 uppercase">
                      {task?.stage}
                    </span>
                  </div>
                </div>

                {/* CREATED AT */}

                <p className="text-gray-500 dark:text-gray-200">
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className="flex items-center gap-8 p-4 border-y border-gray-200 dark:border-gray-700 dark:text-gray-200">
                  {/* ASSETS */}
                  <div className="space-x-2 ">
                    <span className="font-semibold ">Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  {/* SUB-TASK */}
                  <div className="space-x-2 ">
                    <span className="font-semibold ">Sub-Task :</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>
                {/* Description */}

                {/* TEAM */}

                <div className="space-y-4 py-6 dark:text-gray-200">
                  <p className="text-gray-600 dark:text-gray-200 font-medium text-sm">
                    TASK TEAM
                  </p>
                  <div className="space-y-3">
                    {task?.team?.map((m, index) => (
                      <div
                        className="flex gap-4 py-2 items-center border-t border-gray-200 dark:border-gray-700"
                        key={index}
                      >
                        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600">
                          <span className="text-center">
                            {getInitials(m?.name)}
                          </span>
                        </div>

                        <div>
                          <p className="text-lg font-semibold ">{m?.name}</p>
                          <span className="text-gray-500 dark:text-gray-400">
                            {m?.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUB-TASK */}

                <div className="space-y-4 py-6 ">
                  <p className="text-gray-500 dark:text-gray-200 font-semibold text-sm">
                    SUB-TASKS
                  </p>
                  <div className="space-y-8">
                    {task?.subTasks?.map((el, index) => (
                      <div className="flex gap-3" key={index}>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-200">
                          <MdTaskAlt className="text-violet-600" size={26} />
                        </div>

                        <div className="space-y-1 ">
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-200">
                              {new Date(el?.date).toDateString()}
                            </span>
                            <span className="px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold">
                              {el?.tag}
                            </span>
                          </div>

                          <p className="text-gray-700 dark:text-gray-400">
                            {el?.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* --------RIGHT SIDE---------- */}
              <div className="w-full md:w-1/2 space-y-8">
                <p className="text-lg font-semibold  dark:text-gray-200">
                  ASSETS
                </p>

                <div className="w-full grid grid-cols-2 gap-4">
                  {task?.assets?.map((el, index) => (
                    <img
                      src={el}
                      key={index}
                      alt={task?.title}
                      className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50"
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities
              activity={data?.task?.activities}
              id={id}
              refetch={refetch}
            />
          </>
        )}
      </Tabs>
    </div>
  );
}

function Activities({ activity, id, refetch }) {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    try {
      const activityData = {
        type: selected?.toLowerCase(),
        activity: text,
      };

      const result = await postActivity({
        data: activityData,
        id,
      }).unwrap();

      setText("");
      toast.success(result?.message);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  function Card({ item }) {
    return (
      <div className="flex space-x-4">
        {/* Icon and Line Container */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            {TASKTYPEICON[item?.type]}
          </div>
          {/* Vertical Line */}
          <div className="w-0.5 bg-gray-300 dark:bg-gray-700 h-full"></div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-y-1 mb-8">
          <p className="font-semibold dark:text-gray-300">{item?.by?.name}</p>
          <div className="text-gray-500 space-y-2">
            <span className="capitalize">{item?.type} &nbsp;</span>
            <span className="text-sm">{moment(item?.date).fromNow()}</span>
          </div>
          <div className="text-gray-700 dark:text-gray-400">
            {item?.activity}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen py-8 px-10 bg-white dark:bg-black/50 shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 dark:text-gray-200 font-semibold text-lg mb-5">
          Activities
        </h4>

        <div className="w-full ">
          {activity?.map((el, index) => (
            <Card
              key={index}
              item={el}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <h4 className="text-gray-600 dark:text-gray-300 font-semibold text-lg mb-5">
          Add Activity
        </h4>

        <div className="w-full flex flex-wrap gap-5">
          {act_types.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-2 dark:text-gray-400"
            >
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selected === item ? true : false}
                onChange={() => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type ...."
            className="bg-white dark:bg-[#121212] dark:text-gray-300 w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
          ></textarea>
          {isLoading ? (
            <Loader />
          ) : (
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
