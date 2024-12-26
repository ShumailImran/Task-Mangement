import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

function ViewNotification({ open, setOpen, el }) {
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
          <h3 className="font-semibold text-lg dark:text-gray-300">
            {el?.task?.title}
          </h3>
          <p className="text-start text-gray-500 dark:text-gray-200">
            {el?.text}
          </p>

          <Button
            type="button"
            className="bg-white dark:bg-[#121212] px-8 mt-3 text-sm font-semibold text-gray-900 dark:text-gray-300 sm:w-auto border"
            onClick={() => setOpen(false)}
            label="Ok"
          />
        </div>
      </ModalWrapper>
    </>
  );
}

export default ViewNotification;
