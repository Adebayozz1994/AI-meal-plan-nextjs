"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { generateMealPlan } from "../../axios"; // Ensure this function is implemented in your axios file
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface MealPlanResponse {
  mealPlan: string;
}

interface UserData {
  userId: string;
  goal: string;
  allergies: string[];
}

export default function MealPlanPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Get userId from URL query
  const [goal, setGoal] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
    }
  }, [userId]);

  const handleGeneratePlan = async (): Promise<void> => {
    if (!goal.trim()) {
      toast.error("Please enter your health goal!");
      return;
    }
    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const userData: UserData = {
        userId,
        goal,
        allergies: allergies ? allergies.split(",").map((a) => a.trim()) : [],
      };

      const data: MealPlanResponse = await generateMealPlan(userData);
      setMealPlan(data.mealPlan);
      toast.success("Meal plan generated successfully!");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to generate meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">AI Meal Planner 🍽️</h1>

      <div className="mt-4">
        <label className="block font-semibold">Health Goal:</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Weight Loss, Muscle Gain"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Allergies (comma-separated):</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="e.g., nuts, dairy"
        />
      </div>

      <button
        className={`bg-blue-500 text-white p-3 rounded mt-4 w-full transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
        onClick={handleGeneratePlan}
        disabled={loading}
      >
        {loading ? "Generating Meal Plan..." : "Generate Meal Plan"}
      </button>

      {mealPlan && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Your AI-Generated Meal Plan</h2>
          <ul className="mt-2 list-disc list-inside">
            {mealPlan.split("\n").map((item, index) => (
              <li key={index} className="p-1">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
