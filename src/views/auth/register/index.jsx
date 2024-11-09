"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./registerform.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {RegisterUser} from '../../../api/Auth'

function RegisterForm() {
  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username  is required"),

    dob: Yup.string()
      .required("Date of Birth is required")
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Date of Birth must be in the format YYYY-MM-DD"
      ),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    gender: Yup.string().required("Gender is required"),
    profilepic: Yup.mixed().test(
      "fileType",
      "Invalid file types!",
      function (value) {
        if (!value || value.length === 0) {
          return this.createError({ message: "profilepic  is required" });
        }

        if (typeof value === "string" && isValidUrl(value)) {
          return true;
        }

        const allowedExtensions = /(jpeg|jpg|png|pdf)$/;
        const maxSize = 1 * 1024 * 1024;

        for (const file of value) {
          const extension = (file.type || "").split("/").pop();
          const size = file.size || 0;

          if (!allowedExtensions.test(extension)) {
            return this.createError({
              message: "Invalid file types. allow only image!",
            });
          }

          if (size > maxSize) {
            return this.createError({
              message: "File size should be less than 1MB!",
            });
          }
        }

        return true;
      }
    ),
  });
 
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append other form fields
      formData.append("username", data.username);
      formData.append("dob", data.dob);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("gender", data.gender);

      if (data.profilepic[0] && data.profilepic) {
        formData.append("profilepic", data.profilepic[0]);
      } else {
        console.log("something went wrong");
      }
      const response = await RegisterUser(formData);

      if (response.data) {
        toast.success("Sign-Up Successful!", {
          autoClose: 2000,
          position: "top-center",
        });
        setTimeout(() => router.push("/login"), 2000);
        console.log("sucess");
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error.response.data.message:", error);
      toast.error(error || "An error occurred");

      reset();
    }
  };

  return (
    <div className={styles.registerform}>
      <h5 className="card-header">Next.js - Form Validation Example</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col">
              <label>UserName</label>
              <input {...register("username")} type="text" />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col">
              <label>Date of Birth</label>
              <input {...register("dob")} type="date" />
              {errors.dob && (
                <p className={styles.error}>{errors.dob.message}</p>
              )}
            </div>
            <div className="form-group col">
              <label>Email</label>
              <input {...register("email")} type="email" />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col">
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                />
                  {isMounted && ( // Conditional rendering of toggle button
                  <button type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                )}
              
              </div>
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>
            <div className="form-group col">
              <label>Confirm Password</label>
              <input {...register("confirmPassword")} type="password" />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col">
              <label>Gender</label>
              <select {...register("gender")} defaultValue="">
                <option value="" label="Select gender" />
                <option value="Male" label="Male" />
                <option value="Female" label="Female" />
                <option value="Other" label="Other" />
              </select>
              {errors.gender && (
                <p className={styles.error}>{errors.gender.message}</p>
              )}
            </div>

            <div className="form-group col">
              <label>Profile Picture</label>
              <input
                {...register("profilepic")}
                type="file"
                accept="image/jpeg, image/png"
              />
              {errors.profilepic && (
                <p className={styles.error}>{errors.profilepic.message}</p>
              )}
            </div>
          </div>
          <div className="form-group form-check">
            <input
              {...register("acceptTermsandConditions")}
              type="checkbox"
              id="acceptTermsandConditions"
            />
            <label htmlFor="acceptTermsandConditions">
              Accept Terms & Conditions
            </label>
            {errors.acceptTermsandConditions && (
              <p className={styles.error}>
                {errors.acceptTermsandConditions.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary mr-1">
              Register
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn btn-secondary"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
