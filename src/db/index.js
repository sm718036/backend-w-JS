import mongoose from "mongoose";
import DB_NAME from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URL}/${DB_NAME}`
    );
    console.log(
      `\n Connected to database. DB HOST: !! ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit();
  }
};

export default connectDB;
