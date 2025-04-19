import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signup } from "../store/useAuthStore.js"; // Adjust the import path as necessary

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [public_id, setPublic_id] = useState("");

  const onSubmit = (data) => {
    const formData = { ...data, image };
    console.log(formData);
    signup(formData);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className=" w-full max-w-md p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border rounded-md"
              {...register("name", { required: true })}
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
              {...register("email", { required: true })}
            />
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md"
              {...register("password", { required: true })}
            />
            {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
          </div>

          <div>
            <textarea
              placeholder="Short Bio"
              className="w-full px-4 py-2 border rounded-md"
              rows={4}
              {...register("bio", { required: true })}
            ></textarea>
            {errors.bio && <p className="text-red-500 text-sm">Bio is required</p>}
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}