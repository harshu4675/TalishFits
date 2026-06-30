require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "https://talishfits.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".netlify.live");

      if (isAllowed) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Refresh-Token",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.options("*", cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});

app.use("/api", limiter);

app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "TalishFits API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

const loadRoute = (path) => {
  try {
    const route = require(path);
    if (typeof route !== "function" && typeof route.handle !== "function") {
      console.error(`Route ${path} does not export a valid middleware/router`);
      const dummyRouter = express.Router();
      dummyRouter.all("*", (req, res) => {
        res.status(500).json({
          success: false,
          message: `Route ${path} not properly configured`,
        });
      });
      return dummyRouter;
    }
    return route;
  } catch (err) {
    console.error(`Failed to load route ${path}:`, err.message);
    const dummyRouter = express.Router();
    dummyRouter.all("*", (req, res) => {
      res.status(500).json({
        success: false,
        message: `Route module error: ${err.message}`,
      });
    });
    return dummyRouter;
  }
};

app.use("/api/auth", loadRoute("./routes/authRoutes"));
app.use("/api/users", loadRoute("./routes/userRoutes"));
app.use("/api/workouts", loadRoute("./routes/workoutRoutes"));
app.use("/api/diet", loadRoute("./routes/dietRoutes"));
app.use("/api/progress", loadRoute("./routes/progressRoutes"));
app.use("/api/ai", loadRoute("./routes/aiRoutes"));
app.use("/api/achievements", loadRoute("./routes/achievementRoutes"));
app.use("/api/notifications", loadRoute("./routes/notificationRoutes"));

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(". ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
