import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authAPI } from "../../api/authApi";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    document.title = "Reset Password — TalishFits";
  }, []);

  const onSubmit = async (data) => {
    try {
      await authAPI.forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Reset link sent");
    } catch {
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
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
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
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
            Check your inbox.
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b7068",
              fontFamily: "Inter",
              marginBottom: "4px",
            }}
          >
            We've sent a password reset link to
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#0d3d35",
              fontFamily: "Inter",
              fontWeight: 700,
              marginBottom: "2rem",
            }}
          >
            {submittedEmail}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#9ca09a",
                fontFamily: "Inter",
              }}
            >
              Didn't receive the email?{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                style={{
                  color: "#0d3d35",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "Inter",
                  fontSize: "12px",
                  padding: 0,
                }}
              >
                Try again
              </button>
            </p>

            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#6b7068",
                fontSize: "13px",
                fontFamily: "Inter",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: "2.5rem" }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#6b7068",
              fontSize: "13px",
              fontFamily: "Inter",
              textDecoration: "none",
              fontWeight: 500,
              marginBottom: "2rem",
            }}
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>

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
              Reset Password
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
            Forgot password?
          </h1>
          <p
            style={{ fontSize: "14px", color: "#6b7068", fontFamily: "Inter" }}
          >
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
            icon={ArrowRight}
          >
            Send Reset Link
          </Button>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
