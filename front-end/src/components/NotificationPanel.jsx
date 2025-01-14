import moment from "moment";
import { useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  useGetNotificationQuery,
  useMarkNotiAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import ViewNotification from "./ViewNotification";

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false); // Controls the state of the notification panel
  const [selected, setSelected] = useState(null); // Stores the selected notification for viewing
  const { data, refetch } = useGetNotificationQuery();
  const [markAsRead] = useMarkNotiAsReadMutation();

  // Mark a notification as read, and close the popover if needed
  const readHandler = async (type, id, closePopover) => {
    await markAsRead({ type, id }).unwrap();
    refetch();
    if (closePopover) closePopover();
  };

  // Handle viewing a specific notification
  const viewHandler = async (el) => {
    setSelected(el); // Set the selected notification for viewing
    readHandler("one", el._id); // Mark it as read
    setOpen(true); // Open the modal to view the notification details
  };

  // Action buttons in the notification panel
  const callsToAction = [
    {
      name: "Mark All Read",
      href: "#",
      onClick: (closePopover) => readHandler("all", "", closePopover),
    },
    { name: "Cancel", href: "#", onClick: () => setOpen(false) },
  ];

  return (
    <>
      {/* Notification Icon */}
      <div className="relative">
        <button
          className="inline-flex items-center outline-none"
          onClick={() => setOpen((prev) => !prev)} // Toggle the visibility of the notification panel
        >
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 dark:text-gray-300 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {data?.notification?.length > 0 && (
              <span className="flex items-center justify-center absolute text-center top-0 right-1 text-[8px] text-white font-semibold w-3.5 h-3.5 rounded-full bg-red-600">
                {data.notification.length}
              </span>
            )}
          </div>
        </button>

        {/* Notification Popover */}
        {open && (
          <div className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {data?.notification?.length > 0 && (
              <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white dark:bg-[#121212] text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {data.notification.slice(0, 5).map((item, index) => (
                    <div
                      key={item._id + index}
                      className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => viewHandler(item)} // View the notification details on click
                    >
                      <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-[#121212]">
                        <span className="w-6 h-6 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                          {ICONS[item.notiType] || "No Icon"}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-400 capitalize">
                          <p>{item.notiType || "Notification"}</p>
                          <span className="text-xs font-normal lowercase">
                            {moment(item.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="line-clamp-1 mt-1 text-gray-600 dark:text-gray-300">
                          {item.text || "No text provided"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x dark:divide-gray-700 bg-gray-50 dark:bg-gray-800">
                  {callsToAction.map((item) => (
                    <Link
                      key={item.name}
                      onClick={() =>
                        item?.onClick ? item.onClick() : setOpen(false)
                      }
                      className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ViewNotification Component */}
      {selected && (
        <ViewNotification open={open} setOpen={setOpen} el={selected} />
      )}
    </>
  );
};

export default NotificationPanel;
