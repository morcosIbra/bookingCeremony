import mongoose from 'mongoose';

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
}
export default connectDb;
