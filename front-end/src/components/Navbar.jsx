import { MdOutlineAddTask } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import UserAvatar from "./UserAvatar";
import { setOpenSidebar } from "../redux/slices/authSlice";
import NotificationPanel from "./NotificationPanel";

function Navbar({ toggleDarkMode, darkMode }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-white dark:bg-[#121212] px-4 py-3 2xl:py-4 sticky z-10 top-0 ">
        {/* LEFT SIDE */}
        <div className="flex gap-4">
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className="text-2xl text-gray-500 dark:text-gray-300 block md:hidden"
          >
            ☰
          </button>

          <div className="bg-blue-600 p-2 rounded-full md:hidden">
            <MdOutlineAddTask className="text-white text-2xl " />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-2 items-center">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="hidden"
            />
            <span className="slider round"></span>
          </label>

          <NotificationPanel />

          <UserAvatar />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
