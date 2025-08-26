import express from "express";
import { connectDB } from "./utils/features.js";
import cookieParser from "cookie-parser";
import {errorMiddleware} from "./middleware/error.js";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid} from "uuid";
import apiRoute from "./routes/apiroute.js";
dotenv.config({
    path: "./.env",
});
const PORT = process.env.PORT || 3000;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();


// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true
// }));

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // e.g. https://your-production.com
].filter(Boolean); // removes undefined if env is not set

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api",apiRoute);
app.use(errorMiddleware);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});
