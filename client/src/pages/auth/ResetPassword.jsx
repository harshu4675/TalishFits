import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authAPI } from "../../api/authApi";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Lock, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    document.title = "New Password — TalishFits";
  }, []);

  const onSubmit = async (data) => {
    try {
      await authAPI.resetPassword(token, {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setIsSuccess(true);
      toast.success("Password reset successful");
    } catch (error) {
      const msg = error.response?.data?.message || "Reset failed";
      if (msg.includes("expired") || msg.includes("invalid")) setIsError(true);
      toast.error(msg);
    }
  };

  if (isError) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(168, 72, 56, 0.1)",
              color: "#a84838",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.75rem auto",
              border: "1px solid rgba(168, 72, 56, 0.2)",
            }}
          >
            <AlertTriangle size={32} strokeWidth={1.5} />
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "2rem",
              color: "#0d3d35",
              marginBottom: "0.75rem",
            }}
          >
            Link expired.
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7068",
              fontFamily: "Inter",
              marginBottom: "2rem",
            }}
          >
            This reset link has expired or is invalid. Please request a new one.
          </p>
          <Link to="/forgot-password" style={{ textDecoration: "none" }}>
            <Button size="lg" icon={ArrowRight}>
              Request New Link
            </Button>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "#0d3d35",
              color: "#f5f3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.75rem auto",
            }}
          >
            <CheckCircle size={32} strokeWidth={1.5} />
          </motion.div>
          <h1
            className="font-display"
            style={{
              fontSize: "2rem",
              color: "#0d3d35",
              marginBottom: "0.75rem",
            }}
          >
            Password updated.
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7068",
              fontFamily: "Inter",
              marginBottom: "2rem",
            }}
          >
            Your password has been reset successfully. Sign in with your new
            password.
          </p>
          <Button
            size="lg"
            icon={ArrowRight}
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
              New Password
            </span>
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "2.25rem",
              color: "#0d3d35",
              marginBottom: "0.625rem",
            }}
          >
            Set new password.
          </h1>
          <p
            style={{ fontSize: "14px", color: "#6b7068", fontFamily: "Inter" }}
          >
            Create a strong password you haven't used before.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
            icon={ArrowRight}
          >
            Reset Password
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
          Remember your password?{" "}
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

export default ResetPassword;
