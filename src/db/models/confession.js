import mongoose from 'mongoose';

const confessionSchema = mongoose.Schema({
    seats: {
        type: number,
        required: [true, i18n.__('seatsRequired')],
    },
    date: {
        type: Date,
        required: [true, i18n.__('dateRequired')]
    },
    reservedSeats: [],
    father: {
        type: number,
        required: [true, i18n.__('fatherRequired')],
    }
}, {
    timestamps: true
});

confessionSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

const Confession = mongoose.model('Confession', confessionSchema);
export default Confession;