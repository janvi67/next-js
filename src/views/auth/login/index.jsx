"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./loginform.module.css";
import { LoginUser } from "../../../api/Auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../../slices/userAuth";

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
  const onSubmit = async (formData) => {
    console.log("🚀 ~ onSubmit ~ data:", formData);
    try {
      const response = await LoginUser(formData);
      console.log("🚀 ~ onSubmit ~ response:", response.data.accesstoken);
      const token = response?.data?.accesstoken;

      if (token) {
        const userObj = {
          email: formData.email,
        };

        dispatch(login(userObj));

        localStorage.setItem("token", token);

        toast.success("Login successful");
        router.push("/");
      } else {
        throw new Error("Invalid login data");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
      reset();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginform}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
