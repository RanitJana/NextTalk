import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);

  const onSubmit = (data) => {
    const formData = { ...data, image };
    console.log(formData);
    // Handle form submission logic
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Name"
              {...register("name", { required: true })}
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

            <Textarea
              placeholder="Short Bio"
              {...register("bio", { required: true })}
            />
            {errors.bio && <p className="text-red-500 text-sm">Bio is required</p>}

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
