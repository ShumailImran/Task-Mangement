import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
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
    <HiBellAlert className="h-5 w-5 text-gray-600  group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600   group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, refetch } = useGetNotificationQuery();
  const [markAsRead] = useMarkNotiAsReadMutation();

  const readHandler = async (type, id, closePopover) => {
    await markAsRead({ type, id }).unwrap();
    refetch();

    // Close the popover after the action
    if (closePopover) {
      closePopover();
    }
  };

  const viewHandler = async (el) => {
    setSelected(el);
    readHandler("one", el._id);
    setOpen(true);
  };

  const callsToAction = [
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: (closePopover) => readHandler("all", "", closePopover),
    },
    { name: "Cancel", href: "#", icon: "", onClick: () => setOpen(false) },
  ];

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 dark:text-gray-300 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {data?.notification?.length > 0 && (
              <span className="flex items-center justify-center absolute text-center top-0 right-1 text-[8px] text-white  font-semibold w-3.5 h-3.5 rounded-full bg-red-600">
                {data.notification.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              data?.notification?.length > 0 && (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white dark:bg-[#121212] text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {data.notification.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-[#121212]">
                          {ICONS[item.notiType] || <div>No Icon</div>}
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => viewHandler(item)}
                        >
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
                  <div className="grid grid-cols-2 divide-x bg-gray-50 dark:bg-gray-800">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={() =>
                          item?.onClick ? item.onClick(close) : close()
                        }
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>

      <ViewNotification open={open} setOpen={setOpen} el={selected} />
    </>
  );
};

export default NotificationPanel;
