const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
        return true;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        console.log("Continuing without MongoDB. The API will use in-memory sample data until the URI is fixed.");
        return false;
    }
};

module.exports = connectDB;
