import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const defaultMotivation = {
  messages: [
    {
      type: "morning",
      title: "Stay Consistent",
      message: "Every rep, every meal, every choice adds up. Keep going.",
    },
    {
      type: "workout",
      title: "Discipline Wins",
      message:
        "Discipline beats motivation. Show up even when you don't feel like it.",
    },
  ],
  dailyQuote: "The body achieves what the mind believes.",
  weeklyChallenge: "Complete all planned workouts this week.",
};

const MotivationCard = ({ motivation }) => {
  const data = motivation || defaultMotivation;
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = data.messages || [];
  const current = messages[currentIndex] || messages[0];

  const nextMessage = () =>
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  const prevMessage = () =>
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);

  return (
    <div className="motivation-card">
      <div className="motivation-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={13} style={{ color: "#0d3d35" }} strokeWidth={2.5} />
          <span
            className="font-mono motivation-tag"
            style={{
              color: "#0d3d35",
              letterSpacing: "0.25em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            AI Motivation
          </span>
        </div>

        {messages.length > 1 && (
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={prevMessage} className="motivation-nav-btn">
              <ChevronLeft size={12} />
            </button>
            <button onClick={nextMessage} className="motivation-nav-btn">
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <h4
              className="font-display motivation-title"
              style={{ color: "#0d3d35", letterSpacing: "-0.01em" }}
            >
              {current.title}
            </h4>
            <p
              className="motivation-message"
              style={{ color: "#2a2a2a", fontFamily: "Inter", lineHeight: 1.6 }}
            >
              {current.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {data.dailyQuote && (
        <>
          <div
            style={{
              height: "1px",
              background: "rgba(13, 61, 53, 0.08)",
              margin: "1rem 0",
            }}
          />
          <blockquote
            className="script motivation-quote"
            style={{ color: "#0d3d35", lineHeight: 1.4 }}
          >
            "{data.dailyQuote}"
          </blockquote>
        </>
      )}

      {data.weeklyChallenge && (
        <div className="motivation-challenge">
          <p
            className="font-mono motivation-challenge-label"
            style={{
              color: "#c4a87a",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            Weekly Challenge
          </p>
          <p
            className="motivation-challenge-text"
            style={{ color: "#f5f3ee", fontFamily: "Inter", lineHeight: 1.5 }}
          >
            {data.weeklyChallenge}
          </p>
        </div>
      )}

      <style>{`
        .motivation-card {
          background: #d8e0d4;
          border-radius: 16px;
          padding: 1.25rem;
        }

        .motivation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .motivation-tag {
          font-size: 9px;
        }

        .motivation-nav-btn {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: rgba(13, 61, 53, 0.08);
          border: none;
          cursor: pointer;
          color: #0d3d35;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .motivation-title {
          font-size: 1rem;
          margin-bottom: 6px;
        }

        .motivation-message {
          font-size: 12px;
        }

        .motivation-quote {
          font-size: 1rem;
        }

        .motivation-challenge {
          margin-top: 1rem;
          padding: 10px 12px;
          background: #0d3d35;
          border-radius: 10px;
        }

        .motivation-challenge-label {
          font-size: 8px;
        }

        .motivation-challenge-text {
          font-size: 11px;
        }

        @media (min-width: 480px) {
          .motivation-card {
            padding: 1.5rem;
          }
          .motivation-tag {
            font-size: 10px;
          }
          .motivation-nav-btn {
            width: 24px;
            height: 24px;
          }
          .motivation-title {
            font-size: 1.125rem;
          }
          .motivation-message {
            font-size: 13px;
          }
          .motivation-quote {
            font-size: 1.125rem;
          }
          .motivation-challenge {
            padding: 12px 14px;
          }
          .motivation-challenge-label {
            font-size: 9px;
          }
          .motivation-challenge-text {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MotivationCard;
