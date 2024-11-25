"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./update.profile.module.css";
import { useRouter } from "next/navigation";
import { getUserProfile, UpdateUser } from "@/api/userprofile";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookie from "universal-cookie";

const ProfileUpdate = () => {
  // Validation schema for family members
  const schema = yup.object().shape({
    username: yup.string().required("Username  is required"),

    dob: yup
      .string()
      .required("Date of Birth is required")
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Date of Birth must be in the format YYYY-MM-DD"
      ),
    gender: yup.string().required("Gender is required"),

    familyMembers: yup
      .array()
      .of(
        yup.object().shape({
          firstname: yup.string().required("First name is required"),
          lastname: yup.string().required("Last name is required"),
          relationship: yup.string().required("Relationship is required"),
          age: yup
            .number()
            .required("Age is required")
            .typeError("Age must be a number"),
        })
      )
      .required(),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyMembers",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showFamilyDetails, setShowFamilyDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  var cookie = new Cookie();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = cookie.get("token");
      try {
        const profileData = await getUserProfile(token);
        setValue("username", profileData.data.username);
        setValue(
          "dob",
          new Date(profileData.data.dob).toISOString().split("T")[0]
        );
        setValue("gender", profileData.data.gender);
        setValue("familyMembers", profileData.data.familyMembers || []);
      } catch (error) {
        setErrorMessage("Failed to load user data");
      }
    };

    fetchUserProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("dob", data.dob);
      formData.append("gender", data.gender);

      formData.append("profilepic", data.profilePic[0]);

      formData.append("familyMembers", JSON.stringify(data.familyMembers));

      const response = await UpdateUser(formData);
      console.log("🚀 ~ onSubmit ~ response:", response);
      if (response) {
        setSuccessMessage("Profile updated successfully!");
        router.push("/profile");
      } else {
        setErrorMessage("Something went wrong while updating the profile.");
      }
      console.log("error", errors);
    } catch (error) {
      setErrorMessage("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.updateProfile}>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}

        <div>
          <label>Username:</label>
          <input type="text" {...register("username", { required: true })} />
          {errors.username && (
            <p className={styles.error}>{errors.username.message}</p>
          )}
        </div>

        <div>
          <label>Date of Birth:</label>
          <input type="date" {...register("dob", { required: true })} />
          {errors.dob && <p className={styles.error}>{errors.dob.message}</p>}
        </div>

        <div>
          <label>Gender:</label>
          <select {...register("gender", { required: true })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className={styles.error}>{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" {...register("profilePic")} />
          {errors.profilePic && (
            <p className={styles.error}>{errors.profilepic.message}</p>
          )}
        </div>

        <div>
          <label>Family Details:</label>
          <p style={{ color: "green" }}>showFamilyDetails</p>

          {fields.length > 0 ? (
            <ul>
              {fields.map((member, index) => {
                <li key={member.id}>
                  <div>
                    <label>Firstname:</label>
                    <input
                      type="text"
                      {...register(`familyMembers.${index}.firstname`)}
                      defaultValue={member.firstname}
                    />
                  </div>
                </li>;
              })}
            </ul>
          ) : (
            <p>no family members added yet</p>
          )}

          {showFamilyDetails ? (
            <ul className={styles.familymembers}>
              {fields.map((member, index) => (
                <li className={styles.familymemberlist} key={index}>
                  Firstname: {member.firstname}, Lastname: {member.lastname},
                  Relationship: {member.relationship}, Age: {member.age}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul>
                {fields.map((member, index) => (
                  <li key={member.id}>
                    <div>
                      <label>Firstname:</label>
                      <input
                        type="text"
                        {...register(`familyMembers.${index}.firstname`)}
                      />
                      {errors.familyMembers?.[index]?.firstname && (
                        <p style={{ color: "red" }}>
                          {errors.familyMembers[index].firstname.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Lastname:</label>
                      <input
                        type="text"
                        {...register(`familyMembers.${index}.lastname`)}
                      />
                      {errors.familyMembers?.[index]?.lastname && (
                        <p style={{ color: "red" }}>
                          {errors.familyMembers[index].lastname.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Relationship:</label>
                      <input
                        type="text"
                        {...register(`familyMembers.${index}.relationship`)}
                      />
                      {errors.familyMembers?.[index]?.relationship && (
                        <p style={{ color: "red" }}>
                          {errors.familyMembers[index].relationship.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label>Age:</label>
                      <input
                        type="number"
                        {...register(`familyMembers.${index}.age`)}
                      />
                      {errors.familyMembers?.[index]?.age && (
                        <p style={{ color: "red" }}>
                          {errors.familyMembers[index].age.message}
                        </p>
                      )}
                    </div>
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  append({
                    firstname: "",
                    lastname: "",
                    relationship: "",
                    age: "",
                  })
                }
              >
                Add Family Member
              </button>
            </>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging  in..." : "Update Profile"}{" "}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
