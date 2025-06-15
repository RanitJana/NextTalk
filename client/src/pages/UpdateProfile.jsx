import { useAuthStore } from "../store/useAuthStore.js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Upload, Image as ImageIcon, X, Loader2, ArrowLeft } from "lucide-react";

export default function UpdateProfile() {
  const currentUser = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser.authUser.user.name);
  const [email, setEmail] = useState(currentUser.authUser.user.email);
  const [bio, setBio] = useState(currentUser.authUser.user.bio);
  const [profilePic, setProfilePic] = useState(
    currentUser.authUser.user.profilePic
  );
  const [previewImage, setPreviewImage] = useState(
    currentUser.authUser.user.profilePic
  );

  const { register, handleSubmit } = useForm();

  const { updateProfile, isUpdatingProfile } = useAuthStore();

  const onSubmit = () => {
    const formData = {
      name,
      email,
      bio,
      profilePic,
    };
    updateProfile(formData);
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
      {isUpdatingProfile && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-30 z-50">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-sky-600" />
          </div>
        </div>
      )}

      <div className="relative h-full overflow-auto">
        <div className="h-full min-h-[35rem] flex items-center justify-center p-4 absolute left-0 right-0">


          <div className="w-full max-w-md p-8 rounded-xl border">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-sm text-primary hover:underline gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Profile Update
            </h2>

            {/* Image Upload */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={previewImage}
                    alt="Preview"
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

                {/* Remove Button (top-right) */}
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
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  value={name}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  {...register("name")}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  value={email}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  {...register("email")}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Bio Field */}
              <div>
                <textarea
                  value={bio}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  rows={4}
                  {...register("bio")}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
              >
                {isUpdatingProfile ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
