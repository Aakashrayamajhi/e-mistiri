import kafka  from "../config/kafka.config.js";
import Message from "../model/chatModel.js"; 

const consumer = kafka.consumer({ groupId: "chat-group" });

export const kafkaConsumer = async (io, users) => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "chat-messages",
    fromBeginning: false,
  });

  console.log(" Consumer connected");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        const { msg, to, senderId } = data;

        console.log("Kafka received:", data);

        await Message.create({
          sender: senderId,
          receiver: to,
          content: msg,
        });

        console.log(" Saved to DB");


        const socketId = users.get(to);

        if (socketId) {
          io.to(socketId).emit("receivingmessage", { msg, senderId });
          console.log(" Sent to user:", to);
        } else {
          console.log("User offline:", to);
        }

      } catch (err) {
        console.error("Consumer error:", err);
      }
    },
  });
};