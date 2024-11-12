"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ForgetPassword } from "../../../api/Auth";
import { toast } from "react-toastify";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
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
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Forgetpassword;
