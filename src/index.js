import express, { urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./configs/dbConnect.js";

dotenv.config();
const app = express();
dbConnect();

//Middleware

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(urlencoded({ limit: "100mb", extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretxyz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
//Routes

//Listen app

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
