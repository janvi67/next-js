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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="btn btn-secondary"
        >
          Register
        </button>

        <button
          type="button"
          onClick={() => router.push("/forgetpwd")}
          className="btn btn-secondary"
        >
          forgetPassword
        </button>
      </form>
      {loading && <p className={styles.loadingMessage}>Please wait...</p>}
    </div>
  );
}
