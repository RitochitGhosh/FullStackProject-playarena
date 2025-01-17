import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import { cookie } from "express/lib/response.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// handling json responses from API calls
app.use(express.json({
    limit: "16kb"
}));

// handling file uploading config : multer

//handling url requests
app.use(express.urlencoded({
    extended: true,
    limit : "16kb",
}));

// to store static informations temporarily
app.use(express.static("public"));

app.use(cookieParser());

// routes import 
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app };
