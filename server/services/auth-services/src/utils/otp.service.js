import twilio from "twilio";
import { env } from "../config/dotenv.config.js";

const client = twilio(
  env.TWILIO_SID,
  env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await client.messages.create({
        body: message,
        from: env.TWILIO_PHONE,
        to
      });
      return response;
    } catch (error) {
      if (attempt === retries) {
        console.error("Twilio error:", error.message);
        throw new Error("Failed to send OTP");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
};
