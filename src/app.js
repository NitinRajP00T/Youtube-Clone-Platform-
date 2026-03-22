const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Basic health route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "API is running" });
});

const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const channelRoutes = require("./routes/channelRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// ==========================================
// FULL API ENDPOINTS LIST FOR TESTING
// ==========================================
//
// --- AUTH ---
// POST   /api/auth/register
// POST   /api/auth/login
// POST   /api/auth/google
// GET    /api/auth/me
//
// --- USERS ---
// GET    /api/users/:userId
//
// --- CHANNELS ---
// POST   /api/channels
// GET    /api/channels/:channelId
// PUT    /api/channels/:channelId
// GET    /api/channels/user/:userId
//
// --- VIDEOS ---
// GET    /api/videos
// GET    /api/videos/:videoId
// POST   /api/videos
// PUT    /api/videos/:videoId
// DELETE /api/videos/:videoId
// POST   /api/videos/:videoId/like
// POST   /api/videos/:videoId/dislike
//
// --- COMMENTS ---
// GET    /api/comments
// POST   /api/comments
// PUT    /api/comments/:commentId
// DELETE /api/comments/:commentId
// (Note: also accessible via /api/videos/:videoId/comments/...)
//
// --- UPLOAD ---
// POST   /api/upload
// ==========================================

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

// Nest the comment router into the video router
videoRoutes.use("/:videoId/comments", commentRoutes);

//404 handler
// app.all('/*', (req, res, next) => {
//     res.status(404).json({
//         status: 'fail',
//         message: `Can't find ${req.originalUrl} on this server!`
//     });
// });

// Global error handler
const AppError = require("./utils/AppError");
const passport = require("passport");

require("./config/passport");
app.use(passport.initialize());

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production simplified error msg
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : "Something went very wrong!",
    });
  }
});

module.exports = app;
