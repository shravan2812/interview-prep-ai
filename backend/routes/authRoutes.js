/*Auth Routes contains endpoints of each api
authController contains loogic of what each api should do
authMiddlewares protects routes using JWT authetication*/

const express = require("express");
const{registerUser,loginUser,getUserProfile} = require("../controllers/authController");
const {protect} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware")

const router = express.Router();

//Auth Routers

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/profile",protect, getUserProfile)

router.post("/upload-image",upload.single("image"),(req,res) => {
    console.log("FILE:", req.file);
    if(!req.file){
        return res.status(400).json({msg:"No file uploaded"});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({imageUrl})
})

module.exports = router;
 