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

  await redis.set(otpKey(phone), otp, "EX", 200);

  await sendSMS(phone, `Your Garage OTP is ${otp}`);
  console.log("garage otp:", otp);

  return { success: true, message: "OTP sent" };
};


export const verifyGarageOTP = async (phone, otp) => {
  const storedOtp = await redis.get(otpKey(phone));

  if (!storedOtp) throw new Error("OTP expired");
  if (storedOtp !== otp) throw new Error("Invalid OTP");

  await redis.del(otpKey(phone));

  const response = await axios.post(`${GARAGE_SERVICE_URL}/register`, {
    phone
  });

  return response.data;
};


export const completeGarageProfile = async (data) => {
  const {
    garageId,
    name,
    ownerName,
    email,
    password,
    address,
    city,
    description,
    location,
    services,
    openingTime,
    closingTime,
    isOpen24Hours,
    documents,
    paymentDetails,
    shopImages
  } = data;

  if (!garageId) throw new Error("Garage ID required");
  if (!name || !ownerName) throw new Error("Basic info missing");
  if (!email || !email.includes("@")) throw new Error("Invalid email");

  let updateData = {
    name,
    ownerName,
    email,
    address,
    city,
    description,
    location,
    services,
    openingTime,
    closingTime,
    isOpen24Hours,
    documents,
    paymentDetails,
    shopImages
  };

  // Password optional
  if (password) {
    if (password.length < 6) throw new Error("Password too short");
    updateData.password = await bcrypt.hash(password, 10);
  }

  const response = await axios.patch(
    `${GARAGE_SERVICE_URL}/${garageId}`,
    updateData
  );

  const garage = response.data;

  const token = jwt.sign(
    { id: garage._id, role: "garage" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    garage
  };
};

// ================= LOGIN =================
export const loginGarage = async ({ phone, password }) => {
  if (!phone || !password)
    throw new Error("Phone and password required");

  let garage;

  try {
    const response = await axios.get(
      `${GARAGE_SERVICE_URL}`
    );
    garage = response.data.data;
    console.log("garage:", garage)
  } catch {
    throw new Error("Garage not found");
  }

  if (garage.status !== "approved") {
    throw new Error("Garage not approved yet");
  }

  const match = await bcrypt.compare(password, garage.password);
  if (!match) throw new Error("Invalid password");

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
