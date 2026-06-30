import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How does TalishFits create personalized plans?",
    a: "Our AI analyzes your body composition, health profile, activity level, food preferences, and fitness goals to generate unique plans tailored specifically for you.",
  },
  {
    q: "Is TalishFits suitable for beginners?",
    a: "Absolutely. TalishFits adapts to all fitness levels. The system starts with your current capabilities and progressively increases intensity as you improve.",
  },
  {
    q: "Can I use TalishFits for home workouts?",
    a: "Yes. Choose between gym, home, or mixed workouts. Home plans use bodyweight exercises only with no equipment required.",
  },
  {
    q: "Does it support vegetarian and Indian diets?",
    a: "TalishFits fully supports vegetarian, vegan, non-vegetarian, and eggetarian diets with extensive Indian food databases.",
  },
  {
    q: "How accurate are the body metrics calculations?",
    a: "We use clinically validated formulas including Mifflin-St Jeor for BMR, Deurenberg for body fat, and Devine for ideal weight — within 3-5% accuracy.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, cancel anytime with zero fees. Your data remains accessible and you keep access to free tier features.",
  },
  {
    q: "Is my health data safe?",
    a: "Your data is AES-256 encrypted, stored on secure cloud infrastructure, and never sold or shared with third parties.",
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <div style={{ borderBottom: "1px solid rgba(13, 61, 53, 0.1)" }}>
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.75rem 0",
        cursor: "pointer",
        background: "transparent",
        border: "none",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <span
          className="font-mono"
          style={{
            fontSize: "11px",
            color: "#c4a87a",
            letterSpacing: "0.2em",
            fontWeight: 700,
            width: "30px",
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "15px",
            color: isOpen ? "#0d3d35" : "#2a2a2a",
            transition: "color 0.3s",
          }}
        >
          {faq.q}
        </h3>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: isOpen ? "#0d3d35" : "transparent",
          border: "1.5px solid #0d3d35",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isOpen ? "#f5f3ee" : "#0d3d35",
          flexShrink: 0,
          marginLeft: "1rem",
          transition: "all 0.3s",
        }}
      >
        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ overflow: "hidden" }}
        >
          <p
            style={{
              paddingBottom: "1.75rem",
              paddingLeft: "3.25rem",
              paddingRight: "3rem",
              fontSize: "14px",
              color: "#6b7068",
              fontFamily: "Inter",
              lineHeight: 1.7,
            }}
          >
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      id="faq"
      style={{
        padding: "clamp(4rem, 8vw, 8rem) 0",
        backgroundColor: "#d8e0d4",
      }}
    >
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "1.5px",
                  background: "#0d3d35",
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: "11px",
                  color: "#0d3d35",
                  letterSpacing: "0.3em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                FAQ
              </span>
            </div>
            <h2 className="text-display" style={{ marginBottom: "1.5rem" }}>
              Frequently asked questions.
            </h2>
            <p
              style={{
                color: "#6b7068",
                fontFamily: "Inter",
                fontSize: "14px",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              Can't find what you're looking for? Reach out to our support team.
            </p>
            <a
              href="mailto:support@talishfits.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#0d3d35",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                paddingBottom: "4px",
                borderBottom: "2px solid #0d3d35",
              }}
            >
              Contact Support
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
