"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
//   const { token } = router.query;  // Retrieve token from the URL query string

//   useEffect(() => {
//     if (!token) {
//       setError('Invalid or expired token.');
//     }
//   }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/resetPassword', {
        token,
        newPassword,
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => router.push('/login'), 2000);  // Redirect to login page after successful reset
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} >
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ResetPassword;
