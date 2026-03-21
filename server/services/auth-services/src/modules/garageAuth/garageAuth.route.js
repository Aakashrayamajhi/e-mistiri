
import express from "express";
import * as garageAuthController from "./garageAuth.controller.js";

const garageAuthRouter = express.Router();

garageAuthRouter.post("/send-otp", garageAuthController.sendOTP);

garageAuthRouter.post("/verify-otp", garageAuthController.verifyOTP);

garageAuthRouter.post("/login", garageAuthController.loginGarage);

export default garageAuthRouter;
