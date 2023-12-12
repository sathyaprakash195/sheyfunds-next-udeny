import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB Connection Successfull");
  } catch (error) {
    console.log(error);
  }
};
