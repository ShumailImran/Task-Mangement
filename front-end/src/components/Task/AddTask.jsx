import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";

import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UserList";
import { dateFormatter } from "../../utils";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

function AddTask({ open, setOpen, task, refetch }) {
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    description: task?.description || "",
    team: task?.team || [],
    stage: task?.stage || LISTS[0],
    priority: task?.priority || PRIORITY[2],
    assets: task?.assets || [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  );
  const [assets, setAssets] = useState(task?.assets || []);
  const [uploading, setUploading] = useState(false);

  const submitHandler = async (data) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("stage", stage);
      formData.append("priority", priority);
      formData.append("date", data.date);
      formData.append("description", data.description);
      formData.append("team", JSON.stringify(team));

      // Separate URLs and files
      const urls = assets.filter((item) => typeof item === "string"); // Existing URLs
      const files = assets.filter((item) => typeof item !== "string"); // New files

      urls.forEach((url) => formData.append("assets", url)); // Append existing URLs
      files.forEach((file) => formData.append("assets", file)); // Append new files

      const url = task?._id
        ? `${import.meta.VITE_APP_BASE_URL}/api/tasks/update/${task._id}`
        : `${import.meta.VITE_APP_BASE_URL}/api/tasks/create`;

      const response = await fetch(url, {
        method: task?._id ? "PUT" : "POST",
        body: formData,
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Something went wrong");
      }

      setUploading(false);
      toast.success(resData.message);

      if (refetch) {
        refetch();
      } else {
        window.location.reload();
      }
      setOpen(false);
    } catch (error) {
      setUploading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);

    // Append only file objects
    setAssets((prevAssets) => [
      ...prevAssets.filter((item) => typeof item !== "string"),
      ...files,
    ]);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <h2 className="text-base font-bold leading-6 text-gray-900 dark:text-gray-300 mb-4">
            {task ? "UPDATE TASK" : "ADD TASK"}
          </h2>

          <div className="mt-2 flex flex-col gap-6">
            {/* TASK TITLE */}
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded text-gray-300"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : null}
            />

            {/* ASSIGNED TO */}
            <UserList setTeam={setTeam} team={team} />

            {/* TASK STAGE */}
            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                {/* TASK PRIORITY */}
                <SelectList
                  label="Priority Level"
                  lists={PRIORITY}
                  selected={priority}
                  setSelected={setPriority}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded dark:text-gray-300"
                register={register("date", { required: "Date is required" })}
                error={errors.date ? errors.date.message : ""}
              />

              {/* ASSETS */}
              <div className="w-full flex items-center justify-center mt-4">
                <label
                  htmlFor="imgUpload"
                  className="dark:text-gray-300 flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                >
                  <input
                    type="file"
                    id="imgUpload"
                    className="hidden"
                    onChange={handleSelect}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>
            <Textbox
              placeholder="Task Description"
              type="text"
              multiline={true}
              name="description"
              label="Task Description"
              className="w-full rounded text-gray-300"
              register={register("description", {
                required: "Description is required",
              })}
              error={errors.title ? errors.title.message : null}
            />

            <div className="bg-gray-50 dark:bg-[#121212] py-6 flex flex-row-reverse gap-4">
              {/* CANCEL */}
              <Button
                label="Cancel"
                type="button"
                className="bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
              />

              {uploading ? (
                <span className="text-sm py-2 text-blue-500">
                  Uploading Assets
                </span>
              ) : (
                // SUBMIT

                <Button
                  label="Submit"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
}

export default AddTask;
