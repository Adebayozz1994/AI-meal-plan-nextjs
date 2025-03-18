"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {jwtDecode} from "jwt-decode"; 

// Define Type for Decoded JWT
interface DecodedToken {
  id: string;
  name?: string;
  email?: string;
  exp: number; 
  profilePicture:string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = searchParams.get("token") || localStorage.getItem("token");

    if (!token) {
      router.push("/login"); 
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token); 
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
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user ? (
        <div className="mt-4 text-center">
          <p>Welcome, <strong>{user.name || "User"}</strong></p>
          <p>Email: {user.email || "Not provided"}</p>
          <img src={user.profilePicture} alt="" />
          <p>Token Expires At: {new Date(user.exp * 1000).toLocaleString()}</p>

          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Unauthorized</p>
      )}
    </div>
  );
};

export default Dashboard;
