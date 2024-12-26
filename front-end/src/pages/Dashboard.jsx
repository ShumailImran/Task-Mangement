import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import { MdAdminPanelSettings } from "react-icons/md";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Loader from "../components/Loader";
import TaskTable from "../components/TaskTable";
import UserTable from "../components/UserTable";
import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";

function Dashboard() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading)
    return (
      <div className="py-10">
        <Loader />
      </div>
    );

  const totals = data?.tasks;

  const stats = [
    {
      id: "1",
      label: "TOTAL TASKS",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },

    {
      id: "2",
      label: "COMPLETED TASKS",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },

    {
      id: "3",
      label: "TASK IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },

    {
      id: "4",
      label: "TODOS",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  return (
    <div className="h-full py-4 ">
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="w-full bg-white dark:bg-[#121212] my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
          Charts By Priority
        </h4>
        <Chart data={data?.graphData} />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 2xl:gap-10 py-8">
        {/* /left */}

        <TaskTable tasks={data.last10Task} />

        {/* /right */}

        <UserTable users={data?.user} />
      </div>
    </div>
  );
}

export default Dashboard;
