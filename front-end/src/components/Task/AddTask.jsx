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

function AddTask({ open, setOpen, task }) {
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
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
      // Set uploading state to true when the upload starts
      setUploading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("stage", stage);
      formData.append("priority", priority);
      formData.append("date", data.date);
      formData.append("team", JSON.stringify(team));
      assets.forEach((file) => formData.append("assets", file));

      // Check if task exists (for updating) or create a new task
      const url = task?._id
        ? `/api/tasks/update/${task._id}` // For updating
        : `/api/tasks/create`; // For creating

      const response = await fetch(url, {
        method: task?._id ? "PUT" : "POST",
        body: formData,
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Something went wrong");
      }

      // Set uploading state to false after the upload is completed
      setUploading(false);

      toast.success(resData.message);
      setOpen(false);
    } catch (error) {
      // Set uploading state to false if there's an error
      setUploading(false);
      toast.error(error.message);
    }
  };

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    setAssets((prevAssets) => [...prevAssets, ...files]);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <h2 className="text-base font-bold leading-6 text-gray-900 mb-4">
            {task ? "UPDATE TASK" : "ADD TASK"}
          </h2>

          <div className="mt-2 flex flex-col gap-6">
            {/* TASK TITLE */}
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
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
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", { required: "Date is required" })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              {/* TASK PRIORITY */}
              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />

              {/* ASSETS */}
              <div className="w-full flex items-center justify-center mt-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
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

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
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

              {/* CANCEL */}
              <Button
                label="Cancel"
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
}

export default AddTask;
