import { FaRegTrashAlt, FaTasks } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";

import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";

const linkData = [
  { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "tasks", icon: <FaTasks /> },
  { label: "Completed", link: "completed/completed", icon: <MdTaskAlt /> },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  { label: "To Do", link: "todo/todo", icon: <MdOutlinePendingActions /> },
  { label: "Team", link: "team", icon: <LuUsers /> },
  { label: "Trash", link: "trashed", icon: <FaRegTrashAlt /> },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const currentPath = location.pathname.split("/")[1];
  // const sidebarLinks = linkData; // Customize links based on user roles if needed
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <div className="w-full h-full p-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white  text-2xl" />
        </div>
        <h1 className="text-2xl font-bold dark:text-white">TaskMe</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 flex flex-col gap-4">
        {sidebarLinks.map(({ label, link, icon }) => (
          <Link
            key={label}
            to={link}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2 rounded-full text-base ${
              currentPath === link.split("/")[0]
                ? "bg-blue-700 text-white "
                : "text-gray-800 dark:text-gray-200 hover:dark:text-[#121212] hover:bg-blue-100"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
