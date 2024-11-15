// src/pages/profile.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser, getUserProfile } from "../../api/userprofile";
import { clearAuthData } from "../../utils/Auth";
import styles from "./profile.module.css";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
   
    clearAuthData();
    toast.success("user logout sucessfully")
    router.push("/login");
  };
  const editprofile = () => {
    router.push("/profile/updateProfile");
  };
  const deleteProfile = async () => {
    const confirmed = confirm("Are you sure you want to delete your account? ");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token not found.");
        return;
      }
      const deletedata = await deleteUser(token);
      if (deletedata) {
        console.log("succees to delete profile");
        clearAuthData();
        router.push("/");
      }
    } catch (error) {
      console.log("delete user", error);
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          router.push("/login"); 
          return;
        }
        const data = await getUserProfile(token);
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
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
      <button type="submit" onClick={editprofile}>
        Edit Profile
      </button>
      <button type="submit" onClick={deleteProfile}>
        delete Profile
      </button>
      <button type="submit" onClick={()=>router.push("/familyDetails")}>
        Add FamilyDetails
      </button><br/>
      <button type="submit" onClick={handleLogout} className={styles.logout}>
        Logout
      </button>
    </div>
  );
}
