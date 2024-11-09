// src/pages/profile.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "../../api/userprofile";
import { Image } from "next/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT token from local storage
        if (!token) {
          router.push("/login"); // Redirect to login if not logged in
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Profile</h1>

      <p>
        <strong>Username:</strong> {profile.data.username}
      </p>
      <p>
        <strong>Email:</strong> {profile.data.email}
      </p>
      <p>
        <strong>Date of Birth:</strong> {profile.data.dob}
      </p>
      <p>
        <strong>Gender:</strong> {profile.data.gender}
      </p>
    </div>
  );
}
