import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chatapp",
  brokers: ["localhost:9092"],
  retry : {
    initialRetryTime : 100,
    retries: 8 
  }
});

export default kafka;