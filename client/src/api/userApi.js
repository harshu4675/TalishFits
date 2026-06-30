import axiosInstance from "./axios";

export const userAPI = {
  getProfile: () => axiosInstance.get("/users/profile"),

  updateProfile: (data) => axiosInstance.put("/users/profile", data),

  getDashboard: () => axiosInstance.get("/users/dashboard"),

  updateHealthProfile: (data) =>
    axiosInstance.put("/users/health-profile", data),

  setGoal: (data) => axiosInstance.post("/users/goal", data),

  completeOnboarding: () => axiosInstance.post("/users/complete-onboarding"),

  uploadAvatar: (formData) =>
    axiosInstance.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateFCMToken: (data) => axiosInstance.put("/users/fcm-token", data),

  deleteAccount: (data) => axiosInstance.delete("/users/account", { data }),
};
