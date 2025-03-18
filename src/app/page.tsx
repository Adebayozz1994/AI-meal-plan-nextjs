"use client"; 

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:7000/auth/google"; 
  };

  useEffect(() => {
    // Check if there's a token in the URL (After successful login)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token); 
      router.push("/dashboard"); 
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={handleGoogleLogin} className="bg-blue-500 text-white px-6 py-2 rounded">
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
