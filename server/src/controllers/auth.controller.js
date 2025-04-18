import { User } from "../models/user.model";
import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async (req, res) => {
    /*
     * step#1: take input name, email, password validation them -> not empty
     * step#2: check for profilePicture given or not... ( from middleware )
     * step#3: create User object and send it after removing credentials
     */

    // step#1: take input name, email, password... 
    const { name, email, password } = req.body;

    // if any one not found, throw error: validation - not empty
    if ([name, email, password].some((field) => field?.trim() === "")) {
        res
            .status(400)
            .json(
                {
                    success: false,
                    message: "All fields are required..."
                }
            );
    }





});

export {
    registerUser,

};
