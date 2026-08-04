import * as mechanicAuthService from "./mechanicAuth.service.js";

export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const result = await mechanicAuthService.sendmechanicOTP(phone);

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

    const mechanic = await mechanicAuthService.verifymechanicOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified",
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
};

export const completeProfile = async (req, res, next) => {
  try {
    const result = await mechanicAuthService.completeProfile(req.body);

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data || null,
    });
  } catch (error) {
    next(error);
  }
};

export const loginmechanic = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const result = await mechanicAuthService.loginmechanic({ phone, password });

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

    const result = await mechanicAuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
