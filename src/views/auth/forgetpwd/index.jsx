"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from './forgetpwd.module.css'

import { ForgetPassword } from "../../../api/Auth";
import { toast } from "react-toastify";

const Forgetpassword = () => {
  const [loading,setLoading]=useState(false)
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await ForgetPassword(data.email);
      if (response) {
        toast.success(response.data.message);
        reset();
      }
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
      console.log(err);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className={styles.forgetpwd}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button disabled={loading} type="submit">{loading ? "Logging in..." : "Send Reset Link "}</button>
      </form>
      {loading && <p className={styles.loadingMessage}>Please wait...</p>}
    </div>
  );
};

export default Forgetpassword;
