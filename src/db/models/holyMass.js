import mongoose from 'mongoose';
import i18n from '../../localization';

const holyMassSchema = mongoose.Schema({
    seats: {
        type: Number,
        required: [true, i18n.__('seatsRequired')],
    },
    date: {
        type: Date,
        required: [true, i18n.__('dateRequired')]
    },
    reservedSeats: []
}, {
    timestamps: true
});

holyMassSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


const Holymass = mongoose.model('HolyMass', holyMassSchema);
export default Holymass;