"use client"; // Ensure the component is treated as a Client Component

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { signInAction } from "./actions";

export default function Login({ searchParams }: { searchParams: Message }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-row items-center justify-center bg-gray-100">
      <div className="container mx-auto flex justify-center items-center h-full">
        <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg lg:max-w-xl">
          <h1 className="text-3xl font-semibold mb-4 text-center text-purple-700">Exam printer</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            ระบบจัดพิมพ์ข้อสอบ
            <br />
            คณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์
          </p>
          <form className="flex flex-col gap-6" method="POST">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                name="email"
                placeholder="example@gmail.com"
                required
                className="p-3 border rounded-md border-gray-300 focus:outline-purple-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="********"
                  required
                  className="p-3 border rounded-md border-gray-300 w-full focus:outline-purple-500"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-purple-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "🔒"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded-sm text-purple-600" />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <button
            formAction={signInAction} 
              type="submit"
              className="bg-purple-600 text-white py-3 rounded-md text-center hover:bg-purple-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
