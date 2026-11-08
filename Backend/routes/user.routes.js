import { Router } from "express";
import { askToGemini, getUser, updateAssistant } from "../controllers/user.controllers.js";
import isAuth from "../middleware/isAuth.js"
import upload from "../config/multer.js";

const userRouter = Router()

userRouter.get("/getuser", isAuth, getUser)
userRouter.post("/update", isAuth , upload.single("Img") , updateAssistant)
userRouter.post("/asktoassistant", isAuth , askToGemini)

export default userRouter