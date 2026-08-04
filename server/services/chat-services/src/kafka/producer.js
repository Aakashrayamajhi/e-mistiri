import kafka, { TOPIC } from "../config/kafka.config.js";
import { Partitioners } from "kafkajs";
import { withRetry } from "../utils/retry.js";
import logger from "../utils/logger.js";

let producer;

export const connectProducer = async () => {
  producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  await withRetry(() => producer.connect(), 3, 1000)();
  logger.info("Producer connected");
};

export const sendToKafka = async (data) => {
  if (!producer) {
    throw new Error("Producer not connected");
  }

  await withRetry(
    () =>
      producer.send({
        topic: TOPIC,
        messages: [
          {
            key: "chat",
            value: JSON.stringify(data),
          },
        ],
      }),
    3,
    1000
  )();

  logger.info("Message sent to Kafka", { topic: TOPIC });
};

export const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
    logger.info("Producer disconnected");
  }
};
