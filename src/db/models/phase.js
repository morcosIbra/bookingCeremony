import mongoose from 'mongoose';
import i18n from '../../localization';

const phaseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true,i18n.__('tileRequired')]
    },
    Startdate:{
        type: Date,
        required: [true, i18n.__('dateRequired')]
    },
    Enddate:{
        type: Date,
        required: [true, i18n.__('dateRequired')]
    },
    Active: {
        type: Boolean
    }
})

const Phase = mongoose.model('Phase',phaseSchema);
export default Phase;