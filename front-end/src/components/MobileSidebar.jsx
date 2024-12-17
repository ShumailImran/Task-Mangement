import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { setOpenSidebar } from "../redux/slices/authSlice";

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <div
      className={`fixed inset-0 md:hidden bg-black/40 z-50 transition-opacity duration-300 ${
        isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={closeSidebar}
    >
      <div
        className={`bg-white w-3/4 h-full shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
      >
        <div className={`flex justify-end p-4  `}>
          <button
            onClick={closeSidebar}
            className={` ${isSidebarOpen} ? "translate-x-full" :"translate-x-0" `}
          >
            <IoClose size={25} />
          </button>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default MobileSidebar;
