import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    // 1. get user details from frontend
    // 2. validation - not empty
    // 3. Check if user already exist: userName, email
    // 4. Check for images, check for avatar
    // 5. Upload them to cloudinary
    // 6. Create user object - create entry in db
    // 7. Remove password & refresh token field from response
    // 8. Check for user creation
    // 9. Return response

    const {userName, fullName, email, password} = req.body;


    if (
        [userName, fullName, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })


    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0].path;


    if (! avatarLocalPath) {
        throw new ApiError(400, "Avatar is required!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (! avatar) {
        throw new ApiError(400, "Avatar is required!");
    }

    const user = await User.create ({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if (! createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User has been registered successfully")
    )
})

export { registerUser }