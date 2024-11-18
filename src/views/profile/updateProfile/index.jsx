"use client";
import { useEffect, useState } from "react";
import styles from "./update.profile.module.css";
import { useRouter } from "next/navigation";
import { getUserProfile, UpdateUser } from "@/api/userprofile";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [familyMembers, setfamilyMembers] = useState([]);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({
    firstname: "",
    lastname: "",
    relationship: "",
    age: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const profileData = await getUserProfile(token);

        setUsername(profileData.data.username);
        setDob(new Date(profileData.data.dob).toISOString().split("T")[0]);
        setGender(profileData.data.gender);
        setProfilePic(profileData.data.profilepic);

        console.log("🚀 ~ fetchUserProfile ~ profileData :", profileData);
      } catch (error) {
        setErrorMessage("Failed to load user data");
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleAddFamilyMember = () => {
    setfamilyMembers([
      ...familyMembers,
      {
        ...newFamilyMember,
        age: Number(newFamilyMember.age), // Cast age to a number
      },
    ]);
    setNewFamilyMember({
      firstname: "",
      lastname: "",
      relationship: "",
      age: "",
    });
    setShowFamilyForm(false);
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
      formData.append("familyMembers", JSON.stringify(familyMembers));
      console.log("🚀 ~ handleSubmit ~ formData:", formData);

      const response = await UpdateUser(formData);
      console.log("🚀 ~ handleSubmit ~  response:", response);
      if (response) {
        setSuccessMessage("Profile updated successfully!");
       
        router.push("/profile");
      } else {
        setErrorMessage("Something went wrong while updating the profile.");
      }
    } catch (error) {
      setErrorMessage("Error updating profile");
    }
    console.log("🚀 ~ handleSubmit ~ familyMembers:", familyMembers);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.updateProfile}>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}

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

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <label>Family Details:</label>

          <ul>
            {familyMembers.map((member, index) => (
              <li key={index}>
                {member.firstname} - {member.lastname} -{member.relationship} -
                {member.age}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setShowFamilyForm((prev) => !prev)}
          >
            {showFamilyForm ? "Cancel" : "Add Family Member"}
          </button>
        </div>

        {showFamilyForm && (
          <div className={styles.familyForm}>
            <h3>Add Family Member</h3>
            <div>
              <label>firstname:</label>
              <input
                type="text"
                value={newFamilyMember.firstname}
                onChange={(e) =>
                  setNewFamilyMember({
                    ...newFamilyMember,
                    firstname: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label>lastname:</label>
              <input
                type="text"
                value={newFamilyMember.lastname}
                onChange={(e) =>
                  setNewFamilyMember({
                    ...newFamilyMember,
                    lastname: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label>Relation:</label>
              <input
                type="text"
                value={newFamilyMember.relationship}
                onChange={(e) =>
                  setNewFamilyMember({
                    ...newFamilyMember,
                    relationship: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label>Age:</label>
              <input
                type="text"
                value={newFamilyMember.age}
                onChange={(e) =>
                  setNewFamilyMember({
                    ...newFamilyMember,
                    age: e.target.value,
                  })
                }
              />
            </div>
            <button type="button" onClick={handleAddFamilyMember}>
              Add
            </button>
          </div>
        )}

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
