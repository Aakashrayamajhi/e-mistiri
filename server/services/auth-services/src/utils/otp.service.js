import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to
    });
    console.log("Twilio response:", response);

    return response;
  } catch (error) {
    console.error("Twilio error:", error.message);
    throw new Error("Failed to send OTP");
  }
};