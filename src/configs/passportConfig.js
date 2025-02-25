import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "User not found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return done(null, user);
      else return done(null, false, { message: "invalid credentials" });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user,done)=>{
  console.log("we are inside serialized user");
  done(null,user._id);
})


passport.deserializeUser(async (_id, done) => {
  try {
    console.log("inside deserializeUser");
    const user = await User.findById(_id);  // Correctly assigning the result to `user`
    done(null, user);  // Passing the fetched user instead of an undefined variable
  } catch (error) {
    done(error);
  }
});
