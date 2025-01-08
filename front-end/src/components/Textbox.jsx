/* eslint-disable react/display-name */
import { forwardRef } from "react";

const Textbox = forwardRef(
  (
    {
      type = "text",
      placeholder,
      label,
      className,
      register,
      name,
      error,
      multiline = false,
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={name} className="text-slate-800 dark:text-slate-200">
            {label}
          </label>
        )}

        <div>
          {multiline ? (
            <textarea
              name={name}
              placeholder={placeholder}
              ref={ref}
              {...register}
              aria-invalid={error ? "true" : "false"}
              className={`bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 dark:text-gray-200 outline-none text-base focus:ring-2 ring-blue-300 ${
                className ? className : ""
              }`}
            />
          ) : (
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              ref={ref}
              {...register}
              aria-invalid={error ? "true" : "false"}
              className={`bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 dark:text-gray-200 outline-none text-base focus:ring-2 ring-blue-300 ${
                className ? className : ""
              }`}
            />
          )}
        </div>

        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5 ">{error}</span>
        )}
      </div>
    );
  }
);

export default Textbox;
