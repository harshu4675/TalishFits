import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { dietAPI } from "../../api/dietApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import MealCard from "../../components/diet/MealCard";
import WaterTracker from "../../components/diet/WaterTracker";
import MacroChart from "../../components/diet/MacroChart";
import toast from "react-hot-toast";
import { UtensilsCrossed, RefreshCw, ShoppingCart } from "lucide-react";

const Diet = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    document.title = "Nutrition — TalishFits";
  }, []);

  const { data: planData, isLoading } = useQuery({
    queryKey: ["activeDiet"],
    queryFn: () => dietAPI.getActivePlan(),
    select: (res) => res.data.data,
  });

  const { data: todayData } = useQuery({
    queryKey: ["todayMeals"],
    queryFn: () => dietAPI.getTodayMeals(),
    select: (res) => res.data.data,
  });

  const { data: todayProgressData, refetch: refetchProgress } = useQuery({
    queryKey: ["todayProgress"],
    queryFn: async () => {
      const res = await axiosInstance.get("/progress/history", {
        params: { period: "1" },
      });
      return res.data.data;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  const generateMutation = useMutation({
    mutationFn: (data) => dietAPI.generatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeDiet"] });
      queryClient.invalidateQueries({ queryKey: ["todayMeals"] });
      toast.success("Nutrition plan generated");
    },
  });

  const logMutation = useMutation({
    mutationFn: (data) => dietAPI.logNutrition(data),
    onSuccess: (res) => {
      const newProgress = res.data?.data?.progress;
      if (newProgress) {
        queryClient.setQueryData(["todayProgress"], (old) => ({
          ...old,
          progress: [newProgress, ...(old?.progress?.slice(1) || [])],
        }));
      }
      refetchProgress();
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      console.error("Log error:", err);
      toast.error(err.response?.data?.message || "Failed to log");
    },
  });

  const plan = planData?.dietPlan;
  const today = todayData?.meals;

  const todayEntry = todayProgressData?.progress?.find((p) => {
    const entryDate = new Date(p.date);
    const now = new Date();
    return entryDate.toDateString() === now.toDateString();
  });

  const latestProgress = todayEntry?.nutrition || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div
          className="skeleton"
          style={{ height: "500px", borderRadius: "16px" }}
        />
      </DashboardLayout>
    );
  }

  if (!plan) {
    return (
      <DashboardLayout>
        <div className="diet-empty-state">
          <UtensilsCrossed className="diet-empty-icon" />
          <div className="font-mono diet-empty-tag">No Plan Yet</div>
          <h2 className="font-display diet-empty-title">
            Generate Your Nutrition Plan
          </h2>
          <p className="diet-empty-desc">
            Let our AI create a personalized meal plan with recipes, shopping
            lists, and precise macros.
          </p>
          <button
            onClick={() => generateMutation.mutate({})}
            disabled={generateMutation.isPending}
            className="btn-primary diet-empty-btn"
          >
            {generateMutation.isPending ? "Generating..." : "Generate Plan"}
            <RefreshCw size={14} />
          </button>

          <style>{`
            .diet-empty-state { max-width: 560px; margin: 3rem auto; text-align: center; padding: 2rem 1.5rem; background: #ffffff; border-radius: 16px; border: 1px solid rgba(13, 61, 53, 0.08); }
            .diet-empty-icon { width: 40px; height: 40px; color: #0d3d35; opacity: 0.5; margin: 0 auto 1.25rem auto; }
            .diet-empty-tag { font-size: 10px; color: #c4a87a; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 700; margin-bottom: 0.875rem; }
            .diet-empty-title { font-size: 1.5rem; color: #0d3d35; margin-bottom: 0.875rem; letter-spacing: -0.02em; }
            .diet-empty-desc { font-size: 13px; color: #6b7068; font-family: Inter; margin-bottom: 1.5rem; line-height: 1.7; }
            .diet-empty-btn { padding: 0.875rem 2rem !important; }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="diet-page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="diet-page-header"
        >
          <div className="diet-header-content">
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "1.5px",
                    background: "#c4a87a",
                  }}
                />
                <span
                  className="font-mono diet-header-tag"
                  style={{
                    color: "#c4a87a",
                    letterSpacing: "0.3em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {plan.dailyCalorieTarget} Cal · {plan.type} · Week{" "}
                  {plan.weekNumber}
                </span>
              </div>
              <h1
                className="font-display diet-page-title"
                style={{ color: "#0d3d35", letterSpacing: "-0.02em" }}
              >
                {plan.title}
              </h1>
            </div>

            <button
              onClick={() => generateMutation.mutate({})}
              disabled={generateMutation.isPending}
              className="diet-regen-btn"
            >
              <RefreshCw size={12} />
              Regenerate
            </button>
          </div>
        </motion.div>

        <div className="diet-content-grid">
          <div className="diet-meals-column">
            {today?.meals?.map((meal, i) => (
              <MealCard
                key={i}
                meal={meal}
                onLog={(data) => logMutation.mutate(data)}
              />
            ))}

            {today?.shoppingList?.length > 0 && (
              <div className="premium-card shopping-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "1rem",
                  }}
                >
                  <ShoppingCart size={13} style={{ color: "#0d3d35" }} />
                  <h3 className="font-mono shopping-title">Shopping List</h3>
                </div>
                <div className="shopping-grid">
                  {today.shoppingList.map((item, i) => (
                    <div key={i} className="shopping-item">
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#c4a87a",
                          flexShrink: 0,
                        }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="diet-sidebar">
            <MacroChart
              targets={{
                calories: plan.dailyCalorieTarget,
                protein: plan.dailyProteinTarget,
                carbs: plan.dailyCarbTarget,
                fat: plan.dailyFatTarget,
              }}
              consumed={{
                calories: latestProgress.calories || 0,
                protein: latestProgress.protein || 0,
                carbs: latestProgress.carbs || 0,
                fat: latestProgress.fat || 0,
              }}
            />

            <WaterTracker
              key={latestProgress.water}
              target={plan.dailyWaterTarget || 3}
              currentAmount={latestProgress.water || 0}
              onLog={(amount) => logMutation.mutate({ water: amount })}
            />

            {plan.supplements?.length > 0 && (
              <div className="premium-card supplements-card">
                <h4 className="font-mono supplements-title">Supplements</h4>
                <div className="supplements-list">
                  {plan.supplements.map((supp, i) => (
                    <div key={i} className="supplement-item">
                      <p className="supplement-name">{supp.name}</p>
                      <p className="font-mono supplement-meta">
                        {supp.timing} · {supp.amount}
                      </p>
                      {supp.purpose && (
                        <p className="supplement-purpose">{supp.purpose}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .diet-page { max-width: 1400px; margin: 0 auto; }
        .diet-page-header { margin-bottom: 1.5rem; }
        .diet-header-content { display: flex; flex-direction: column; gap: 1rem; }
        .diet-header-tag { font-size: 9px; }
        .diet-page-title { font-size: 1.5rem; line-height: 1.1; }
        .diet-regen-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0.5rem 1rem; background: transparent; color: #0d3d35; border: 1.5px solid #0d3d35; border-radius: 9999px; cursor: pointer; font-family: Inter; font-weight: 700; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
        .diet-content-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .diet-meals-column { display: flex; flex-direction: column; gap: 1rem; }
        .diet-sidebar { display: flex; flex-direction: column; gap: 1rem; }
        .shopping-card { padding: 1.25rem; }
        .shopping-title { font-size: 10px; color: #0d3d35; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; }
        .shopping-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .shopping-item { display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 12px; color: #2a2a2a; font-family: Inter; }
        .supplements-card { padding: 1.25rem; }
        .supplements-title { font-size: 10px; color: #0d3d35; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; margin-bottom: 1rem; }
        .supplements-list { display: flex; flex-direction: column; gap: 8px; }
        .supplement-item { padding: 10px 12px; background: #f5f3ee; border-radius: 10px; }
        .supplement-name { font-size: 12px; font-family: Inter; font-weight: 700; color: #0d3d35; margin-bottom: 3px; }
        .supplement-meta { font-size: 9px; color: #6b7068; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }
        .supplement-purpose { font-size: 10px; color: #6b7068; font-family: Inter; margin-top: 4px; }
        @media (min-width: 480px) {
          .diet-header-tag { font-size: 10px; }
          .diet-page-title { font-size: 1.75rem; }
          .diet-regen-btn { font-size: 11px; padding: 0.625rem 1.25rem; }
          .shopping-card, .supplements-card { padding: 1.5rem; }
          .supplement-name { font-size: 13px; }
          .supplement-meta { font-size: 10px; }
          .supplement-purpose { font-size: 11px; }
        }
        @media (min-width: 768px) {
          .diet-header-content { flex-direction: row; justify-content: space-between; align-items: flex-end; }
          .diet-regen-btn { flex-shrink: 0; }
          .diet-page-title { font-size: 2rem; }
        }
        @media (min-width: 1024px) {
          .diet-page-title { font-size: 2.25rem; }
          .diet-content-grid { grid-template-columns: 1fr 320px; }
          .diet-meals-column, .diet-sidebar { gap: 1.25rem; }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Diet;
