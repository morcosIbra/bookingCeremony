import mongoose from 'mongoose';
import i18n from '../../localization';
import ReservationSchema from './reservation';



const holyMassSchema = mongoose.Schema({
    seats: {
        type: Number,
        required: [true, i18n.__('seatsRequired')],
    },
    date: {
        type: Date,
        required: [true, i18n.__('dateRequired')],
        unique: true
    },
    description: {
        type: String
    },
    reservedSeats: [{
        memberId: String,
        nationalId: String,
        fullName: String,
        mobile: String,
        bookingId: Number,
        bookDate: Date,
        adminSeat: Boolean,
        isDeacon: Boolean
    }]
}, {
    timestamps: true
});

holyMassSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Holymass = mongoose.model('HolyMass', holyMassSchema);
export default Holymass;