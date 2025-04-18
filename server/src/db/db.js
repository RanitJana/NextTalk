import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ... ");
        console.log(`\n DB host : ${connectionInstance.connection.host}\n`);


    } catch (error) {
        console.log(`MongoDb connection-fail error: , ${error}`);
        process.exit(1);
    }
};

export { connectDb };

