import { z } from "zod";

export const sendMessageSchema = z.object({
  msg: z.string().min(1).max(5000),
  to: z.string(),
  senderId: z.string(),
});

export default sendMessageSchema;
