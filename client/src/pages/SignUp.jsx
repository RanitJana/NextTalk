import { useAuthStore } from "../store/useAuthStore.js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState("/defaultUser.jpg");

  const { signup,isSigningUp } = useAuthStore();

  const onSubmit = (data) => {
    const formData = new FormData();

    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    signup(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePic(null);
    setPreviewImage("/defaultUser.jpg");
  };

  return (
<>
    {isSigningUp && (
      <div className="absolute inset-0 w-full h-full bg-black opacity-30 z-50">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin text-sky-600" />
        </div>
      </div>
    )}


    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Centered Image Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name with Upload Icon */}
          <div className="relative">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
              {...register("name", { required: true })}
            />
            <label className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <div className="text-gray-400 hover:text-blue-600 transition">
                {previewImage ? (
                  <ImageIcon className="w-5 h-5" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="profilePic"
                  onChange={handleImageChange}
                />
              </div>
            </label>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">Password is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>

    </>
  );
}
