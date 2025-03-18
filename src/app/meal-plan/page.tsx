"use client";
import { useState } from "react";
import { generateMealPlan } from "../../axios"; 
import { toast } from "react-toastify";
import { AxiosError } from "axios";

// Define the expected response type from the API
interface MealPlanResponse {
  mealPlan: string;
}

// Define the user input type
interface UserData {
  userId: string;
  goal: string;
  allergies: string[];
}

export default function MealPlanPage() {
  const [goal, setGoal] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGeneratePlan = async (): Promise<void> => {
    if (!goal.trim()) {
      toast.error("Please enter your health goal!");
      return;
    }

    setLoading(true);
    try {
      const userData: UserData = {
        userId: "12345", // Replace with actual user ID
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
