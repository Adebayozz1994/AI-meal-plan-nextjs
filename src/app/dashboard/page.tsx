"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {jwtDecode} from "jwt-decode"; // Make sure to install with: npm install jwt-decode

// Define the type for the decoded JWT token
interface DecodedToken {
  id: string;
  name?: string;
  email?: string;
  exp: number;
  profilePicture: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get token from URL (if redirected) or from localStorage
    const token = searchParams.get("token") || localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("Decoded token:", decoded);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.error("Token expired");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }
      setUser(decoded);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-700">AI Meal Planner</div>
          {user && (
            <div className="flex items-center gap-4">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full shadow-sm"
              />
              <span className="font-medium text-gray-800">{user.name || "User"}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Dashboard</h1>
        {user ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-xl">
                  Welcome, <span className="font-semibold">{user.name || "User"}</span>
                </p>
                <p className="text-gray-600">Email: {user.email || "Not provided"}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Token Expires At:</p>
                <p className="font-medium">{new Date(user.exp * 1000).toLocaleString()}</p>
              </div>
            </div>
            {/* Button to Access AI Meal Generator */}
            <div className="mt-6 text-center">
              <button
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300"
                onClick={() => router.push(`/meal-plan?userId=${user.id}`)}
              >
                Access AI Meal Generator
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Unauthorized</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
