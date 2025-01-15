import { useState } from "react";
import { getInitials } from "../utils";

function UserInfo({ user }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <div className="relative px-4">
      <button
        onClick={togglePopover}
        className="inline-flex items-center outline-none"
      >
        <span>{getInitials(user?.name)}</span>
      </button>

      <div
        className={`absolute right-1 z-20 mt-3 w-90 max-w-sm  transform px-4 sm:px-0 transition-all duration-300 ${
          isPopoverOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 rounded-lg shadow-lg bg-white dark:bg-[#121212] p-4">
          <div className="w-16 h-16 flex-shrink-0 bg-blue-600 rounded-full text-white font-bold flex items-center justify-center text-2xl">
            <span>{getInitials(user?.name)}</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-black dark:text-white text-xl font-bold">
              {user?.name}
            </p>
            <span className="text-base text-gray-500 dark:text-gray-100">
              {user?.title}
            </span>
            <span className="text-blue-500">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
