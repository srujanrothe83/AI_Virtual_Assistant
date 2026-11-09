import userModel from "../models/user.model.js";
import uploadOnCloudinary from '../config/cloudinary.js'
import geminiResponse from "../config/gemini.js";
import moment from 'moment-timezone'

export async function getUser(req, res) {
    try {
        const user = await userModel.findById(req.userId).select("-password")
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({ user })


    } catch (error) {
        console.log("Get User Error:", error);

        return res.status(500).json({
            message: "Get user error",
            error: error.message
        });
    }
}

export const updateAssistant = async (req,res)=>{
    try {
        const {assistantName , assistantImg} = req.body

        let Img;

        if(req.file){
            Img = await uploadOnCloudinary(req.file.path)
        }else{
            Img = assistantImg
        }

        const user = await userModel.findByIdAndUpdate(req.userId,{
            assistantName , Img
        },{new:true}).select("-password")

        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"update assistant error"})
    }
}




export const askToGemini = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        const userName = user.name;
        const assistantName = user.assistantName;

        const result = await geminiResponse(
                prompt,
                assistantName,
                userName
        );

        console.log("Raw Gemini Result:", result);

        const gemResult = typeof result === "string"
                ? JSON.parse(result.replace(/```json|```/g, "").trim())
                : result;

        console.log("Parsed Gemini Result:", gemResult);
        const { type } = gemResult;

        const now = moment().tz("Asia/Kolkata");

        switch (type) {

            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today's date is ${now.format("YYYY-MM-DD")}`
                });

            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${now.format("dddd")}`
                });

            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `The current time is ${now.format("hh:mm A")}`
                });

            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `The current month is ${now.format("MMMM")}`
                });

            default:
                if (gemResult.response) {
                    return res.json(gemResult);
                }

                return res.json({
                    type: "general",
                    userInput: prompt,
                    response: "Sorry, I couldn't process your request.",
                    parameters: {}
                });
        }

    } catch (error) {
    console.log("Ask Gemini Error:", error);
    console.log("Error Message:", error.message);
    console.log("Error Stack:", error.stack);

    return res.status(500).json({
        message: "Ask to Gemini error",
        error: error.message
    });
}
};
