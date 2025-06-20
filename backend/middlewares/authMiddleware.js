const jwt = require("jsonwebtoken")
const User = require("../models/User")

//Middlewares to protect routes

const protect = async (req,res,next) => {
    try{
        let token = req.headers.authorization;
        if(token &&token.startsWith("Bearer")){ //"Bearer xyz" --> "xyz"
            token = token.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }else{
            res.status(401).json({msg:"Not authorized,no token"});
        }
    }catch(error){
        
        res.status(401).json({msg:"Token failed",error:error.message})
    }
}

module.exports = {protect}