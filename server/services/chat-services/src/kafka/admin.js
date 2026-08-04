import kafka, { TOPIC } from "../config/kafka.config.js";
import logger from "../utils/logger.js";

export const createTopic = async () => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    logger.info("Kafka admin connected");

    await admin.createTopics({
      topics: [
        {
          topic: TOPIC,
          numPartitions: 5,
          replicationFactor: 1,
        },
      ],
    });

    logger.info("Kafka topic created", { topic: TOPIC });

    await admin.disconnect();
    logger.info("Kafka admin disconnected");
  } catch (error) {
    logger.error("Error creating topic", { error: error.message });
  }
};
