"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { ForgetPassword } from "../../../api/Auth";
import { toast } from "react-toastify";

const Forgetpassword = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await ForgetPassword(email);
      if (response) {
        toast.success(response.data.message);
      }
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default Forgetpassword;
