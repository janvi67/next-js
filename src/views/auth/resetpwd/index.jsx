"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Using next/navigation for URL params
import { toast } from "react-toastify";
import { resetPassword } from "../../../api/Auth"; // Import the API call function

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Get URL query parameters

  useEffect(() => {
    // Extract the token from the URL
    const tokenFromUrl = searchParams.get("token");
    console.log("🚀 ~ useEffect ~ tokenFromUrl:", tokenFromUrl)
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or expired token.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send the reset request to the backend with the token and new password
      const response = await resetPassword(token, newPassword);

      if (response) {
        toast.success("Password reset successfully.");
        router.push("/login"); // Redirect to login after successful reset
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
