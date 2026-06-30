import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import AIFeatures from "../components/landing/AIFeatures";
import Stats from "../components/landing/Stats";
import WorkoutShowcase from "../components/landing/WorkoutShowcase";
import Transformation from "../components/landing/Transformation";
import FAQ from "../components/landing/FAQ";

const Landing = () => {
  useEffect(() => {
    document.title = "TalishFits — Train Smarter. Live Better.";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#e8ebe5" }}
    >
      <Navbar />
      <Hero />
      <Features />
      <AIFeatures />
      <Stats />
      <WorkoutShowcase />
      <Transformation />
      <FAQ />
      <Footer />
    </motion.div>
  );
};

export default Landing;
