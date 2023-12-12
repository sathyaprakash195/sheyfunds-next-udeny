"use server";
import { connectDB } from "@/db/config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs";

connectDB();

export const handleNewUserRegistration = async () => {
  try {
    const loggedInUserData = await currentUser();

    // check if the user model already exists , if its exits return user data
    const existingUser = await UserModel.findOne({
      clerkUserId: loggedInUserData?.id,
    });
    if (existingUser) return existingUser;

    // create new user
    let userName = loggedInUserData?.username;
    if (!userName) {
      userName = loggedInUserData?.firstName + " " + loggedInUserData?.lastName;
      userName = userName?.replace("null", "");
    }
    const newUser = new UserModel({
      clerkUserId: loggedInUserData?.id,
      userName: userName,
      email: loggedInUserData?.emailAddresses[0].emailAddress,
      profilePic: loggedInUserData?.imageUrl,
    });

    await newUser.save();
    return newUser;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getCurrentUserDataFromMongoDB = async () => {
  try {
    const loggedInUserData = await currentUser();
    const mongoUser = await UserModel.findOne({
      clerkUserId: loggedInUserData?.id,
    });
    return {
      data: JSON.parse(JSON.stringify(mongoUser)),
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
