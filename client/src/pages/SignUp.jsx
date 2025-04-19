import { useAuthStore } from "../store/useAuthStore.js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Image as ImageIcon, X } from "lucide-react"; // Lucide icons

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState();

  const { signup } = useAuthStore();

  const onSubmit = (data) => {
    const formData = { ...data, profilePic };
    console.log(formData);
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
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-6 p-4">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center ">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              {...register("name", { required: true })}
            />
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

          {/* Bio */}
          {/* <div>
            <textarea
              placeholder="Short Bio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              rows={4}
              {...register("bio", { required: true })}
            ></textarea>
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">Bio is required</p>
            )}
          </div> */}

          {/* Image Upload (Styled with Lucide Icons) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium ">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition group">
                  {previewImage ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm">Change Image</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 group-hover:text-blue-600">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Click to upload</span>
                      <span className="text-xs text-gray-400">
                        (JPEG, PNG, WEBP)
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </label>
              {previewImage && (
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
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
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}