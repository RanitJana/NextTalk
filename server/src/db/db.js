import mongoose from "mongoose";
import { _env, DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${_env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("MongoDB connected ... ");
    console.log(`\n DB host : ${connectionInstance.connection.host}\n`);
  } catch (error) {
    console.log(`MongoDb connection-fail error: , ${error}`);
    process.exit(1);
  }
};

export default connectDB;
