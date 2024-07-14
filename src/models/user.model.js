import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema ({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // to make it searchable
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    avatar: {
        type: String, // from cloudinary
        required: true,
    },

    coverImage: {
        type: String,
    },

    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    refreshToken: {
        type: String,
    },
}, { timestamps: true })

// encrypt the passworde using bcrypt
userSchema.pre("save",  async function (next) {
    if(! this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10);
    next();
})

// compare if the password is correct
userSchema.models.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
    {
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    })
}

userSchema.methods.genarateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN__EXPIRY,
        })
}

export const User = mongoose.model("User", userSchema);