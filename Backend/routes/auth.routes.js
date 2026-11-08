import { Router } from "express";
import { logIn, logOut, register } from "../controllers/auth.controllers.js";
import { googleAuth } from "../controllers/google.controller.js";

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", logIn)
authRouter.get("/logout", logOut)
authRouter.post("/google", googleAuth)


export default authRouter