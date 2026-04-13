import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import redis from "../../config/redis.config.js";

import { sendSMS } from "../../utils/otp.service.js";

import {
  getUsername,
  getEmail,
  reserveUsername,
  reserveEmail,
  releaseUsername,
  releaseEmail,
  saveUserCache
} from "../../utils/lookup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3002/api/v1/user";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const otpKey = (phone) => `otp:${phone}`;


// ================= SEND OTP =================

export const sendOTP = async (phone) => {
  if (!phone) throw new Error("Phone required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 200);

  // await sendSMS(phone, `Your OTP is ${otp}`);
  console.log("otp:", otp)

  return { success: true, message: "OTP sent" };
};


// ================= VERIFY OTP =================

export const verifyOTP = async (phone, otp) => {
  const storedOtp = await redis.get(otpKey(phone));

  if (!storedOtp) throw new Error("OTP expired");

  if (storedOtp !== otp) throw new Error("Invalid OTP");

  await redis.del(otpKey(phone));
  const response = await axios.post(`${USER_SERVICE_URL}`, {
    phone
  });

  let user = response.data.data

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
  return {
    success: true,
    token,
    message: "Successfully verified your Number",
    user
  };
};


const validatePassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
  }
};

export const completeProfile = async (data, token) => {
  try {
    const { userId, fullname, password } = data;

    
    if (!userId) throw new Error("User ID is required");
    if (!fullname || fullname.trim().length < 3) {
      throw new Error("Full name must be at least 3 characters");
    }

    const updateData = {
      fullname: fullname.trim(),
    };

   
    if (password) {
      // validatePassword(password);

      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

   
    const response = await axios.patch(
      `${USER_SERVICE_URL}/${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      user: response.data.data,
    };

  } catch (error) {
 
    if (error.response) {
  
      throw new Error(
        error.response.data?.message || "User service error"
      );
    }

    throw new Error(error.message || "Something went wrong");
  }
};



export const loginUser = async ({ phone, password }) => {
  if (!phone || !password)
    throw new Error("phoneNumber and password required");

  console.log("password:", password)

  let user;

  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/phone/${phone}`
    );
    user = response.data.data;
    console.log("l-u:", user)
  } catch {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid password");

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,

    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
  return {
    token,
    user: {
      id: user._id,
      username: user.name,
      email: user.email
    }
  };
};