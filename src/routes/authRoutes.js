const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const passport = require("passport");
const router = express.Router();
const generateUsername = require("./../utils/UserNameGun");
router.post(
  "/register",
  [
    body("username")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.register,
);

router.post("/login", authController.login);

// router.post("/google", authController.googleAuth); // Commented for learning purposes

router.get("/me", protect, authController.getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth` 
  }),
  authController.googleAuthCallback
);

module.exports = router;
