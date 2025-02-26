import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/authController.js";
import {
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js"; 
import "../configs/passportConfig.js"; 

const route = Router();

// Register route
route.post("/register", register);

// Login route
route.post("/login", passport.authenticate("local"), login);

// Auth Status route
route.get("/status", authStatus);

// Logout route
route.post("/logout", logout);


route.post(
  "/setup2FA",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorised" });
  },
  setup2FA
);


route.post("/verify2FA", verify2FA);


route.post("/2FA/reset", reset2FA);

export default route;
