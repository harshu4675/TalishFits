import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../api/userApi";
import toast from "react-hot-toast";

import StepGender from "./steps/StepGender";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepLifestyle from "./steps/StepLifestyle";
import StepDietPreference from "./steps/StepDietPreference";
import StepExperience from "./steps/StepExperience";
import StepMedical from "./steps/StepMedical";
import BMIResult from "./BMIResult";
import GoalSelection from "./GoalSelection";

import { ArrowLeft } from "lucide-react";

const TOTAL_STEPS = 8;

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: { duration: 0.3 },
  }),
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser, setOnboarded } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    heightFeet: "",
    heightInches: "0",
    weight: "",
    activityLevel: "",
    lifestyle: "",
    sleepHours: "7",
    waterIntake: "2",
    foodPreference: "",
    allergies: [],
    medicalConditions: [],
    workoutExperience: "",
    selectedGoal: "",
  });

  const [bmiResults, setBmiResults] = useState(null);

  useEffect(() => {
    document.title = "Setup Profile — TalishFits";
  }, []);

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const submitHealthProfile = async () => {
    setIsSubmitting(true);
    try {
      const response = await userAPI.updateHealthProfile({
        gender: formData.gender,
        age: parseInt(formData.age),
        heightFeet: parseInt(formData.heightFeet),
        heightInches: parseInt(formData.heightInches || 0),
        weight: parseFloat(formData.weight),
        activityLevel: formData.activityLevel,
        lifestyle: formData.lifestyle,
        sleepHours: parseFloat(formData.sleepHours),
        waterIntake: parseFloat(formData.waterIntake),
        foodPreference: formData.foodPreference,
        allergies: formData.allergies,
        medicalConditions: formData.medicalConditions,
        workoutExperience: formData.workoutExperience,
      });

      if (response.data.success) {
        const { metrics } = response.data.data;
        setBmiResults(metrics);
        updateUser(response.data.data.user);
        nextStep();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitGoal = async (goalType) => {
    setIsSubmitting(true);
    try {
      const response = await userAPI.setGoal({ goalType });

      if (response.data.success) {
        updateUser(response.data.data.user);
        setOnboarded();
        toast.success("Your transformation begins now");
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set goal");
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepGender
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <StepBasicInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepLifestyle
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <StepDietPreference
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <StepExperience
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <StepMedical
            data={formData}
            updateData={updateFormData}
            onNext={submitHealthProfile}
            isSubmitting={isSubmitting}
          />
        );
      case 6:
        return <BMIResult results={bmiResults} onNext={nextStep} />;
      case 7:
        return (
          <GoalSelection
            onSelect={submitGoal}
            isSubmitting={isSubmitting}
            gender={formData.gender}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#e8ebe5",
      }}
    >
      <header
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(13, 61, 53, 0.06)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="font-display"
            style={{
              fontSize: "1.25rem",
              color: "#0d3d35",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            TALISHFITS
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "8px",
              color: "#6b7068",
              letterSpacing: "0.3em",
              marginTop: "2px",
              fontWeight: 600,
            }}
          >
            ONBOARDING
          </span>
        </div>

        {currentStep > 0 && currentStep < 7 && (
          <button
            onClick={prevStep}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#6b7068",
              fontSize: "12px",
              fontFamily: "Inter",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0d3d35")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7068")}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        )}
      </header>

      <div style={{ position: "relative", zIndex: 20, padding: "1rem 2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#0d3d35",
              letterSpacing: "0.25em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Step {currentStep + 1} / {TOTAL_STEPS}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#c4a87a",
              letterSpacing: "0.15em",
              fontWeight: 700,
            }}
          >
            {Math.round(progress)}% COMPLETE
          </span>
        </div>
        <div
          style={{
            height: "3px",
            background: "rgba(13, 61, 53, 0.08)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{ height: "100%", background: "#0d3d35" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i === currentStep ? 1.4 : 1 }}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background:
                  i <= currentStep ? "#0d3d35" : "rgba(13, 61, 53, 0.15)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "2rem 1.5rem 4rem 1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
