const express = require("express");
const router = express.Router();

// Handlers
const { login, signup, sendOTP, getAllUser, updateIsActive } = require("../controllers/Auth");
const { auth, isAdmin } = require("../middlewares/auth");
const { createBooking, getBookingsByDate } = require("../controllers/Booking");

// User Routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendOTP);

// Booking Routes -> Protected Route
router.post("/creatbooking", auth, createBooking);
router.get("/bookings/:date", auth, getBookingsByDate);

// Get User data --> Proteted Route
router.get("/getalluser", auth, isAdmin, getAllUser);
router.post("/updateisactive", auth, isAdmin, updateIsActive);

// Protected route
// check authontication and role is Admin or not
router.get("/admin", auth, isAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "welcome to the protected route for the Admin",
  });
});

module.exports = router;
