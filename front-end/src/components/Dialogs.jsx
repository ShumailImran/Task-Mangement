import { FaQuestion } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <h3>
            <p
              className={`p-2 rounded-full ${
                type === "restore" || type === "restoreAll"
                  ? "text-blue-600 bg-blue-100"
                  : "text-red-600 bg-red-200"
              }`}
            >
              <FaQuestion size={32} />
            </p>
          </h3>

          <p className="text-center text-gray-500 dark:text-gray-200">
            {msg ?? "Are you sure you want to delete the selected record?"}
          </p>

          <div className="bg-gray-50 dark:bg-[#121212] py-3 flex flex-row-reverse gap-6">
            <Button
              type="button"
              className="bg-white dark:bg-[#121212] px-8 text-sm font-semibold text-gray-900 dark:text-gray-200 sm:w-auto border border-gray-700"
              onClick={() => closeDialog()}
              label="Cancel"
            />

            <Button
              type="button"
              className={`px-8 text-sm font-semibold text-white sm:w-auto ${
                type === "restore" || type === "restoreAll"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={onClick}
              label={
                type === "restore" || type === "restoreAll"
                  ? "Restore"
                  : "Delete"
              }
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <h3 className="">
            <p className={`p-2 rounded-full text-red-600 bg-red-200`}>
              <FaQuestion size={32} />
            </p>
          </h3>

          <p className="text-center text-gray-500">
            {"Are you sure you want to activate or deactive this account?"}
          </p>

          <div className=" py-3 flex flex-row-reverse gap-4">
            <Button
              type="button"
              className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border"
              onClick={() => closeDialog()}
              label="No"
            />

            <Button
              type="button"
              className={`px-8 text-sm font-semibold text-white sm:w-auto bg-red-600 hover:bg-red-500`}
              onClick={onClick}
              label={"Yes"}
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}
