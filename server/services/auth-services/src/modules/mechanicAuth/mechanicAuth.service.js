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

const MECHANIC_SERVICE_URL =
  process.env.MECHANIC_SERVICE_URL || "http://localhost:3002/api/v1/mechanic";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";


const validatePassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/;

  if (!strongPasswordRegex.test(password)) {
    throw new Error(
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character"
    );
  }
};

// phone number validation ko laghi 

export function isValidNepaliPhoneNumber(phone) {
  if (typeof phone !== "string") return false;

  const normalized = phone.replace(/[\s-]/g, "");
  const local = normalized.replace(/^(?:\+?977)/, "");

  if (!/^\d{10}$/.test(local)) return false;

  const prefix = local.slice(0, 2);

  return prefix === "97" || prefix === "98";
}

//mechanic ko signup logic

export const completeProfile = async (data) => {
  try {

    console.log("mechanic complete profile module hit")
    const { phone, fullname, password, otp } = data;

    if (!phone) throw new Error("Phone is required");

    //CB and fallback 
      if (!isValidNepaliPhoneNumber(phone)) {
      throw new Error("Invalid Nepali phone number");
    }


    if (!otp) {
    if (!phone) {
        const error = new Error("Phone is required");
        error.status = 400;
        throw error;
      }

      if (!fullname && !password) {
        const error = new Error("All feilds are required")
        error.status = 400;
        throw error;
      }

      if (!fullname) {
        const error = new Error("fullname missing")
        error.status = 400
        throw error
      }

      if (!password) {
        const error = new Error("Password is required");
        error.status = 400;
        throw error;
      }

      if (fullname.trim().length < 3) {
        const error = new Error("Fullname must be at least 3 characters");
        error.status = 400;
        throw error;
      }

      validatePassword(password);

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();


      await redis.set(
        `mechanicsignup:${phone}`,
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

    // ================= VERIFY OTP =================
    const storedData = await redis.get(`mechanicsignup:${phone}`);

    if (!storedData) throw new Error("OTP expired or not requested");

    const parsedData = JSON.parse(storedData);

    if (parsedData.otp !== otp) {
      throw new Error("Invalid OTP");
    }


    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const response = await axios.post(`${MECHANIC_SERVICE_URL}`, {
      phone: parsedData.phone,
      fullname: parsedData.fullname,
      password: hashedPassword,
    });
    
    console.log("axios hit mechanic.services.js")
    const mechanic = response.data.data;
    console.log("mechanic:", mechanic)

    await redis.del(`mechanicsignup:${phone}`);

    const token = jwt.sign(
      {
        id: mechanic._id,
        role: mechanic.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN
      }
    );

    console.log("mechanic id in token:" , mechanic._id)
    return {
      success: true,
      message: "Signup successful",
      data: {
        token,
        mechanic,
      },
    };

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "mechanic service error");
    }

    throw new Error(error.message || "Something went wrong");
  }
};



export const loginmechanic = async ({ phone, password }) => {
  if (!phone || !password)
    throw new Error("phoneNumber and password required");

    if (!isValidNepaliPhoneNumber(phone)) {
    throw new Error("Invalid Nepali phone number");
  }

  console.log("password:", password)

  let mechanic;

  try {
    const response = await axios.get(
      `${MECHANIC_SERVICE_URL}/phone/${phone}`
    );
    mechanic = response.data.data;
    console.log("l-u:", mechanic)
  } catch {
    throw new Error("mechanic not found");
  }

  const match = await bcrypt.compare(password, mechanic.password);
  if (!match) throw new Error("Invalid password");

  const token = jwt.sign(
    {
      id: mechanic._id,
      role: mechanic.role,

    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN
    }
  );
  return {
    token,
    mechanic: {
      id: mechanic._id,
      mechanicname: mechanic.name,
      email: mechanic.email
    }
  };
};




// // ================= LOGIN =================
// export const loginmechanic = async ({ phone, password }) => {
//   if (!phone || !password)
//     throw new Error("Phone and password required");
//   console.log("password:", password)

//   let mechanic;
  
//   try {
//     const response = await axios.get(
//       `${mechanic_SERVICE_URL}/approved`
//     );
//     mechanic = response.data.data;
//     console.log("mechanic:", mechanic)
//   } catch {
//     throw new Error("mechanic not found");
//   }

//   if (mechanic.status !== "approved") {
//     throw new Error("mechanic not approved yet");
//   }

//   // const match = await bcrypt.compare(password, mechanic.password);
//   // if (!match) throw new Error("Invalid password");

//   const token = jwt.sign({ id: mechanic._id, role: "mechanic" }, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES_IN
//   });

//   return {
//     token,
//     mechanic: {
//       id: mechanic._id,
//       name: mechanic.name,
//       email: mechanic.email
//     }
//   };
// };
