import { useEffect, useRef } from "react";

function ModalWrapper({ open, setOpen, children }) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => setOpen(false)} // Close on backdrop click
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      <div
        className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-[#121212] shadow-xl transition-all sm:my-8"
        role="document"
        aria-labelledby="modal-title"
      >
        <div className="bg-white dark:bg-[#121212] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            {/* Modal Content */}
            <div
              className="mt-3 w-full sm:mt-0 sm:text-left"
              ref={cancelButtonRef}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="text-xl absolute top-2 right-2 text-gray-400  dark:hover:text-gray-200 hover:text-gray-600"
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ModalWrapper;
