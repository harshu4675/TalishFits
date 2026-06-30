import axiosInstance from "./axios";

export const dietAPI = {
  generatePlan: (data) => axiosInstance.post("/diet/generate", data),
  getActivePlan: () => axiosInstance.get("/diet/active"),
  getTodayMeals: () => axiosInstance.get("/diet/today"),
  logNutrition: (data) => axiosInstance.post("/diet/log", data),
  getStats: (params) => axiosInstance.get("/diet/stats", { params }),
  getMealAlternatives: (meal) =>
    axiosInstance.get(`/diet/alternatives/${encodeURIComponent(meal)}`),
};
