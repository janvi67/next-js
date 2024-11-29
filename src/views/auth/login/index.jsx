"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./loginform.module.css";
import { LoginUser } from "../../../api/Auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/userAuth";
import Cookie from "universal-cookie";

const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup
    .string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must contain 8 characters, one uppercase, one lowercase, one number, and one special character"
    ),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const dispatch = useDispatch();
  var cookie = new Cookie();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (formData) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await LoginUser(formData);
      console.log("🚀 ~ onSubmit ~ response :", response);
      const token = response?.data?.accesstoken;
      console.log("🚀 ~ onSubmit ~ token:", token);

      const role = response?.data.role;
      console.log("🚀 ~ onSubmit ~ role:", role);

      if (token) {
        console.log("🚀 ~ onSubmit ~ token:", token);
        const userObj = {
          email: formData.email,
          role,
        };
        dispatch(login(userObj));

        if (token) {
          cookie.set("token", token, { path: "/" });

          if (role) {
            console.log("🚀 ~ onSubmit1 ~ role:", role);
            cookie.set("role", role, { path: "/" });

            if (role === "admin") {
              toast.success("admin login successful");
              router.push("/showusers");
            } else if (role === "user") {
              toast.success("User login successful");
              router.push("/profile");
            } else {
              toast.warning("Unrecognized role");
            }
          } else {
            toast.error("Role information is missing");
          }
        } else {
          toast.error("Token is missing or invalid");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid login data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900">
      <div className="grid gap-8">
        <div
          id="back-div"
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
        >
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
              Log in
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2  dark:text-gray-400 text-lg"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 dark:text-gray-400 text-lg"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="forgetpwd"
              >
                <span className="bg-left-bottom float-end pt-2  font-semibold bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Forget your password?
                </span>
              </a>
              <button
                className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="flex flex-col mt-4 items-center justify-center text-sm">
                <h3 className="dark:text-gray-300">
                  Don&apos;t have an account?
                  <a
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="register"
                  >
                    <span className="bg-left-bottom font-semibold pl-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                      Sign Up
                    </span>
                  </a>
                </h3>
              </div>
            </form>
            {loading && <p className={styles.loadingMessage}>Please wait...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
