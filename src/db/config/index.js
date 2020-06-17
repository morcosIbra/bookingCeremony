import mongoose from 'mongoose';
require('dotenv').config({ path: 'sample.env' })

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
}
export default connectDb;
