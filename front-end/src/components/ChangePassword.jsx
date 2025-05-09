import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import Loader from "./Loader";
import Button from "./Button";
import { useSelector } from "react-redux";

function ChangePassword({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [changeUserPassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    if (user.email === "demouser@gmail.com") {
      toast.error("Demo user can't change password");
      return;
    }
    if (data.password !== data.cpass) {
      toast.warning("Password doesn't match");
      return;
    }
    try {
      const res = await changeUserPassword(data).unwrap();
      toast.success("Password Changed Successfully");

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <h2 className="text-base font-bold leading-6 text-gray-900 dark:text-gray-200 mb-4">
            Change Password
          </h2>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="New Password"
              type="password"
              name="password"
              label="New Password"
              className="w-full rounded"
              register={register("password", {
                required: "New Password is required",
              })}
              error={errors.password ? errors.password.message : ""}
            />

            <Textbox
              placeholder="Confirm New Password"
              type="password"
              name="cpass"
              label="Confirm New Password"
              className="w-full rounded"
              register={register("cpass", {
                required: "Confirm New Password is required",
              })}
              error={errors.cpass ? errors.cpass.message : ""}
            />
          </div>

          {isLoading ? (
            <div className="py-5">
              <Loader />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="bg-white dark:bg-[#121212] px-5 text-sm font-semibold text-gray-900 dark:text-gray-200 sm:w-auto"
              >
                Cancel
              </button>
              <Button
                type="submit"
                label="Save"
                className="bg-blue-600 px-8 text-sm font-semibold text-white  hover:bg-blue-700"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
}

export default ChangePassword;
