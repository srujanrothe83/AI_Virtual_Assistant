import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        default:null
    },
    googleId: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    assistantName:{
        type:String,
        default:"Jarvis"
    },
    Img:{
        type:String,
        default:"https://img.magnific.com/free-photo/portrait-robot-scifi_23-2151843187.jpg?semt=ais_hybrid&w=740&q=80"
    }
},{timestamps:true})

const userModel = mongoose.model("user",userSchema)

export default userModel