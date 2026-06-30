import axiosInstance from "./axios";

export const aiAPI = {
  chat: (data) => axiosInstance.post("/ai/chat", data),

  getMotivation: () => axiosInstance.get("/ai/motivation"),

  generateMeal: (data) => axiosInstance.post("/ai/meal", data),

  getRecovery: () => axiosInstance.get("/ai/recovery"),
};
