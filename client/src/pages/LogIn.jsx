import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function LogInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="absolute left-0 top-0 h-full w-full p-4 overflow-y-auto">
      <div className="min-h-[20rem] h-full w-full flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl border">
          {isLoggingIn && (
            <div className="absolute inset-0 w-full h-full bg-black opacity-30 z-50">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-sky-600" />
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
            >
              Log In
            </button>

            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}