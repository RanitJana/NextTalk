import { useAuthStore } from "../store/useAuthStore.js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Image as ImageIcon, X, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState("/defaultUser.jpg");
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigningUp } = useAuthStore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    <div className="absolute left-0 top-0 h-full w-full p-4 overflow-y-auto">
      <div className="min-h-[25rem] h-full w-full flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl border">
          {isSigningUp && (
            <div className="absolute inset-0 w-full h-full bg-black opacity-30 z-50">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-sky-600" />
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Upload Button (bottom-right, overlapping) */}
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-white rounded-full p-1.5 border-2 border-gray-300 hover:bg-gray-100 transition shadow-sm">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </label>

              {/* Remove Button (top-right, only when image changed) */}
              {previewImage !== "/defaultUser.jpg" && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">Name is required</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">Email is required</p>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  Password is required
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
            >
              {isSigningUp ? "Signing up..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}