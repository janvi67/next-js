"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./registerform.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RegisterUser } from "../../../api/Auth";

function RegisterForm() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username  is required"),

    dob: Yup.string()
      .required("Date of Birth is required")
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Date of Birth must be in the format YYYY-MM-DD"
      ),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    gender: Yup.string().required("Gender is required"),
    profilepic: Yup.mixed().test(
      "fileType",
      "Invalid file types!",
      function (value) {
        if (!value || value.length === 0) {
          return this.createError({ message: "profilepic  is required" });
        }

        if (typeof value === "string" && isValidUrl(value)) {
          return true;
        }

        const allowedExtensions = /(jpeg|jpg|png|pdf)$/;
        const maxSize = 1 * 1024 * 1024;

        for (const file of value) {
          const extension = (file.type || "").split("/").pop();
          const size = file.size || 0;

          if (!allowedExtensions.test(extension)) {
            return this.createError({
              message: "Invalid file types. allow only image!",
            });
          }

          if (size > maxSize) {
            return this.createError({
              message: "File size should be less than 1MB!",
            });
          }
        }

        return true;
      }
    ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibilitycp = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("username", data.username);
      formData.append("dob", data.dob);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("gender", data.gender);

      if (data.profilepic[0] && data.profilepic) {
        formData.append("profilepic", data.profilepic[0]);
      } else {
        toast.error("something went wrong");
      }
      if (loading) return;
      setLoading(true);
      const response = await RegisterUser(formData);

      if (response.data) {
        toast.success("Sign-Up Successful!", {
          autoClose: 2000,
          position: "top-center",
        });
        setTimeout(() => router.push("/login"), 2000);
        console.log("sucess");
      }
    } catch (error) {
      if (error.response) {
        if (error.response?.status === 409) {
          toast.error("User already exists. Please use a different email.");
        } else {
          toast.error("something went wrong");
        }
      } else {
        toast.error("registration fail");
      }

      toast.error("something is wrong please try again later...");
    } finally {
      setLoading(false);
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900 ">
      <div className="grid gap-8">
        <div
          id="back-div"
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
        >
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h5 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
              Sign Up
            </h5>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div >
                  <div className="flex items-center">
                    <label className="mb-2  dark:text-gray-400 text-lg w-3/6">
                      UserName
                    </label>
                    <input
                      {...register("username")}
                      type="text"
                      className="border p-3 dark:bg-indigo-700  text-gray-600  dark:text-gray-300  dark:border-gray-700 shadow-md  focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                    />
                    {errors.username && (
                      <p className={styles.error}>{errors.username.message}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div  className="flex items-center">
                    <label className="mb-2 text-nowrap  dark:text-gray-400 text-lg w-3/6">
                      Date of Birth
                    </label>
                    <input
                      {...register("dob")}
                      type="date"
                      max={today}
                      className="border p-3 dark:bg-indigo-700 dark:text-gray-300 text-gray-600  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                    />
                    {errors.dob && (
                      <p className={styles.error}>{errors.dob.message}</p>
                    )}
                  </div>
                  </div>
                  <div className="form-row">
                  <div className="flex items-center">
                    <label className="mb-2  dark:text-gray-400 text-lg w-3/6">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className=" border p-3 dark:bg-indigo-700 dark:text-gray-300 text-gray-600  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                    />
                    {errors.email && (
                      <p className={styles.error}>{errors.email.message}</p>
                    )}
                  </div>
                  </div>
              

                <div className="form-row ">
                  <div className="flex items-center" >
                    <label className="mb-2 flex dark:text-gray-400 text-lg w-3/6">
                      Password
                    </label>
                    <div className="w-full">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className=" border  p-3 relative dark:bg-indigo-700 dark:text-gray-300 text-gray-600  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                      />
                      {isMounted && (
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute mt-4 -ml-8"
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      )}
                    </div>
                    {errors.password && (
                      <p className={styles.error}>{errors.password.message}</p>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="flex gap-2 items-center">
                    <label className="mb-2 text-nowrap dark:text-gray-400 text-lg ">
                      Confirm Password
                    </label>
                    <div className="w-full">
                      <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        className=" border p-3 relative dark:bg-indigo-700 dark:text-gray-300 text-gray-600  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                      />
                      {isMounted && (
                        <button
                          type="button"
                          onClick={togglePasswordVisibilitycp}
                          className="absolute mt-4 -ml-8"
                        >
                          {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      )}
                    </div>
                    {errors.password && (
                      <p className={styles.error}>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="flex items-center gap-3">
                    <label className="mb-2  dark:text-gray-400 text-lg w-3/6">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      defaultValue=""
                      className=" border p-3 relative dark:bg-indigo-700 dark:text-gray-300 text-gray-600  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                    >
                      <option value="" label="Select gender" />
                      <option value="Male" label="Male" />
                      <option value="Female" label="Female" />
                      <option value="Other" label="Other" />
                    </select>
                    {errors.gender && (
                      <p className={styles.error}>{errors.gender.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex  gap-3  items-centerl">
                  <label className="mb-2  dark:text-gray-400 text-lg w-3/6 text-nowrap">
                    Profile Picture
                  </label>
                  <input
                    {...register("profilepic")}
                    type="file"
                    accept="image/jpeg, image/png"
                    className=" border p-3 relative dark:bg-indigo-700 dark:text-gray-300 text-gray-600  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  />
                  {errors.profilepic && (
                    <p className={styles.error}>{errors.profilepic.message}</p>
                  )}
                </div>

                <div className="form-group form-check">
                  <input
                    {...register("acceptTermsandConditions")}
                    type="checkbox"
                    id="acceptTermsandConditions"
                  />
                  <label
                    className="mb-2  dark:text-gray-400 text-lg pl-2"
                    htmlFor="acceptTermsandConditions"
                  >
                    Accept Terms & Conditions
                  </label>
                  {errors.acceptTermsandConditions && (
                    <p className={styles.error}>
                      {errors.acceptTermsandConditions.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-3 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                  >
                    {loading ? "Logging in..." : "Register Account"}
                  </button>
                  <h3 className="dark:text-gray-300 mt-3">
                  Already have an account?
                  <a
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="login"
                  >
                    <span className="bg-left-bottom font-semibold pl-1  bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                      Sign in here
                    </span>
                  </a>
                </h3>
                
                  <a  onClick={() => reset()}
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="#"
                  >
                    <span className=" float-end -mt-5 bg-left-bottom font-semibold pl-1  bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                   Reset Form
                    </span>
                  </a>
             
                </div>
              </form>
              {loading && (
                <p className={styles.loadingMessage}>Please wait...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
