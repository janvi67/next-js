// src/pages/profile.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser, getUserProfile } from "../../api/userprofile";
import styles from "./profile.module.css";
import { toast } from "react-toastify";
import Cookie from "universal-cookie";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdDelete } from "react-icons/md";


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  var cookie = new Cookie();

  const handleLogout = () => {
    cookie.remove("token", { path: "/" });
    cookie.remove("role", { path: "/" });
    cookie.remove("cloudinaryUrl", { path: "/" });
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
      className="h-screen w-screen flex justify-center items-center dark:bg-gray-900"
    >
      <div className="grid gap-8">
        <div
          id="back-div"
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
        >
          <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
              Profile
            </h1>

            <img
              src={profile.data.profilepic}
              className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-blue-600 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
              alt="profilepic"
            />
            <button
              className="mt-4 bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg  text-white rounded-lg  px-4 py-2 hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              type="submit"
              disabled={loading}
              onClick={editprofile}
            >
              {loading ? "Logging in..." : "Edit Profile"}
            </button>
            <MdDelete type="submit" className="cursor-pointer h-7 w-10  text-indigo-800" disabled={loading} onClick={deleteProfile} >
            {loading ? "Logging in..." : "Delete Profile"}</MdDelete>

            <p className="text-2xl mt-3 font-bold text-indigo-800 mb-2">
              {profile.data.username}
            </p>

            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-800 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {profile.data.email}
              </li>

              <li class="flex items-center">
                <FaRegCalendarAlt className="h-5 w-5 mr-2 text-indigo-800 text-xl" />
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(profile.data.dob))}
              </li>

              <li class="flex items-center">
                <CgProfile class="h-5 w-5 mr-2 text-indigo-800 " />
                {profile.data.gender}
              </li>
            </ul>

            <br />
          

            <button type="submit" disabled={loading} onClick={deleteProfile}>
              {loading ? "Logging in..." : "Delete Profile"}
            </button>
            <br />
            <button
              type="submit"
              onClick={handleLogout}
              className={styles.logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
