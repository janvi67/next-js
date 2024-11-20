"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { resetPassword } from "../../../api/Auth";
import styles from "./resetpwd.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("new password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibilitycp = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    setIsMounted(true);
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or expired token.");
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await resetPassword(token, data.newPassword);
      if (response) {
        toast.success("Password reset successfully.");
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetpwd}>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.passwordWrapper}>
          <input
            {...register("newPassword")}
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
          />
          {isMounted && ( // Conditional rendering of toggle button
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </div>
        <div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {isMounted && ( // Conditional rendering of toggle button
            <button type="button" onClick={togglePasswordVisibilitycp}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit">
          {loading ? "Logging in..." : "Reset Password"}
        </button>
      </form>
      {loading && <p className={styles.loadingMessage}>Please wait...</p>}
    </div>
  );
};

export default ResetPassword;
