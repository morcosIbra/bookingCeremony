import mongoose from 'mongoose';
const ReservationSchema = mongoose.Schema({
    Id:Number,
    nationalId: String,
    fullName: String,
    mobile: String,
    bookingId:Number
});

export default ReservationSchema;