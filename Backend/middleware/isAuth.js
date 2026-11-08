import jwt from 'jsonwebtoken';

const isAuth = async (req,res,next)=>{
    try {
        const token = req.cookies?.token
    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET)
    
    if(!verifiedToken){
        return res.status(400).json({message:'unathorized token'})
    }

    console.log("Decoded JWT:", verifiedToken);
    console.log("User ID:", verifiedToken.id);

    req.userId =  verifiedToken.id

    next()


    } catch (error) {
        console.log("Auth Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }



    
}

export default isAuth