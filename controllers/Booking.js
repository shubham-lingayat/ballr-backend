const Booking = require("../models/Booking");
const DateModel = require("../models/Date");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    // Get data from request body
    const { clientname, tablenumber, clientcount, clientcontact, date } =
      req.body;
    const userId = req.user.id; // Assuming user is authenticated

    // Validate fields
    if (
      !clientname ||
      !tablenumber ||
      !clientcount ||
      !clientcontact ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found, please log in again",
      });
    }

    // ✅ Check if a Date entry already exists for the given date
    let dateEntry = await DateModel.findOne({ date });

    // ✅ Check if a booking already exists for the same date and table number
    const existingBooking = await Booking.findOne({
      tablenumber,
      dateDetails: dateEntry._id,
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message:
          "A booking already exists for this table on the selected date.",
      });
    }

    // ✅ Create a new Booking entry
    const bookingDetails = await Booking.create({
      userdetails: userId,
      clientname,
      tablenumber,
      clientcount,
      clientcontact,
      date,
    });

    if (!dateEntry) {
      // If no entry exists, create a new one with the first booking
      dateEntry = await DateModel.create({
        date,
        bookingdetails: [bookingDetails._id], // Store as an array
      });
    } else {
      // If a Date entry exists, add this new booking to the array
      dateEntry.bookingdetails.push(bookingDetails._id);
      await dateEntry.save();
    }

    const finalBooking = await Booking.findByIdAndUpdate(
      bookingDetails._id,
      { dateDetails: dateEntry._id },
      { new: true }
    );

    // ✅ Return response
    return res.status(200).json({
      success: true,
      message: "Booking created successfully!",
      databooking: finalBooking,
      datadate: dateEntry,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Get booking data from date
exports.getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Find bookings for the given date and populate user details
    const dateData = await DateModel.findOne({ date }).populate({
      path: "bookingdetails",
      populate: {
        path: "userdetails",
        select: "name email contactNumber accountType",
      },
    });

    if (!dateData) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this date",
      });
    }

    res.status(200).json({
      success: true,
      data: dateData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
