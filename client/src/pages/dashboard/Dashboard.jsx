import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import DailyGoals from "../../components/dashboard/DailyGoals";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import AchievementCard from "../../components/dashboard/AchievementCard";
import TodayWorkout from "../../components/dashboard/TodayWorkout";
import TodayMeals from "../../components/dashboard/TodayMeals";
import MotivationCard from "../../components/dashboard/MotivationCard";
import QuickActions from "../../components/dashboard/QuickActions";
import StreakCard from "../../components/dashboard/StreakCard";
import { Skeleton } from "../../components/ui/Loader";
import StepCounter from "../../components/dashboard/StepCounter";
const Dashboard = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => userAPI.getDashboard(),
    select: (res) => res.data.data,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    document.title = "Dashboard — TalishFits";
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const { activeGoal, todayProgress, weekProgress, weeklyStats, motivation } =
    data || {};

  return (
    <DashboardLayout>
      <div
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        className="dashboard-wrapper"
      >
        <WelcomeBanner
          user={user}
          activeGoal={activeGoal}
          streak={user?.gamification?.streak?.current || 0}
        />

        <QuickActions />

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <DailyGoals
              progress={todayProgress}
              targets={{
                calories: user?.bodyMetrics?.macros?.calories || 2000,
                protein: user?.bodyMetrics?.macros?.protein || 150,
                water: user?.bodyMetrics?.dailyWaterIntake || 3,
              }}
            />
            <WeeklyChart weekProgress={weekProgress || []} />
            <TodayWorkout />
            <TodayMeals />
          </div>

          <div className="dashboard-sidebar">
            <StepCounter />
            <StreakCard
              current={user?.gamification?.streak?.current || 0}
              longest={user?.gamification?.streak?.longest || 0}
              level={user?.gamification?.level || 1}
              xp={user?.gamification?.xp || 0}
            />
            <MotivationCard motivation={motivation} />
            <WeeklyStatsSummary stats={weeklyStats} />
            <AchievementCard badges={user?.gamification?.badges || []} />
            <RecentActivity />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .dashboard-wrapper {
            gap: 1.25rem;
          }
        }

        @media (min-width: 1024px) {
          .dashboard-wrapper {
            gap: 1.5rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

const WeeklyStatsSummary = ({ stats }) => {
  const items = [
    { label: "Workouts", value: stats?.workoutsCompleted || 0, target: 5 },
    {
      label: "Calories Burned",
      value: stats?.totalCaloriesBurned || 0,
      target: 2500,
    },
    {
      label: "Avg Calories",
      value: stats?.avgCaloriesConsumed || 0,
      target: 2000,
      suffix: "cal",
    },
  ];

  return (
    <div className="premium-card" style={{ padding: "1.25rem" }}>
      <h3
        className="font-mono"
        style={{
          fontSize: "10px",
          color: "#0d3d35",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "1.25rem",
        }}
      >
        This Week
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item) => {
          const percentage = Math.min((item.value / item.target) * 100, 100);
          return (
            <div key={item.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#2a2a2a",
                    fontFamily: "Inter",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "12px",
                    color: "#0d3d35",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.value.toLocaleString()}
                  {item.suffix ? ` ${item.suffix}` : ""}
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  background: "rgba(13, 61, 53, 0.06)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{ height: "100%", background: "#0d3d35" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <Skeleton style={{ height: "160px", borderRadius: "16px" }} />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
      }}
    >
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} style={{ height: "70px", borderRadius: "12px" }} />
      ))}
    </div>
    <Skeleton style={{ height: "260px", borderRadius: "16px" }} />
    <Skeleton style={{ height: "300px", borderRadius: "16px" }} />
  </div>
);

export default Dashboard;
