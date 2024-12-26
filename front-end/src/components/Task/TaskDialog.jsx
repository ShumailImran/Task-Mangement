import { useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmationDialog from "../Dialogs";
import AddSubTask from "./AddSubTask";
import AddTask from "./AddTask";
import { toast } from "sonner";

const TaskDialog = ({ task, isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [deleteTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteClicks = () => {
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: task._id,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task._id}`),
      enabled: true, // Always enabled
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
      enabled: isAdmin,
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpen(true),
      enabled: isAdmin,
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => duplicateHandler(),
      enabled: isAdmin,
    },
    {
      label: "Delete",
      icon: <RiDeleteBin6Line className="mr-2 h-5 w-5 text-red-400" />,
      onClick: deleteClicks,
      enabled: isAdmin,
    },
  ];

  return (
    <>
      <div>
        <div className="relative inline-block text-left">
          {/* Dropdown trigger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-200"
          >
            <BsThreeDots />
          </button>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-800 rounded-md bg-white dark:bg-[#121212] shadow-lg ring-1 ring-black/5 focus:outline-none transform transition-all ${
              menuOpen
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible"
            }`}
          >
            <div className="px-1 py-1 space-y-2">
              {items.map((el) => (
                <button
                  key={el.label}
                  onClick={() => {
                    if (el.enabled) el.onClick();
                    setMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors z-10 ${
                    el.enabled
                      ? "text-gray-900 dark:text-gray-300 hover:bg-blue-500 hover:text-white "
                      : "text-gray-400 dark:text-gray-700 cursor-not-allowed"
                  }`}
                  disabled={!el.enabled}
                >
                  <span className="mr-2 h-5 w-5">{el.icon}</span>
                  {el.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
