"use client";
import { fetchUsers } from "@/api/userprofile";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from './showusers.module.css'

export default function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") 

  useEffect(() => {
    const getUsers = async () => {
      if (token) {
        try {
          const res = await fetchUsers(token);
          const data = res.data;
          setUsers(data.users);
          setLoading(false);
        } catch (error) {
          toast.error("Failed to load users.");
          setLoading(false);
        }
      } else {
        toast.error("No token found, please login first.");
        setLoading(false);
      }
    };

    getUsers();
  }, [token]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={styles.userscontainer}>
      <h2>All Users</h2>
      <div className={styles.usercards}>
        {users.map((user) => (
          <div key={user._id} className={styles.usercard}>
            <img src={user.profilepic} alt="Profile" className={styles.profilepic} />
            <h3>{user.username}</h3>
            <p>Email: {user.email}</p>
            <p>Date of Birth:  {new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(user.dob))}</p>
            <p>Gender: {user.gender}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
