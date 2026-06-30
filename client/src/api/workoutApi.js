import axiosInstance from "./axios";

export const workoutAPI = {
  generatePlan: (data) => axiosInstance.post("/workouts/generate", data),

  getActivePlan: () => axiosInstance.get("/workouts/active"),

  getTodayWorkout: () => axiosInstance.get("/workouts/today"),

  completeWorkout: (data) => axiosInstance.post("/workouts/complete", data),

  getAllPlans: () => axiosInstance.get("/workouts/all"),

  getStats: (params) => axiosInstance.get("/workouts/stats", { params }),

  getExerciseTips: (exerciseName) =>
    axiosInstance.get(
      `/workouts/exercise-tips/${encodeURIComponent(exerciseName)}`,
    ),
};
