const mongoose = require('mongoose');

const DateSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    bookingdetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    }
})

module.exports = mongoose.model("Date", DateSchema);