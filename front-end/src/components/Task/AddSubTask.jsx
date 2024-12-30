import { useForm } from "react-hook-form";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";

function AddSubTask({ open, setOpen, id }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSubTask] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await addSubTask({
        data,
        id,
      }).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      console.log("hello world");
      toast.error(error.data.message || error.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <h2 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-300 mb-4">
            Add Sub Task
          </h2>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Sub-Task Title"
              type="text"
              name="title"
              className="w-full rounded dark:text-gray-200"
              register={register("title", { required: "Title is required" })}
              errors={errors.title ? errors.title.message : null}
            />

            <div className="flex items-center gap-4">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded dark:text-gray-200"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
              <Textbox
                placeholder="Tag"
                type="text"
                name="tag"
                label="Tag"
                className="w-full rounded dark:text-gray-200"
                register={register("tag", {
                  required: "Tag is required!",
                })}
                error={errors.tag ? errors.tag.message : ""}
              />
            </div>
          </div>

          <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
            <Button
              type="button"
              className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
            <Button
              type="submit"
              className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
              label="Add Task"
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
}

export default AddSubTask;
