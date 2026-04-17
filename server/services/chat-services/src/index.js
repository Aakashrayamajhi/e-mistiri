import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import app from "./app.js";
import dbconnection from "./database/connection.js";

import { createTopic } from "./kafka/admin.js";
import { connectProducer, sendToKafka } from "./kafka/producer.js";
import { kafkaConsumer } from "./kafka/consumer.js";

const PORT = 5000;

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});


const users = new Map();     // userId - socketId
const sockets = new Map();   // socketId - userId

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);


    socket.on("register", ({ userId }) => {
        if (userId) {
            users.set(userId, socket.id);
            sockets.set(socket.id, userId);
            console.log("Registered user:", userId);
        }
    });

    
    socket.on("sendingmessage", async ({ msg, to, senderId }) => {
        try {
            const data = { msg, to, senderId };

            console.log("Sending to Kafka:", data);

            await sendMessageToKafka(data);

        } catch (err) {
            console.error("Kafka send error:", err);
        }
    });


    socket.on("disconnect", () => {
        const userId = sockets.get(socket.id);

        if (userId) {
            users.delete(userId);
            sockets.delete(socket.id);
        }

        console.log("User Disconnected:", socket.id);
    });
});

const start = async () => {
    try {
       
        await dbconnection();
        console.log("DB connected");

    
        await createTopic();
        await connectProducer();
        await kafkaConsumer(io, users);

       
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
};

start();