import bcrypt from "bcryptjs"
import User from "../models/user.js"

export const register = async (req, res) => {
    try {
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, password: hashedPassword,isMfaActive: false});
        console.log("new user ",newUser);
        await newUser.save()
        res.status(201).json({message:"User register successfully"})
    } catch (error) {
        res.status(500).json({error:"Error in registring user", message:error.message})
    }
};
export const login = async (req, res) => {
    console.log("The authenticated user is : ",req.user);;
    res.status(200).json({
        message:"User logged in successfully",
        username: req.user.username,
        isMfaActive: req.user.isMfaActive
    })
};
export const authStatus = async (req, res) => {};
export const logout = async (req, res) => {};
