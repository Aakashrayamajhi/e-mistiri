import * as authService from "./userAuth.service.js";

export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const result = await authService.sendOTP(phone);

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

    const user = await authService.verifyOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


export const completeProfile = async (req, res, next) => {
  try {
    const result = await authService.completeProfile(req.body);

    res.status(200).json({
      success: result.success,
      message: result.message, 
      data: result.data || null,
    });

  } catch (error) {
    next(error); 
  }
};


// export const completeProfile = async (req, res, next) => {
//   try {
//     const result = await authService.completeProfile(req.body);

//     res.status(200).json({
//       success: true,
//       message: "Profile completed",
//       data: result,
//     });

//   } catch (error) {
//     next(error); 
//   }
// };

export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const result = await authService.loginUser({ phone, password });


    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};