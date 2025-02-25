import { Router } from "express";
import passport from "passport";
import { register, login } from "../controllers/authController.js";
import { authStatus, logout } from "../controllers/authController.js"; // Ensure these functions are imported
import "../configs/passportConfig.js"; // Corrected import path (assuming it's a setup file)

const route = Router();

// Register route
route.post("/register", register);

// Login route
route.post("/login", passport.authenticate("local"), login); 

// Auth Status route
route.get("/status", authStatus);

// Logout route
route.post("/logout", logout);

export default route;
