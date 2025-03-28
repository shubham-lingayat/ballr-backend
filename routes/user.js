const express = require("express");
const router = express.Router();

// Handlers
const { login, signup, sendOTP } = require("../controllers/Auth");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendOTP);

// Protected route
// check authontication and role is Admin or not
router.get("/admin", auth, isAdmin, (req,res)=>{
    return res.status(200).json({
        success:true,
        message:"welcome to the protected route for the Admin",
    });
});

module.exports = router;