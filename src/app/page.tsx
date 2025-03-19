"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:7000/auth/google"; 
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to AI Meal Planner
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Harness the power of AI to generate personalized meal plans tailored just for you.
          Eat healthy, save time, and reach your fitness goals effortlessly.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
