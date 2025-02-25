import mongoose from "mongoose"

const userSchama = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isMfaActive:{
        type: Boolean,
        required: false
    },
    twoFactorSecret:{
        type: String
    }
},{
    timestamps: true
})

const User = mongoose.model("User",userSchama)
export default User;