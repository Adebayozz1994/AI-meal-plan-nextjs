// import axios from "axios";

// const API_URL = "http://localhost:7000/api/meals";

// export const generateMealPlan = async (userData) => {
//   try {
//     const response = await axios.post(`${API_URL}/generate`, userData);
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };



import axios from "axios";
const API_URL = "http://localhost:7000/api/meals";
export const generateMealPlan = async (userData) => {
  const token = localStorage.getItem("token"); 
  const response = await axios.post(`${API_URL}/generate`, userData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};
