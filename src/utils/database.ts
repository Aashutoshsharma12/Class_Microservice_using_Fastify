import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const MONGO_URI: any = process.env.MONGO_URI
        await mongoose.connect(MONGO_URI.toString())
        console.log('DB connected ---')
    } catch (err) {
        console.log(err);
        return err;
    }
}

export default connectDb;