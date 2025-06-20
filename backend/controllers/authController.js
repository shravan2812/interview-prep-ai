const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate Web Token
const generateToken = (userId) => {
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"})
}

//@desc Register a user
//@route POST/api/auth/register
//@access public 

const registerUser = async (req,res) => {
    try{
        const{name,email,password,profileImageUrl} = req.body;

        //Check if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({msg:"User already exists"});
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);//generates a cryptographic salt.A salt is a random string added to the password before hashing.
        const hashedPassword = await bcrypt.hash(password,10);

        //Create a user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl
        })
        //Return user data with jwt
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),
        })

    }catch(error){
        res.status(500).json({msg:"Server error",error:error.message})
    }
}

//@desc Login User
//@route GET/api/auth/login
//@access public 
const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            res.status(500).json({msg:"Invalid email or password"});
        }

        //Compare password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(500).json({msg:"Invalid email or password"})
        }

        //Return user data with JWT
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),
        }) 
    }catch(error){
        res.status(500).json({msg:"Server error",error:error.message})
    }
}

//@desc User profile
//@route GET/api/auth/profile
//@access private(Requires JWT)

const getUserProfile = async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            res.status(404).json({msg:"User Not found"})
        }
        res.json(user);
    }catch(error){
        res.status(500).json({msg:"Server error",error:error.message})
    }
}

module.exports = {registerUser,loginUser,getUserProfile};