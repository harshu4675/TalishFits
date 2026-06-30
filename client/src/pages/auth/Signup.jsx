import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/authApi";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must include uppercase, lowercase, and number",
      ),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const passwordRequirements = [
  { label: "8+ characters", test: (v) => v.length >= 8 },
  { label: "Uppercase", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v) => /[a-z]/.test(v) },
  { label: "Number", test: (v) => /\d/.test(v) },
];

const Signup = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const watchPassword = watch("password", "");

  useEffect(() => {
    document.title = "Create Account — TalishFits";
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authAPI.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        toast.success("Verification code sent to your email");
        navigate("/verify-otp", {
          state: { email: data.email },
          replace: true,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
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
        <div style={{ marginBottom: "2rem" }}>
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
              Get Started
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
            Create account.
          </h1>
          <p
            style={{ fontSize: "14px", color: "#6b7068", fontFamily: "Inter" }}
          >
            Start your AI-powered transformation today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            label="Full Name"
            icon={User}
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          <div>
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register("password")}
            />

            {watchPassword.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "8px",
                }}
              >
                {passwordRequirements.map((req) => {
                  const met = req.test(watchPassword);
                  return (
                    <div
                      key={req.label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        background: met
                          ? "rgba(74, 124, 89, 0.1)"
                          : "rgba(13, 61, 53, 0.04)",
                        color: met ? "#4a7c59" : "#9ca09a",
                        border: `1px solid ${met ? "rgba(74, 124, 89, 0.2)" : "rgba(13, 61, 53, 0.06)"}`,
                      }}
                    >
                      {met && <Check size={9} strokeWidth={3} />}
                      {req.label}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <p
            style={{
              fontSize: "11px",
              color: "#9ca09a",
              fontFamily: "Inter",
              lineHeight: 1.6,
              marginTop: "4px",
            }}
          >
            By creating an account, you agree to our{" "}
            <a href="#" style={{ color: "#0d3d35", fontWeight: 600 }}>
              Terms
            </a>{" "}
            and{" "}
            <a href="#" style={{ color: "#0d3d35", fontWeight: 600 }}>
              Privacy Policy
            </a>
            .
          </p>

          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
            icon={ArrowRight}
          >
            Create Account
          </Button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.75rem",
            fontSize: "13px",
            color: "#6b7068",
            fontFamily: "Inter",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#0d3d35",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Signup;
