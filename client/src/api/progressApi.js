import axiosInstance from "./axios";

export const progressAPI = {
  logProgress: (data) => axiosInstance.post("/progress/log", data),

  getHistory: (params) => axiosInstance.get("/progress/history", { params }),

  uploadPhoto: (formData) =>
    axiosInstance.post("/progress/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAdvice: () => axiosInstance.get("/progress/advice"),

  getMeasurements: () => axiosInstance.get("/progress/measurements"),
};
