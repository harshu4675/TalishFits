import axiosInstance from "./axios";

export const authAPI = {
  signup: (data) => axiosInstance.post("/auth/signup", data),
  verifyOTP: (data) => axiosInstance.post("/auth/verify-otp", data),
  resendOTP: (data) => axiosInstance.post("/auth/resend-otp", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  googleLogin: (data) => axiosInstance.post("/auth/google", data),
  logout: () => axiosInstance.post("/auth/logout"),
  refreshToken: () => axiosInstance.post("/auth/refresh"),
  getMe: () => axiosInstance.get("/auth/me"),
  forgotPassword: (data) => axiosInstance.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    axiosInstance.put(`/auth/reset-password/${token}`, data),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),
  changePassword: (data) => axiosInstance.put("/auth/change-password", data),
};
