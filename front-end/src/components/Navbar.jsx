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

          {/* <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          
          <input
          type="text"
          placeholder="Search..."
          className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
          </div> */}
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

          {/* <button
            className="w-10 h-10 bg-neutral-900 dark:bg-white rounded-full text-white dark:text-black font-semibold"
            onClick={toggleDarkMode}
          >
            {darkMode ? "🌞" : "🌜"}
          </button> */}
          <NotificationPanel />

          <UserAvatar />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
