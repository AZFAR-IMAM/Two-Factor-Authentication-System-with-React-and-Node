import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";
import qrCode from "qrCode";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });
    console.log("new user ", newUser);
    await newUser.save();
    res.status(201).json({ message: "User register successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error in registring user", message: error.message });
  }
};
export const login = async (req, res) => {
  console.log("The authenticated user is : ", req.user);
  res.status(200).json({
    message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};
export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};

export const logout = async (req, res) => {
  if (!req.user) res.status(401).json({ message: "Unauthorized user" });
  req.logout((err) => {
    if (err) return res.status(401).json({ message: "User not logged in" });
    res.status(200).json({ message: "logout successfull" });
  });
};

export const setup2FA = async (req, res) => {
  try {
    console.log("the req.user is : ", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("secret is: ", secret);
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      encoding: "base32",
    });
    const qrImageURL = await qrCode.toDataURL(url);
    res.status(200).json({ secret: secret.base32, qrImageURL });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error setting up 2FA", message: error });
  }
};
export const verify2FA = async (req, res) => {
  const { token } = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });
  const paylode = { username: user.username };
  const key = process.env.JWT_SECRET;
  const expireTime = { expiresIn: "1hr" };
  if (verified) {
    const jwtToken = jwt.sign(paylode, key, expireTime);
    res.status(200).json({ message: "2FA successfull ", token: jwtToken });
  } else {
    res.status(400).json({ message: "Invalide 2FA token" });
  }
};
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successfull" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reseting 2FA", message: error.message });
  }
};
