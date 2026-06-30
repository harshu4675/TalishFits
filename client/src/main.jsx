import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#0d3d35",
              color: "#f5f3ee",
              border: "1px solid rgba(245, 243, 238, 0.1)",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              padding: "14px 20px",
              boxShadow: "0 16px 40px rgba(13, 61, 53, 0.25)",
            },
            success: {
              iconTheme: {
                primary: "#c4a87a",
                secondary: "#0d3d35",
              },
            },
            error: {
              iconTheme: {
                primary: "#a84838",
                secondary: "#f5f3ee",
              },
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
