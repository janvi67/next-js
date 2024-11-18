"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./familyDetails.module.css";

function FamilyDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract initial data passed through navigation state
  const initialData = JSON.parse(searchParams.get("data")) || null;

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      familyMembers: initialData?.familyMembers || [
        { firstname: "", lastname: "", relationship: "", age: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyMembers",
  });

  const onSubmit = (data) => {
    toast.success("Saved your family details successfully");

    // Pass data to the update profile page
    router.push(`/profile/updateProfile`);
  };

  return (
    <div className={styles.container}>
      <h1>Family Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.familyForm}>
        {fields.map((item, index) => (
          <div key={item.id} className={styles.familyMember}>
            <h3>Family Member {index + 1}</h3>
            <label>First Name</label>
            <input
              {...register(`familyMembers.${index}.firstname`, {
                required: "First name is required",
              })}
              placeholder="First Name"
              className={styles.input}
            />
            <label>Last Name</label>
            <input
              {...register(`familyMembers.${index}.lastname`, {
                required: "Last name is required",
              })}
              placeholder="Last Name"
              className={styles.input}
            />
            <label>Relationship</label>
            <input
              {...register(`familyMembers.${index}.relationship`, {
                required: "Relationship is required",
              })}
              placeholder="Relationship"
              className={styles.input}
            />
            <label>Age</label>
            <input
              type="number"
              {...register(`familyMembers.${index}.age`, {
                required: "Age is required",
              })}
              placeholder="Age"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className={styles.removeButton}
            >
              Delete Member
            </button>
          </div>
        ))}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() =>
              append({ firstname: "", lastname: "", relationship: "", age: "" })
            }
            className={styles.appendButton}
          >
            Add Member
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Family Details
        </button>
      </form>
    </div>
  );
}

export default FamilyDetails;
