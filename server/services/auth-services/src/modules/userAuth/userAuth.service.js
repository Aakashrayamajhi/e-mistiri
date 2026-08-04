import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import redis from "../../config/redis.config.js";
import { sendSMS } from "../../utils/otp.service.js";
import { generateAccessToken, generateRefreshToken, storeRefreshToken, revokeRefreshToken, verifyRefreshToken, isRefreshTokenValid } from "../../utils/token.service.js";
import { env } from "../../config/dotenv.config.js";
import { retry, withTimeout } from "../../utils/retry.js";
import { withCircuitBreaker } from "../../utils/circuitBreaker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

const USER_SERVICE_URL = env.USER_SERVICE_URL;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
  }
};

export function isValidNepaliPhoneNumber(phone) {
  if (typeof phone !== "string") return false;
  const normalized = phone.replace(/[\s-]/g, "");
  const local = normalized.replace(/^(?:\+?977)/, "");
  if (!/^\d{10}$/.test(local)) return false;
  const prefix = local.slice(0, 2);
  return prefix === "97" || prefix === "98";
}

const callWithResilience = async (fn) => {
  const timeoutFn = withTimeout(fn, 10000);
  const retryFn = () => retry(timeoutFn, 3, 1000, 10000);
  const circuitBreakerFn = withCircuitBreaker(retryFn);
  return circuitBreakerFn();
};

export const completeProfile = async (data) => {
  try {
    const { phone, fullname, password, otp, email } = data;

    if (!phone) throw new Error("Phone is required");

    if (!isValidNepaliPhoneNumber(phone)) {
      throw new Error("Invalid Nepali phone number");
    }

    if (!otp) {
      if (!fullname && !password) {
        throw new Error("All fields are required");
      }

      if (!fullname) {
        throw new Error("fullname missing");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (fullname.trim().length < 3) {
        throw new Error("Fullname must be at least 3 characters");
      }

      validatePassword(password);

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      await redis.set(
        `usersignup:${phone}`,
        JSON.stringify({
          phone,
          fullname,
          password,
          otp: generatedOtp
        }),
        "EX",
        300
      );

      console.log("OTP:", generatedOtp);

      return {
        success: true,
        message: "OTP sent to phone",
      };
    }

    const storedData = await redis.get(`usersignup:${phone}`);

    if (!storedData) throw new Error("OTP expired or not requested");

    const parsedData = JSON.parse(storedData);

    if (parsedData.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const response = await callWithResilience(() =>
      axios.post(`${USER_SERVICE_URL}`, {
        phone: parsedData.phone,
        fullname: parsedData.fullname,
        password: hashedPassword,
      })
    );

    if (response.fallback) {
      throw new Error("User service is temporarily unavailable. Please try again later.");
    }

    const user = response.data.data.data;
    console.log("user:", user)

    await redis.del(`usersignup:${phone}`);

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      role: user.role,
    });

    await storeRefreshToken(user._id, refreshToken);

    console.log("user id in token:", user._id)
    return {
      success: true,
      message: "Signup successful",
      data: {
        accessToken,
        refreshToken,
        user,
      },
    };

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "User service error");
    }
    throw new Error(error.message || "Something went wrong");
  }
};

export const loginUser = async ({ phone, password }) => {
  if (!phone || !password)
    throw new Error("phoneNumber and password required");

  if (!isValidNepaliPhoneNumber(phone)) {
    throw new Error("Invalid Nepali phone number");
  }

  const response = await callWithResilience(() =>
    axios.get(`${USER_SERVICE_URL}/phone/${phone}`)
  );

  if (response.fallback) {
    throw new Error("User service is temporarily unavailable. Please try again later.");
  }

  const user = response.data.data;

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid password");

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  await storeRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.name,
      email: user.email
    }
  };
};

export const refreshToken = async (token) => {
  try {
    const decoded = verifyRefreshToken(token);

    const isValid = await isRefreshTokenValid(decoded.id, token);
    if (!isValid) {
      throw new Error("Invalid or expired refresh token");
    }

    await revokeRefreshToken(decoded.id, token);

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    const newRefreshToken = generateRefreshToken({
      id: decoded.id,
      role: decoded.role,
    });

    await storeRefreshToken(decoded.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
