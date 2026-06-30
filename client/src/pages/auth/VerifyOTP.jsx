import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/authApi";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initializeAuth } = useAuth();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    document.title = "Verify Email — TalishFits";
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerify = async (code = otp.join("")) => {
    if (code.length !== 6) {
      toast.error("Enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authAPI.verifyOTP({ email, otp: code });

      if (response.data.success) {
        const { user, accessToken } = response.data.data;

        localStorage.setItem("accessToken", accessToken);

        setIsSuccess(true);
        toast.success("Email verified successfully");

        await initializeAuth();

        setTimeout(() => {
          if (user.isOnboarded) {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/onboarding";
          }
        }, 1200);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Verification failed";
      toast.error(message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      await authAPI.resendOTP({ email });
      toast.success("New code sent to your email");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setResendCooldown(60);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to resend code";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", padding: "2rem 0" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#4a7c59",
              color: "#f5f3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.75rem auto",
              boxShadow: "0 20px 50px rgba(74, 124, 89, 0.3)",
            }}
          >
            <CheckCircle size={40} strokeWidth={2.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#4a7c59",
                letterSpacing: "0.3em",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Email Verified
            </div>
            <h1
              className="font-display"
              style={{
                fontSize: "2rem",
                color: "#0d3d35",
                marginBottom: "12px",
                letterSpacing: "-0.02em",
              }}
            >
              You're all set.
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7068",
                fontFamily: "Inter",
              }}
            >
              Signing you in...
            </p>
          </motion.div>
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
        <button
          onClick={() => navigate("/signup")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "#6b7068",
            fontFamily: "Inter",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "1.5rem",
            padding: "4px 0",
          }}
        >
          <ArrowLeft size={13} />
          Back to signup
        </button>

        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "#0d3d35",
                color: "#c4a87a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Mail size={22} strokeWidth={2} />
            </div>
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: "10px",
                  color: "#c4a87a",
                  letterSpacing: "0.3em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Verify Email
              </div>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                  color: "#0d3d35",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Check your inbox.
              </h1>
            </div>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "#6b7068",
              fontFamily: "Inter",
              lineHeight: 1.6,
              marginBottom: "4px",
            }}
          >
            We sent a 6-digit verification code to
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#0d3d35",
              fontFamily: "Inter",
              fontWeight: 700,
              wordBreak: "break-all",
            }}
          >
            {email}
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#0d3d35",
              letterSpacing: "0.25em",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "12px",
            }}
          >
            Enter Code
          </label>

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "space-between",
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isVerifying}
                className="otp-input"
                style={{
                  width: "100%",
                  maxWidth: "56px",
                  height: "60px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontFamily: "Space Grotesk, monospace",
                  fontWeight: 700,
                  color: "#0d3d35",
                  background: digit ? "#0d3d35" : "#ffffff",
                  border: "2px solid",
                  borderColor: digit ? "#0d3d35" : "rgba(13, 61, 53, 0.15)",
                  borderRadius: "12px",
                  outline: "none",
                  transition: "all 0.2s",
                  WebkitTextFillColor: digit ? "#c4a87a" : "#0d3d35",
                }}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={() => handleVerify()}
          loading={isVerifying}
          fullWidth
          size="lg"
          icon={ArrowRight}
        >
          Verify & Sign In
        </Button>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f5f3ee",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6b7068",
              fontFamily: "Inter",
              marginBottom: "8px",
            }}
          >
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "transparent",
              border: "none",
              color: resendCooldown > 0 ? "#9ca09a" : "#0d3d35",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.05em",
              cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
            }}
          >
            <RotateCw size={12} />
            {isResending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
          </button>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "12px 14px",
            background: "rgba(196, 130, 58, 0.06)",
            border: "1px solid rgba(196, 130, 58, 0.15)",
            borderRadius: "10px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#5a3818",
              fontFamily: "Inter",
              lineHeight: 1.5,
            }}
          >
            <strong>Can't find the email?</strong> Check your spam or promotions
            folder. Mark it as "Not Spam" to receive future emails in your
            inbox.
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: "11px",
            color: "#9ca09a",
            fontFamily: "Inter",
            lineHeight: 1.6,
          }}
        >
          Code expires in 10 minutes.
        </p>

        <style>{`
          .otp-input:focus {
            border-color: #c4a87a !important;
            box-shadow: 0 0 0 4px rgba(196, 168, 122, 0.15);
          }
          .otp-input::-webkit-outer-spin-button,
          .otp-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          @media (max-width: 380px) {
            .otp-input {
              max-width: 48px !important;
              height: 52px !important;
              font-size: 1.25rem !important;
            }
          }
        `}</style>
      </motion.div>
    </AuthLayout>
  );
};

export default VerifyOTP;
