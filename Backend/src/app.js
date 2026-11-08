
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from '../routes/auth.routes.js';
import userRouter from '../routes/user.routes.js';

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/test", (req, res) => {
    res.send("Backend working!");
});

export default app;
