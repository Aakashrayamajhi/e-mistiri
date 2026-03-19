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
  process.env.USER_SERVICE_URL || "http://localhost:3000/api/v1/user";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const otpKey = (phone) => `otp:${phone}`;


// ================= SEND OTP =================

export const sendOTP = async (phone) => {
  if (!phone) throw new Error("Phone required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 200);

  await sendSMS(phone, `Your OTP is ${otp}`);
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

  return response.data;
};


export const completeProfile = async ({
  userId,
  username,
  email,
  password
}) => {
  if (!username || !email || !password)
    throw new Error("All fields required");

  if (!email.includes("@")) throw new Error("Invalid email");
  if (password.length < 6) throw new Error("Password too short");

  const existingUsername = await getUsername(username);
  if (existingUsername) throw new Error("Username already exists");

  const existingEmail = await getEmail(email);
  if (existingEmail) throw new Error("Email already exists");

  const usernameReserved = await reserveUsername(username);
  if (!usernameReserved) throw new Error("Username busy");

  const emailReserved = await reserveEmail(email);
  if (!emailReserved) {
    await releaseUsername(username);
    throw new Error("Email busy");
  }

  let existingUser = null;
  try {
    const res = await axios.get(`${USER_SERVICE_URL}/email/${email}`);
    existingUser = res.data;
  } catch {}

  if (existingUser) {
    await releaseUsername(username);
    await releaseEmail(email);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const response = await axios.patch(`${USER_SERVICE_URL}/${userId}`, {
    name: username,
    email,
    password: hashedPassword
  });

  const user = response.data;

  await saveUserCache(username, email);

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  return {
    token,
    user: {
      id: user._id,
      username: user.name,
      email: user.email
    }
  };
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
    console.log("l-u:",user)
  } catch {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid password");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  return {
    token,
    user: {
      id: user._id,
      username: user.name,
      email: user.email
    }
  };
};