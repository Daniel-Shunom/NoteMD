import mongoose, { Schema } from "mongoose";
import { required } from "nodemon/lib/config";
import { type } from "os";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    }, 
    lname: {
        type: String,
        required: true,
    }, 
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
})

const User = models.User || mongoose.model("User", userSchema)

export default User;