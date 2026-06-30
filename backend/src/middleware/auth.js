const jwt = require("jsonwebtoken");
const User = require("../models/User");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw createError(401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw createError(401, "User not found. Token invalid.");
    }

    if (!user.isActive) {
      throw createError(403, "Your account has been deactivated.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expired. Please refresh."));
    }
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid token."));
    }
    next(error);
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(403, `Role '${req.user.role}' is not authorized.`),
      );
    }
    next();
  };
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select(
        "-password -refreshToken",
      );
    } catch {
      // Silent fail for optional auth
    }
  }

  next();
});

module.exports = {
  protect,
  authorize,
  optionalAuth,
  asyncHandler,
  createError,
};
