import kafka, { TOPIC, GROUP_ID } from "../config/kafka.config.js";
import Message from "../model/chatModel.js";
import { getUserSession } from "../utils/redisSession.js";
import logger from "../utils/logger.js";

const consumer = kafka.consumer({ groupId: GROUP_ID });

export const kafkaConsumer = async (io) => {
  await consumer.connect();
  logger.info("Kafka consumer connected");

  await consumer.subscribe({
    topic: TOPIC,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        const { msg, to, senderId } = data;

        logger.info("Kafka received message", { topic: TOPIC });

        await Message.create({
          sender: senderId,
          receiver: to,
          content: msg,
        });

        logger.info("Message saved to DB");

        const socketId = await getUserSession(to);

        if (socketId) {
          io.to(socketId).emit("receivingmessage", { msg, senderId });
          logger.info("Message sent to user", { userId: to, socketId });
        } else {
          logger.warn("User offline", { userId: to });
        }
      } catch (err) {
        logger.error("Consumer error", { error: err.message });
      }
    },
  });
};
