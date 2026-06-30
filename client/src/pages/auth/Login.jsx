import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { authAPI } from "../../api/authApi";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { login, googleLogin, updateUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    document.title = "Sign In — TalishFits";
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.login({ ...data, rememberMe });

      if (response.data.data?.requiresVerification) {
        toast.success("Please verify your email first");
        navigate("/verify-otp", {
          state: { email: response.data.data.email },
        });
        return;
      }

      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        updateUser(user);
        toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
        navigate(user.isOnboarded ? "/dashboard" : "/onboarding");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const result = await googleLogin(response.credential);
          if (result.success) {
            navigate(result.user.isOnboarded ? "/dashboard" : "/onboarding");
          }
        },
      });
      window.google.accounts.id.prompt();
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{ width: "32px", height: "1.5px", background: "#c4a87a" }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#c4a87a",
                letterSpacing: "0.3em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Sign In
            </span>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              color: "#0d3d35",
              marginBottom: "0.625rem",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back.
          </h1>
          <p
            style={{ fontSize: "14px", color: "#6b7068", fontFamily: "Inter" }}
          >
            Continue your transformation journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        >
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  border: "1.5px solid",
                  borderColor: rememberMe
                    ? "#0d3d35"
                    : "rgba(13, 61, 53, 0.25)",
                  background: rememberMe ? "#0d3d35" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {rememberMe && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="#f5f3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "#6b7068",
                  fontFamily: "Inter",
                  fontWeight: 500,
                }}
              >
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              style={{
                fontSize: "12px",
                color: "#0d3d35",
                fontFamily: "Inter",
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#1a5d52")}
              onMouseLeave={(e) => (e.target.style.color = "#0d3d35")}
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "13px",
            color: "#6b7068",
            fontFamily: "Inter",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#0d3d35",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
