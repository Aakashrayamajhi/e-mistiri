import * as garageAuthService from "./garageAuth.service.js";


export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const result = await garageAuthService.sendGarageOTP(phone);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};


export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const garage = await garageAuthService.verifyGarageOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified",
      data: garage,
    });
  } catch (error) {
    next(error);
  }
};


export const completeProfile = async (req, res) => {
  try {
    const result = await garageAuthService.completeGarageProfile(req.body);

    res.status(200).json({
      success: true,
      message: "Profile completed",
      data: result,
    });
  } catch (error) {
    console.error("Complete profile error:", error.message);
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginGarage = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const result = await garageAuthService.loginGarage({ phone, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

