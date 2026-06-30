import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRouter from "./router";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollToTop />
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
