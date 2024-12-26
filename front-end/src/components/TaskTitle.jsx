import { IoMdAdd } from "react-icons/io";

function TaskTitle({ label, className }) {
  return (
    <div className="w-full h-10 md:h-12 px-2 md:px-4 rounded bg-white dark:bg-[#121212] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${className}`} />
        <p className=" text-sm md:text-base text-gray-600 dark:text-gray-300">
          {label}
        </p>
      </div>

      <button className="hidden md:block">
        <IoMdAdd className="text-lg text-black" />
      </button>
    </div>
  );
}

export default TaskTitle;
