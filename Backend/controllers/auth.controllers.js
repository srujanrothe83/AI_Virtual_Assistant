import userModel from '../models/user.model.js'
import genToken from '../config/token.js'
import bcrypt from "bcryptjs"

export async function register(req, res) {
    try {
        const { name, email, password } = req.body

        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(400).json({message:"User already exists."})
        }

        if (password.length < 6 || password.length > 16) {
            return res.status(400).json({ message: "password must be greater that 6 and less that 16 letters." })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            name,
            email,
            password:hashPassword
        })

        const token = await genToken(user._id)

        res.cookie("token",token, {
            httpOnly:true,
            maxAge : 3*24*60*60*1000
        })

        return res.status(200).json({
            message: "User Created Successfully.",
            token,
            user
        })
    } catch (error) {
        return res.status(400).json({message:"error occupied"})
    }
}

export async function logIn(req, res) {
    try {
        const { email, password } = req.body

        const existingUser = await userModel.findOne({email})

        if(!existingUser){
            return res.status(400).json({message:"User not found."})
        }

        const hashPassword = await bcrypt.compare(password, existingUser.password)

        if(!hashPassword){
            return res.status(400).json({message:"Incorrect Password"})
        }

        const token = await genToken(existingUser._id)

        res.cookie("token",token, {
            httpOnly:true,
            maxAge : 3*24*60*60*1000
        })

        return res.status(200).json({
            message: "User login Successfully.",
            token,
            existingUser
        })
    } catch (error) {
        return res.status(400).json({message:"error occupied"})
    }
}

export async function logOut(req,res){
    res.clearCookie("token")
    return res.status(200).json({message:"logout successfully."})
}