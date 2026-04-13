import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import redis from "../../config/redis.config.js";

import { sendSMS } from "../../utils/otp.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

const GARAGE_SERVICE_URL =
  process.env.GARAGE_SERVICE_URL || "http://localhost:3000/api/v1/garage";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const otpKey = (phone) => `garage:otp:${phone}`;

// ================= SEND OTP =================
export const sendGarageOTP = async (phone) => {
  if (!phone) throw new Error("Phone required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 300);

  await sendSMS(phone, `Your Garage OTP is ${otp}`);
  console.log("garage otp:", otp);

  return { success: true, message: "OTP sent" };
};

export const verifyGarageOTP = async (phone, otp) => {
  const storedOtp = await redis.get(otpKey(phone));

  if (!storedOtp) throw new Error("OTP expired");
  if (storedOtp !== otp) throw new Error("Invalid OTP");

  await redis.del(otpKey(phone));

  let garage;

  try {

    const response = await axios.post(`${GARAGE_SERVICE_URL}/register`, {
      phone
    });

    console.log(" REGISTER SUCCESS:", response.data);
    garage = response.data;

  } catch (err) {
    console.log(" AXIOS ERROR STATUS:", err.response?.status);
    console.log(" AXIOS ERROR DATA:", err.response?.data);

    if (err.response?.data?.includes("Garage already exists")) {
      console.log("Garage exists → logging in");

      const loginResponse = await axios.post(`${GARAGE_SERVICE_URL}/login`, {
        phone
      });

      console.log("LOGIN SUCCESS:", loginResponse.data);
      garage = loginResponse.data;

    } else {
      throw new Error("Garage service error");
    }
  }

  
  const token = jwt.sign(
    { id: garage._id, role: "garage" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    success: true,
    message: "Verification completed",
    token,
    garage
  };
};

// ================= LOGIN =================
export const loginGarage = async ({ phone, password }) => {
  if (!phone || !password)
    throw new Error("Phone and password required");
  console.log("password:", password)

  let garage;

  try {
    const response = await axios.get(
      `${GARAGE_SERVICE_URL}/approved`
    );
    garage = response.data.data;
    console.log("garage:", garage)
  } catch {
    throw new Error("Garage not found");
  }

  if (garage.status !== "approved") {
    throw new Error("Garage not approved yet");
  }

  // const match = await bcrypt.compare(password, garage.password);
  // if (!match) throw new Error("Invalid password");

  const token = jwt.sign({ id: garage._id, role: "garage" }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });

  return {
    token,
    garage: {
      id: garage._id,
      name: garage.name,
      email: garage.email
    }
  };
};
