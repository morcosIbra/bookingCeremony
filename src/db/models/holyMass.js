import mongoose from 'mongoose';

const holyMassSchema = mongoose.Schema({
    seats: {
        type: number,
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

const HolyMass = mongoose.model('HolyMass', holyMassSchema);
export default HolyMass;