import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import React from "react";
import { useForm } from "react-hook-form";
// import { Upload, Image as ImageIcon, X } from "lucide-react";

export default function LogInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login, isLoggingIn } = useAuthStore();

  const onSubmit = (data) => {
    // const formData = { ...data };
    console.log(data);
    // signup(formData);
    login(data);
  };

  return (
    <div className="absolute left-0 top-0 h-full w-full p-4 overflow-y-auto">
      <div className="min-h-[20rem] h-full w-full flex items-center justify-center">
        <div className=" w-full max-w-md p-8 rounded-xl shadow-lg">
          {isLoggingIn && (
            <div className="absolute inset-0 w-full h-full bg-black opacity-30 z-50">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-sky-600" />
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name with Upload Icon */}
            {/* <div className="relative">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
              {...register("name", { required: true })}
            />
            
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">Name is required</p>
            )}
          </div> */}

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
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
