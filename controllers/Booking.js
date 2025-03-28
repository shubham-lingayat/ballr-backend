const Booking = require('../models/Booking');
const Date = require('../models/Date');

exports.createBooking = async(req,res) =>{
    try{
        // get data from req body
        const {clientname, tablenumber, clientcount, clientcontact, date} = req.body;
        const userId = req.user.id;
        // validate fields
        if (!clientname || !tablenumber || !clientcount || !clientcontact){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            });
        }
        // check entry is already present in db or not
        // if present then return resposne
        // create an entry in db
        const bookingDetails = Booking.create({
            userdetails:userId, clientname, tablenumber, clientcount, clientcontact
        });

        const dateDetails = Date.create
        // return response
        return res.status(200).json({
            success:true,
            message:"Booking created successfully!",
            data:bookingDetails
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server Error",
            error:err.message
        });
    }
}