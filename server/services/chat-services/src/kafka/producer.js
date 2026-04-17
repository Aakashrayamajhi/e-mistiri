import kafka from "../config/kafka.config.js"
import { Partitioners } from "kafkajs"

let producer;

export const connectProducer = async () => {
    producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner
    })

    await producer.connect()
    console.log("producer connected ")
}

export const sendToKafka = async (data) => {
    try {
        console.log("hello")
        if (!producer) {
            throw new Error("Producer not connected ")
        }

        await producer.send({
            topic: "chat-message",
            messages: [
                {
                    key: "chat",
                    value: JSON.stringify(data)
                }
            ]
        })

        console.log("successfully sent to topic ")
    } catch (error) {
        console.log("error from producer:", error)
    }

}

