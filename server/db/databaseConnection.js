import mongoose from 'mongoose';


async function connectDB() {
    try {
        await mongoose.connect( process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
    }
}

export default connectDB;