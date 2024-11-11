"use client";
import { useEffect, useState } from "react";
import styles from './update.profile.module.css'
import { useRouter } from "next/navigation";
import { UpdateUser } from "@/api/userprofile";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      if (!profilePic) {
        setErrorMessage("Please upload a profile picture.");
        return;
      }

      const formData = new FormData();
      formData.append("username", username);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("profilepic", profilePic);

      const response = await UpdateUser(formData);
      if(response){
        setSuccessMessage("Profile updated successfully!");
        router.push("/profile")
      }
      else{
        setErrorMessage("something is wrong");
      }

    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error.response.data.message:", error);
      setErrorMessage(error);
    }
  };

  if (!isClient) {
    return null; // Prevent rendering until on the client side
  }

  return (
    <div className={styles.updateProfile}>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}

        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
