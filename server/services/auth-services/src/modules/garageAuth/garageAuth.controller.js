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

export const completeProfile = async (req, res, next) => {
  try {
    const result = await garageAuthService.completeProfile(req.body);

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data || null,
    });

  } catch (error) {
    next(error);
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

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await garageAuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
