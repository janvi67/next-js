// src/pages/profile.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser, getUserProfile } from "../../api/userprofile";
import styles from "./profile.module.css";
import { toast } from "react-toastify";
import Cookie from "universal-cookie";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  var cookie = new Cookie();

  const handleLogout = () => {
    cookie.remove("token", { path: "/" });
    cookie.remove("role", { path: "/" });
    cookies.remove("cloudinaryUrl", { path: "/" });
    toast.success("user logout sucessfully");
    router.push("/login");
  };
  const editprofile = () => {
    setLoading(true);
    router.push("/profile/updateProfile");
  };
  const deleteProfile = async () => {
    setLoading(true);
    const confirmed = confirm("Are you sure you want to delete your account? ");
    if (!confirmed) return;

    try {
     
      const deletedata = await deleteUser();
      if (deletedata) {
        console.log("succees to delete profile");
        cookie.remove("token", { path: "/" });
        cookie.remove("role", { path: "/" });
        router.push("/");
      }
    } catch (error) {
      console.log("delete user", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = cookie.get("token");

        const data = await getUserProfile(token);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfile();
  }, [router]);

  if (!profile) {
    return <p className={styles.profileNotFound}>Profile not found.</p>;
  }
  console.log(
    "🚀 ~ ProfilePage ~ profile.profilepic:",
    profile.data?.profilepic
  );
  return (
    <div
      style={{ textAlign: "center", marginTop: "20px" }}
      className={styles.profile}
    >
      <h1>Profile</h1>
      <img
        src={profile.data.profilepic}
        className={styles.img}
        alt="profilepic"
      />
      <p>
        <strong>Username:</strong> {profile.data.username}
      </p>
      <p>
        <strong>Email:</strong> {profile.data.email}
      </p>
      <p>
        <strong>Date of Birth:</strong>
        {new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(profile.data.dob))}
      </p>
      <p>
        <strong>Gender:</strong> {profile.data.gender}
      </p>

      <br />
      <button type="submit" disabled={loading} onClick={editprofile}>
        {loading ? "Logging in..." : "Edit Profile"}
      </button>
      <button type="submit" disabled={loading} onClick={deleteProfile}>
        {loading ? "Logging in..." : "Delete Profile"}
      </button>
      <br />
      <button type="submit" onClick={handleLogout} className={styles.logout}>
        Logout
      </button>
    </div>
  );
}
