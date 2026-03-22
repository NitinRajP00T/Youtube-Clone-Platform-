const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          const randomPassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
          user = await User.create({
            googleId: profile.id,
            username:
              profile.displayName.replace(/\s/g, "").toLowerCase() +
              Math.random().toString(36).slice(-4),
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: randomPassword,
            googleAuth: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.googleAuth = true;
          await user.save({ validateBeforeSave: false });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);