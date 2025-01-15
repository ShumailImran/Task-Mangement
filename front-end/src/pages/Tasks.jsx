import { useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import BoardView from "../components/BoardView";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Tabs from "../components/Tabs";
import AddTask from "../components/Task/AddTask";
import Table from "../components/Task/Table";
import TaskTitle from "../components/TaskTitle";
import Title from "../components/Title";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600 dark:bg-blue-500",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

function Tasks() {
  const { user } = useSelector((state) => state.auth);
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  return isLoading ? (
    <div className="py-10">
      <Loader />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && user?.isAdmin && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={data?.tasks} refetch={refetch} />
        ) : (
          <div className="w-full">
            <Table tasks={data?.tasks} refetch={refetch} user={user} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} refetch={refetch} />
    </div>
  );
}

export default Tasks;
