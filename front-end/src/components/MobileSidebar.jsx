import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [closing, setClosing] = useState(false); // Manages the closing animation

  // Close sidebar with animation
  const closeSidebar = () => {
    setClosing(true);
    setTimeout(() => {
      dispatch(setOpenSidebar(false));
      setClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <div
      className={`fixed inset-0 md:hidden bg-black/40 z-50 transition-opacity duration-300 ${
        isSidebarOpen || closing ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={closeSidebar}
    >
      <div
        className={`bg-white dark:bg-[#121212] w-3/4 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen && !closing ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 dark:text-gray-100">
          <button onClick={closeSidebar}>
            <IoClose size={25} />
          </button>
        </div>

        {/* Sidebar Content */}
        <Sidebar />
      </div>
    </div>
  );
};

export default MobileSidebar;
