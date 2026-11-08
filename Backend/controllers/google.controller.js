import { OAuth2Client } from "google-auth-library";
import userModel from "../models/user.model.js";
import genToken from "../config/token.js";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            name,
            email,
            email_verified
        } = payload;

        if (!email || !email_verified) {
            return res.status(400).json({
                message: "Google email is not verified"
            });
        }

        let user = await userModel.findOne({ googleId });

        if (!user) {
            user = await userModel.findOne({ email });

            // Don't silently link an existing local account.
            if (user) {
                return res.status(409).json({
                    message: "Account already exists. Login using your password first."
                });
            }

            user = await userModel.create({
                name,
                email,
                googleId,
                authProvider: "google"
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,    
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({
            message: "Google authentication successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Google authentication failed"
        });
    }
};
