import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import collateralRoute from "./routes/collateral.js";
import loanRoute from "./routes/loan.js";
import bankRoute from "./routes/bank.js";
import usersRoute from "./routes/users.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});
  
  // startAgenda().catch((err) => {
  //   console.error("Error starting Agenda:", err);
  // });
  
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/collateral", collateralRoute);
app.use("/api/loan", loanRoute);
app.use("/api/bank", bankRoute);
app.use("/api/user", usersRoute);


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!!!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
});

app.listen(process.env.PORT, () => {
    connect();
    console.log(`Connected to backend on port ${process.env.PORT}`);
});
  