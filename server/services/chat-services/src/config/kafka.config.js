import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "chatapp",
  brokers,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export const TOPIC = process.env.KAFKA_TOPIC || "chat-message";
export const GROUP_ID = process.env.KAFKA_GROUP_ID || "chat-group";

export default kafka;
